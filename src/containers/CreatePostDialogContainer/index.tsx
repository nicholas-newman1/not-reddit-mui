import CreatePostDialog from '../../components/CreatePostDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { createPost, hideCreatePostDialog } from '../../store/createPostSlice';

const CreatePostDialogContainer = () => {
  const dispatch = useAppDispatch();
  const hideDialog = () => dispatch(hideCreatePostDialog());
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
      open={open}
      hideDialog={hideDialog}
      loading={loading}
      loadingSubscribedCategoryIds={loadingSubscribedCategoryIds}
      error={error}
      subscribedCategoryIds={subscribedCategoryIds}
    />
  );
};

export default CreatePostDialogContainer;
