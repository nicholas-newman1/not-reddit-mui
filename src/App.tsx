import { CssBaseline, Dialog } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './pages/Home';
import { hideSignInDialog, hideSignUpDialog } from './store/auth/actions';
import { AppState } from './store/rootReducer';
import { theme } from './theme';

function App() {
  const dispatch = useDispatch();
  const signInDialog = useSelector(
    (state: AppState) => state.auth.signInDialog
  );
  const signUpDialog = useSelector(
    (state: AppState) => state.auth.signUpDialog
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog
        open={signInDialog}
        onClose={() => dispatch(hideSignInDialog())}
        fullWidth
        maxWidth='xs'
      >
        <SignIn />
      </Dialog>

      <Dialog
        open={signUpDialog}
        onClose={() => dispatch(hideSignUpDialog())}
        fullWidth
        maxWidth='xs'
      >
        <SignUp />
      </Dialog>

      <Router>
        <Header />
        <main>
          <Switch>
            <Route exact path='/' component={Home} />
          </Switch>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
