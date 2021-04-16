import SignUpDialog from '../../components/SignUpDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  hideSignUpDialog,
  displaySignInDialog,
  signUp,
} from '../../store/authSlice';

interface FormDetails {
  username: string;
  email: string;
  password: string;
}

const SignUpDialogContainer = () => {
  const dispatch = useAppDispatch();
  const hideDialog = () => dispatch(hideSignUpDialog());
  const switchToSignInDialog = () => {
    dispatch(hideSignUpDialog());
    dispatch(displaySignInDialog());
  };
  const { isSignUpDialogOpen, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleSignUp = (data: FormDetails) => {
    dispatch(signUp(data));
  };

  return (
    <SignUpDialog
      switchToSignInDialog={switchToSignInDialog}
      loading={loading}
      open={isSignUpDialogOpen}
      handleSignUp={handleSignUp}
      hideDialog={hideDialog}
      error={error}
    />
  );
};

export default SignUpDialogContainer;
