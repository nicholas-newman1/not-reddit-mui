import { List, ListItem } from '@material-ui/core';
import PostPreview from '../PostPreview';

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
  return (
    <List>
      {posts.map((post) => (
        <ListItem disableGutters>
          <PostPreview {...post} />
        </ListItem>
      ))}
    </List>
  );
};

export default PostList;
