import Toast from '../../components/Toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hideSignUpSuccessToast } from '../../store/authSlice';

const SignUpSuccessToastContainer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.auth.isSignUpSuccessToastOpen);

  return (
    <Toast
      message='Account successfully created!'
      severity='success'
      open={open}
      handleClose={() => dispatch(hideSignUpSuccessToast())}
    />
  );
};

export default SignUpSuccessToastContainer;
