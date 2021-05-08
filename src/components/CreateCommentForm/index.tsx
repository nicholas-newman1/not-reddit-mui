import {
  makeStyles,
  Grid,
  Typography,
  Button,
  TextField,
  Link,
} from '@material-ui/core';
import { ErrorOption, useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    padding: theme.spacing(3),
    margin: '0 auto',
  },
  form: {
    width: '100%',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    maxWidth: '500px',
  },
  error: {
    display: 'flex',
  },
  link: {
    padding: '0 0.25rem',
  },
}));

interface FormDetails {
  body: string;
}

interface Props {
  onReply: (
    body: string,
    setError: (name: string, error: ErrorOption) => void
  ) => void;
  loading: boolean;
  isReply?: boolean;
  onSignIn: () => void;
  onSendVerification: () => void;
  onSubscribe: (clearErrors: () => void) => void;
  loadingSendVerification: boolean;
  loadingSubscribe: boolean;
}

const CreateCommentForm: React.FC<Props> = ({
  onReply,
  loading,
  isReply,
  onSignIn,
  onSendVerification,
  onSubscribe,
  loadingSendVerification,
  loadingSubscribe,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setError, clearErrors } = useForm();

  return (
    <form
      aria-label='create comment'
      className={classes.form}
      onSubmit={handleSubmit((data: FormDetails) =>
        onReply(data.body, setError)
      )}
    >
      <Grid container direction='column' spacing={3}>
        <Grid item>
          <TextField
            multiline
            inputRef={register({ required: 'Body is required' })}
            autoFocus
            id='body'
            label='Body'
            fullWidth
            name='body'
            aria-invalid={errors.comment ? 'true' : 'false'}
          />
        </Grid>

        {errors.body && (
          <Grid item>
            <Typography
              role='alert'
              variant='subtitle2'
              color='error'
              className={classes.error}
            >
              {errors.body.type === 'auth' ? (
                <>
                  You must
                  {
                    <Link
                      component='button'
                      variant='subtitle2'
                      color='inherit'
                      underline='always'
                      onClick={onSignIn}
                      className={classes.link}
                    >
                      sign in
                    </Link>
                  }
                  first
                </>
              ) : errors.body.type === 'verify' ? (
                <>
                  You must verify your email and refresh the page first.{' '}
                  {
                    <Link
                      component='button'
                      variant='subtitle2'
                      color='inherit'
                      underline='always'
                      onClick={onSendVerification}
                      disabled={loadingSendVerification}
                      className={classes.link}
                    >
                      Resend.
                    </Link>
                  }
                </>
              ) : errors.body.type === 'subscribe' ? (
                <>
                  You must{' '}
                  {
                    <Link
                      component='button'
                      variant='subtitle2'
                      color='inherit'
                      underline='always'
                      onClick={() => onSubscribe(clearErrors)}
                      disabled={loadingSubscribe}
                      className={classes.link}
                    >
                      subscribe
                    </Link>
                  }{' '}
                  to the category first
                </>
              ) : (
                errors.body.message
              )}
            </Typography>
          </Grid>
        )}

        <Grid item container>
          <Button
            disabled={loading}
            variant='contained'
            color='primary'
            type='submit'
          >
            {isReply ? 'Reply' : 'Comment'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateCommentForm;
