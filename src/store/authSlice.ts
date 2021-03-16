import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db, FirebaseError } from '../firebase/client';

interface SignInParams {
  email: string;
  password: string;
  onSuccess: () => void;
  onFailure: (err: FirebaseError) => void;
}

export const signIn = createAsyncThunk(
  'auth/signIn',
  (
    {
      email,
      password,
      onSuccess = () => {},
      onFailure = () => {},
    }: SignInParams,
    { rejectWithValue }
  ) => {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((cred) => {
        onSuccess();
        return cred.user
          ? {
              displayName: cred.user.displayName,
              email: cred.user.email,
              emailVerified: cred.user.emailVerified,
              creationTime: cred.user.metadata.creationTime,
              lastSignInTime: cred.user.metadata.lastSignInTime,
              phoneNumber: cred.user.phoneNumber,
              photoUrl: cred.user.photoURL,
              uid: cred.user.uid,
            }
          : null;
      })
      .catch((err: FirebaseError) => {
        onFailure(err);
        return rejectWithValue(err);
      });
  }
);

interface SignUpParams {
  username: string;
  email: string;
  password: string;
  onSuccess: () => void;
  onFailure: (err: FirebaseError) => void;
}

export const signUp = createAsyncThunk(
  'auth/signUp',
  (
    {
      username,
      email,
      password,
      onSuccess = () => {},
      onFailure = () => {},
    }: SignUpParams,
    { rejectWithValue }
  ) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        if (cred.user)
          db.collection('users').doc(cred.user.uid).set({
            username,
          });

        onSuccess();
        return cred.user
          ? {
              displayName: cred.user.displayName,
              email: cred.user.email,
              emailVerified: cred.user.emailVerified,
              creationTime: cred.user.metadata.creationTime,
              lastSignInTime: cred.user.metadata.lastSignInTime,
              phoneNumber: cred.user.phoneNumber,
              photoUrl: cred.user.photoURL,
              uid: cred.user.uid,
            }
          : null;
      })
      .catch((err: FirebaseError) => {
        onFailure(err);
        return rejectWithValue(err);
      });
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  (x, { rejectWithValue }) => {
    return auth.signOut().catch((err: FirebaseError) => rejectWithValue(err));
  }
);

export const verifyAuth = createAsyncThunk('auth/verifyAuth', (x, thunkAPI) => {
  auth.onAuthStateChanged((user) => {
    if (user)
      return thunkAPI.dispatch(
        verifySuccess({
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
          phoneNumber: user.phoneNumber,
          photoUrl: user.photoURL,
          uid: user.uid,
        })
      );
  });
});

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string;
  isSignInDialogOpen: boolean;
  isSignUpDialogOpen: boolean;
  isSignUpSuccessToastOpen: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: '',
  isSignInDialogOpen: false,
  isSignUpDialogOpen: false,
  isSignUpSuccessToastOpen: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    verifySuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    displaySignInDialog: (state) => {
      state.isSignInDialogOpen = true;
    },
    hideSignInDialog: (state) => {
      state.isSignInDialogOpen = false;
    },
    displaySignUpDialog: (state) => {
      state.isSignUpDialogOpen = true;
    },
    hideSignUpDialog: (state) => {
      state.isSignUpDialogOpen = false;
    },
    displaySignUpSuccessToast: (state) => {
      state.isSignUpSuccessToastOpen = true;
    },
    hideSignUpSuccessToast: (state) => {
      state.isSignUpSuccessToastOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => ({
        ...state,
        loading: true,
        user: null,
        error: '',
      }))
      .addCase(signIn.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        user: action.payload,
        error: '',
      }))
      .addCase(signIn.rejected, (state, action) => ({
        ...state,
        error: action.error.code || 'Unknown error',
      }))
      .addCase(signUp.pending, (state) => ({
        ...state,
        loading: true,
        user: null,
        error: '',
      }))
      .addCase(signUp.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        user: action.payload,
        error: '',
      }))
      .addCase(signUp.rejected, (state, action) => ({
        ...state,
        error: action.error.message || 'Unknown error',
      }))
      .addCase(signOut.pending, (state) => ({
        ...state,
        loading: true,
        error: '',
      }))
      .addCase(signOut.fulfilled, (state) => ({
        ...state,
        loading: false,
        user: null,
        error: '',
      }))
      .addCase(signOut.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.error.message || 'Unknown error',
      }))
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
      });
  },
});

export const {
  verifySuccess,
  displaySignInDialog,
  hideSignInDialog,
  displaySignUpDialog,
  hideSignUpDialog,
  displaySignUpSuccessToast,
  hideSignUpSuccessToast,
} = authSlice.actions;

export default authSlice.reducer;
