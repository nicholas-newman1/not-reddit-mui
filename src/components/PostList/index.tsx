import { List, ListItem, makeStyles } from '@material-ui/core';
import PostListing from '../PostListing';

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
    userProfileHref: string;
    categoryHref: string;
    title: string;
    authorUsername: string | null;
    timestamp: number;
    categoryId: string;
    numOfComments: number;
    rating: number;
    ratingStatus?: 'up' | 'down';
  }[];
  loading: boolean;
}

const PostList: React.FC<Props> = ({ posts, loading }) => {
  const classes = useStyles();

  return loading ? (
    <h2>Loading...</h2>
  ) : (
    <List disablePadding>
      {posts.map((post) => (
        <ListItem disableGutters className={classes.item} key={post.postId}>
          <PostListing {...post} />
        </ListItem>
      ))}
    </List>
  );
};

export default PostList;
