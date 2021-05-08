import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import auth, { verifyAuth } from './authSlice';
import createCategory from './createCategorySlice';
import createPost from './createPostSlice';
import categoryPage from './categoryPageSlice';
import homePage from './homePageSlice';
import subscribedCategories from './subscribedCategoriesSlice';
import ratingStatus from './ratingStatusSlice';
import categoryMeta from './categoryMetaSlice';
import postPage from './postPageSlice';

const rootReducer = combineReducers({
  auth,
  createCategory,
  createPost,
  categoryPage,
  homePage,
  subscribedCategories,
  ratingStatus,
  categoryMeta,
  postPage,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',
    'createCategory',
    'createPost',
    'categoryPage',
    'homePage',
    'subscribedCategories',
    'ratingStatus',
    'categoryMeta',
    'postPage',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//@ts-ignore
store.dispatch(verifyAuth());
