import React from 'react';
import { ErrorOption } from 'react-hook-form';
import CreateCommentForm from '../../components/CreateCommentForm';
import CustomDialog from '../../components/CustomDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import useSubscribedCategoryIds from '../../hooks/useSubscribedCategoryIds';
import { displaySignInDialog } from '../../store/authSlice';
import {
  createComment,
  hideCreateCommentDialog,
} from '../../store/postPageSlice';
import { subscribeToCategory } from '../../store/subscribedCategoriesSlice';

interface Props {
  categoryId: string;
  postId: string;
}

const CreateCommentDialogContainer: React.FC<Props> = ({
  categoryId,
  postId,
}) => {
  const dispatch = useAppDispatch();
  const { subscribed, loading } = useSubscribedCategoryIds();
  const user = useAppSelector((state) => state.auth.user);
  const { createCommentLoading, isCreateCommentDialogOpen } = useAppSelector(
    (state) => state.postPage
  );

  const onReply = async (
    body: string,
    setError: (name: string, error: ErrorOption) => void
  ) => {
    if (!user) return setError('body', { type: 'auth', shouldFocus: false });
    if (!subscribed(categoryId))
      return setError('body', { type: 'subscribe', shouldFocus: false });

    dispatch(createComment({ body, postId }));
  };
  return (
    <CustomDialog
      heading='Create Comment'
      open={isCreateCommentDialogOpen}
      onClose={() => dispatch(hideCreateCommentDialog())}
    >
      <CreateCommentForm
        onReply={onReply}
        onSignIn={() => dispatch(displaySignInDialog())}
        onSubscribe={(clearErrors: () => void) =>
          dispatch(subscribeToCategory(categoryId)).then(() => clearErrors())
        }
        loading={createCommentLoading}
        loadingSubscribe={loading(categoryId)}
      />
    </CustomDialog>
  );
};

export default CreateCommentDialogContainer;
