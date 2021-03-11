import { Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import React from 'react';

interface Props {
  rating: number;
  onUpVote: () => void;
  onDownVote: () => void;
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

  return (
    <Grid data-testid='wrapper' className={classes.root}>
      <IconButton
        onClick={() => props.onUpVote()}
        aria-label='up vote'
        data-testid='up-arrow'
        color={props.status === 'up' ? 'secondary' : 'inherit'}
        className={classes.iconButton}
      >
        <ExpandLess className={classes.svgIcon} />
      </IconButton>

      <Typography>{props.rating}</Typography>

      <IconButton
        onClick={() => props.onDownVote()}
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
