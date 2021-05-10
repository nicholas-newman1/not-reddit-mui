import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RouteComponentProps } from 'react-router';
import { auth, db } from '../services/firebase';

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
  async ({ title, category, body, history }: CreatePostData) =>
    db
      .collection('posts')
      .add({
        title,
        categoryId: category.toLowerCase(),
        authorId: auth.currentUser?.uid,
        body,
      })
      .then((ref) => {
        history.push(`/categories/${category}/${ref.id}`);
      })
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

export const {
  displayCreatePostDialog,
  hideCreatePostDialog,
} = createPostSlice.actions;

export default createPostSlice.reducer;
