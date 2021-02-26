import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Menu from '../../svg/Menu';
import styles from './Header.module.scss';

const Header = () => {
  const [displayMenu, setDisplayMenu] = useState(false);
  const header = useRef<HTMLElement>(null);

  const toggleDisplayMenu = () => {
    setDisplayMenu((prev) => !prev);
  };

  useEffect(() => {
    /* clicking on main closes the menu */
    const main = document.querySelector('main')!;
    main.addEventListener('click', () => setDisplayMenu(false));

    /* Header animates */
    header.current!.classList.add(styles.headerAnimate);
  }, []);

  return (
    <header ref={header} className={styles.header}>
      <div className={styles.container}>
        <Link to='/' className={styles.logo}>
          Not Reddit
        </Link>

        <div className={styles.hamburger} onClick={toggleDisplayMenu}>
          <Menu />
        </div>

        <div
          className={`${styles.menu} ${displayMenu ? styles.menuActive : ''}`}
        >
          <div className={styles.login}>
            <Link
              to='/login'
              className={styles.loginBtn + ' btn btn-outline-white'}
            >
              Log In
            </Link>
            <Link to='/signup' className={styles.signUpBtn + ' btn btn-white'}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
