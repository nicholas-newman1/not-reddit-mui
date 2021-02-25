import { Dispatch } from 'redux';
import { auth, FirebaseError, FirebaseUser } from '../../firebase/client';
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

export const signIn = (email: string, password: string) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(signUpRequest());

    auth
      .signInWithEmailAndPassword(email, password)
      .then((cred) => {
        dispatch(signInSuccess(cred.user));
      })
      .catch((err: FirebaseError) => dispatch(signInFailure(err.message)));
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

export const signUp = (email: string, password: string) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(signUpRequest());

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        dispatch(signUpSuccess(cred.user));
      })
      .catch((err: FirebaseError) => dispatch(signUpFailure(err.message)));
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
