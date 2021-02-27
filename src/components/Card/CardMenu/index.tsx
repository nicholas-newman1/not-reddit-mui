import React from 'react';
import styles from './CardMenu.module.scss';

const CardMenu: React.FC = ({ children }) => {
  return (
    <nav>
      <ul className={styles.list}>{children}</ul>
    </nav>
  );
};

export default CardMenu;
