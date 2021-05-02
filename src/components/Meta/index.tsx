import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import { getTimeAgoString } from '../../utils';

interface Props {
  authorUsername?: string;
  userProfileHref?: string;
  timestamp?: number;
  category?: {
    categoryId: string;
    categoryHref: string;
  };
}

const useStyles = makeStyles((theme) => {
  const buttonSpacing = theme.spacing(1);

  return {
    root: {
      margin: `0 -${buttonSpacing}px`,
    },
    item: {
      paddingLeft: buttonSpacing,
      paddingRight: buttonSpacing,
      minHeight: 0,
      minWidth: 0,
      textTransform: 'lowercase',
      fontSize: '0.7rem',
    },
    username: {
      fontWeight: theme.typography.fontWeightBold,
    },
    timeString: {
      color: theme.palette.text.secondary,
    },
    category: {
      color: theme.palette.text.secondary,
    },
  };
});

const Meta: React.FC<Props> = (props) => {
  const classes = useStyles();
  return (
    <Grid container alignItems='center' className={classes.root}>
      {props.authorUsername && props.userProfileHref && (
        <Button
          component={Link}
          className={clsx(classes.username, classes.item)}
          to={props.userProfileHref}
        >
          {props.authorUsername ? props.authorUsername : <em>Unknown</em>}
        </Button>
      )}

      {props.timestamp && (
        <Typography
          variant='button'
          className={clsx(classes.timeString, classes.item)}
        >
          {getTimeAgoString(props.timestamp)}
        </Typography>
      )}

      {props.category && (
        <Button
          component={Link}
          className={clsx(classes.category, classes.item)}
          to={props.category.categoryHref}
        >
          {props.category.categoryId}
        </Button>
      )}
    </Grid>
  );
};

export default Meta;
