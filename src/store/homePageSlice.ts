import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../firebase/client';
import { DocumentSnapshot, DBPost, DBCategory } from '../firebase/types';
import { daysSinceEpoch } from '../utils';
import { Post } from '../types/client';

interface Category {
  ownerId: string;
  numOfSubscribers: number;
  numOfModerators: number;
  categoryId: string;
}

type PostOrder = 'new' | 'hot' | 'top';

interface HomePageState {
  postList: Post[];
  postListLoading: boolean;
  postListError: string;
  postOrder: PostOrder;
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

const initialState: HomePageState = {
  postList: [],
  postListLoading: true,
  postListError: '',
  postOrder: 'new',
  morePostsLoading: false,
  morePostsError: '',
  morePostsExhausted: false,
  categoryList: [],
  categoryListLoading: true,
  categoryListError: '',
  moreCategoriesLoading: false,
  moreCategoriesError: '',
  moreCategoriesExhausted: false,
};

const postsPageLength = 10;
const categoriesPageLength = postsPageLength;
let lastPost: DocumentSnapshot | null = null;
let lastCategory: DocumentSnapshot | null = null;

export const getPostList = createAsyncThunk(
  'homePage/getPostList',
  async (order: PostOrder) => {
    let field = 'rating';
    if (order === 'new') field = 'timestamp';
    let postsQuery = db.collection('posts').limit(postsPageLength);

    if (order === 'hot') {
      /* only include posts that are up to a week old */
      postsQuery = postsQuery.where(
        'daysWhenPostIsLessThanWeekOld',
        'array-contains',
        daysSinceEpoch()
      );
    }

    const snap = await postsQuery.orderBy(field, 'desc').get();
    lastPost = snap.docs[snap.docs.length - 1];
    const posts = snap.docs.map((snap) => {
      const data = snap.data() as DBPost;
      return {
        ...data,
        postId: snap.id,
        timestamp: data.timestamp.seconds,
        postHref: `/categories/${data.categoryId}/${snap.id}`,
        userProfileHref: `/users/${data.authorId}`,
        categoryHref: `/categories/${data.categoryId}`,
        numOfComments: 0,
      };
    }) as Post[];

    return posts;
  }
);

export const getMorePosts = createAsyncThunk(
  'homePage/getMorePosts',
  async (order: PostOrder) => {
    let field = 'rating';
    if (order === 'new') field = 'timestamp';
    let postsQuery = db.collection('posts').limit(postsPageLength);

    if (order === 'hot') {
      postsQuery = postsQuery.where(
        'daysWhenPostIsLessThanWeekOld',
        'array-contains',
        daysSinceEpoch()
      );
    }

    const snap = await postsQuery
      .orderBy(field, 'desc')
      .startAfter(lastPost)
      .get();
    lastPost = snap.docs[snap.docs.length - 1];
    const posts = snap.docs.map((snap) => {
      const data = snap.data() as DBPost;
      return {
        ...data,
        postId: snap.id,
        timestamp: data.timestamp.seconds,
        postHref: `/categories/${data.categoryId}/${snap.id}`,
        userProfileHref: `/users/${data.authorId}`,
        categoryHref: `/categories/${data.categoryId}`,
        numOfComments: 0,
      };
    }) as Post[];

    return posts;
  }
);

export const getCategoryList = createAsyncThunk(
  'homePage/getCategoryList',
  async () =>
    await db
      .collection('categories')
      .limit(categoriesPageLength)
      .orderBy('numOfSubscribers', 'desc')
      .get()
      .then((snap) => {
        lastCategory = snap.docs[snap.docs.length - 1];
        return snap.docs.map((snap) => {
          const data = snap.data() as DBCategory;
          const categoryId = snap.id;
          return {
            ...data,
            categoryId,
          };
        }) as Category[];
      })
);

export const getMoreCategories = createAsyncThunk(
  'homePage/getMoreCategories',
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
          const data = snap.data() as DBCategory;
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
      .addCase(getPostList.rejected, (state, action) => {
        state.postList = [];
        state.postListLoading = false;
        state.postListError = 'An error occurred';
        console.log(action.error);
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
      .addCase(getCategoryList.pending, (state) => {
        state.moreCategoriesExhausted = false;
        state.categoryList = [];
        state.categoryListLoading = true;
        state.categoryListError = '';
      })
      .addCase(getCategoryList.fulfilled, (state, action) => {
        state.categoryList = action.payload;
        state.categoryListLoading = false;
        state.categoryListError = '';
        if (action.payload.length < categoriesPageLength)
          state.moreCategoriesExhausted = true;
      })
      .addCase(getCategoryList.rejected, (state) => {
        state.categoryList = [];
        state.categoryListLoading = false;
        state.categoryListError = 'An error occurred';
      })
      .addCase(getMoreCategories.pending, (state) => {
        state.moreCategoriesLoading = true;
        state.moreCategoriesError = '';
      })
      .addCase(getMoreCategories.fulfilled, (state, action) => {
        state.categoryList = [...state.categoryList, ...action.payload];
        state.moreCategoriesLoading = false;
        if (action.payload.length < categoriesPageLength)
          state.moreCategoriesExhausted = true;
      })
      .addCase(getMoreCategories.rejected, (state) => {
        state.moreCategoriesLoading = false;
        state.moreCategoriesError = 'An error occurred';
      });
  },
});

export const { setPostOrder } = homePageSlice.actions;

export default homePageSlice.reducer;
