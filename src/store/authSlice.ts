import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, FirebaseError } from '../firebase/client';

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
        onSuccess();

        if (cred.user) {
          cred.user.updateProfile({
            displayName: username,
          });

          cred.user.sendEmailVerification();

          return {
            displayName: cred.user.displayName,
            email: cred.user.email,
            emailVerified: cred.user.emailVerified,
            creationTime: cred.user.metadata.creationTime,
            lastSignInTime: cred.user.metadata.lastSignInTime,
            phoneNumber: cred.user.phoneNumber,
            photoUrl: cred.user.photoURL,
            uid: cred.user.uid,
          };
        }

        return null;
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
    thunkAPI.dispatch(
      verifySuccess(
        user
          ? {
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              creationTime: user.metadata.creationTime,
              lastSignInTime: user.metadata.lastSignInTime,
              phoneNumber: user.phoneNumber,
              photoUrl: user.photoURL,
              uid: user.uid,
            }
          : null
      )
    );
  });
});

interface ResetPasswordParams {
  email: string;
  onSuccess: () => void;
  onFailure: (err: FirebaseError) => void;
}

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  (
    { email, onSuccess, onFailure }: ResetPasswordParams,
    { rejectWithValue }
  ) => {
    return auth
      .sendPasswordResetEmail(email)
      .then(() => {
        onSuccess();
      })
      .catch((err: FirebaseError) => {
        onFailure(err);
        rejectWithValue(err);
      });
  }
);

interface AuthState {
  user: User | null;
  loading: boolean;
  isSignInDialogOpen: boolean;
  isSignUpDialogOpen: boolean;
  isResetPasswordDialogOpen: boolean;
  isSignUpSuccessToastOpen: boolean;
  isResetPasswordSentToastOpen: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  isSignInDialogOpen: false,
  isSignUpDialogOpen: false,
  isResetPasswordDialogOpen: false,
  isSignUpSuccessToastOpen: false,
  isResetPasswordSentToastOpen: false,
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
    displayResetPasswordDialog: (state) => {
      state.isResetPasswordDialogOpen = true;
    },
    hideResetPasswordDialog: (state) => {
      state.isResetPasswordDialogOpen = false;
    },
    displaySignUpSuccessToast: (state) => {
      state.isSignUpSuccessToastOpen = true;
    },
    hideSignUpSuccessToast: (state) => {
      state.isSignUpSuccessToastOpen = false;
    },
    displayResetPasswordSentToast: (state) => {
      state.isResetPasswordSentToastOpen = true;
    },
    hideResetPasswordSentToast: (state) => {
      state.isResetPasswordSentToastOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => ({
        ...state,
        loading: true,
        user: null,
      }))
      .addCase(signIn.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        user: action.payload,
      }))
      .addCase(signIn.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.error.code || 'Unknown error',
      }))
      .addCase(signUp.pending, (state) => ({
        ...state,
        loading: true,
        user: null,
      }))
      .addCase(signUp.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        user: action.payload,
      }))
      .addCase(signUp.rejected, (state, action) => ({
        ...state,
        loading: false,
      }))
      .addCase(signOut.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(signOut.fulfilled, (state) => ({
        ...state,
        loading: false,
        user: null,
      }))
      .addCase(signOut.rejected, (state, action) => ({
        ...state,
        loading: false,
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
  displayResetPasswordDialog,
  hideResetPasswordDialog,
  displaySignUpSuccessToast,
  hideSignUpSuccessToast,
  displayResetPasswordSentToast,
  hideResetPasswordSentToast,
} = authSlice.actions;

export default authSlice.reducer;
