import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../store/rootReducer';
import styles from './Header.module.scss';
import LoginMenu from './LoginMenu';
import UserMenu from './UserMenu';

const Header = () => {
  const header = useRef<HTMLElement>(null);
  const user = useSelector((state: AppState) => state.auth.user);

  useEffect(() => {
    /* Header animates */
    header.current!.classList.add(styles.headerAnimate);
  }, []);

  return (
    <header ref={header} className={styles.header}>
      <div className={styles.container}>
        <Link to='/' className={styles.logo}>
          Not Reddit
        </Link>

        {user ? <UserMenu uid={user.uid} /> : <LoginMenu />}
      </div>
    </header>
  );
};

export default Header;
