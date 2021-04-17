import CreateCategoryDialog from '../../components/CreateCategoryDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { displaySignInDialog } from '../../store/authSlice';
import {
  createCategory,
  hideCreateCategoryDialog,
} from '../../store/createCategorySlice';

const CreateCategoryDialogContainer = () => {
  const dispatch = useAppDispatch();
  const hideDialog = () => dispatch(hideCreateCategoryDialog());
  const onLogin = () => dispatch(displaySignInDialog());
  const user = !!useAppSelector((state) => state.auth.user);
  const { loading, error, isCreateCategoryDialogOpen } = useAppSelector(
    (state) => state.createCategory
  );

  interface createCategoryData {
    categoryName: string;
  }

  const handleCreateCategory = (data: createCategoryData) => {
    dispatch(createCategory(data));
  };

  return (
    <CreateCategoryDialog
      handleCreateCategory={handleCreateCategory}
      open={isCreateCategoryDialogOpen}
      hideDialog={hideDialog}
      loading={loading}
      error={error}
      user={user}
      onLogin={onLogin}
    />
  );
};

export default CreateCategoryDialogContainer;
