import React from 'react';
import ArrowIcon from '../../svg/ArrowIcon';
import styles from './Rating.module.scss';

interface Props {
  rating: number;
  onUpVote: () => void;
  onDownVote: () => void;
  status?: 'up' | 'down';
  className?: string;
}

const Rating: React.FC<Props> = (props) => {
  return (
    <div
      className={
        styles.container + ` ${props.className ? props.className : ''}`
      }
      data-testid='wrapper'
    >
      <button
        className={
          styles.arrowUp + ` ${props.status === 'up' ? styles.arrowActive : ''}`
        }
        onClick={() => props.onUpVote()}
        aria-label='up vote'
        data-testid='up-arrow'
      >
        <ArrowIcon ariaHidden={true} />
      </button>

      <div className={styles.rating}>{props.rating}</div>

      <button
        className={
          styles.arrowDown +
          ` ${props.status === 'down' ? styles.arrowActive : ''}`
        }
        onClick={() => props.onDownVote()}
        aria-label='down vote'
        data-testid='down-arrow'
      >
        <ArrowIcon ariaHidden={true} />
      </button>
    </div>
  );
};

export default Rating;
