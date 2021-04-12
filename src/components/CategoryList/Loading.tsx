import { Grid } from '@material-ui/core';
import CategoryListingLoading from '../CategoryListing/Loading';

const CategoryListLoading = () => {
  return (
    <Grid container direction='column' spacing={2}>
      {Array.from(Array(10).keys()).map((i) => (
        <Grid item key={i}>
          <CategoryListingLoading />
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryListLoading;
