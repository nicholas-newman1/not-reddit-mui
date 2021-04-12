import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db, Timestamp } from '../firebase/client';

interface ReceivedPost {
  title: string;
  body: string;
  authorId: string;
  authorUsername: string | null;
  categoryId: string;
  edited: boolean;
  rating: number;
  timestamp: Timestamp;
}

interface Post {
  title: string;
  body: string;
  authorId: string;
  authorUsername: string | null;
  categoryId: string;
  postId: string;
  edited: boolean;
  rating: number;
  timestamp: number;
}

interface CategoryMeta {
  ownerId: string;
  numOfModerators: number;
  numOfSubscribers: number;
}

interface categoryPageState {
  postList: Post[];
  postListLoading: boolean;
  postListError: string;
  categoryMeta: CategoryMeta | null;
  categoryMetaLoading: boolean;
  categoryMetaError: string;
}

const initialState: categoryPageState = {
  postList: [],
  postListLoading: false,
  postListError: '',
  categoryMeta: null,
  categoryMetaLoading: false,
  categoryMetaError: '',
};

export const getPostList = createAsyncThunk(
  'categoryPage/getPostList',
  async (categoryId: string) => {
    return db
      .collection('posts')
      .where('categoryId', '==', categoryId)
      .limit(10)
      .get()
      .then(
        (snap) =>
          snap.docs.map((snap) => {
            const data = snap.data() as ReceivedPost;
            return {
              ...data,
              postId: snap.id,
              timestamp: data.timestamp.seconds,
            };
          }) as Post[]
      );
  }
);

export const categoryPageSlice = createSlice({
  name: 'categoryPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPostList.pending, (state) => {
        state.postList = [];
        state.postListLoading = true;
        state.postListError = '';
      })
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
        state.postListLoading = false;
        state.postListError = '';
      })
      .addCase(getPostList.rejected, (state, action) => {
        console.log(action.error);
        state.postList = [];
        state.postListLoading = false;
        state.postListError = 'An error occurred';
      });
  },
});

export default categoryPageSlice.reducer;
