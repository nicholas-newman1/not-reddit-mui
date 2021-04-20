import { configureStore } from '@reduxjs/toolkit';
import auth, { verifyAuth } from './authSlice';
import createCategory from './createCategorySlice';
import createPost from './createPostSlice';
import categoryPage from './categoryPageSlice';
import homePage from './homePageSlice';
import subscribedCategories from './subscribedCategoriesSlice';
import ratingStatus from './ratingStatusSlice';

const store = configureStore({
  reducer: {
    auth,
    createCategory,
    createPost,
    categoryPage,
    homePage,
    subscribedCategories,
    ratingStatus,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//@ts-ignore
store.dispatch(verifyAuth());

export default store;
