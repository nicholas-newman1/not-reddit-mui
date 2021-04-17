import { Button, Container, Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  getHomeCategoryList,
  getHomePostList,
  getMoreHomeCategories,
  getMoreHomePosts,
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

  const getMorePosts = () => dispatch(getMoreHomePosts(postOrder));
  const getMoreCategories = () => dispatch(getMoreHomeCategories());

  const {
    onToggleSubscribe,
    loading: loadingToggleSubscribe,
    subscribed,
  } = useSubscribedCategoryIds();

  const posts = postList.map((post) => ({
    ...post,
    onUpVote: () => {},
    onDownVote: () => {},
    onSave: () => {},
    onShare: () => {},
    onReport: () => {},
    postHref: `/categories/${post.categoryId}/${post.postId}`,
    userProfileHref: `/users/${post.authorId}`,
    categoryHref: `/categories/${post.categoryId}`,
    numOfComments: 0,
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
      !postList.length && dispatch(getHomePostList(postOrder));
      !categoryList.length && dispatch(getHomeCategoryList());
    }

    // eslint-disable-next-line
  }, [loadingUser]);

  /* reload posts if postOrder changes */
  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    if (!isFirstRender) {
      dispatch(getHomePostList(postOrder));
      dispatch(getHomeCategoryList());
    }
    // eslint-disable-next-line
  }, [postOrder]);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <Button
                variant='contained'
                onClick={() => dispatch(displayCreatePostDialog())}
              >
                Create Post
              </Button>
            </Grid>
            <Grid item>
              <PostOrder
                buttons={[
                  {
                    label: 'new',
                    onClick: () => dispatch(setPostOrder('new')),
                    disabled: postOrder === 'new',
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
                <Button variant='contained' onClick={getMorePosts}>
                  More
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <Button
                fullWidth
                variant='contained'
                onClick={() => dispatch(displayCreateCategoryDialog())}
              >
                Create Category
              </Button>
            </Grid>

            <Grid item>
              <Button
                fullWidth
                component={Link}
                to='/categories'
                variant='outlined'
              >
                All Categories
              </Button>
            </Grid>

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
                <Button variant='contained' onClick={getMoreCategories}>
                  More
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
