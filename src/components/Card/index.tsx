import React from 'react';
import styles from './Card.module.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {}

const Card: React.FC<Props> = (props) => {
  return (
    <div
      {...props}
      className={`${styles.card} ${props.className ? props.className : ''}`}
      data-testid='wrapper'
    >
      {props.children}
    </div>
  );
};

export default Card;
