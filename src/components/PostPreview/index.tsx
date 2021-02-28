import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card';
import CardMenu from '../Card/CardMenu';
import CardMenuItem from '../Card/CardMenuItem';
import PostMeta from '../PostMeta';
import Rating from '../Rating';
import styles from './PostPreview.module.scss';

interface Props {
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
}

const PostPreview: React.FC<Props> = (props) => {
  return (
    <Card className={styles.container}>
      <div className={styles.flex}>
        <Rating
          rating={props.rating}
          onUpVote={props.onUpVote}
          onDownVote={props.onDownVote}
          status={props.ratingStatus}
        />
        <div className={styles.grid}>
          <PostMeta
            category={props.category}
            categoryHref={props.categoryHref}
            timestamp={props.timestamp}
            userProfileHref={props.userProfileHref}
            username={props.username}
          />
          <h2 className={styles.title}>
            <Link to={props.postHref}>{props.title}</Link>
          </h2>

          <CardMenu>
            <CardMenuItem>
              <Link to={props.postHref + '#comments'}>
                comments ({props.numOfComments})
              </Link>
            </CardMenuItem>
            <CardMenuItem>
              <button onClick={props.onSave}>Save</button>
            </CardMenuItem>
            <CardMenuItem>
              <button onClick={props.onShare}>Share</button>
            </CardMenuItem>
            <CardMenuItem>
              <button onClick={props.onReport}>Report</button>
            </CardMenuItem>
          </CardMenu>
        </div>
      </div>
    </Card>
  );
};

export default PostPreview;
