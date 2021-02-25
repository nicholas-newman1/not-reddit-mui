import { FirebaseUser } from '../../firebase/client';
import { AuthActionTypes } from './types';

interface AuthState {
  user: FirebaseUser;
  loading: boolean;
  error: string;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: '',
};

export const authReducer = (state = initialState, action: AuthActionTypes) => {
  switch (action.type) {
    case 'SIGN_IN_REQUEST':
      return { ...state, loading: true };
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
      return { ...state, loading: true };
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
      return { ...state, loading: true };
    case 'SIGN_OUT_SUCCESS':
      return { ...state, loading: false, user: null, error: '' };
    case 'SIGN_OUT_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
