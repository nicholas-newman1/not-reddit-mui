import React, { useEffect, useMemo } from 'react';
import { Button, Container, Grid } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import Post from '../../components/Post';
import CategoryMetaContainer from '../../containers/CategoryMetaContainer';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { displayCreatePostDialog } from '../../store/createPostSlice';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getPost } from '../../store/postPageSlice';
import useRatingStatus from '../../hooks/useRatingStatus';

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
  const { post, postLoading } = useAppSelector((state) => state.postPage);
  const posts = useMemo(() => (post ? [post] : []), [post]); // useRatingStatus requires a Post[]
  const { postsWithRating } = useRatingStatus(posts);

  useEffect(() => {
    if (!loadingUser) {
      !post && dispatch(getPost(postId));
    }

    // eslint-disable-next-line
  }, [loadingUser]);

  return (
    <Container>
      <Grid container spacing={2} wrap='wrap-reverse'>
        <Grid item xs={12} md={8}>
          <Post post={postsWithRating[0]} loading={postLoading} />
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
