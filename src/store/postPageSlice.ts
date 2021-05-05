import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../firebase/client';
import { DBComment, DBPost } from '../firebase/types';
import { Comment, Post } from '../types/client';

interface PostPageState {
  post: Post | null;
  postLoading: boolean;
  postError: string;
  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string;
}

const initialState: PostPageState = {
  post: null,
  postLoading: true,
  postError: '',
  comments: [],
  commentsLoading: true,
  commentsError: '',
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
      authorProfileHref: `/users/${data.authorId}`,
      categoryHref: `/categories/${data.categoryId}`,
    };
  }
);

export const getComments = createAsyncThunk(
  'postPage/getComments',
  async (postId: string) => {
    const snap = await db
      .collection(`/posts/${postId}/comments`)
      .orderBy('timestamp', 'desc')
      .get();
    return snap.docs.map((doc) => {
      const data = doc.data() as DBComment;
      return {
        ...data,
        timestamp: data.timestamp.seconds,
        replies: [] as Comment[],
        path: doc.ref.path,
        authorProfileHref: `/profiles/${data.authorId}`,
        isAuthor: auth.currentUser?.uid === data.authorId,
      };
    });
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
      })
      .addCase(getComments.pending, (state) => {
        state.comments = [];
        state.commentsLoading = true;
        state.commentsError = '';
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.commentsLoading = false;
        state.commentsError = '';
      })
      .addCase(getComments.rejected, (state, action) => {
        console.log(action.error);
        state.comments = [];
        state.commentsLoading = false;
        state.commentsError = 'An error occured';
      });
  },
});

export default postPageSlice.reducer;
