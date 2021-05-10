import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../services/firebase';
import { DBCategory, DBUser } from '../types/db';

interface CategoryMeta {
  categoryId: string;
  owner: {
    username: string;
    uid: string;
  };
  numOfModerators: number;
  numOfSubscribers: number;
}

interface CategoryMetaState {
  categoryMeta: CategoryMeta;
  categoryMetaLoading: boolean;
  categoryMetaError: string;
}

const initialState: CategoryMetaState = {
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

export const getCategoryMeta = createAsyncThunk(
  'categoryMeta/getCategoryMeta',
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

export const categoryMetaSlice = createSlice({
  name: 'categoryMeta',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

export default categoryMetaSlice.reducer;
