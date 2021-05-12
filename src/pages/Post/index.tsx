import React, { useEffect, useMemo } from 'react';
import { Button, Container, Grid, Hidden, Typography } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import Post from '../../components/Post';
import CategoryMetaContainer from '../../containers/CategoryMetaContainer';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  displayCreateCommentDialog,
  getComments,
  getMoreComments,
  getPost,
} from '../../store/postPageSlice';
import useRatingStatus from '../../hooks/useRatingStatus';
import CommentList from '../../components/CommentList';
import CreateCommentDialogContainer from '../../containers/CreateCommentDialogContainer';
import CommentListLoading from '../../components/CommentList/Loading';

interface MatchProps {
  categoryId: string;
  postId: string;
}

interface Props extends RouteComponentProps<MatchProps> {}
const PostPage: React.FC<Props> = ({ match }) => {
  const { categoryId, postId } = match.params;
  const dispatch = useAppDispatch();
  const loadingUser = useAppSelector((state) => state.auth.loading);
  const {
    post,
    postLoading,
    comments,
    commentsLoading,
    moreCommentsLoading,
    moreCommentsExhausted,
  } = useAppSelector((state) => state.postPage);
  const posts = useMemo(() => (post ? [post] : []), [post]); // useRatingStatus requires a Post[]
  const { postsWithRating } = useRatingStatus(posts);

  useEffect(() => {
    if (!loadingUser) {
      dispatch(getPost(postId));
      dispatch(getComments(postId));
    }

    // eslint-disable-next-line
  }, [loadingUser]);

  // console.log({ postLoading, post: postsWithRating[0] });

  return (
    <Container>
      <CreateCommentDialogContainer {...match.params} />
      <Grid container spacing={2} wrap='wrap-reverse'>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Post
                post={{
                  ...postsWithRating[0],
                  onSave: () => {},
                  onShare: () => {},
                  onReport: () => {},
                }}
                /* WHY DOES THIS NEED TO BE DONE ? */
                loading={postLoading || postsWithRating[0] === undefined}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography component='h2' variant='h5' id='comments'>
                Comments
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant='contained'
                onClick={() => dispatch(displayCreateCommentDialog())}
              >
                Create Comment
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CommentList loading={commentsLoading} comments={comments} />
                </Grid>

                {moreCommentsLoading && (
                  <Grid item xs={12}>
                    <CommentListLoading />
                  </Grid>
                )}

                {!moreCommentsExhausted && (
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      onClick={() => dispatch(getMoreComments(postId))}
                    >
                      More Comments
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Hidden smDown>
          <Grid item md={4}>
            <CategoryMetaContainer categoryId={categoryId} />
          </Grid>
        </Hidden>
      </Grid>
    </Container>
  );
};

export default PostPage;
