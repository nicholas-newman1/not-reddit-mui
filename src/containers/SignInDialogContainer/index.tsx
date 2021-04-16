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
  const { isSignInDialogOpen, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleSignIn = ({ email, password }: FormDetails) => {
    dispatch(signIn({ email, password }));
  };

  return (
    <SignInDialog
      handleSignIn={handleSignIn}
      switchToSignUpDialog={switchToSignUpDialog}
      switchToResetPasswordDialog={switchToResetPasswordDialog}
      open={isSignInDialogOpen}
      hideDialog={hideDialog}
      loading={loading}
      error={error}
    />
  );
};

export default SignInDialogContainer;
