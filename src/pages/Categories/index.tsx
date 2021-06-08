import { Grid, Button, Container, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import CategoryListing from '../../components/CategoryListing';
import CategoryListingLoading from '../../components/CategoryListing/Loading';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import useSubscribedCategoryIds from '../../hooks/useSubscribedCategoryIds';
import {
  getCategoryList,
  getMoreCategories,
} from '../../store/categoriesPageSlice';

const Categories = () => {
  const dispatch = useAppDispatch();
  const loadingUser = useAppSelector((state) => state.auth.loading);
  const uid = useAppSelector((state) => state.auth.user?.uid);
  const {
    categoryList,
    categoryListLoading,
    moreCategoriesLoading,
    moreCategoriesExhausted,
  } = useAppSelector((state) => state.categoriesPage);

  const {
    onToggleSubscribe,
    loading: loadingToggleSubscribe,
    subscribed,
  } = useSubscribedCategoryIds();

  const categories = categoryList.map((category) => ({
    ...category,
    subscribed: subscribed(category.categoryId),
    onToggleSubscribe: () => onToggleSubscribe(category.categoryId),
    categoryHref: `/categories/${category.categoryId}`,
    loading: loadingToggleSubscribe(category.categoryId),
    isOwner: category.ownerId === uid,
  }));

  /* only load posts/categories if auth has been verified */
  useEffect(() => {
    if (!loadingUser) {
      dispatch(getCategoryList());
    }

    // eslint-disable-next-line
  }, [loadingUser]);

  return (
    <Container>
      <Typography variant='h3' component='h1' gutterBottom>
        Categories
      </Typography>
      <Grid container spacing={2}>
        {categoryListLoading
          ? Array.from(Array(10).keys()).map((i) => (
              <Grid item key={i} xs={12} sm={6} lg={4}>
                <CategoryListingLoading />
              </Grid>
            ))
          : categories.map((category) => (
              <Grid item xs={12} sm={6} lg={4} key={category.categoryId}>
                <CategoryListing {...category} />
              </Grid>
            ))}

        {moreCategoriesLoading &&
          Array.from(Array(10).keys()).map((i) => (
            <Grid item key={i} xs={12} sm={6} lg={4}>
              <CategoryListingLoading />
            </Grid>
          ))}

        {!moreCategoriesExhausted && (
          <Grid item xs={12}>
            <Button
              variant='contained'
              onClick={() => dispatch(getMoreCategories())}
            >
              More
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Categories;
