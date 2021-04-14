import { Button, Container, Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import CategoryMeta from '../../components/CategoryMeta';
import PostList from '../../components/PostList';
import PostListLoading from '../../components/PostList/Loading';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import useSubscribedCategoryIds from '../../hooks/useSubscribedCategoryIds';
import {
  getCategoryMeta,
  getMoreCategoryPosts,
  getPostList,
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
    morePostsLoading,
    morePostsExhausted,
    categoryMeta,
    categoryMetaLoading,
  } = useAppSelector((state) => state.categoryPage);

  const getMorePosts = () => dispatch(getMoreCategoryPosts());
  const onCreatePost = () => dispatch(displayCreatePostDialog(categoryId));

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

  /* only load posts/meta if auth has been verified and there are not already
  posts/meta loaded, or if the category does not match */
  useEffect(() => {
    if (!loadingUser) {
      (!postList.length || postList[0].categoryId !== categoryId) &&
        dispatch(getPostList(categoryId));
      (!categoryMeta || categoryMeta.categoryId !== categoryId) &&
        dispatch(getCategoryMeta(categoryId));
    }
    //eslint-disable-next-line
  }, [categoryId, loadingUser]);

  return (
    <Container>
      <Grid container spacing={2} wrap='wrap-reverse'>
        <Grid item xs={12} md={8}>
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
                <Button variant='contained' onClick={getMorePosts}>
                  More
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <CategoryMeta
                categoryName={categoryMeta.categoryId}
                owner={categoryMeta.owner}
                numOfModerators={categoryMeta.numOfModerators}
                numOfSubscribers={categoryMeta.numOfSubscribers}
                onToggleSubscribe={() => onToggleSubscribe(categoryId)}
                loadingToggleSubscribe={loadingToggleSubscribe(categoryId)}
                loading={categoryMetaLoading}
                subscribed={subscribed(categoryId)}
              />
            </Grid>

            <Grid item>
              <Button variant='contained' onClick={onCreatePost}>
                Create Post
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Category;
