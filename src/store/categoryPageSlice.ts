import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../firebase/client';
import {
  DocumentSnapshot,
  DBPost,
  DBCategory,
  DBUser,
} from '../firebase/types';
import { daysSinceEpoch } from '../utils';

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
  categoryId: string;
  owner: {
    username: string;
    uid: string;
  };
  numOfModerators: number;
  numOfSubscribers: number;
}

type PostOrder = 'new' | 'hot' | 'top';

interface CategoryPageState {
  postList: Post[];
  postListLoading: boolean;
  postListError: string;
  postOrder: PostOrder;
  morePostsLoading: boolean;
  morePostsError: string;
  morePostsExhausted: boolean;
  categoryMeta: CategoryMeta;
  categoryMetaLoading: boolean;
  categoryMetaError: string;
}

const initialState: CategoryPageState = {
  postList: [],
  postListLoading: true,
  postListError: '',
  postOrder: 'new',
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
  async ({
    categoryId,
    postOrder,
  }: {
    categoryId: string;
    postOrder: PostOrder;
  }) => {
    let field = 'rating';
    if (postOrder === 'new') field = 'timestamp';
    let postsQuery = db
      .collection('posts')
      .where('categoryId', '==', categoryId)
      .limit(postsPageLength);

    if (postOrder === 'hot') {
      /* only include posts that are up to a week old */
      postsQuery = postsQuery.where(
        'daysWhenPostIsLessThanWeekOld',
        'array-contains',
        daysSinceEpoch()
      );
    }

    return postsQuery
      .orderBy(field, 'desc')
      .get()
      .then((snap) => {
        lastPost = snap.docs[snap.docs.length - 1];
        return snap.docs.map((snap) => {
          const data = snap.data() as DBPost;
          return {
            ...data,
            postId: snap.id,
            timestamp: data.timestamp.seconds,
          };
        }) as Post[];
      });
  }
);

export const getMorePosts = createAsyncThunk(
  'categoryPage/getMorePosts',
  async (postOrder: string) => {
    let field = 'rating';
    if (postOrder === 'new') field = 'timestamp';
    let postsQuery = db
      .collection('posts')
      .where('categoryId', '==', lastPost?.data().categoryId)
      .limit(postsPageLength);

    if (postOrder === 'hot') {
      /* only include posts that are up to a week old */
      postsQuery = postsQuery.where(
        'daysWhenPostIsLessThanWeekOld',
        'array-contains',
        daysSinceEpoch()
      );
    }

    return postsQuery
      .orderBy(field, 'desc')
      .startAfter(lastPost)
      .get()
      .then((snap) => {
        lastPost = snap.docs[snap.docs.length - 1];
        return snap.docs.map((snap) => {
          const data = snap.data() as DBPost;
          return {
            ...data,
            postId: snap.id,
            timestamp: data.timestamp.seconds,
          };
        }) as Post[];
      });
  }
);

export const getCategoryMeta = createAsyncThunk(
  'categoryPage/getCategoryMeta',
  async (categoryId: string) => {
    const categorySnap = await db.doc(`categories/${categoryId}`).get();
    const categoryData = categorySnap.data() as DBCategory;

    const userSnap = await db.doc(`users/${categoryData.ownerId}`).get();
    const userData = userSnap.data() as DBUser;

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
  reducers: {
    setPostOrder: (state, action: { payload: PostOrder }) => {
      state.postOrder = action.payload;
    },
  },
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
      .addCase(getMorePosts.pending, (state) => {
        state.morePostsLoading = true;
        state.morePostsError = '';
      })
      .addCase(getMorePosts.fulfilled, (state, action) => {
        state.postList = [...state.postList, ...action.payload];
        state.morePostsLoading = false;
        if (action.payload.length < postsPageLength)
          state.morePostsExhausted = true;
      })
      .addCase(getMorePosts.rejected, (state) => {
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

export const { setPostOrder } = categoryPageSlice.actions;

export default categoryPageSlice.reducer;
