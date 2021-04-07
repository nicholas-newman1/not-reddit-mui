import CreateCategorySuccessToast from '../../components/CreateCategorySuccessToast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hideCreateCategorySuccessToast } from '../../store/createCategorySlice';

const CreateCategorySuccessToastContainer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(
    (state) => state.createCategory.isCreateCategorySuccessToastOpen
  );

  return (
    <CreateCategorySuccessToast
      open={open}
      handleClose={() => dispatch(hideCreateCategorySuccessToast())}
    />
  );
};

export default CreateCategorySuccessToastContainer;
