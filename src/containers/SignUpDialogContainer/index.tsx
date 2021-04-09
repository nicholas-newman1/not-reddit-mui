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

  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  const open = useAppSelector((state) => state.auth.isSignUpDialogOpen);

  const handleSignUp = (data: FormDetails) => {
    dispatch(signUp(data));
  };

  return (
    <SignUpDialog
      switchToSignInDialog={switchToSignInDialog}
      loading={loading}
      open={open}
      handleSignUp={handleSignUp}
      hideDialog={hideDialog}
      error={error}
    />
  );
};

export default SignUpDialogContainer;
