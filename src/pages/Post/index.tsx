import React, { useEffect, useMemo } from 'react';
import { Button, Container, Grid, Hidden, Typography } from '@material-ui/core';
import { RouteComponentProps, useHistory } from 'react-router';
import Post from '../../components/Post';
import CategoryMetaContainer from '../../containers/CategoryMetaContainer';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  deletePost,
  displayCreateCommentDialog,
  editPost,
  getComments,
  getMoreComments,
  getPost,
  toggleEditing,
} from '../../store/postPageSlice';
import usePostRatingStatus from '../../hooks/usePostRatingStatus';
import CommentList from '../../components/CommentList';
import CreateCommentDialogContainer from '../../containers/CreateCommentDialogContainer';
import CommentListLoading from '../../components/CommentList/Loading';

interface MatchProps {
  categoryId: string;
  postId: string;
}

interface Props extends RouteComponentProps<MatchProps> {}
const PostPage: React.FC<Props> = ({ match, location }) => {
  const { categoryId, postId } = match.params;
  const history = useHistory();
  const dispatch = useAppDispatch();
  const loadingUser = useAppSelector((state) => state.auth.loading);
  const {
    comments,
    commentsLoading,
    deletePostLoading,
    editPostLoading,
    isEditing,
    moreCommentsLoading,
    moreCommentsExhausted,
    post,
    postLoading,
  } = useAppSelector((state) => state.postPage);
  const posts = useMemo(() => (post ? [post] : []), [post]); // usePostRatingStatus requires a Post[]
  const { postsWithRating } = usePostRatingStatus(posts);

  useEffect(() => {
    const state = location.state;
    if (!loadingUser) {
      !state && dispatch(getPost(postId));
      dispatch(getComments(postId));
      return;
    }

    // eslint-disable-next-line
  }, [loadingUser]);

  useEffect(() => {
    if (!postLoading && (!post || !post.title)) {
      history.push('/');
    }
    // eslint-disable-next-line
  }, [postLoading]);

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
                  isEditing,
                  loadingDelete: deletePostLoading,
                  loadingEdit: editPostLoading,
                  onDelete: () => {
                    dispatch(deletePost(postId)).then(() => history.goBack());
                  },
                  onEdit: (title: string, body: string) => {
                    dispatch(
                      editPost({ title, body, post: postsWithRating[0] })
                    ).then(() => dispatch(toggleEditing()));
                  },
                  onReport: () => {},
                  onSave: () => {},
                  onShare: () => {},
                  onToggleEditing: () => dispatch(toggleEditing()),
                }}
                loading={postLoading}
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
