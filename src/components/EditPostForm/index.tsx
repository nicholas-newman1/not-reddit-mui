import {
  makeStyles,
  Grid,
  Typography,
  Button,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles((theme) => ({
  error: {
    display: 'flex',
  },
}));

interface FormDetails {
  title: string;
  body: string;
}

interface Props {
  defaultBody?: string;
  defaultTitle?: string;
  loading: boolean;
  onCancel: () => void;
  onEdit: (title: string, body: string) => void;
}

const EditPostForm: React.FC<Props> = ({
  defaultBody = '',
  defaultTitle = '',
  loading,
  onCancel,
  onEdit,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm<FormDetails>();

  return (
    <form
      aria-label='create comment'
      onSubmit={handleSubmit((data) => onEdit(data.title, data.body))}
    >
      <Grid container direction='column' spacing={3}>
        <Grid item>
          <TextField
            inputRef={register({ required: 'Title is required' })}
            autoFocus
            id='title'
            label='Title'
            fullWidth
            name='title'
            aria-invalid={errors.title ? 'true' : 'false'}
            defaultValue={defaultTitle}
          />
        </Grid>

        {errors.title && (
          <Grid item>
            <Typography
              role='alert'
              variant='subtitle2'
              color='error'
              className={classes.error}
            >
              {errors.title.message}
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
            defaultValue={defaultBody}
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
              {errors.body.message}
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
                Edit
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

export default EditPostForm;
