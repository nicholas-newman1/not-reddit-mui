import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../firebase/client';
import { FirebaseError } from '../firebase/types';

interface SignInParams {
  email: string;
  password: string;
}

export const signIn = createAsyncThunk(
  'auth/signIn',
  ({ email, password }: SignInParams, { dispatch }) => {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((cred): User | null => {
        dispatch(hideSignInDialog());

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
      });
  }
);

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export const signUp = createAsyncThunk(
  'auth/signUp',
  ({ username, email, password }: SignUpData, { dispatch }) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred): User | null => {
        dispatch(hideSignUpDialog());
        dispatch(displaySignUpSuccessToast());

        if (cred.user) {
          cred.user.updateProfile({
            displayName: username,
          });

          dispatch(sendEmailVerification());

          db.collection('users').doc(cred.user.uid).set({
            username,
          });

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
}

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  ({ email }: ResetPasswordParams, { dispatch }) => {
    return auth.sendPasswordResetEmail(email).then(() => {
      dispatch(hideResetPasswordDialog());
      dispatch(displayResetPasswordSentToast());
    });
  }
);

export const sendEmailVerification = createAsyncThunk(
  'auth/sendEmailVerification',
  (x, { dispatch }) => {
    return auth.currentUser?.sendEmailVerification().then(() => {
      dispatch(displaySentEmailVerificationDialog());
    });
  }
);

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string;
  isSignInDialogOpen: boolean;
  isSignUpDialogOpen: boolean;
  isResetPasswordDialogOpen: boolean;
  isSignUpSuccessToastOpen: boolean;
  isResetPasswordSentToastOpen: boolean;
  isSentEmailVerificationDialogOpen: boolean;
  loadingSendEmailVerification: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: '',
  isSignInDialogOpen: false,
  isSignUpDialogOpen: false,
  isResetPasswordDialogOpen: false,
  isSignUpSuccessToastOpen: false,
  isResetPasswordSentToastOpen: false,
  isSentEmailVerificationDialogOpen: false,
  loadingSendEmailVerification: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    verifySuccess: (state, action: { type: string; payload: User | null }) => {
      state.loading = false;
      state.user = action.payload;
      state.error = '';
    },
    displaySignInDialog: (state) => {
      state.isSignInDialogOpen = true;
    },
    hideSignInDialog: (state) => {
      state.isSignInDialogOpen = false;
      state.error = '';
    },
    displaySignUpDialog: (state) => {
      state.isSignUpDialogOpen = true;
    },
    hideSignUpDialog: (state) => {
      state.isSignUpDialogOpen = false;
      state.error = '';
    },
    displayResetPasswordDialog: (state) => {
      state.isResetPasswordDialogOpen = true;
    },
    hideResetPasswordDialog: (state) => {
      state.isResetPasswordDialogOpen = false;
      state.error = '';
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
    displaySentEmailVerificationDialog: (state) => {
      state.isSentEmailVerificationDialogOpen = true;
    },
    hideSentEmailVerificationDialog: (state) => {
      state.isSentEmailVerificationDialogOpen = false;
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
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        if (action.error.code === 'auth/too-many-requests') {
          state.error =
            'Too many failed attempts. Try again later, or reset your password';
        } else if (
          action.error.code === 'auth/user-not-found' ||
          action.error.code === 'auth/wrong-password'
        ) {
          state.error = 'Incorrect email or password';
        } else {
          state.error = action.error.message || 'Unknown error';
        }
      })
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
        loading: false,
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
        error: action.error.code || 'Unknown error',
      }))
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(resetPassword.pending, (state) => ({
        ...state,
      }))
      .addCase(resetPassword.fulfilled, (state) => ({
        ...state,
      }))
      .addCase(resetPassword.rejected, (state, action) => {
        if (action.error.code === 'auth/user-not-found') {
          state.error = 'User does not exist';
        } else {
          state.error = action.error.message || 'Unknown error';
        }
      })
      .addCase(sendEmailVerification.pending, (state) => {
        state.loadingSendEmailVerification = true;
      })
      .addCase(sendEmailVerification.fulfilled, (state) => {
        state.loadingSendEmailVerification = false;
      })
      .addCase(sendEmailVerification.rejected, (state) => {
        state.loadingSendEmailVerification = false;
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
  displaySentEmailVerificationDialog,
  hideSentEmailVerificationDialog,
} = authSlice.actions;

export default authSlice.reducer;
