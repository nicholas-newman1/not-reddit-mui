import React, { useEffect, useMemo } from 'react';
import { Button, Container, Grid, Typography } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import Post from '../../components/Post';
import CategoryMetaContainer from '../../containers/CategoryMetaContainer';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { displayCreatePostDialog } from '../../store/createPostSlice';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getComments, getPost } from '../../store/postPageSlice';
import useRatingStatus from '../../hooks/useRatingStatus';
import CommentContainer from '../../containers/CommentContainer';

interface MatchProps {
  categoryId: string;
  postId: string;
}

interface Props extends RouteComponentProps<MatchProps> {}
const PostPage: React.FC<Props> = ({ match }) => {
  const categoryId = match.params.categoryId;
  const postId = match.params.postId;
  const dispatch = useAppDispatch();
  const loadingUser = useAppSelector((state) => state.auth.loading);
  const { post, postLoading, comments, commentsLoading } = useAppSelector(
    (state) => state.postPage
  );
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

            {comments.map((comment, i) => (
              <Grid key={i} item xs={12}>
                <CommentContainer comment={comment} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <Button
                variant='contained'
                onClick={() => dispatch(displayCreatePostDialog(categoryId))}
                fullWidth
              >
                Create Post
              </Button>
            </Grid>
            <Grid item>
              <CategoryMetaContainer categoryId={categoryId} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostPage;
