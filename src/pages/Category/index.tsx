import { Container, Grid } from '@material-ui/core';
import { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import CategoryMeta from '../../components/CategoryMeta';
import PostList from '../../components/PostList';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getPostList } from '../../store/categoryPageSlice';

interface MatchProps {
  categoryId: string;
}

interface Props extends RouteComponentProps<MatchProps> {}

const Category: React.FC<Props> = ({ match }) => {
  const categoryId = match.params.categoryId;
  const dispatch = useAppDispatch();
  const postListLoading = useAppSelector(
    (state) => state.categoryPage.postListLoading
  );
  const postList = useAppSelector((state) => state.categoryPage.postList);

  useEffect(() => {
    dispatch(getPostList(categoryId));
  }, [dispatch, categoryId]);

  return (
    <Container>
      <Grid container spacing={2} wrap='wrap-reverse'>
        <Grid item xs={12} md={8}>
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
        <Grid item xs={12} md={4}>
          <CategoryMeta
            categoryName='meditation'
            owner={{ name: 'ovechking899', uid: 'ng423g32b9gnn3' }}
            numOfModerators={4}
            numOfSubscribers={32153}
            onSubscribe={() => {}}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Category;
