import { Dispatch } from 'redux';
import { auth, db, FirebaseError, FirebaseUser } from '../../firebase/client';
import { AppActions } from '../appActions';
import {
  SignInRequest,
  SignInSuccess,
  SignInFailure,
  SignUpRequest,
  SignUpSuccess,
  SignUpFailure,
  SignOutFailure,
  SignOutRequest,
  SignOutSuccess,
  VerifyRequest,
  VerifySuccess,
  DisplaySignInDialog,
  DisplaySignUpDialog,
  HideSignInDialog,
  HideSignUpDialog,
  DisplaySignUpSuccessToast,
  HideSignUpSuccessToast,
} from './types';

// Sign In
export const signInRequest = (): SignInRequest => ({
  type: 'SIGN_IN_REQUEST',
});

export const signInSuccess = (user: FirebaseUser): SignInSuccess => ({
  type: 'SIGN_IN_SUCCESS',
  payload: {
    user,
  },
});

export const signInFailure = (error: string): SignInFailure => ({
  type: 'SIGN_IN_FAILURE',
  payload: {
    error,
  },
});

export const signIn = (
  email: string,
  password: string,
  onSuccess = () => {},
  onFailure = (err: FirebaseError) => {}
) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(signUpRequest());

    auth
      .signInWithEmailAndPassword(email, password)
      .then((cred) => {
        dispatch(signInSuccess(cred.user));
        onSuccess();
      })
      .catch((err: FirebaseError) => {
        dispatch(signInFailure(err.code));
        onFailure(err);
      });
  };
};

// Sign Up
export const signUpRequest = (): SignUpRequest => ({
  type: 'SIGN_UP_REQUEST',
});

export const signUpSuccess = (user: FirebaseUser): SignUpSuccess => ({
  type: 'SIGN_UP_SUCCESS',
  payload: {
    user,
  },
});

export const signUpFailure = (error: string): SignUpFailure => ({
  type: 'SIGN_UP_FAILURE',
  payload: {
    error,
  },
});

export const signUp = (
  username: string,
  email: string,
  password: string,
  onSuccess = () => {},
  onFailure = (err: FirebaseError) => {}
) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(signUpRequest());

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        if (cred.user)
          db.collection('users').doc(cred.user.uid).set({
            username,
          });
        dispatch(signUpSuccess(cred.user));
        onSuccess();
      })
      .catch((err: FirebaseError) => {
        dispatch(signUpFailure(err.message));
        onFailure(err);
      });
  };
};

// Sign Out
export const signOutRequest = (): SignOutRequest => ({
  type: 'SIGN_OUT_REQUEST',
});

export const signOutSuccess = (): SignOutSuccess => ({
  type: 'SIGN_OUT_SUCCESS',
});

export const signOutFailure = (error: string): SignOutFailure => ({
  type: 'SIGN_OUT_FAILURE',
  payload: {
    error,
  },
});

export const signOut = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(signOutRequest());

    auth
      .signOut()
      .then(() => {
        dispatch(signOutSuccess());
      })
      .catch((err: FirebaseError) => dispatch(signOutFailure(err.message)));
  };
};

// verify
export const verifyRequest = (): VerifyRequest => ({
  type: 'VERIFY_REQUEST',
});

export const verifySuccess = (): VerifySuccess => ({
  type: 'VERIFY_SUCCESS',
});

export const verifyAuth = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(verifyRequest());

    auth.onAuthStateChanged((user) => {
      if (user) dispatch(signInSuccess(user));
      return dispatch(verifySuccess());
    });
  };
};

// dialogs
export const displaySignInDialog = (): DisplaySignInDialog => ({
  type: 'DISPLAY_SIGN_IN_DIALOG',
});

export const hideSignInDialog = (): HideSignInDialog => ({
  type: 'HIDE_SIGN_IN_DIALOG',
});

export const displaySignUpDialog = (): DisplaySignUpDialog => ({
  type: 'DISPLAY_SIGN_UP_DIALOG',
});

export const hideSignUpDialog = (): HideSignUpDialog => ({
  type: 'HIDE_SIGN_UP_DIALOG',
});

export const displaySignUpSuccessToast = (): DisplaySignUpSuccessToast => ({
  type: 'DISPLAY_SIGN_UP_SUCCESS_TOAST',
});

export const hideSignUpSuccessToast = (): HideSignUpSuccessToast => ({
  type: 'HIDE_SIGN_UP_SUCCESS_TOAST',
});
