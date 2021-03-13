import { FirebaseUser } from '../../firebase/client';
import { AuthActionTypes } from './types';

interface AuthState {
  user: FirebaseUser;
  loading: boolean;
  error: string;
  signInDialog: boolean;
  signUpDialog: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: '',
  signInDialog: false,
  signUpDialog: false,
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case 'SIGN_IN_REQUEST':
      return { ...state, loading: true, user: null, error: '' };
    case 'SIGN_IN_SUCCESS':
      return { ...state, loading: false, user: action.payload.user, error: '' };
    case 'SIGN_IN_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        error: action.payload.error,
      };
    case 'SIGN_UP_REQUEST':
      return { ...state, loading: true, user: null, error: '' };
    case 'SIGN_UP_SUCCESS':
      return { ...state, loading: false, user: action.payload.user, error: '' };
    case 'SIGN_UP_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        error: action.payload.error,
      };
    case 'SIGN_OUT_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'SIGN_OUT_SUCCESS':
      return { ...state, loading: false, user: null, error: '' };
    case 'SIGN_OUT_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case 'VERIFY_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'VERIFY_SUCCESS':
      return { ...state, loading: false };
    case 'DISPLAY_SIGN_IN_DIALOG':
      return { ...state, signInDialog: true };
    case 'HIDE_SIGN_IN_DIALOG':
      return { ...state, signInDialog: false };
    case 'DISPLAY_SIGN_UP_DIALOG':
      return { ...state, signUpDialog: true };
    case 'HIDE_SIGN_UP_DIALOG':
      return { ...state, signUpDialog: false };
    default:
      return state;
  }
};
