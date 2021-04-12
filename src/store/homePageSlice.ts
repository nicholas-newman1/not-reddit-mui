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

interface ReceivedCategory {
  ownerId: string;
  numOfSubscribers: number;
  numOfModerators: number;
}

interface Category {
  ownerId: string;
  numOfSubscribers: number;
  numOfModerators: number;
  categoryId: string;
}

interface categoryPageState {
  postList: Post[];
  postListLoading: boolean;
  postListError: string;
  categoryList: Category[];
  categoryListLoading: boolean;
  categoryListError: string;
}

const initialState: categoryPageState = {
  postList: [],
  postListLoading: false,
  postListError: '',
  categoryList: [],
  categoryListLoading: false,
  categoryListError: '',
};

export const getHomePostList = createAsyncThunk(
  'homePage/getHomePostList',
  async () => {
    return db
      .collection('posts')
      .limit(10)
      .orderBy('rating', 'desc')
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

export const getHomeCategoryList = createAsyncThunk(
  'homePage/getHomeCategoryList',
  async () =>
    await db
      .collection('categories')
      .limit(5)
      .orderBy('numOfSubscribers', 'desc')
      .get()
      .then(
        (snap) =>
          snap.docs.map((snap) => {
            const data = snap.data() as ReceivedCategory;
            const categoryId = snap.id;
            return {
              ...data,
              categoryId,
            };
          }) as Category[]
      )
);

export const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHomePostList.pending, (state) => {
        state.postList = [];
        state.postListLoading = true;
        state.postListError = '';
      })
      .addCase(getHomePostList.fulfilled, (state, action) => {
        state.postList = action.payload;
        state.postListLoading = false;
        state.postListError = '';
      })
      .addCase(getHomePostList.rejected, (state) => {
        state.postList = [];
        state.postListLoading = false;
        state.postListError = 'An error occurred';
      })
      .addCase(getHomeCategoryList.pending, (state) => {
        state.categoryList = [];
        state.categoryListLoading = true;
        state.categoryListError = '';
      })
      .addCase(getHomeCategoryList.fulfilled, (state, action) => {
        state.categoryList = action.payload;
        state.categoryListLoading = false;
        state.categoryListError = '';
      })
      .addCase(getHomeCategoryList.rejected, (state) => {
        state.categoryList = [];
        state.categoryListLoading = false;
        state.categoryListError = 'An error occurred';
      });
  },
});

export default homePageSlice.reducer;
