import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RouteComponentProps } from 'react-router';
import { auth, db } from '../services/firebase';
import { subscribeToCategory } from './subscribedCategoriesSlice';

interface CreateCategoryState {
  isCreateCategoryDialogOpen: boolean;
  isCreateCategorySuccessToastOpen: boolean;
  loading: boolean;
  error: string;
}

const initialState: CreateCategoryState = {
  isCreateCategoryDialogOpen: false,
  isCreateCategorySuccessToastOpen: false,
  loading: false,
  error: '',
};

interface CreateCategoryData {
  categoryName: string;
  history: RouteComponentProps['history'];
}

export const createCategory = createAsyncThunk(
  'createCategory/createCategory',
  async (
    { categoryName, history }: CreateCategoryData,
    { rejectWithValue, dispatch }
  ) => {
    const uid = auth.currentUser?.uid;
    const categoryId = categoryName.toLowerCase();
    const ref = db.doc(`categories/${categoryId}`);
    const snap = await ref.get();
    if (snap.exists) return rejectWithValue('');
    await ref.set({ ownerId: uid });
    await dispatch(subscribeToCategory(categoryId));
    dispatch(hideCreateCategoryDialog());
    history.push(`/categories/${categoryId}`);
  }
);

export const createCategorySlice = createSlice({
  name: 'createCategory',
  initialState,
  reducers: {
    displayCreateCategoryDialog: (state) => {
      state.isCreateCategoryDialogOpen = true;
    },
    hideCreateCategoryDialog: (state) => {
      state.isCreateCategoryDialogOpen = false;
    },
    displayCreateCategorySuccessToast: (state) => {
      state.isCreateCategorySuccessToastOpen = true;
    },
    hideCreateCategorySuccessToast: (state) => {
      state.isCreateCategorySuccessToastOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.error = '';
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = 'Category already exists';
        state.loading = false;
      });
  },
});

export const {
  hideCreateCategoryDialog,
  displayCreateCategoryDialog,
  hideCreateCategorySuccessToast,
  displayCreateCategorySuccessToast,
} = createCategorySlice.actions;

export default createCategorySlice.reducer;
