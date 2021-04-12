import { Grid } from '@material-ui/core';
import PostListingLoading from '../PostListing/Loading';

const PostListLoading = () => {
  return (
    <Grid container direction='column' spacing={2}>
      {Array.from(Array(10).keys()).map((i) => (
        <Grid item key={i}>
          <PostListingLoading />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostListLoading;
