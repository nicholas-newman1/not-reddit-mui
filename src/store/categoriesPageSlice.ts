import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../services/firebase';
import { DocumentSnapshot, DBCategory } from '../types/db';

interface Category {
  ownerId: string;
  numOfSubscribers: number;
  numOfModerators: number;
  categoryId: string;
}

interface CategoriesPageState {
  categoryList: Category[];
  categoryListError: string;
  categoryListLoading: boolean;
  moreCategoriesError: string;
  moreCategoriesExhausted: boolean;
  moreCategoriesLoading: boolean;
}

const initialState: CategoriesPageState = {
  categoryList: [],
  categoryListError: '',
  categoryListLoading: true,
  moreCategoriesError: '',
  moreCategoriesExhausted: false,
  moreCategoriesLoading: false,
};

const categoriesPageLength = 12;
let lastCategory: DocumentSnapshot | null = null;

export const getCategoryList = createAsyncThunk(
  'categoriesPage/getCategoryList',
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
  'categoriesPage/getMoreCategories',
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

export const categoriesPageSlice = createSlice({
  name: 'categoriesPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

export default categoriesPageSlice.reducer;
