import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import SignInDialogContainer from './containers/SignInDialogContainer';
import SignUpDialogContainer from './containers/SignUpDialogContainer';
import Home from './pages/Home';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SignInDialogContainer />
      <SignUpDialogContainer />

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
