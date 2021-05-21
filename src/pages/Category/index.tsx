import { Button, Container, Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import PostList from '../../components/PostList';
import PostListLoading from '../../components/PostList/Loading';
import PostOrder from '../../components/PostOrder';
import CategoryMetaContainer from '../../containers/CategoryMetaContainer';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useIsFirstRender } from '../../hooks/useIsFirstRender';
import usePostRatingStatus from '../../hooks/usePostRatingStatus';
import {
  getMorePosts,
  getPostList,
  setPostOrder,
} from '../../store/categoryPageSlice';
import { displayCreatePostDialog } from '../../store/createPostSlice';

interface MatchProps {
  categoryId: string;
}

interface Props extends RouteComponentProps<MatchProps> {}

const Category: React.FC<Props> = ({ match }) => {
  const categoryId = match.params.categoryId;
  const dispatch = useAppDispatch();
  const loadingUser = useAppSelector((state) => state.auth.loading);
  const {
    postList,
    postListLoading,
    postOrder,
    morePostsLoading,
    morePostsExhausted,
  } = useAppSelector((state) => state.categoryPage);

  const { postsWithRating } = usePostRatingStatus(postList);

  const posts = postsWithRating.map((post) => ({
    ...post,
    onSave: () => {},
    onShare: () => {},
    onReport: () => {},
  }));

  /* only load posts/meta if auth has been verified and there are not already
  posts/meta loaded, or if the category does not match */
  useEffect(() => {
    if (!loadingUser) {
      (!postList.length || postList[0].categoryId !== categoryId) &&
        dispatch(getPostList({ categoryId, postOrder }));
    }
    //eslint-disable-next-line
  }, [categoryId, loadingUser]);

  /* reload posts if postOrder changes */
  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    if (!isFirstRender) {
      dispatch(getPostList({ categoryId, postOrder }));
    }
    // eslint-disable-next-line
  }, [postOrder]);

  return (
    <Container>
      <Grid container spacing={2} wrap='wrap-reverse'>
        <Grid item xs={12} md={8}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <PostOrder
                buttons={[
                  {
                    label: 'new',
                    onClick: () => dispatch(setPostOrder('new')),
                    disabled: postOrder === 'new',
                  },
                  {
                    label: 'hot',
                    onClick: () => dispatch(setPostOrder('hot')),
                    disabled: postOrder === 'hot',
                  },
                  {
                    label: 'top',
                    onClick: () => dispatch(setPostOrder('top')),
                    disabled: postOrder === 'top',
                  },
                ]}
              />
            </Grid>

            <Grid item>
              <PostList posts={posts} loading={postListLoading} />
            </Grid>

            {morePostsLoading && (
              <Grid item>
                <PostListLoading />
              </Grid>
            )}

            {!morePostsExhausted && (
              <Grid item>
                <Button
                  variant='contained'
                  onClick={() => dispatch(getMorePosts(postOrder))}
                >
                  More
                </Button>
              </Grid>
            )}
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

export default Category;
