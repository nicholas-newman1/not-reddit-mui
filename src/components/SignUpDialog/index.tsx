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
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FirebaseError } from '../../firebase/client';
import {
  displaySignInDialog,
  hideSignUpDialog,
  signUp,
} from '../../store/auth/actions';
import { AppState } from '../../store/rootReducer';

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
  confirmPassword: string;
}

const SignUpDialog = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: AppState) => state.auth.loading);
  const { register, handleSubmit, errors, setError } = useForm();
  const classes = useStyles();
  const signUpDialog = useSelector(
    (state: AppState) => state.auth.signUpDialog
  );

  const handleSubmitCb = ({
    username,
    email,
    password,
    confirmPassword,
  }: FormDetails) => {
    if (password !== confirmPassword)
      return setError('confirmPassword', {
        message: 'Passwords must match',
        shouldFocus: false,
      });

    const onSuccess = () => dispatch(hideSignUpDialog());
    const onFailure = (err: FirebaseError) =>
      setError('confirmPassword', { message: err.message, shouldFocus: false });

    dispatch(signUp(username, email, password, onSuccess, onFailure));
  };

  const switchDialog = () => {
    dispatch(hideSignUpDialog());
    dispatch(displaySignInDialog());
  };

  return (
    <Dialog
      open={signUpDialog}
      onClose={() => dispatch(hideSignUpDialog())}
      fullWidth
      maxWidth='xs'
    >
      <Card className={classes.card}>
        <Typography component='h1' variant='h4' align='center'>
          Sign Up
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(handleSubmitCb)}>
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

        <Link color='textPrimary' component='button' onClick={switchDialog}>
          Already have an account?
        </Link>
      </Card>
    </Dialog>
  );
};

export default SignUpDialog;
