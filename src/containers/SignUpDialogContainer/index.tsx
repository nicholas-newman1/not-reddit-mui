import { useDispatch, useSelector } from 'react-redux';
import SignUpDialog from '../../components/SignUpDialog';
import { FirebaseError } from '../../firebase/client';
import {
  hideSignUpDialog,
  displaySignInDialog,
  signUp,
} from '../../store/auth/actions';
import { AppState } from '../../store/rootReducer';

interface FormDetails {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpDialogContainer = () => {
  const dispatch = useDispatch();
  const hideDialog = () => dispatch(hideSignUpDialog());
  const switchToSignInDialog = () => {
    dispatch(hideSignUpDialog());
    dispatch(displaySignInDialog());
  };

  const loading = useSelector((state: AppState) => state.auth.loading);
  const isDialogOpen = useSelector(
    (state: AppState) => state.auth.signUpDialog
  );

  const handleSignUp = (
    { username, email, password, confirmPassword }: FormDetails,
    setError: (message: string) => void
  ) => {
    if (password !== confirmPassword) return setError('Passwords must match');

    const onSuccess = () => dispatch(hideSignUpDialog());
    const onFailure = (err: FirebaseError) => setError(err.message);

    dispatch(signUp(username, email, password, onSuccess, onFailure));
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
