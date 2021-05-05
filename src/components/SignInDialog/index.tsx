import {
  Button,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CustomDialog from '../CustomDialog';

const useStyles = makeStyles({
  form: {
    width: '100%',
    marginBottom: '1rem',
  },
});

interface FormDetails {
  email: string;
  password: string;
}

interface Props {
  handleSignIn: (data: FormDetails) => void;
  switchToSignUpDialog: () => void;
  switchToResetPasswordDialog: () => void;
  open: boolean;
  hideDialog: () => void;
  loading: boolean;
  error: string;
}

const SignInDialog: React.FC<Props> = ({
  handleSignIn,
  switchToSignUpDialog,
  switchToResetPasswordDialog,
  open,
  hideDialog,
  loading,
  error,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setError, clearErrors } = useForm();

  useEffect(() => {
    error
      ? setError('password', { message: error, shouldFocus: false })
      : clearErrors();
  }, [error, setError, clearErrors]);

  return (
    <CustomDialog
      heading='Log In'
      open={open}
      onClose={hideDialog}
      maxWidth='xs'
    >
      <form
        aria-label='log in form'
        className={classes.form}
        onSubmit={handleSubmit((data: FormDetails) => handleSignIn(data))}
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

          <Grid item>
            <TextField
              inputRef={register({
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              id='password'
              label='Password'
              type='password'
              name='password'
              autoComplete='current-password'
              fullWidth
              aria-invalid={errors.password ? 'true' : 'false'}
            />
          </Grid>

          {errors.password && (
            <Grid item>
              <Typography role='alert' variant='subtitle2' color='error'>
                {errors.password.message}
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
              Log In
            </Button>
          </Grid>
        </Grid>
      </form>

      <Grid container justify='space-between' spacing={1}>
        <Grid item>
          <Link
            color='textPrimary'
            component='button'
            onClick={switchToSignUpDialog}
          >
            Don't have an account?
          </Link>
        </Grid>

        <Grid item>
          <Link
            color='textPrimary'
            component='button'
            onClick={switchToResetPasswordDialog}
          >
            Forgot your password?
          </Link>
        </Grid>
      </Grid>
    </CustomDialog>
  );
};

export default SignInDialog;
