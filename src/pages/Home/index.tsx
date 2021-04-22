import { Button, Container, Grid, Hidden } from '@material-ui/core';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  getCategoryList,
  getPostList,
  getMoreCategories,
  getMorePosts,
  setPostOrder,
} from '../../store/homePageSlice';
import CategoryList from '../../components/CategoryList';
import PostList from '../../components/PostList';
import PostListLoading from '../../components/PostList/Loading';
import CategoryListLoading from '../../components/CategoryList/Loading';
import useSubscribedCategoryIds from '../../hooks/useSubscribedCategoryIds';
import { displayCreatePostDialog } from '../../store/createPostSlice';
import { displayCreateCategoryDialog } from '../../store/createCategorySlice';
import { Link } from 'react-router-dom';
import PostOrder from '../../components/PostOrder';
import { useIsFirstRender } from '../../hooks/useIsFirstRender';
import useRatingStatus from '../../hooks/useRatingStatus';

const Home = () => {
  const dispatch = useAppDispatch();
  const loadingUser = useAppSelector((state) => state.auth.loading);
  const {
    postList,
    postListLoading,
    postOrder,
    categoryList,
    categoryListLoading,
    morePostsLoading,
    morePostsExhausted,
    moreCategoriesLoading,
    moreCategoriesExhausted,
  } = useAppSelector((state) => state.homePage);

  const {
    onToggleSubscribe,
    loading: loadingToggleSubscribe,
    subscribed,
  } = useSubscribedCategoryIds();

  const { postsWithRating } = useRatingStatus(postList);

  const posts = postsWithRating.map((post) => ({
    ...post,
    onSave: () => {},
    onShare: () => {},
    onReport: () => {},
  }));

  const categories = categoryList.map((category) => ({
    ...category,
    subscribed: subscribed(category.categoryId),
    onToggleSubscribe: () => onToggleSubscribe(category.categoryId),
    categoryHref: `/categories/${category.categoryId}`,
    loading: loadingToggleSubscribe(category.categoryId),
  }));

  /* only load posts/categories if auth has been verified and there are
  not already posts/categories loaded */
  useEffect(() => {
    if (!loadingUser) {
      !postList.length && dispatch(getPostList(postOrder));
      !categoryList.length && dispatch(getCategoryList());
    }

    // eslint-disable-next-line
  }, [loadingUser]);

  /* reload posts if postOrder changes */
  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    if (!isFirstRender) {
      dispatch(getPostList(postOrder));
      dispatch(getCategoryList());
    }
    // eslint-disable-next-line
  }, [postOrder]);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant='contained'
                onClick={() => dispatch(displayCreatePostDialog())}
              >
                Create Post
              </Button>
            </Grid>

            <Grid item xs={12}>
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
          </Grid>
        </Grid>

        <Grid item xs={6} sm={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant='contained'
                onClick={() => dispatch(displayCreateCategoryDialog())}
              >
                Create Category
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                component={Link}
                to='/categories'
                variant='outlined'
              >
                All Categories
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Grid container direction='column' spacing={2}>
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

        <Hidden xsDown>
          <Grid item xs={12} sm={4}>
            <Grid container direction='column' spacing={2}>
              <Grid item>
                <CategoryList
                  categories={categories}
                  loading={categoryListLoading}
                />
              </Grid>

              {moreCategoriesLoading && (
                <Grid item>
                  <CategoryListLoading />
                </Grid>
              )}

              {!moreCategoriesExhausted && (
                <Grid item>
                  <Button
                    variant='contained'
                    onClick={() => dispatch(getMoreCategories())}
                  >
                    More
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Hidden>
      </Grid>
    </Container>
  );
};

export default Home;
