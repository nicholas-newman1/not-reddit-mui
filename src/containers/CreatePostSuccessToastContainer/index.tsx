import Toast from '../../components/Toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hideCreatePostSuccessToast } from '../../store/createPostSlice';

const CreatePostSuccessToastContainer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(
    (state) => state.createPost.isCreatePostSuccessToastOpen
  );

  return (
    <Toast
      message='Post successfully created!'
      severity='success'
      open={open}
      handleClose={() => dispatch(hideCreatePostSuccessToast())}
    />
  );
};

export default CreatePostSuccessToastContainer;
