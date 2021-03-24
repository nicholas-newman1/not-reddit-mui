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
    overflow: 'auto',
  },
  form: {
    width: '100%',
    marginTop: '2rem',
    marginBottom: '1rem',
  },
}));

interface FormDetails {
  username: string;
  email: string;
  password: string;
}

interface Props {
  switchToSignInDialog: () => void;
  loading: boolean;
  open: boolean;
  handleSignUp: (data: FormDetails) => void;
  hideDialog: () => void;
  error: string;
}

const SignUpDialog: React.FC<Props> = ({
  switchToSignInDialog,
  loading,
  open,
  handleSignUp,
  hideDialog,
  error,
}) => {
  const { register, handleSubmit, errors, setError, watch } = useForm();
  const classes = useStyles();

  useEffect(() => {
    setError('confirmPassword', { message: error, shouldFocus: false });
  }, [error, setError]);

  return (
    <Dialog open={open} onClose={hideDialog} fullWidth maxWidth='xs'>
      <Card className={classes.card}>
        <Typography component='h1' variant='h4' align='center'>
          Sign Up
        </Typography>

        <form
          aria-label='sign up form'
          className={classes.form}
          onSubmit={handleSubmit(({ email, password, username }: FormDetails) =>
            handleSignUp({ email, password, username })
          )}
        >
          <Grid container direction='column' spacing={3}>
            <Grid item>
              <TextField
                inputRef={register({ required: 'Username is required' })}
                id='username'
                label='Username'
                fullWidth
                autoFocus
                autoComplete='username'
                name='username'
                aria-invalid={errors.username ? 'true' : 'false'}
              />
            </Grid>

            {errors.username && (
              <Grid item>
                <Typography role='alert' variant='subtitle2' color='error'>
                  {errors.username.message}
                </Typography>
              </Grid>
            )}

            <Grid item>
              <TextField
                inputRef={register({ required: 'Email is required' })}
                id='email'
                label='Email'
                fullWidth
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
                autoComplete='new-password'
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

            <Grid item>
              <TextField
                inputRef={register({
                  required: 'Please confirm password',
                  validate: (value) =>
                    value === watch('password') || 'Passwords must match',
                })}
                id='confirmPassword'
                label='Confirm Password'
                type='password'
                name='confirmPassword'
                autoComplete='new-password'
                fullWidth
                aria-invalid={errors.password ? 'true' : 'false'}
              />
            </Grid>

            {errors.confirmPassword && (
              <Grid item>
                <Typography role='alert' variant='subtitle2' color='error'>
                  {errors.confirmPassword.message}
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
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>

        <Link
          color='textPrimary'
          component='button'
          onClick={switchToSignInDialog}
        >
          Already have an account?
        </Link>
      </Card>
    </Dialog>
  );
};

export default SignUpDialog;
