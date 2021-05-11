import { Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import React, { useState } from 'react';

interface Props {
  rating: number;
  onUpVote: (setRating: (a: number) => void) => void;
  onDownVote: (setRating: (a: number) => void) => void;
  loading: boolean;
  status?: 'up' | 'down';
  className?: string;
}

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
  iconButton: {
    '&:hover': {
      background: 'none',
    },
  },
  svgIcon: {
    fontSize: '30px',
  },
});

const Rating: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [rating, setRating] = useState(props.rating);

  return (
    <Grid data-testid='wrapper' className={classes.root}>
      <IconButton
        disabled={props.loading}
        onClick={() => props.onUpVote(setRating)}
        aria-label='up vote'
        data-testid='up-arrow'
        color={props.status === 'up' ? 'secondary' : 'inherit'}
        className={classes.iconButton}
      >
        <ExpandLess className={classes.svgIcon} />
      </IconButton>

      <Typography itemProp='vote count'>{rating}</Typography>

      <IconButton
        disabled={props.loading}
        onClick={() => props.onDownVote(setRating)}
        aria-label='down vote'
        data-testid='down-arrow'
        color={props.status === 'down' ? 'secondary' : 'inherit'}
        className={classes.iconButton}
      >
        <ExpandMore className={classes.svgIcon} />
      </IconButton>
    </Grid>
  );
};

export default Rating;
