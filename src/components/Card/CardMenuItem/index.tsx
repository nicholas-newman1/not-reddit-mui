import styles from './CardMenuItem.module.scss';

const CardMenuItem: React.FC = ({ children }) => {
  return <li className={styles.item}>{children}</li>;
};

export default CardMenuItem;
