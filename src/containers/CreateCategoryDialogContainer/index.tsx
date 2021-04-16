import CreateCategoryDialog from '../../components/CreateCategoryDialog';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  createCategory,
  hideCreateCategoryDialog,
} from '../../store/createCategorySlice';

const CreateCategoryDialogContainer = () => {
  const dispatch = useAppDispatch();
  const hideDialog = () => dispatch(hideCreateCategoryDialog());
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
    />
  );
};

export default CreateCategoryDialogContainer;
