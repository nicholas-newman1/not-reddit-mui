import {
  Button,
  Card,
  Dialog,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactHookFormSelect from '../ReactHookFormSelect';

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
  select: {},
}));

interface FormDetails {
  title: string;
  categoryId: string;
  body?: string;
}

interface Props {
  handleCreatePost: (data: FormDetails) => void;
  open: boolean;
  hideDialog: () => void;
  loading: boolean;
  error: string;
  subscribedCategoryIds: string[];
  defaultCategoryId?: string;
}

const CreatePostDialog: React.FC<Props> = ({
  handleCreatePost,
  open,
  hideDialog,
  loading,
  error,
  subscribedCategoryIds,
  defaultCategoryId = '',
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors, setError, control } = useForm();

  useEffect(() => {
    if (error)
      setError('body', { type: 'prop', message: error, shouldFocus: false });
  }, [error, setError]);

  return (
    <Dialog open={open} onClose={hideDialog} fullWidth maxWidth='md'>
      <Card className={classes.card}>
        <Typography component='h1' variant='h4' align='center'>
          Create Post
        </Typography>

        <form
          aria-label='create post'
          className={classes.form}
          onSubmit={handleSubmit((data: FormDetails) => handleCreatePost(data))}
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
      </Card>
    </Dialog>
  );
};

export default CreatePostDialog;
