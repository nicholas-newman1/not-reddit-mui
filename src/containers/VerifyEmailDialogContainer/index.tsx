import VerifyEmailDialog from '../../components/VerifyEmailDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hideVerifyEmailDialog } from '../../store/authSlice';

const VerifyEmailDialogContainer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.auth.isVerifyEmailDialogOpen);

  return (
    <VerifyEmailDialog
      open={open}
      onClose={() => dispatch(hideVerifyEmailDialog())}
    />
  );
};

export default VerifyEmailDialogContainer;
