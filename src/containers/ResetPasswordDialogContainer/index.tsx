import React from 'react';
import ResetPasswordDialog from '../../components/ResetPasswordDialog';
import { FirebaseError } from '../../firebase/client';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  displayResetPasswordSentToast,
  hideResetPasswordDialog,
  resetPassword,
} from '../../store/authSlice';

const ResetPasswordDialogContainer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.auth.isResetPasswordDialogOpen);

  const handleResetPassword = (
    email: string,
    setError: (err: string) => void
  ) => {
    const onSuccess = () => {
      dispatch(hideResetPasswordDialog());
      dispatch(displayResetPasswordSentToast());
    };

    const onFailure = (err: FirebaseError) => {
      if (err.code === 'auth/user-not-found') {
        return setError('User does not exist');
      }
      return setError(err.message);
    };

    dispatch(resetPassword({ email, onSuccess, onFailure }));
  };
  return (
    <ResetPasswordDialog
      handleResetPassword={handleResetPassword}
      isDialogOpen={open}
      hideDialog={() => dispatch(hideResetPasswordDialog())}
      loading={false}
    />
  );
};

export default ResetPasswordDialogContainer;
