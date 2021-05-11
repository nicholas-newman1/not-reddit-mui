import { makeStyles, Grid, Typography, Button, Paper } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { ErrorOption } from 'react-hook-form';
import CommentContainer from '../../containers/CommentContainer';
import { Comment as CommentType } from '../../types/client';
import CreateCommentForm from '../CreateCommentForm';
import CommentMeta from '../CommentMeta';
import Rating from '../Rating';
import Spinner from '../Spinner';

export interface CommentProps extends CommentType {
  onUpVote: (setRating: (a: number) => void) => void;
  onDownVote: (setRating: (a: number) => void) => void;
  onReport: () => void;
  onReplies: () => void;
  onReply: (
    body: string,
    setError: (name: string, error: ErrorOption) => void
  ) => void;
  replying: boolean;
  setReplying: React.Dispatch<React.SetStateAction<boolean>>;
  onSignIn: () => void;
  onSubscribe: (clearErrors: () => void) => void;
  onDelete: () => void;
  isReply?: boolean;
  gotReplies: boolean;
  loadingReplies: boolean;
  loadingReply: boolean;
  loadingRating: boolean;
  loadingSubscribe: boolean;
  loadingDelete: boolean;
  ratingStatus?: 'up' | 'down';
}

const useStyles = makeStyles((theme) => {
  const buttonSpacing = theme.spacing(1);

  return {
    root: {
      padding: theme.spacing(2),
      width: '100%',
    },
    reply: {
      padding: 0,
      marginLeft: '-1rem',
    },
    buttonGroup: {
      margin: `0 -${buttonSpacing}px`,
    },
    button: {
      paddingLeft: buttonSpacing,
      paddingRight: buttonSpacing,
      minHeight: 0,
      minWidth: 0,
      fontSize: '0.6rem',
      fontWeight: theme.typography.fontWeightBold,
    },
    report: {
      color: theme.palette.error.light,
    },
    spinner: {
      marginTop: '1rem',
    },
    replies: {
      marginTop: '0.5rem',
    },
    deleted: {
      marginTop: '0.25rem',

      '& p': {
        marginTop: '0.25rem',
        fontStyle: 'italic',
      },
    },
  };
});

const Comment: React.FC<CommentProps> = (props) => {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.root, props.isReply && classes.reply)}>
      <Grid container direction='row' wrap='nowrap' spacing={2}>
        <Grid item>
          <Rating
            loading={props.loadingRating}
            rating={props.rating}
            onUpVote={props.onUpVote}
            onDownVote={props.onDownVote}
            status={props.ratingStatus}
          />
        </Grid>

        <Grid item xs={12}>
          {props.deleted ? (
            <div className={classes.deleted}>
              <CommentMeta timestamp={props.timestamp} />
              <Typography component='p' variant='subtitle2'>
                Deleted comment
              </Typography>
              <Grid container className={classes.buttonGroup}>
                {props.numOfComments > 0 && (
                  <Button
                    className={classes.button}
                    onClick={props.onReplies}
                    disabled={props.loadingReplies}
                  >
                    {props.gotReplies
                      ? 'Hide Replies'
                      : `Replies (${props.numOfComments})`}
                  </Button>
                )}
              </Grid>
            </div>
          ) : (
            <>
              <CommentMeta
                timestamp={props.timestamp}
                authorProfileHref={props.authorProfileHref}
                authorUsername={props.authorUsername}
              />

              <Typography component='p' variant='body1'>
                {props.body}
              </Typography>

              <Grid container className={classes.buttonGroup}>
                {props.numOfComments > 0 && (
                  <Button
                    className={classes.button}
                    onClick={props.onReplies}
                    disabled={props.loadingReplies}
                  >
                    {props.gotReplies
                      ? 'Hide Replies'
                      : `Replies (${props.numOfComments})`}
                  </Button>
                )}

                <Button
                  className={classes.button}
                  onClick={() => props.setReplying((prev) => !prev)}
                >
                  Reply
                </Button>

                <Button
                  className={clsx(classes.button, classes.report)}
                  onClick={props.isAuthor ? props.onDelete : props.onReport}
                  disabled={props.isAuthor && props.loadingDelete}
                >
                  {props.isAuthor ? 'Delete' : 'Report'}
                </Button>
              </Grid>

              {props.replying && (
                <CreateCommentForm
                  onReply={props.onReply}
                  loading={props.loadingReply}
                  isReply={true}
                  onSignIn={props.onSignIn}
                  onSubscribe={props.onSubscribe}
                  loadingSubscribe={props.loadingSubscribe}
                />
              )}
            </>
          )}

          {props.replies && (
            <div className={classes.replies}>
              {props.replies.map((comment, i) => (
                <CommentContainer key={i} comment={comment} isReply />
              ))}
            </div>
          )}

          {props.loadingReplies && <Spinner />}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Comment;
