import { Container, Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  getHomeCategoryList,
  getHomePostList,
} from '../../store/homePageSlice';
import CategoryList from '../../components/CategoryList';
import PostList from '../../components/PostList';
import {
  clearSubscribedCategoryIds,
  getSubscribedCategoryIds,
  subscribeToCategory,
  unsubscribeFromCategory,
} from '../../store/subscribedCategoriesSlice';

const Home = () => {
  const dispatch = useAppDispatch();
  const loadingUser = useAppSelector((state) => state.auth.loading);
  const user = !!useAppSelector((state) => state.auth.user);
  const subscribedCategoryIds = useAppSelector(
    (state) => state.subscribedCategories.subscribedIds
  );
  const subscribedCategoryIdsLoading = useAppSelector(
    (state) => state.subscribedCategories.loading
  );
  const subscribedCategoryIdsLoadingIds = useAppSelector(
    (state) => state.subscribedCategories.loadingIds
  );
  const postList = useAppSelector((state) => state.homePage.postList);
  const postListLoading = useAppSelector(
    (state) => state.homePage.postListLoading
  );
  const categoryList = useAppSelector((state) => state.homePage.categoryList);
  const categoryListLoading = useAppSelector(
    (state) => state.homePage.categoryListLoading
  );

  /* only load posts/categories if auth has been verified and there are
  not already posts/categories loaded */
  useEffect(() => {
    if (!loadingUser) {
      !postList.length && dispatch(getHomePostList());
      !categoryList.length && dispatch(getHomeCategoryList());

      // get subscribedIds
    }

    //eslint-disable-next-line
  }, [loadingUser]);

  /* reload posts/categories if user signs in/out */
  useEffect(() => {
    if (user) {
      !subscribedCategoryIds.length && dispatch(getSubscribedCategoryIds());
    } else {
      dispatch(clearSubscribedCategoryIds());
    }
    //eslint-disable-next-line
  }, [user]);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <PostList
            posts={postList.map((post) => ({
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
            }))}
            loading={postListLoading}
          />
        </Grid>
        <Grid item xs={4}>
          <CategoryList
            categories={categoryList.map((category) => ({
              ...category,
              subscribed: subscribedCategoryIds.includes(category.categoryId),
              onToggleSubscribe: () => {
                subscribedCategoryIds.includes(category.categoryId)
                  ? dispatch(unsubscribeFromCategory(category.categoryId))
                  : dispatch(subscribeToCategory(category.categoryId));
              },
              categoryHref: `/categories/${category.categoryId}`,
              loading:
                subscribedCategoryIdsLoading ||
                subscribedCategoryIdsLoadingIds.includes(category.categoryId),
            }))}
            loading={categoryListLoading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
