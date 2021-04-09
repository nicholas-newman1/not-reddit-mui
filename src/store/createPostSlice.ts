import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../firebase/client';

interface createPostState {
  isCreatePostDialogOpen: boolean;
  isCreatePostSuccessToastOpen: boolean;
  loading: boolean;
  error: string;
  subscribedCategoryIds: string[];
  loadingSubscribedCategoryIds: boolean;
}

const initialState: createPostState = {
  isCreatePostDialogOpen: false,
  isCreatePostSuccessToastOpen: false,
  loading: false,
  error: '',
  subscribedCategoryIds: [],
  loadingSubscribedCategoryIds: false,
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

export const displayCreatePostDialog = createAsyncThunk(
  'createPost/displayCreatePostDialog',
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
    hideCreatePostDialog: (state) => {
      state.isCreatePostDialogOpen = false;
    },
    displayCreatePostSuccessToast: (state) => {
      state.isCreatePostSuccessToastOpen = true;
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
        state.error = '';
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = 'An unknown error occured';
        state.loading = false;
      })
      .addCase(displayCreatePostDialog.pending, (state) => {
        state.isCreatePostDialogOpen = true;
        state.error = '';
        state.loadingSubscribedCategoryIds = true;
      })
      .addCase(displayCreatePostDialog.fulfilled, (state, action) => {
        state.error = '';
        state.loadingSubscribedCategoryIds = false;
        state.subscribedCategoryIds = action.payload;
      })
      .addCase(displayCreatePostDialog.rejected, (state, action) => {
        state.error = 'An unknown error occured';
        state.loadingSubscribedCategoryIds = false;
      });
  },
});

export const {
  hideCreatePostDialog,
  hideCreatePostSuccessToast,
  displayCreatePostSuccessToast,
} = createPostSlice.actions;

export default createPostSlice.reducer;
