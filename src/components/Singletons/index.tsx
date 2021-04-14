import CreateCategoryDialogContainer from '../../containers/CreateCategoryDialogContainer';
import CreateCategorySuccessToastContainer from '../../containers/CreateCategorySuccessToastContainer';
import CreatePostDialogContainer from '../../containers/CreatePostDialogContainer';
import CreatePostSuccessToastContainer from '../../containers/CreatePostSuccessToastContainer';
import ResetPasswordDialogContainer from '../../containers/ResetPasswordDialogContainer';
import ResetPasswordSentToastContainer from '../../containers/ResetPasswordSentToastContainer';
import SentEmailVerificationDialogContainer from '../../containers/SentEmailVerificationDialogContainer';
import SignInDialogContainer from '../../containers/SignInDialogContainer';
import SignUpDialogContainer from '../../containers/SignUpDialogContainer';
import SignUpSuccessToastContainer from '../../containers/SignUpSuccessToastContainer';

const Singletons = () => {
  return (
    <>
      <SignInDialogContainer />
      <SignUpDialogContainer />
      <ResetPasswordDialogContainer />
      <SignUpSuccessToastContainer />
      <ResetPasswordSentToastContainer />
      <SentEmailVerificationDialogContainer />
      <CreatePostDialogContainer />
      <CreatePostSuccessToastContainer />
      <CreateCategoryDialogContainer />
      <CreateCategorySuccessToastContainer />
    </>
  );
};

export default Singletons;
