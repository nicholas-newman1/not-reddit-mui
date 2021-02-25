export const AUTH_LOGIN_USER = 'auth/LOGIN_USER';

interface AuthLoginUser {
  type: typeof AUTH_LOGIN_USER;
  payload: {
    email: string;
    password: string;
  };
}

export type AuthActionTypes = AuthLoginUser;
