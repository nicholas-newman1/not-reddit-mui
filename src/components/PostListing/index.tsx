import {
  Grid,
  makeStyles,
  Button,
  Paper,
  Typography,
  Link as StyledLink,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types/client';
import PostMeta from '../PostMeta';
import Rating from '../Rating';
import clsx from 'clsx';

interface Props extends Post {
  loadingDelete: boolean;
  loadingRating: boolean;
  onDelete: () => void;
  onDownVote: (setRating: (a: number) => void) => void;
  onEdit: () => void;
  onSave: () => void;
  onShare: () => void;
  onReport: () => void;
  onUpVote: (setRating: (a: number) => void) => void;
  ratingStatus?: 'up' | 'down';
}

const useStyles = makeStyles((theme) => {
  const buttonSpacing = theme.spacing(1);

  return {
    root: {
      padding: theme.spacing(2),
      width: '100%',
    },
    title: {
      padding: '0.5rem 0',
      display: 'inline-block',

      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
    buttonGroup: {
      margin: `0 -${buttonSpacing}px`,
    },
    button: {
      paddingLeft: buttonSpacing,
      paddingRight: buttonSpacing,
      minHeight: 0,
      minWidth: 0,
      fontSize: '0.7rem',
      fontWeight: theme.typography.fontWeightBold,
    },
    report: {
      color: theme.palette.error.light,
    },
    edit: {
      color: theme.palette.warning.main,
    },
  };
});

const PostListing: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Grid
        container
        direction='row'
        alignItems='center'
        wrap='nowrap'
        spacing={2}
      >
        <Grid item>
          <Rating
            loading={props.loadingRating}
            rating={props.rating}
            onUpVote={props.onUpVote}
            onDownVote={props.onDownVote}
            status={props.ratingStatus}
          />
        </Grid>
        <Grid item container direction='column'>
          <PostMeta
            categoryId={props.categoryId}
            categoryHref={props.categoryHref}
            timestamp={props.timestamp}
            authorProfileHref={props.authorProfileHref}
            authorUsername={props.authorUsername}
            edited={props.edited}
            isOwnerOfCategory={props.isOwnerOfCategory}
          />

          <Typography component='h2' variant='body1'>
            <StyledLink
              component={Link}
              to={props.postHref}
              color='textPrimary'
              className={classes.title}
            >
              {props.title}
            </StyledLink>
          </Typography>

          <Grid container className={classes.buttonGroup}>
            <Button
              className={classes.button}
              component={Link}
              to={props.postHref}
            >
              comments ({props.numOfComments})
            </Button>

            <Button className={classes.button} onClick={props.onSave}>
              Save
            </Button>

            <Button className={classes.button} onClick={props.onShare}>
              Share
            </Button>

            {props.isAuthor || props.isOwnerOfCategory ? (
              <>
                {props.isAuthor && (
                  <Button
                    className={clsx(classes.button, classes.edit)}
                    onClick={props.onEdit}
                  >
                    Edit
                  </Button>
                )}

                <Button
                  className={clsx(classes.button, classes.report)}
                  onClick={props.onDelete}
                  disabled={props.loadingDelete}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                className={clsx(classes.button, classes.report)}
                onClick={props.onReport}
              >
                Report
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PostListing;
