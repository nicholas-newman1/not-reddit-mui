import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../firebase/client';

interface createPostState {
  isCreatePostDialogOpen: boolean;
  isCreatePostSuccessToastOpen: boolean;
  loading: boolean;
  error: string;
  subscribedCategoryIds: string[];
  loadingSubscribedCategoryIds: boolean;
  defaultCategoryId: string;
}

const initialState: createPostState = {
  isCreatePostDialogOpen: false,
  isCreatePostSuccessToastOpen: false,
  loading: false,
  error: '',
  subscribedCategoryIds: [],
  loadingSubscribedCategoryIds: false,
  defaultCategoryId: '',
};

interface createPostData {
  title: string;
  category: string;
  body: string;
}

export const createPost = createAsyncThunk(
  'createPost/createPost',
  async ({ title, category, body }: createPostData, { dispatch }) => {
    return db
      .collection('posts')
      .doc()
      .set({
        title,
        categoryId: category.toLowerCase(),
        authorId: auth.currentUser?.uid,
        body,
      })
      .then(() => {
        dispatch(hideCreatePostDialog());
        dispatch(displayCreatePostSuccessToast());
      });
  }
);

export const getSubscribedCategoryIds = createAsyncThunk(
  'createPost/getSubscribedCategoryIds',
  async () => {
    return db
      .collectionGroup('subscriberIds')
      .where('uid', '==', auth.currentUser?.uid)
      .get()
      .then((snap) =>
        snap.docs.map((snap) => snap.data().categoryId as string)
      );
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
      state.isCreatePostSuccessToastOpen = false;
      state.isCreatePostDialogOpen = true;
      state.error = '';
      state.loading = false;
      if (action.payload) state.defaultCategoryId = action.payload;
    },
    hideCreatePostDialog: (state) => {
      state.isCreatePostDialogOpen = false;
      state.loading = false;
      state.error = '';
    },
    displayCreatePostSuccessToast: (state) => {
      state.isCreatePostDialogOpen = false;
      state.isCreatePostSuccessToastOpen = true;
      state.loading = false;
      state.error = '';
      state.subscribedCategoryIds = [];
    },
    hideCreatePostSuccessToast: (state) => {
      state.isCreatePostSuccessToastOpen = false;
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
        state.isCreatePostSuccessToastOpen = true;
        state.loading = false;
        state.subscribedCategoryIds = [];
      })
      .addCase(createPost.rejected, (state) => {
        state.error = 'An error occured';
        state.loading = false;
      })
      .addCase(getSubscribedCategoryIds.pending, (state) => {
        state.error = '';
        state.subscribedCategoryIds = [];
        state.loadingSubscribedCategoryIds = true;
      })
      .addCase(getSubscribedCategoryIds.fulfilled, (state, action) => {
        state.loadingSubscribedCategoryIds = false;
        state.subscribedCategoryIds = action.payload;
      })
      .addCase(getSubscribedCategoryIds.rejected, (state) => {
        state.error = 'An error occured';
        state.loadingSubscribedCategoryIds = false;
      });
  },
});

export const {
  displayCreatePostDialog,
  hideCreatePostDialog,
  displayCreatePostSuccessToast,
  hideCreatePostSuccessToast,
} = createPostSlice.actions;

export default createPostSlice.reducer;
