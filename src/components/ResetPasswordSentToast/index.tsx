import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const ResetPasswordSentToast: React.FC<Props> = ({ open, handleClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity='success'
        variant='filled'
        elevation={6}
      >
        An email has been sent with further instructions
      </Alert>
    </Snackbar>
  );
};

export default ResetPasswordSentToast;
