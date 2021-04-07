import {
  makeStyles,
  Typography,
  Grid,
  Button,
  Dialog,
  Card,
  TextField,
} from '@material-ui/core';
import React, { useEffect } from 'react';
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
  categoryName: string;
}

interface Props {
  handleCreateCategory: (data: FormDetails) => void;
  open: boolean;
  hideDialog: () => void;
  loading: boolean;
  error: string;
}

const CreateCategoryDialog: React.FC<Props> = ({
  handleCreateCategory,
  open,
  hideDialog,
  loading,
  error,
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors, setError } = useForm();

  useEffect(() => {
    setError('categoryName', {
      type: 'prop',
      message: error,
      shouldFocus: false,
    });
  }, [error, setError]);

  return (
    <Dialog open={open} onClose={hideDialog} fullWidth maxWidth='xs'>
      <Card className={classes.card}>
        <Typography component='h1' variant='h4' align='center'>
          Create Category
        </Typography>

        <form
          aria-label='create category'
          className={classes.form}
          onSubmit={handleSubmit((data: FormDetails) =>
            handleCreateCategory(data)
          )}
        >
          <Grid container direction='column' spacing={3}>
            <Grid item>
              <TextField
                inputRef={register({
                  required: 'Category name is required',
                  minLength: 3,
                  pattern: /^[a-z0-9]+$/i,
                })}
                id='categoryName'
                label='Category Name'
                fullWidth
                autoFocus
                name='categoryName'
                aria-invalid={errors.categoryName ? 'true' : 'false'}
              />
            </Grid>

            {errors.categoryName && (
              <Grid item>
                <Typography role='alert' variant='subtitle2' color='error'>
                  {(errors.categoryName.type === 'required' ||
                    errors.categoryName.type === 'prop') &&
                    errors.categoryName.message}
                  {errors.categoryName.type === 'minLength' &&
                    'Must be at least 3 characters'}
                  {errors.categoryName.type === 'pattern' &&
                    'Only letters and numbers allowed'}
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
                Create Category
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Dialog>
  );
};

export default CreateCategoryDialog;