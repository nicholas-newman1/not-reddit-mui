import React, { useEffect, useState } from 'react';
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
  const {
    createCommentLoading,
    isCreateCommentDialogOpen,
    createCommentError,
  } = useAppSelector((state) => state.postPage);
  const [error, setError] =
    useState<undefined | { type?: string; message?: string }>();

  const onReply = async (body: string) => {
    if (!user) return setError({ type: 'auth' });
    if (!subscribed(categoryId)) return setError({ type: 'subscribe' });
    dispatch(createComment({ body, postId }));
  };

  useEffect(() => {
    createCommentError && setError({ message: createCommentError });
  }, [createCommentError]);

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
        error={error}
      />
    </CustomDialog>
  );
};

export default CreateCommentDialogContainer;
