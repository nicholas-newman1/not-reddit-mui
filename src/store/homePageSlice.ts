import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../services/firebase';
import { DocumentSnapshot, DBPost, DBCategory } from '../types/db';
import { daysSinceEpoch } from '../utils/utils';
import { Post } from '../types/client';

interface Category {
  ownerId: string;
  numOfSubscribers: number;
  numOfModerators: number;
  categoryId: string;
}

type PostOrder = 'new' | 'hot' | 'top';

interface HomePageState {
  categoryList: Category[];
  categoryListError: string;
  categoryListLoading: boolean;
  deletePostLoading: string[];
  moreCategoriesError: string;
  moreCategoriesExhausted: boolean;
  moreCategoriesLoading: boolean;
  morePostsError: string;
  morePostsExhausted: boolean;
  morePostsLoading: boolean;
  postList: Post[];
  postListError: string;
  postListLoading: boolean;
  postOrder: PostOrder;
}

const initialState: HomePageState = {
  categoryList: [],
  categoryListError: '',
  categoryListLoading: true,
  deletePostLoading: [],
  moreCategoriesError: '',
  moreCategoriesExhausted: false,
  moreCategoriesLoading: false,
  morePostsError: '',
  morePostsExhausted: false,
  morePostsLoading: false,
  postList: [],
  postListError: '',
  postListLoading: true,
  postOrder: 'new',
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
        authorProfileHref: `/users/${data.authorId}`,
        categoryHref: `/categories/${data.categoryId}`,
        isAuthor: auth.currentUser?.uid === data.authorId,
        postHref: `/categories/${data.categoryId}/${snap.id}`,
        postId: snap.id,
        timestamp: data.timestamp.seconds,
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
        authorProfileHref: `/users/${data.authorId}`,
        categoryHref: `/categories/${data.categoryId}`,
        isAuthor: auth.currentUser?.uid === data.authorId,
        postHref: `/categories/${data.categoryId}/${snap.id}`,
        postId: snap.id,
        timestamp: data.timestamp.seconds,
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

export const deletePost = createAsyncThunk(
  'homePage/deletePost',
  (postId: string) => db.doc(`posts/${postId}`).delete()
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
      })
      .addCase(deletePost.pending, (state, action) => {
        state.deletePostLoading.push(action.meta.arg);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deletePostLoading = state.deletePostLoading.filter(
          (id) => id !== action.meta.arg
        );
        state.postList = state.postList.filter(
          (post) => post.postId !== action.meta.arg
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deletePostLoading = state.deletePostLoading.filter(
          (id) => id !== action.meta.arg
        );
      });
  },
});

export const { setPostOrder } = homePageSlice.actions;

export default homePageSlice.reducer;
