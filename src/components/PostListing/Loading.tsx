import { makeStyles, Card } from '@material-ui/core';
import Spinner from '../Spinner';

const useStyles = makeStyles({
  card: {
    display: 'grid',
    justifyContent: 'center',
    padding: '2rem 0',
  },
});

const PostListingLoading = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Spinner />
    </Card>
  );
};

export default PostListingLoading;
