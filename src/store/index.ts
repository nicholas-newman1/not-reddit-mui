import { configureStore } from '@reduxjs/toolkit';
import auth, { verifyAuth } from './authSlice';

const store = configureStore({
  reducer: {
    auth,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//@ts-ignore
store.dispatch(verifyAuth());

export default store;
