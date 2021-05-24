import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../services/firebase';
import { DocumentSnapshot, DBPost } from '../types/db';
import { daysSinceEpoch } from '../utils/utils';
import { Post } from '../types/client';

type PostOrder = 'new' | 'hot' | 'top';

interface CategoryPageState {
  postList: Post[];
  postListLoading: boolean;
  postListError: string;
  postOrder: PostOrder;
  morePostsLoading: boolean;
  morePostsError: string;
  morePostsExhausted: boolean;
}

const initialState: CategoryPageState = {
  postList: [],
  postListLoading: true,
  postListError: '',
  postOrder: 'new',
  morePostsLoading: false,
  morePostsError: '',
  morePostsExhausted: false,
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
            postHref: `/categories/${data.categoryId}/${snap.id}`,
            authorProfileHref: `/users/${data.authorId}`,
            categoryHref: `/categories/${data.categoryId}`,
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
            postHref: `/categories/${data.categoryId}/${snap.id}`,
            authorProfileHref: `/users/${data.authorId}`,
            categoryHref: `/categories/${data.categoryId}`,
          };
        }) as Post[];
      });
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
      });
  },
});

export const { setPostOrder } = categoryPageSlice.actions;

export default categoryPageSlice.reducer;
