import ResetPasswordDialog from '../../components/ResetPasswordDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hideResetPasswordDialog, resetPassword } from '../../store/authSlice';

const ResetPasswordDialogContainer = () => {
  const dispatch = useAppDispatch();
  const { error, isResetPasswordDialogOpen } = useAppSelector(
    (state) => state.auth
  );

  const handleResetPassword = (email: string) => {
    dispatch(resetPassword({ email }));
  };

  return (
    <ResetPasswordDialog
      handleResetPassword={handleResetPassword}
      open={isResetPasswordDialogOpen}
      hideDialog={() => dispatch(hideResetPasswordDialog())}
      loading={false}
      error={error}
    />
  );
};

export default ResetPasswordDialogContainer;
