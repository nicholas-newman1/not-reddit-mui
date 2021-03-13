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
import { useHistory } from 'react-router-dom';
import { FirebaseError } from '../../firebase/client';
import {
  displaySignUpDialog,
  hideSignInDialog,
  signIn,
} from '../../store/auth/actions';
import { AppState } from '../../store/rootReducer';

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

const SignInDialog = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const loading = useSelector((state: AppState) => state.auth.loading);
  const { register, handleSubmit, errors, setError } = useForm();
  const signInDialog = useSelector(
    (state: AppState) => state.auth.signInDialog
  );

  const handleSubmitCb = ({ email, password }: FormDetails) => {
    const onSuccess = () => history.push('/');
    const onFailure = (err: FirebaseError) => {
      console.log(err);
      if (err.code === 'auth/too-many-requests') {
        return setError('password', {
          message:
            'Too many failed attempts. Try again later, or reset your password',
          shouldFocus: false,
        });
      }
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        return setError('password', {
          message: 'Incorrect email or password',
          shouldFocus: false,
        });
      }
    };

    dispatch(signIn(email, password, onSuccess, onFailure));
  };

  const switchDialog = () => {
    dispatch(hideSignInDialog());
    dispatch(displaySignUpDialog());
  };

  return (
    <Dialog
      open={signInDialog}
      onClose={() => dispatch(hideSignInDialog())}
      fullWidth
      maxWidth='xs'
    >
      <Card className={classes.card}>
        <Typography component='h1' variant='h4' align='center'>
          Login
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(handleSubmitCb)}>
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

        <Link color='textPrimary' component='button' onClick={switchDialog}>
          Don't have an account?
        </Link>
      </Card>
    </Dialog>
  );
};

export default SignInDialog;
