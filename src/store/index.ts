import { configureStore } from '@reduxjs/toolkit';
import auth, { verifyAuth } from './authSlice';
import createCategory from './createCategorySlice';

const store = configureStore({
  reducer: {
    auth,
    createCategory,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//@ts-ignore
store.dispatch(verifyAuth());

export default store;
