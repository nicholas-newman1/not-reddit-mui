import {
  Button,
  Card,
  Dialog,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    padding: theme.spacing(3),
    margin: '0 auto',
  },
  form: {
    width: '100%',
    marginTop: '2rem',
    marginBottom: '1rem',
  },
}));

interface Props {
  open: boolean;
  handleClose: () => void;
}

const SentEmailVerificationDialog: React.FC<Props> = ({
  open,
  handleClose,
}) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
      <Card className={classes.card}>
        <Grid container spacing={3} direction='column'>
          <Grid item>
            <Typography component='h1' variant='h4' align='center'>
              Email Verification Sent
            </Typography>
          </Grid>

          <Grid item>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={handleClose}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Dialog>
  );
};

export default SentEmailVerificationDialog;
