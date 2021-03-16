import ResetPasswordSentToast from '../../components/ResetPasswordSentToast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hideResetPasswordSentToast } from '../../store/authSlice';

const ResetPasswordSentToastContainer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(
    (state) => state.auth.isResetPasswordSentToastOpen
  );

  return (
    <ResetPasswordSentToast
      open={open}
      handleClose={() => dispatch(hideResetPasswordSentToast())}
    />
  );
};

export default ResetPasswordSentToastContainer;
