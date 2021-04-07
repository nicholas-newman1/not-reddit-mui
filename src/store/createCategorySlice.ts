import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../firebase/client';

interface createCategoryState {
  isCreateCategoryDialogOpen: boolean;
  isCreateCategorySuccessToastOpen: boolean;
  loading: boolean;
  error: string;
}

const initialState: createCategoryState = {
  isCreateCategoryDialogOpen: false,
  isCreateCategorySuccessToastOpen: false,
  loading: false,
  error: '',
};

interface createCategoryData {
  categoryName: string;
}

export const createCategory = createAsyncThunk(
  'createCategory/createCategory',
  async (
    { categoryName }: createCategoryData,
    { rejectWithValue, dispatch }
  ) => {
    const ref = db.doc(`categories/${categoryName.toLowerCase()}`);
    const snap = await ref.get();
    return snap.exists
      ? rejectWithValue('')
      : ref
          .set({
            ownerId: auth.currentUser?.uid,
          })
          .then(() => {
            dispatch(hideCreateCategoryDialog());
            dispatch(displayCreateCategorySuccessToast());
          });
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
