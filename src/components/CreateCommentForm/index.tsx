import {
  makeStyles,
  Grid,
  Typography,
  Button,
  TextField,
  Link,
} from '@material-ui/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Error } from '../../types/client';

const useStyles = makeStyles((theme) => ({
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
  defaultValue?: string;
  error?: Error;
  isEdit?: boolean;
  isReply?: boolean;
  loading: boolean;
  loadingSubscribe: boolean;
  onCancel: () => void;
  onReply: (body: string) => void;
  onSignIn: () => void;
  onSubscribe: (clearErrors: () => void) => void;
}

const CreateCommentForm: React.FC<Props> = ({
  defaultValue = '',
  error,
  isEdit,
  isReply,
  loading,
  loadingSubscribe,
  onCancel,
  onReply,
  onSignIn,
  onSubscribe,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setError, clearErrors } = useForm();

  useEffect(() => {
    error &&
      setError('body', {
        type: error.type,
        message: error.message,
        shouldFocus: false,
      });
  }, [error, setError]);

  return (
    <form
      aria-label='create comment'
      className={classes.form}
      onSubmit={handleSubmit((data: FormDetails) => onReply(data.body))}
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
            defaultValue={defaultValue}
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

        <Grid item>
          <Grid container direction='row' spacing={2}>
            <Grid item>
              <Button
                disabled={loading}
                variant='contained'
                color='primary'
                type='submit'
              >
                {isReply ? 'Reply' : isEdit ? 'Edit' : 'Comment'}
              </Button>
            </Grid>

            <Grid item>
              <Button variant='contained' onClick={onCancel}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateCommentForm;
