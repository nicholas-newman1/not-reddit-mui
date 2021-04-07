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
  const loading = useAppSelector((state) => state.createCategory.loading);
  const error = useAppSelector((state) => state.createCategory.error);
  const open = useAppSelector(
    (state) => state.createCategory.isCreateCategoryDialogOpen
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
      open={open}
      hideDialog={hideDialog}
      loading={loading}
      error={error}
    />
  );
};

export default CreateCategoryDialogContainer;
