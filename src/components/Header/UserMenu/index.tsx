import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { signOut } from '../../../store/auth/actions';
import UserIcon from '../../../svg/UserIcon';
import useModalNav from '../useModalNav';
import styles from './UserMenu.module.scss';

interface Props {
  uid: string;
}

const UserMenu: React.FC<Props> = ({ uid }) => {
  const { displayNav, setDisplayNav, nav, icon } = useModalNav();
  const dispatch = useDispatch();

  const toggleDisplayNav = () => {
    setDisplayNav((prev) => !prev);
  };

  return (
    <div className={styles.menu}>
      <div ref={icon} className={styles.userIcon} onClick={toggleDisplayNav}>
        <UserIcon />
      </div>

      <nav
        ref={nav}
        className={`${styles.nav} ${displayNav ? styles.displayNav : ''}`}
      >
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to={`/profile/${uid}`} className={styles.link}>
              Profile
            </Link>
          </li>

          <li className={styles.item}>
            <button onClick={() => dispatch(signOut())} className={styles.btn}>
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserMenu;
