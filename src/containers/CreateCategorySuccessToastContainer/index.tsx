import Toast from '../../components/Toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { hideCreateCategorySuccessToast } from '../../store/createCategorySlice';

const CreateCategorySuccessToastContainer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(
    (state) => state.createCategory.isCreateCategorySuccessToastOpen
  );

  return (
    <Toast
      message='Category successfully created!'
      severity='success'
      open={open}
      onClose={() => dispatch(hideCreateCategorySuccessToast())}
    />
  );
};

export default CreateCategorySuccessToastContainer;
