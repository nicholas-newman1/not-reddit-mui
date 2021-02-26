import React from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '../../../svg/MenuIcon';
import useModalNav from '../useModalNav';
import styles from './LoginMenu.module.scss';

const LoginMenu = () => {
  const { displayNav, setDisplayNav, nav, icon } = useModalNav();

  const toggleDisplayNav = () => {
    setDisplayNav((prev) => !prev);
  };

  return (
    <div className={styles.menu}>
      <div ref={icon} className={styles.menuIcon} onClick={toggleDisplayNav}>
        <MenuIcon />
      </div>

      <nav
        ref={nav}
        className={`${styles.nav} ${displayNav ? styles.displayNav : ''}`}
      >
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to='/login' className={styles.signIn}>
              Log In
            </Link>
          </li>
          <li className={styles.item}>
            <Link to='/signup' className={styles.signUp}>
              Sign Up
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LoginMenu;
