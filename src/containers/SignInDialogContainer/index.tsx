import SignInDialog from '../../components/SignInDialog';
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
  const error = useAppSelector((state) => state.auth.error);
  const isDialogOpen = useAppSelector((state) => state.auth.isSignInDialogOpen);

  const handleSignIn = ({ email, password }: FormDetails) => {
    dispatch(signIn({ email, password }));
  };

  return (
    <SignInDialog
      handleSignIn={handleSignIn}
      switchToSignUpDialog={switchToSignUpDialog}
      switchToResetPasswordDialog={switchToResetPasswordDialog}
      isDialogOpen={isDialogOpen}
      hideDialog={hideDialog}
      loading={loading}
      error={error}
    />
  );
};

export default SignInDialogContainer;
