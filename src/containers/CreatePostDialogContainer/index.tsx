import CreatePostDialog from '../../components/CreatePostDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import useSubscribedCategoryIds from '../../hooks/useSubscribedCategoryIds';
import { displaySignInDialog } from '../../store/authSlice';
import { createPost, hideCreatePostDialog } from '../../store/createPostSlice';

const CreatePostDialogContainer = () => {
  const dispatch = useAppDispatch();
  const hideDialog = () => dispatch(hideCreatePostDialog());
  const onLogin = () => dispatch(displaySignInDialog());
  const user = !!useAppSelector((state) => state.auth.user);
  const {
    isCreatePostDialogOpen,
    loading,
    error,
    defaultCategoryId,
  } = useAppSelector((state) => state.createPost);

  const {
    loading: loadingSubscribedCategoryIds,
    onToggleSubscribe,
    subscribed,
    subscribedCategoryIds,
  } = useSubscribedCategoryIds();

  interface createPostData {
    title: string;
    category: string;
    body: string;
  }

  const handleCreatePost = (data: createPostData) => {
    dispatch(createPost(data));
  };

  return (
    <CreatePostDialog
      handleCreatePost={handleCreatePost}
      open={isCreatePostDialogOpen}
      hideDialog={hideDialog}
      loading={loading}
      user={user}
      onLogin={onLogin}
      loadingSubscribedCategoryIds={loadingSubscribedCategoryIds(
        defaultCategoryId
      )}
      error={error}
      subscribedCategoryIds={subscribedCategoryIds}
      defaultCategoryId={defaultCategoryId}
      onSubscribe={() => onToggleSubscribe(defaultCategoryId)}
      isSubscribed={subscribed(defaultCategoryId)}
    />
  );
};

export default CreatePostDialogContainer;
