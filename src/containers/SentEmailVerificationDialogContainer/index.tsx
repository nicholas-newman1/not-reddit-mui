import SentEmailVerificationDialog from '../../components/SentEmailVerificationDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hideSentEmailVerificationDialog } from '../../store/authSlice';

const SentEmailVerificationDialogContainer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(
    (state) => state.auth.isSentEmailVerificationDialogOpen
  );

  return (
    <SentEmailVerificationDialog
      isDialogOpen={open}
      hideDialog={() => dispatch(hideSentEmailVerificationDialog())}
    />
  );
};

export default SentEmailVerificationDialogContainer;
