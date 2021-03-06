import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import { getTimeAgoString } from '../../utils/utils';

interface Props {
  authorUsername: string;
  authorProfileHref: string;
  isOwnerOfCategory: boolean;
  timestamp: number;
  categoryId: string;
  categoryHref: string;
  edited?: boolean;
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
      color: (props: Props) =>
        props.isOwnerOfCategory
          ? theme.palette.secondary.main
          : theme.palette.text.secondary,
    },
    edited: {
      color: theme.palette.text.secondary,
      fontStyle: 'italic',
    },
  };
});

const PostMeta: React.FC<Props> = (props) => {
  const classes = useStyles(props);
  return (
    <Grid container alignItems='center' className={classes.root}>
      <Button
        component={Link}
        className={clsx(classes.username, classes.item)}
        to={props.authorProfileHref}
      >
        {props.authorUsername ? props.authorUsername : <em>Unknown</em>}
      </Button>

      <Typography
        variant='button'
        className={clsx(classes.timeString, classes.item)}
      >
        {getTimeAgoString(props.timestamp)}
      </Typography>

      <Button
        component={Link}
        className={clsx(classes.category, classes.item)}
        to={props.categoryHref}
      >
        {props.categoryId}
      </Button>

      {props.edited && (
        <Typography className={clsx(classes.item, classes.edited)}>
          Edited
        </Typography>
      )}
    </Grid>
  );
};

export default PostMeta;
