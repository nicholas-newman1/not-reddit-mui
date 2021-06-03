import { combineReducers, configureStore } from '@reduxjs/toolkit';
import auth, { verifyAuth } from './authSlice';
import createCategory from './createCategorySlice';
import createPost from './createPostSlice';
import categoryPage from './categoryPageSlice';
import homePage from './homePageSlice';
import subscribedCategories from './subscribedCategoriesSlice';
import ratingStatus from './ratingStatusSlice';
import commentRatingStatus from './commentRatingStatusSlice';
import categoryMeta from './categoryMetaSlice';
import postPage from './postPageSlice';

export const reducer = combineReducers({
  auth,
  createCategory,
  createPost,
  categoryPage,
  homePage,
  subscribedCategories,
  ratingStatus,
  commentRatingStatus,
  categoryMeta,
  postPage,
});

const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//@ts-ignore
store.dispatch(verifyAuth());

export default store;
