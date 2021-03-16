import SignUpDialog from '../../components/SignUpDialog';
import { FirebaseError } from '../../firebase/client';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  hideSignUpDialog,
  displaySignInDialog,
  displaySignUpSuccessToast,
  signUp,
} from '../../store/authSlice';

interface FormDetails {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpDialogContainer = () => {
  const dispatch = useAppDispatch();
  const hideDialog = () => dispatch(hideSignUpDialog());
  const switchToSignInDialog = () => {
    dispatch(hideSignUpDialog());
    dispatch(displaySignInDialog());
  };

  const loading = useAppSelector((state) => state.auth.loading);
  const isDialogOpen = useAppSelector((state) => state.auth.isSignUpDialogOpen);

  const handleSignUp = (
    { username, email, password, confirmPassword }: FormDetails,
    setError: (message: string) => void
  ) => {
    if (password !== confirmPassword) return setError('Passwords must match');

    const onSuccess = () => {
      dispatch(hideSignUpDialog());
      dispatch(displaySignUpSuccessToast());
    };
    const onFailure = (err: FirebaseError) => setError(err.message);

    dispatch(signUp({ username, email, password, onSuccess, onFailure }));
  };

  return (
    <SignUpDialog
      switchToSignInDialog={switchToSignInDialog}
      loading={loading}
      isDialogOpen={isDialogOpen}
      handleSignUp={handleSignUp}
      hideDialog={hideDialog}
    />
  );
};

export default SignUpDialogContainer;
