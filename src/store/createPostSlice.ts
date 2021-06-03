import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RouteComponentProps } from 'react-router';
import { RootState } from '.';
import { auth, db } from '../services/firebase';
import { DBCategory } from '../types/db';
import { setPost } from './postPageSlice';

interface CreatePostState {
  isCreatePostDialogOpen: boolean;
  loading: boolean;
  error: string;
  subscribedCategoryIds: string[];
  loadingSubscribedCategoryIds: boolean;
  defaultCategoryId: string;
}

const initialState: CreatePostState = {
  isCreatePostDialogOpen: false,
  loading: false,
  error: '',
  subscribedCategoryIds: [],
  loadingSubscribedCategoryIds: false,
  defaultCategoryId: '',
};

interface CreatePostData {
  title: string;
  category: string;
  body: string;
  history: RouteComponentProps['history'];
}

export const createPost = createAsyncThunk(
  'createPost/createPost',
  async (
    { title, category, body, history }: CreatePostData,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const ref = await db.collection('posts').add({
        title,
        categoryId: category.toLowerCase(),
        authorId: auth.currentUser?.uid,
        body,
      });
      const state = getState() as RootState;
      const authorId = auth.currentUser?.uid || '';
      const categoryDoc = await db.doc(`categories/${category}`).get();
      const categoryData = categoryDoc.data() as DBCategory;

      dispatch(
        setPost({
          title,
          categoryId: category.toLowerCase(),
          authorId,
          body,
          authorProfileHref: `profiles/${authorId}`,
          authorUsername: state.auth.user?.displayName || '',
          categoryHref: `categories/${category}`,
          edited: false,
          isAuthor: true,
          isOwnerOfCategory: categoryData.ownerId === authorId,
          ownerOfCategory: categoryData.ownerId,
          numOfComments: 0,
          postHref: `categories/${category}/${ref.id}`,
          postId: ref.id,
          rating: 0,
          timestamp: Date.now() / 1000,
        })
      );
      history.push(
        `/categories/${category}/${ref.id}`,
        getState() as RootState
      );
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createPostSlice = createSlice({
  name: 'createPost',
  initialState,
  reducers: {
    displayCreatePostDialog: (
      state,
      action: { type: string; payload: string | undefined }
    ) => {
      state.isCreatePostDialogOpen = true;
      state.error = '';
      state.loading = false;
      if (action.payload) state.defaultCategoryId = action.payload;
    },
    hideCreatePostDialog: (state) => {
      state.isCreatePostDialogOpen = false;
      state.loading = false;
      state.error = '';
      state.defaultCategoryId = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.isCreatePostDialogOpen = false;
        state.loading = false;
        state.subscribedCategoryIds = [];
      })
      .addCase(createPost.rejected, (state) => {
        state.error = 'An error occured';
        state.loading = false;
      });
  },
});

export const { displayCreatePostDialog, hideCreatePostDialog } =
  createPostSlice.actions;

export default createPostSlice.reducer;
