import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import ResetPasswordDialogContainer from './containers/ResetPasswordDialogContainer';
import ResetPasswordSentToastContainer from './containers/ResetPasswordSentToastContainer';
import SentEmailVerificationDialogContainer from './containers/SentEmailVerificationDialogContainer';
import SignInDialogContainer from './containers/SignInDialogContainer';
import SignUpDialogContainer from './containers/SignUpDialogContainer';
import SignUpSuccessToastContainer from './containers/SignUpSuccessToastContainer';
import Category from './pages/Category';
import Home from './pages/Home';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SignInDialogContainer />
      <SignUpDialogContainer />
      <ResetPasswordDialogContainer />
      <SignUpSuccessToastContainer />
      <ResetPasswordSentToastContainer />
      <SentEmailVerificationDialogContainer />

      <Router>
        <Header />
        <main>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/categories/:categoryId' component={Category} />
          </Switch>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
