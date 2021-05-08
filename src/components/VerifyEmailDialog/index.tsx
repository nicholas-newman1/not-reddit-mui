import { Button } from '@material-ui/core';
import CustomDialog from '../CustomDialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

const VerifyEmailDialog: React.FC<Props> = ({ open, onClose }) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth='xs'
      heading='Please Verify Your Email Address'
    >
      <Button variant='contained' onClick={onClose} fullWidth>
        Close
      </Button>
    </CustomDialog>
  );
};

export default VerifyEmailDialog;
