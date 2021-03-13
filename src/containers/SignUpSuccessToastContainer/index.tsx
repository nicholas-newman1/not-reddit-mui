import { useDispatch, useSelector } from 'react-redux';
import SignUpSuccessToast from '../../components/SignUpSuccessToast';
import { hideSignUpSuccessToast } from '../../store/auth/actions';
import { AppState } from '../../store/rootReducer';

const SignUpSuccessToastContainer = () => {
  const dispatch = useDispatch();
  const open = useSelector(
    (state: AppState) => state.auth.isSignUpSuccessToastOpen
  );

  return (
    <SignUpSuccessToast
      open={open}
      handleClose={() => dispatch(hideSignUpSuccessToast())}
    />
  );
};

export default SignUpSuccessToastContainer;
