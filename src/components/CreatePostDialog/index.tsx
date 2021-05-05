import {
  Button,
  Card,
  Dialog,
  Grid,
  Link,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactHookFormSelect from '../ReactHookFormSelect';
import Spinner from '../Spinner';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    padding: theme.spacing(3),
    margin: '0 auto',
    overflow: 'auto',
  },
  info: {
    marginTop: '1rem',
  },
  form: {
    width: '100%',
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  select: {},
}));

interface FormDetails {
  title: string;
  category: string;
  body: string;
}

interface Props {
  handleCreatePost: (data: FormDetails) => void;
  open: boolean;
  hideDialog: () => void;
  loading: boolean;
  user: boolean;
  onLogin: () => void;
  loadingSubscribedCategoryIds: boolean;
  error: string;
  subscribedCategoryIds: string[];
  defaultCategoryId?: string;
  onSubscribe: () => void;
  isSubscribed: boolean;
}

const CreatePostDialog: React.FC<Props> = ({
  handleCreatePost,
  open,
  hideDialog,
  loading,
  user,
  onLogin,
  loadingSubscribedCategoryIds,
  error,
  subscribedCategoryIds,
  defaultCategoryId = '',
  onSubscribe,
  isSubscribed,
}) => {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    errors,
    setError,
    control,
    clearErrors,
  } = useForm();

  useEffect(() => {
    error
      ? setError('body', { type: 'prop', message: error, shouldFocus: false })
      : clearErrors();
  }, [error, setError, clearErrors]);

  return (
    <Dialog open={open} onClose={hideDialog} fullWidth maxWidth='md'>
      <Card className={classes.card}>
        <Typography component='h1' variant='h4' align='center'>
          Create Post
        </Typography>

        {loadingSubscribedCategoryIds ? (
          <Grid
            container
            justify='center'
            className={classes.info}
            data-testid='loader'
          >
            <Spinner />
          </Grid>
        ) : !user || (defaultCategoryId && !isSubscribed) ? (
          <Typography component='h2' align='center' className={classes.info}>
            You must{' '}
            <Link
              variant='body1'
              underline='always'
              component='button'
              onClick={user ? onSubscribe : onLogin}
            >
              {user ? 'subscribe' : 'log in'}
            </Link>{' '}
            before you can make a post
          </Typography>
        ) : !subscribedCategoryIds.length ? (
          <Typography component='h2' align='center' className={classes.info}>
            You must subscribe to a category before you can make a post
          </Typography>
        ) : (
          <form
            aria-label='create post'
            className={classes.form}
            onSubmit={handleSubmit((data: FormDetails) =>
              handleCreatePost(data)
            )}
          >
            <Grid container direction='column' spacing={3}>
              <Grid item>
                <TextField
                  inputRef={register({
                    required: 'Title is required',
                    minLength: 3,
                  })}
                  id='title'
                  label='Title'
                  fullWidth
                  autoFocus
                  autoComplete='title'
                  name='title'
                  aria-invalid={errors.title ? 'true' : 'false'}
                />
              </Grid>

              {errors.title && (
                <Grid item>
                  <Typography role='alert' variant='subtitle2' color='error'>
                    {errors.title.type === 'required' && errors.title.message}
                    {errors.title.type === 'minLength' &&
                      'Title must be at least 3 characters'}
                  </Typography>
                </Grid>
              )}

              <Grid item>
                <ReactHookFormSelect
                  id='category'
                  name='category'
                  label='Category'
                  control={control}
                  defaultValue={defaultCategoryId}
                  className={classes.select}
                  rules={{
                    required:
                      'Category is required. If none are available, subscribe to one first!',
                  }}
                >
                  {subscribedCategoryIds.map((categoryId) => (
                    <MenuItem value={categoryId} key={categoryId}>
                      {categoryId}
                    </MenuItem>
                  ))}
                </ReactHookFormSelect>
              </Grid>

              {errors.category && (
                <Grid item>
                  <Typography role='alert' variant='subtitle2' color='error'>
                    {(errors.category.type === 'required' ||
                      errors.category.type === 'prop') &&
                      errors.category.message}
                  </Typography>
                </Grid>
              )}

              <Grid item>
                <TextField
                  multiline
                  inputRef={register()}
                  id='body'
                  label='Body'
                  fullWidth
                  name='body'
                  aria-invalid={errors.body ? 'true' : 'false'}
                ></TextField>
              </Grid>

              {errors.body && (
                <Grid item>
                  <Typography role='alert' variant='subtitle2' color='error'>
                    {errors.body.type === 'prop' && errors.body.message}
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
                  Create Post
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Card>
    </Dialog>
  );
};

export default CreatePostDialog;
