import { AuthActionTypes } from './types';

const initialState = {};

export const authReducer = (state = initialState, action: AuthActionTypes) => {
  switch (action.type) {
    default:
      return state;
  }
};
