import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CustomDialog from '../CustomDialog';

interface Props {
  handleResetPassword: (email: string) => void;
  open: boolean;
  hideDialog: () => void;
  loading: boolean;
  error: string;
}

const useStyles = makeStyles({
  form: {
    width: '100%',
    marginBottom: '1rem',
  },
});

const ResetPasswordDialog: React.FC<Props> = ({
  handleResetPassword,
  open,
  hideDialog,
  loading,
  error,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setError, clearErrors } = useForm();

  useEffect(() => {
    error ? setError('email', { message: error }) : clearErrors();
  }, [error, setError, clearErrors]);

  return (
    <CustomDialog
      heading='Reset Password'
      open={open}
      onClose={hideDialog}
      maxWidth='xs'
    >
      <form
        aria-label='reset password form'
        className={classes.form}
        onSubmit={handleSubmit((data) => handleResetPassword(data.email))}
      >
        <Grid container direction='column' spacing={3}>
          <Grid item>
            <TextField
              inputRef={register({ required: 'Email is required' })}
              id='email'
              label='Email'
              fullWidth
              autoFocus
              autoComplete='email'
              name='email'
              aria-invalid={errors.email ? 'true' : 'false'}
            />
          </Grid>

          {errors.email && (
            <Grid item>
              <Typography role='alert' variant='subtitle2' color='error'>
                {errors.email.message}
              </Typography>
            </Grid>
          )}

          <Grid item container justify='center'>
            <Button
              disabled={loading}
              variant='contained'
              color='primary'
              type='submit'
            >
              Send Password Reset Email
            </Button>
          </Grid>
        </Grid>
      </form>
    </CustomDialog>
  );
};

export default ResetPasswordDialog;
