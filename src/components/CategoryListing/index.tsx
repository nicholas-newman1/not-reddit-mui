import {
  Card,
  Typography,
  Link as StyledLink,
  makeStyles,
  Button,
  Grid,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2),
    width: '100%',
  },
  categoryId: {
    textTransform: 'capitalize',
  },
}));

interface Props {
  categoryId: string;
  numOfSubscribers: number;
  onToggleSubscribe: () => void;
  categoryHref: string;
  subscribed: boolean;
  isOwner: boolean;
  loading: boolean;
}

const CategoryListing: React.FC<Props> = ({
  categoryId,
  numOfSubscribers,
  onToggleSubscribe,
  categoryHref,
  subscribed,
  isOwner,
  loading,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Grid container direction='column' spacing={1}>
        <Grid item>
          <Typography component='h2' variant='h5'>
            <StyledLink
              component={Link}
              to={categoryHref}
              color={isOwner ? 'secondary' : 'textPrimary'}
              className={classes.categoryId}
            >
              {categoryId}
            </StyledLink>
          </Typography>
        </Grid>

        <Grid item>
          <Typography component='h3' variant='caption'>
            Subscribers: {numOfSubscribers}
          </Typography>
        </Grid>

        <Grid item>
          <Button
            disabled={loading}
            variant='contained'
            color={subscribed ? 'default' : 'primary'}
            fullWidth
            onClick={onToggleSubscribe}
          >
            {subscribed ? 'Unsubscribe' : 'Subscribe'}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CategoryListing;
