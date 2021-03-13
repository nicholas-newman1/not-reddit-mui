import { FirebaseUser } from '../../firebase/client';

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE';
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
export const SIGN_OUT_REQUEST = 'SIGN_OUT_REQUEST';
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';
export const SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE';
export const VERIFY_REQUEST = 'VERIFY_REQUEST';
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS';
export const DISPLAY_SIGN_IN_DIALOG = 'DISPLAY_SIGN_IN_DIALOG';
export const HIDE_SIGN_IN_DIALOG = 'HIDE_SIGN_IN_DIALOG';
export const DISPLAY_SIGN_UP_DIALOG = 'DISPLAY_SIGN_UP_DIALOG';
export const HIDE_SIGN_UP_DIALOG = 'HIDE_SIGN_UP_DIALOG';
export const DISPLAY_SIGN_UP_SUCCESS_TOAST = 'DISPLAY_SIGN_UP_SUCCESS_TOAST';
export const HIDE_SIGN_UP_SUCCESS_TOAST = 'HIDE_SIGN_UP_SUCCESS_TOAST';

export interface SignInRequest {
  type: typeof SIGN_IN_REQUEST;
}

export interface SignInSuccess {
  type: typeof SIGN_IN_SUCCESS;
  payload: {
    user: FirebaseUser;
  };
}

export interface SignInFailure {
  type: typeof SIGN_IN_FAILURE;
  payload: {
    error: string;
  };
}

export interface SignUpRequest {
  type: typeof SIGN_UP_REQUEST;
}

export interface SignUpSuccess {
  type: typeof SIGN_UP_SUCCESS;
  payload: {
    user: FirebaseUser;
  };
}

export interface SignUpFailure {
  type: typeof SIGN_UP_FAILURE;
  payload: {
    error: string;
  };
}

export interface SignOutRequest {
  type: typeof SIGN_OUT_REQUEST;
}

export interface SignOutSuccess {
  type: typeof SIGN_OUT_SUCCESS;
}

export interface SignOutFailure {
  type: typeof SIGN_OUT_FAILURE;
  payload: {
    error: string;
  };
}

export interface VerifyRequest {
  type: typeof VERIFY_REQUEST;
}

export interface VerifySuccess {
  type: typeof VERIFY_SUCCESS;
}

export interface DisplaySignInDialog {
  type: typeof DISPLAY_SIGN_IN_DIALOG;
}

export interface HideSignInDialog {
  type: typeof HIDE_SIGN_IN_DIALOG;
}

export interface DisplaySignUpDialog {
  type: typeof DISPLAY_SIGN_UP_DIALOG;
}

export interface HideSignUpDialog {
  type: typeof HIDE_SIGN_UP_DIALOG;
}

export interface DisplaySignUpSuccessToast {
  type: typeof DISPLAY_SIGN_UP_SUCCESS_TOAST;
}

export interface HideSignUpSuccessToast {
  type: typeof HIDE_SIGN_UP_SUCCESS_TOAST;
}

export type AuthActionTypes =
  | SignInRequest
  | SignInSuccess
  | SignInFailure
  | SignUpRequest
  | SignUpSuccess
  | SignUpFailure
  | SignOutRequest
  | SignOutSuccess
  | SignOutFailure
  | VerifyRequest
  | VerifySuccess
  | DisplaySignInDialog
  | HideSignInDialog
  | DisplaySignUpDialog
  | HideSignUpDialog
  | DisplaySignUpSuccessToast
  | HideSignUpSuccessToast;
