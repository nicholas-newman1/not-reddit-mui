import { Card, makeStyles } from '@material-ui/core';
import Spinner from '../Spinner';

const useStyles = makeStyles({
  card: {
    display: 'grid',
    justifyContent: 'center',
    padding: '7rem 0',
  },
});

const CategoryMetaLoading = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Spinner />
    </Card>
  );
};

export default CategoryMetaLoading;
