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
  const isDialogOpen = useAppSelector((state) => state.auth.isSignUpDialogOpen);

  const handleSignUp = ({ username, email, password }: FormDetails) => {
    dispatch(signUp({ username, email, password }));
  };

  return (
    <SignUpDialog
      switchToSignInDialog={switchToSignInDialog}
      loading={loading}
      isDialogOpen={isDialogOpen}
      handleSignUp={handleSignUp}
      hideDialog={hideDialog}
      error={error}
    />
  );
};

export default SignUpDialogContainer;
