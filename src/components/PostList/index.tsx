import { List, ListItem, Typography, makeStyles } from '@material-ui/core';
import { Post } from '../../types/client';
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

interface PostWithActions extends Post {
  loadingDelete: boolean;
  loadingRating: boolean;
  onDelete: () => void;
  onDownVote: (setRating: (a: number) => void) => void;
  onEdit: () => void;
  onSave: () => void;
  onShare: () => void;
  onReport: () => void;
  onToggleEditing: () => void;
  onUpVote: (setRating: (a: number) => void) => void;
  ratingStatus?: 'up' | 'down';
}

interface Props {
  posts: PostWithActions[];
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
