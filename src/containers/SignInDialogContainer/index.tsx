import SignInDialog from '../../components/SignInDialog';
import { FirebaseError } from '../../firebase/client';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  hideSignInDialog,
  displaySignUpDialog,
  signIn,
  displayResetPasswordDialog,
} from '../../store/authSlice';
interface FormDetails {
  email: string;
  password: string;
}

const SignInDialogContainer = () => {
  const dispatch = useAppDispatch();
  const hideDialog = () => dispatch(hideSignInDialog());
  const switchToSignUpDialog = () => {
    dispatch(hideSignInDialog());
    dispatch(displaySignUpDialog());
  };
  const switchToResetPasswordDialog = () => {
    dispatch(hideSignInDialog());
    dispatch(displayResetPasswordDialog());
  };

  const loading = useAppSelector((state) => state.auth.loading);
  const isDialogOpen = useAppSelector((state) => state.auth.isSignInDialogOpen);

  const handleSignIn = (
    { email, password }: FormDetails,
    setError: (message: string) => void
  ) => {
    const onSuccess = () => dispatch(hideSignInDialog());
    const onFailure = (err: FirebaseError) => {
      if (err.code === 'auth/too-many-requests') {
        return setError(
          'Too many failed attempts. Try again later, or reset your password'
        );
      }
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        return setError('Incorrect email or password');
      }
      return setError(err.message);
    };

    dispatch(signIn({ email, password, onSuccess, onFailure }));
  };

  return (
    <SignInDialog
      handleSignIn={handleSignIn}
      switchToSignUpDialog={switchToSignUpDialog}
      switchToResetPasswordDialog={switchToResetPasswordDialog}
      isDialogOpen={isDialogOpen}
      hideDialog={hideDialog}
      loading={loading}
    />
  );
};

export default SignInDialogContainer;
