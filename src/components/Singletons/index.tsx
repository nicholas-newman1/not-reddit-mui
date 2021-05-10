import CreateCategoryDialogContainer from '../../containers/CreateCategoryDialogContainer';
import CreateCategorySuccessToastContainer from '../../containers/CreateCategorySuccessToastContainer';
import CreatePostDialogContainer from '../../containers/CreatePostDialogContainer';
import ResetPasswordDialogContainer from '../../containers/ResetPasswordDialogContainer';
import ResetPasswordSentToastContainer from '../../containers/ResetPasswordSentToastContainer';
import SentEmailVerificationDialogContainer from '../../containers/SentEmailVerificationDialogContainer';
import VerifyEmailDialogContainer from '../../containers/VerifyEmailDialogContainer';
import SignInDialogContainer from '../../containers/SignInDialogContainer';
import SignUpDialogContainer from '../../containers/SignUpDialogContainer';

const Singletons = () => {
  return (
    <>
      <SignInDialogContainer />
      <SignUpDialogContainer />
      <ResetPasswordDialogContainer />
      <ResetPasswordSentToastContainer />
      <SentEmailVerificationDialogContainer />
      <VerifyEmailDialogContainer />
      <CreatePostDialogContainer />
      <CreateCategoryDialogContainer />
      <CreateCategorySuccessToastContainer />
    </>
  );
};

export default Singletons;
