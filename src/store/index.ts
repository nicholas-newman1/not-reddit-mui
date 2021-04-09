import { configureStore } from '@reduxjs/toolkit';
import auth, { verifyAuth } from './authSlice';
import createCategory from './createCategorySlice';
import createPost from './createPostSlice';

const store = configureStore({
  reducer: {
    auth,
    createCategory,
    createPost,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//@ts-ignore
store.dispatch(verifyAuth());

export default store;
