import { Button } from '@material-ui/core';
import CustomDialog from '../CustomDialog';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const SentEmailVerificationDialog: React.FC<Props> = ({
  open,
  handleClose,
}) => {
  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      maxWidth='xs'
      heading='Email Verification Sent'
    >
      <Button
        variant='contained'
        color='primary'
        onClick={handleClose}
        fullWidth
      >
        Close
      </Button>
    </CustomDialog>
  );
};

export default SentEmailVerificationDialog;
