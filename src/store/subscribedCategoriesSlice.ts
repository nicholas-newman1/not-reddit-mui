import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../services/firebase';

interface SubscribedCategoriesState {
  subscribedIds: string[];
  loadingIds: string[];
  loading: boolean;
  error: string;
}

const initialState: SubscribedCategoriesState = {
  subscribedIds: [],
  loadingIds: [],
  loading: false,
  error: '',
};

export const getSubscribedCategoryIds = createAsyncThunk(
  'subscribedCategories/getSubscribedCategoryIds',
  async () => {
    const uid = auth.currentUser?.uid;
    return db
      .collectionGroup('subscriberIds')
      .where('uid', '==', uid || '')
      .get()
      .then((snap) =>
        snap.docs.map((snap) => snap.data().categoryId as string)
      );
  }
);

export const subscribeToCategory = createAsyncThunk(
  'subscribedCategories/subscribeToCategory',
  async (categoryId: string, { rejectWithValue }) => {
    const uid = auth.currentUser?.uid;
    try {
      await db.doc(`categories/${categoryId}/subscriberIds/${uid}`).set({
        categoryId,
        uid,
      });
      return categoryId;
    } catch (err) {
      return rejectWithValue(categoryId);
    }
  }
);

export const unsubscribeFromCategory = createAsyncThunk(
  'subscribedCategories/unsubscribeFromCategory',
  async (categoryId: string, { rejectWithValue }) => {
    const uid = auth.currentUser?.uid;
    try {
      await db.doc(`categories/${categoryId}/subscriberIds/${uid}`).delete();
      return categoryId;
    } catch (err) {
      return rejectWithValue(categoryId);
    }
  }
);

export const subscribedCategoriesSlice = createSlice({
  name: 'subscribedCategories',
  initialState,
  reducers: {
    clearSubscribedCategoryIds: (state) => {
      state.loadingIds = [];
      state.subscribedIds = [];
      state.loading = false;
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscribedCategoryIds.pending, (state) => {
        state.subscribedIds = [];
        state.loading = true;
        state.error = '';
      })
      .addCase(getSubscribedCategoryIds.fulfilled, (state, action) => {
        state.subscribedIds = action.payload;
        state.loading = false;
      })
      .addCase(getSubscribedCategoryIds.rejected, (state, action) => {
        state.loading = false;
        state.error = 'An error occurred';
      })
      .addCase(subscribeToCategory.pending, (state, action) => {
        state.loadingIds.push(action.meta.arg);
        state.error = '';
      })
      .addCase(subscribeToCategory.fulfilled, (state, action) => {
        state.subscribedIds.push(action.payload);
        state.loadingIds = state.loadingIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(subscribeToCategory.rejected, (state, action) => {
        console.log(action);
        state.error = 'An error occurred';
        state.loadingIds = state.loadingIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(unsubscribeFromCategory.pending, (state, action) => {
        state.loadingIds.push(action.meta.arg);
        state.error = '';
      })
      .addCase(unsubscribeFromCategory.fulfilled, (state, action) => {
        state.subscribedIds = state.subscribedIds.filter(
          (id) => id !== action.payload
        );
        state.loadingIds = state.loadingIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(unsubscribeFromCategory.rejected, (state, action) => {
        state.error = 'An error occurred';
        state.loadingIds = state.loadingIds.filter(
          (id) => id !== action.payload
        );
      });
  },
});

export const { clearSubscribedCategoryIds } = subscribedCategoriesSlice.actions;

export default subscribedCategoriesSlice.reducer;
