import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import PostMeta from '../PostMeta';
import Rating from '../Rating';
import Spinner from '../Spinner';
import clsx from 'clsx';
import { Post as ClientPost } from '../../types/client';
import EditPostForm from '../EditPostForm';

const useStyles = makeStyles((theme) => {
  const buttonSpacing = theme.spacing(1);

  return {
    root: {
      padding: theme.spacing(2),
      width: '100%',
    },
    title: {
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
    report: {
      color: theme.palette.error.light,
    },
    edit: {
      color: theme.palette.warning.main,
    },
  };
});

interface PostType extends ClientPost {
  isEditing: boolean;
  loadingDelete: boolean;
  loadingEdit: boolean;
  loadingRating: boolean;
  onDelete: () => void;
  onDownVote: (setRating: (a: number) => void) => void;
  onEdit: (title: string, body: string) => void;
  onSave: () => void;
  onShare: () => void;
  onReport: () => void;
  onToggleEditing: () => void;
  onUpVote: (setRating: (a: number) => void) => void;
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
                    authorProfileHref={post.authorProfileHref}
                    authorUsername={post.authorUsername}
                    edited={post.edited}
                  />
                </Grid>

                {post.isEditing ? (
                  <Grid item xs={12}>
                    <EditPostForm
                      defaultBody={post.body}
                      defaultTitle={post.title}
                      loading={post.loadingEdit}
                      onCancel={post.onToggleEditing}
                      onEdit={post.onEdit}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        component='h2'
                        variant='body1'
                        className={classes.title}
                      >
                        {post.title}
                      </Typography>
                    </Grid>
                    {post.body && (
                      <Grid item xs={12}>
                        <Typography>{post.body}</Typography>
                      </Grid>
                    )}
                  </>
                )}

                <Grid item xs={12} container className={classes.buttonGroup}>
                  <Button className={classes.button}>
                    comments ({post.numOfComments})
                  </Button>

                  <Button className={classes.button} onClick={post.onSave}>
                    Save
                  </Button>

                  <Button className={classes.button} onClick={post.onShare}>
                    Share
                  </Button>

                  {post.isAuthor ? (
                    <>
                      <Button
                        className={clsx(classes.button, classes.edit)}
                        onClick={post.onToggleEditing}
                      >
                        Edit
                      </Button>

                      <Button
                        className={clsx(classes.button, classes.report)}
                        onClick={post.onDelete}
                        disabled={post.loadingDelete}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button
                      className={clsx(classes.button, classes.report)}
                      onClick={post.onReport}
                    >
                      Report
                    </Button>
                  )}
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
