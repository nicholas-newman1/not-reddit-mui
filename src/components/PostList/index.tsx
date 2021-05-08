import { List, ListItem, Typography, makeStyles } from '@material-ui/core';
import PostListing from '../PostListing';
import PostListLoading from './Loading';

const useStyles = makeStyles((theme) => ({
  item: {
    padding: 0,

    '& + &': {
      paddingTop: theme.spacing(2),
    },
  },
}));

interface Props {
  posts: {
    onUpVote: () => void;
    onDownVote: () => void;
    onSave: () => void;
    onShare: () => void;
    onReport: () => void;
    postHref: string;
    postId: string;
    authorProfileHref: string;
    categoryHref: string;
    title: string;
    authorUsername: string;
    timestamp: number;
    categoryId: string;
    numOfComments: number;
    rating: number;
    ratingStatus?: 'up' | 'down';
    loadingRating: boolean;
  }[];
  loading: boolean;
}

const PostList: React.FC<Props> = ({ posts, loading }) => {
  const classes = useStyles();

  return loading ? (
    <PostListLoading />
  ) : posts.length ? (
    <List disablePadding>
      {posts.map((post) => (
        <ListItem disableGutters className={classes.item} key={post.postId}>
          <PostListing {...post} />
        </ListItem>
      ))}
    </List>
  ) : (
    <Typography component='h1' variant='h4' paragraph>
      No Posts Found
    </Typography>
  );
};

export default PostList;
