import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import SignInDialog from './components/SignInDialog';
import SignUpDialog from './components/SignUpDialog';
import Home from './pages/Home';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SignInDialog />
      <SignUpDialog />

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
