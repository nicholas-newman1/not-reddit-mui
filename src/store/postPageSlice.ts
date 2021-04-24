import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../firebase/client';
import { DBPost } from '../firebase/types';
import { Post } from '../types/client';

interface PostPageState {
  post: Post | null;
  postLoading: boolean;
  postError: string;
}

const initialState: PostPageState = {
  post: null,
  postLoading: true,
  postError: '',
};

export const getPost = createAsyncThunk(
  'postPage/getPost',
  async (postId: string) => {
    const snap = await db.doc(`/posts/${postId}`).get();
    const data = snap.data() as DBPost;
    return {
      ...data,
      postId: snap.id,
      timestamp: data.timestamp.seconds,
      postHref: `/categories/${data.categoryId}/${snap.id}`,
      userProfileHref: `/users/${data.authorId}`,
      categoryHref: `/categories/${data.categoryId}`,
      numOfComments: 0,
      onSave: () => {},
      onShare: () => {},
      onReport: () => {},
    };
  }
);

export const postPageSlice = createSlice({
  name: 'postPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPost.pending, (state) => {
        state.post = null;
        state.postLoading = true;
        state.postError = '';
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.post = action.payload;
        state.postLoading = false;
        state.postError = '';
      })
      .addCase(getPost.rejected, (state) => {
        state.post = null;
        state.postLoading = false;
        state.postError = 'An error occured';
      });
  },
});

export default postPageSlice.reducer;
