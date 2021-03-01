import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../store/rootReducer';
import styles from './Header.module.scss';
import LoginMenu from './LoginMenu';
import UserMenu from './UserMenu';

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const user = useSelector((state: AppState) => state.auth.user);

  useEffect(() => {
    /* Header animates */
    const header = headerRef.current!;
    header.classList.add(styles.headerAnimate);

    /* Puts main into view from under header */
    const main = document.querySelector('main')!;
    const headerHeight = header.getBoundingClientRect().height + 'px';
    main.style.paddingTop = headerHeight;
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
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
