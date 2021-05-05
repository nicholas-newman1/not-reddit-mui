import { Grid } from '@material-ui/core';
import CommentLoading from '../Comment/Loading';

const CommentListLoading = () => {
  return (
    <Grid container direction='column' spacing={2}>
      {Array.from(Array(10).keys()).map((i) => (
        <Grid item key={i}>
          <CommentLoading />
        </Grid>
      ))}
    </Grid>
  );
};

export default CommentListLoading;
