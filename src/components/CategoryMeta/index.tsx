import {
  Card,
  Grid,
  Typography,
  Link as StyledLink,
  makeStyles,
  Button,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import CategoryMetaLoading from './Loading';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  heading: {
    textTransform: 'capitalize',
    color: theme.palette.text.primary,
  },
  subHeading: {
    fontWeight: theme.typography.fontWeightBold,
    marginRight: theme.spacing(2),
  },
}));

interface Props {
  categoryName: string;
  categoryHref: string;
  isOwner: boolean;
  owner: {
    username: string;
    uid: string;
  };
  numOfModerators: number;
  numOfSubscribers: number;
  onToggleSubscribe: () => void;
  loadingToggleSubscribe: boolean;
  loading: boolean;
  subscribed: boolean;
}

const CategoryMeta: React.FC<Props> = ({
  categoryName,
  categoryHref,
  isOwner,
  owner,
  numOfModerators,
  numOfSubscribers,
  onToggleSubscribe,
  loadingToggleSubscribe,
  loading,
  subscribed,
}) => {
  const classes = useStyles();

  return loading ? (
    <CategoryMetaLoading />
  ) : (
    <Card className={classes.root}>
      <Grid container spacing={3} direction='column'>
        <Grid item container justify='center'>
          <Typography
            className={classes.heading}
            component={Link}
            to={categoryHref}
            variant='h4'
          >
            {categoryName}
          </Typography>
        </Grid>

        <Grid item container alignItems='center'>
          <Typography component='h2' className={classes.subHeading}>
            Owner:
          </Typography>
          <Typography variant='body2'>
            <StyledLink
              color={isOwner ? 'secondary' : 'textPrimary'}
              component={Link}
              to={`/profile/${owner.uid}`}
            >
              {owner.username}
            </StyledLink>
          </Typography>
        </Grid>

        <Grid item container alignItems='center'>
          <Typography component='h2' className={classes.subHeading}>
            Moderators:
          </Typography>
          <Typography variant='body2'>
            {numOfModerators.toLocaleString()}
          </Typography>
        </Grid>

        <Grid item container alignItems='center'>
          <Typography component='h2' className={classes.subHeading}>
            Subscribers:
          </Typography>
          <Typography variant='body2'>
            {numOfSubscribers.toLocaleString()}
          </Typography>
        </Grid>

        <Grid item>
          <Button
            fullWidth
            variant='contained'
            color={subscribed ? 'default' : 'primary'}
            onClick={onToggleSubscribe}
            disabled={loadingToggleSubscribe}
          >
            {subscribed ? 'Unsubscribe' : 'Subscribe'}
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CategoryMeta;
