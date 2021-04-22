import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import PostMeta from '../PostMeta';
import Rating from '../Rating';
import Spinner from '../Spinner';
import { Post as ClientPost } from '../../types/client';

const useStyles = makeStyles((theme) => {
  const buttonSpacing = theme.spacing(1);

  return {
    root: {
      padding: theme.spacing(2),
      width: '100%',
    },
    title: {
      // padding: '0.5rem 0',
      display: 'inline-block',
      fontWeight: theme.typography.fontWeightBold,

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
  };
});

interface PostType extends ClientPost {
  loadingRating: boolean;
  onUpVote: () => void;
  onDownVote: () => void;
  ratingStatus?: 'up' | 'down';
}

interface Props {
  loading: boolean;
  post?: PostType;
}

const Post: React.FC<Props> = ({ loading, post }) => {
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
        {loading ? (
          <Spinner />
        ) : post ? (
          <>
            <Grid item>
              <Rating
                loading={post.loadingRating}
                rating={post.rating}
                onUpVote={post.onUpVote}
                onDownVote={post.onDownVote}
                status={post.ratingStatus}
              />
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <PostMeta
                    categoryId={post.categoryId}
                    categoryHref={post.categoryHref}
                    timestamp={post.timestamp}
                    userProfileHref={post.userProfileHref}
                    authorUsername={post.authorUsername}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    component='h2'
                    variant='body1'
                    className={classes.title}
                  >
                    {post.title}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography>{post.body}</Typography>
                </Grid>

                <Grid item xs={12} container className={classes.buttonGroup}>
                  <Button
                    className={classes.button}
                    component={Link}
                    to={'#comments'}
                  >
                    comments ({post.numOfComments})
                  </Button>
                  {/* <Button className={classes.button} onClick={post.onSave}>
              Save
            </Button>
            <Button className={classes.button} onClick={post.onShare}>
              Share
            </Button>
            <Button className={classes.button} onClick={post.onReport}>
              Report
            </Button> */}
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <h1>No Post Found</h1>
        )}
      </Grid>
    </Paper>
  );
};

export default Post;
