import React from 'react';
import { Link } from 'react-router-dom';
import { getTimeAgoString } from '../../utils';
import styles from './PostMeta.module.scss';

interface Props {
  username: string;
  userProfileHref: string;
  timestamp: number;
  category: string;
  categoryHref: string;
}

const PostMeta: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <Link className={styles.username} to={props.userProfileHref}>
        {props.username}
      </Link>

      <div className={styles.timeString}>
        {getTimeAgoString(props.timestamp)}
      </div>

      <Link className={styles.category} to={props.categoryHref}>
        {props.category}
      </Link>
    </div>
  );
};

export default PostMeta;
