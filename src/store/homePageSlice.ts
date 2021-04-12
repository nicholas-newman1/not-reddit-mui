import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../firebase/client';
import { DocumentSnapshot, Timestamp } from '../firebase/types';

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
  morePostsLoading: boolean;
  morePostsError: string;
  morePostsExhausted: boolean;
  categoryList: Category[];
  categoryListLoading: boolean;
  categoryListError: string;
  moreCategoriesLoading: boolean;
  moreCategoriesError: string;
  moreCategoriesExhausted: boolean;
}

const initialState: categoryPageState = {
  postList: [],
  postListLoading: false,
  postListError: '',
  morePostsLoading: false,
  morePostsError: '',
  morePostsExhausted: false,
  categoryList: [],
  categoryListLoading: false,
  categoryListError: '',
  moreCategoriesLoading: false,
  moreCategoriesError: '',
  moreCategoriesExhausted: false,
};

const postsPageLength = 10;
const categoriesPageLength = postsPageLength;
let lastPost: DocumentSnapshot | null = null;
let lastCategory: DocumentSnapshot | null = null;

export const getHomePostList = createAsyncThunk(
  'homePage/getHomePostList',
  async () => {
    return db
      .collection('posts')
      .limit(postsPageLength)
      .orderBy('rating', 'desc')
      .get()
      .then((snap) => {
        lastPost = snap.docs[snap.docs.length - 1];
        return snap.docs.map((snap) => {
          const data = snap.data() as ReceivedPost;
          return {
            ...data,
            postId: snap.id,
            timestamp: data.timestamp.seconds,
          };
        }) as Post[];
      });
  }
);

export const getMoreHomePosts = createAsyncThunk(
  'homePage/getMoreHomePosts',
  async () => {
    return db
      .collection('posts')
      .limit(postsPageLength)
      .orderBy('rating', 'desc')
      .startAfter(lastPost)
      .get()
      .then((snap) => {
        lastPost = snap.docs[snap.docs.length - 1];
        return snap.docs.map((snap) => {
          const data = snap.data() as ReceivedPost;
          return {
            ...data,
            postId: snap.id,
            timestamp: data.timestamp.seconds,
          };
        }) as Post[];
      });
  }
);

export const getHomeCategoryList = createAsyncThunk(
  'homePage/getHomeCategoryList',
  async () =>
    await db
      .collection('categories')
      .limit(categoriesPageLength)
      .orderBy('numOfSubscribers', 'desc')
      .get()
      .then((snap) => {
        lastCategory = snap.docs[snap.docs.length - 1];
        return snap.docs.map((snap) => {
          const data = snap.data() as ReceivedCategory;
          const categoryId = snap.id;
          return {
            ...data,
            categoryId,
          };
        }) as Category[];
      })
);

export const getMoreHomeCategories = createAsyncThunk(
  'homePage/getMoreHomeCategories',
  async () => {
    return db
      .collection('categories')
      .limit(categoriesPageLength)
      .orderBy('numOfSubscribers', 'desc')
      .startAfter(lastCategory)
      .get()
      .then((snap) => {
        lastCategory = snap.docs[snap.docs.length - 1];
        return snap.docs.map((snap) => {
          const data = snap.data() as ReceivedCategory;
          const categoryId = snap.id;
          return {
            ...data,
            categoryId,
          };
        }) as Category[];
      });
  }
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
        if (action.payload.length < postsPageLength)
          state.morePostsExhausted = true;
      })
      .addCase(getHomePostList.rejected, (state) => {
        state.postList = [];
        state.postListLoading = false;
        state.postListError = 'An error occurred';
      })
      .addCase(getMoreHomePosts.pending, (state) => {
        state.morePostsLoading = true;
        state.morePostsError = '';
      })
      .addCase(getMoreHomePosts.fulfilled, (state, action) => {
        state.postList = [...state.postList, ...action.payload];
        state.morePostsLoading = false;
        if (action.payload.length < postsPageLength)
          state.morePostsExhausted = true;
      })
      .addCase(getMoreHomePosts.rejected, (state) => {
        state.morePostsLoading = false;
        state.morePostsError = 'An error occurred';
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
        if (action.payload.length < categoriesPageLength)
          state.moreCategoriesExhausted = true;
      })
      .addCase(getHomeCategoryList.rejected, (state) => {
        state.categoryList = [];
        state.categoryListLoading = false;
        state.categoryListError = 'An error occurred';
      })
      .addCase(getMoreHomeCategories.pending, (state) => {
        state.moreCategoriesLoading = true;
        state.moreCategoriesError = '';
      })
      .addCase(getMoreHomeCategories.fulfilled, (state, action) => {
        state.categoryList = [...state.categoryList, ...action.payload];
        state.moreCategoriesLoading = false;
        if (action.payload.length < categoriesPageLength)
          state.moreCategoriesExhausted = true;
      })
      .addCase(getMoreHomeCategories.rejected, (state) => {
        state.moreCategoriesLoading = false;
        state.moreCategoriesError = 'An error occurred';
      });
  },
});

export default homePageSlice.reducer;
