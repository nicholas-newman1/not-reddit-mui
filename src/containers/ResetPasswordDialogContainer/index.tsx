import ResetPasswordDialog from '../../components/ResetPasswordDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hideResetPasswordDialog, resetPassword } from '../../store/authSlice';

const ResetPasswordDialogContainer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.auth.isResetPasswordDialogOpen);
  const error = useAppSelector((state) => state.auth.error);

  const handleResetPassword = (email: string) => {
    dispatch(resetPassword({ email }));
  };

  return (
    <ResetPasswordDialog
      handleResetPassword={handleResetPassword}
      open={open}
      hideDialog={() => dispatch(hideResetPasswordDialog())}
      loading={false}
      error={error}
    />
  );
};

export default ResetPasswordDialogContainer;
