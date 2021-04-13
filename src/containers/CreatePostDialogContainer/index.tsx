import { useEffect } from 'react';
import CreatePostDialog from '../../components/CreatePostDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { displaySignInDialog } from '../../store/authSlice';
import {
  createPost,
  getSubscribedCategoryIds,
  hideCreatePostDialog,
} from '../../store/createPostSlice';

const CreatePostDialogContainer = () => {
  const dispatch = useAppDispatch();
  const hideDialog = () => dispatch(hideCreatePostDialog());
  const onLogin = () => dispatch(displaySignInDialog());
  const user = !!useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.createPost.loading);
  const error = useAppSelector((state) => state.createPost.error);
  const open = useAppSelector(
    (state) => state.createPost.isCreatePostDialogOpen
  );
  const subscribedCategoryIds = useAppSelector(
    (state) => state.createPost.subscribedCategoryIds
  );
  const loadingSubscribedCategoryIds = useAppSelector(
    (state) => state.createPost.loadingSubscribedCategoryIds
  );
  const defaultCategoryId = useAppSelector(
    (state) => state.createPost.defaultCategoryId
  );

  interface createPostData {
    title: string;
    category: string;
    body: string;
  }

  const handleCreatePost = (data: createPostData) => {
    dispatch(createPost(data));
  };

  useEffect(() => {
    if (open) {
      dispatch(getSubscribedCategoryIds());
    }
  }, [dispatch, open, user]);

  return (
    <CreatePostDialog
      handleCreatePost={handleCreatePost}
      open={open}
      hideDialog={hideDialog}
      loading={loading}
      user={user}
      onLogin={onLogin}
      loadingSubscribedCategoryIds={loadingSubscribedCategoryIds}
      error={error}
      subscribedCategoryIds={subscribedCategoryIds}
      defaultCategoryId={defaultCategoryId}
    />
  );
};

export default CreatePostDialogContainer;
