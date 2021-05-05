import {
  Button,
  Card,
  Dialog,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  handleResetPassword: (email: string) => void;
  open: boolean;
  hideDialog: () => void;
  loading: boolean;
  error: string;
}

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
    <Dialog open={open} onClose={hideDialog} fullWidth maxWidth='xs'>
      <Card className={classes.card}>
        <Typography component='h1' variant='h4' align='center'>
          Reset Password
        </Typography>

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
                fullWidth
              >
                Send Password Reset Email
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Dialog>
  );
};

export default ResetPasswordDialog;
