import { Button } from '@material-ui/core';
import CustomDialog from '../CustomDialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SentEmailVerificationDialog: React.FC<Props> = ({ open, onClose }) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth='xs'
      heading='Email Verification Sent'
    >
      <Button variant='contained' color='primary' onClick={onClose} fullWidth>
        Close
      </Button>
    </CustomDialog>
  );
};

export default SentEmailVerificationDialog;
