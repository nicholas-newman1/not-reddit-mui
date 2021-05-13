import { useHistory } from 'react-router';
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
  const history = useHistory();
  const user = !!useAppSelector((state) => state.auth.user);
  const { loading, error, isCreateCategoryDialogOpen } = useAppSelector(
    (state) => state.createCategory
  );

  interface createCategoryData {
    categoryName: string;
  }

  const onSubmit = (data: createCategoryData) => {
    dispatch(createCategory({ ...data, history }));
  };

  return (
    <CreateCategoryDialog
      onSubmit={onSubmit}
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
