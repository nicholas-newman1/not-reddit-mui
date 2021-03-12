import {
  AppBar,
  Box,
  Button,
  Grid,
  makeStyles,
  Toolbar,
  Link as StyledLink,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signOut } from '../../store/auth/actions';
import { AppState } from '../../store/rootReducer';

const useStyles = makeStyles((theme) => ({
  root: {
    transition: '400ms',
  },
  rootAnimate: {
    transform: 'translateY(-100%)',
  },
  title: {
    fontWeight: 800,
    color: theme.palette.text.primary,
  },

  login: {
    marginRight: theme.spacing(1),
  },
}));

const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const headerRef = useRef<HTMLElement>(null);
  const user = useSelector((state: AppState) => state.auth.user);
  const [openMenu, setOpenMenu] = useState(false);
  const menuIconRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  useEffect(() => {
    /* Header animates on mount */
    const header = headerRef.current!;
    header.classList.remove(classes.rootAnimate);

    /* Puts main into view from under header */
    const main = document.querySelector('main')!;
    const headerHeight = header.getBoundingClientRect().height + 'px';
    main.style.paddingTop = headerHeight;

    //eslint-disable-next-line
  }, []);

  return (
    <AppBar
      ref={headerRef}
      color='default'
      className={clsx(classes.root, classes.rootAnimate)}
    >
      <Toolbar>
        <Grid container justify='space-between' alignItems='center'>
          <StyledLink
            component={Link}
            to='/'
            variant='h6'
            className={classes.title}
          >
            Not Reddit
          </StyledLink>

          {user ? (
            <>
              <IconButton
                ref={menuIconRef}
                onClick={handleOpenMenu}
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={menuIconRef.current}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openMenu}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  component={Link}
                  to={`/profile/${user.uid}`}
                  onClick={handleCloseMenu}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(signOut());
                    handleCloseMenu();
                  }}
                >
                  Log Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box>
              <Button
                component={Link}
                to='/login'
                variant='outlined'
                className={classes.login}
              >
                Login
              </Button>
              <Button
                component={Link}
                to='/signup'
                color='primary'
                variant='contained'
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
