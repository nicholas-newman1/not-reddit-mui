import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const CreatePostSuccessToast: React.FC<Props> = ({ open, handleClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity='success'
        variant='filled'
        elevation={6}
      >
        Post successfully created!
      </Alert>
    </Snackbar>
  );
};

export default CreatePostSuccessToast;
