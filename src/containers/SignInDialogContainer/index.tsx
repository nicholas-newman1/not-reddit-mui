import { useDispatch, useSelector } from 'react-redux';
import SignInDialog from '../../components/SignInDialog';
import { FirebaseError } from '../../firebase/client';
import {
  displaySignUpDialog,
  hideSignInDialog,
  signIn,
} from '../../store/auth/actions';
import { AppState } from '../../store/rootReducer';

interface FormDetails {
  email: string;
  password: string;
}

const SignInDialogContainer = () => {
  const dispatch = useDispatch();
  const hideDialog = () => dispatch(hideSignInDialog());
  const switchToSignUpDialog = () => {
    dispatch(hideSignInDialog());
    dispatch(displaySignUpDialog());
  };

  const loading = useSelector((state: AppState) => state.auth.loading);
  const isDialogOpen = useSelector(
    (state: AppState) => state.auth.signInDialog
  );

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
    };

    dispatch(signIn(email, password, onSuccess, onFailure));
  };

  return (
    <SignInDialog
      handleSignIn={handleSignIn}
      switchToSignUpDialog={switchToSignUpDialog}
      isDialogOpen={isDialogOpen}
      hideDialog={hideDialog}
      loading={loading}
    />
  );
};

export default SignInDialogContainer;
