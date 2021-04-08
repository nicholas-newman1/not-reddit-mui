import { List, ListItem, makeStyles } from '@material-ui/core';
import PostPreview from '../PostPreview';

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
    commentsHref: string;
    userProfileHref: string;
    categoryHref: string;
    title: string;
    username: string;
    timestamp: number;
    category: string;
    numOfComments: number;
    rating: number;
    ratingStatus?: 'up' | 'down';
  }[];
}

const PostList: React.FC<Props> = ({ posts }) => {
  const classes = useStyles();

  return (
    <List disablePadding>
      {posts.map((post) => (
        <ListItem disableGutters className={classes.item}>
          <PostPreview {...post} />
        </ListItem>
      ))}
    </List>
  );
};

export default PostList;
