import {
  Button,
  Card,
  Dialog,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

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

interface FormDetails {
  email: string;
  password: string;
}

interface Props {
  handleSignIn: (data: FormDetails) => void;
  switchToSignUpDialog: () => void;
  switchToResetPasswordDialog: () => void;
  isDialogOpen: boolean;
  hideDialog: () => void;
  loading: boolean;
  error: string;
}

const SignInDialog: React.FC<Props> = ({
  handleSignIn,
  switchToSignUpDialog,
  switchToResetPasswordDialog,
  isDialogOpen,
  hideDialog,
  loading,
  error,
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors, setError } = useForm();

  useEffect(() => {
    setError('password', { message: error, shouldFocus: false });
  }, [error, setError]);

  return (
    <Dialog open={isDialogOpen} onClose={hideDialog} fullWidth maxWidth='xs'>
      <Card className={classes.card}>
        <Typography component='h1' variant='h4' align='center'>
          Login
        </Typography>

        <form
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
                fullWidth
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
      </Card>
    </Dialog>
  );
};

export default SignInDialog;
