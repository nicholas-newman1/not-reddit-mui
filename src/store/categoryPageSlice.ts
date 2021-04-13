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

interface ReceivedCategoryMeta {
  ownerId: string;
  numOfModerators: number;
  numOfSubscribers: number;
}

interface ReceivedUser {
  username: string;
}

interface CategoryMeta {
  categoryId: string;
  owner: {
    username: string;
    uid: string;
  };
  numOfModerators: number;
  numOfSubscribers: number;
}

interface categoryPageState {
  postList: Post[];
  postListLoading: boolean;
  postListError: string;
  morePostsLoading: boolean;
  morePostsError: string;
  morePostsExhausted: boolean;
  categoryMeta: CategoryMeta;
  categoryMetaLoading: boolean;
  categoryMetaError: string;
}

const initialState: categoryPageState = {
  postList: [],
  postListLoading: true,
  postListError: '',
  morePostsLoading: false,
  morePostsError: '',
  morePostsExhausted: false,
  categoryMeta: {
    owner: {
      username: '',
      uid: '',
    },
    categoryId: '',
    numOfModerators: 0,
    numOfSubscribers: 0,
  },
  categoryMetaLoading: true,
  categoryMetaError: '',
};

const postsPageLength = 10;
let lastPost: DocumentSnapshot | null = null;

export const getPostList = createAsyncThunk(
  'categoryPage/getPostList',
  async (categoryId: string) =>
    db
      .collection('posts')
      .where('categoryId', '==', categoryId)
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
      })
);

export const getMoreCategoryPosts = createAsyncThunk(
  'categoryPage/getMoreCategoryPosts',
  async () =>
    db
      .collection('posts')
      .where('categoryId', '==', lastPost?.data().categoryId)
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
      })
);

export const getCategoryMeta = createAsyncThunk(
  'categoryPage/getCategoryMeta',
  async (categoryId: string) => {
    const categorySnap = await db.doc(`categories/${categoryId}`).get();
    const categoryData = categorySnap.data() as ReceivedCategoryMeta;

    const userSnap = await db.doc(`users/${categoryData.ownerId}`).get();
    const userData = userSnap.data() as ReceivedUser;

    return {
      ...categoryData,
      categoryId: categorySnap.id,
      owner: {
        username: userData.username,
        uid: categoryData.ownerId,
      },
    };
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
        state.morePostsExhausted = false;
      })
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
        state.postListLoading = false;
        state.postListError = '';
        if (action.payload.length < postsPageLength)
          state.morePostsExhausted = true;
      })
      .addCase(getPostList.rejected, (state) => {
        state.postList = [];
        state.postListLoading = false;
        state.postListError = 'An error occurred';
      })
      .addCase(getMoreCategoryPosts.pending, (state) => {
        state.morePostsLoading = true;
        state.morePostsError = '';
      })
      .addCase(getMoreCategoryPosts.fulfilled, (state, action) => {
        state.postList = [...state.postList, ...action.payload];
        state.morePostsLoading = false;
        if (action.payload.length < postsPageLength)
          state.morePostsExhausted = true;
      })
      .addCase(getMoreCategoryPosts.rejected, (state) => {
        state.morePostsLoading = false;
        state.morePostsError = 'An error occurred';
      })
      .addCase(getCategoryMeta.pending, (state) => {
        state.categoryMetaLoading = true;
        state.categoryMetaError = '';
      })
      .addCase(getCategoryMeta.fulfilled, (state, action) => {
        state.categoryMeta = action.payload;
        state.categoryMetaLoading = false;
      })
      .addCase(getCategoryMeta.rejected, (state) => {
        state.categoryMetaLoading = false;
        state.categoryMetaError = 'An error occurred';
      });
  },
});

export default categoryPageSlice.reducer;
