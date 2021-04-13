import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Singletons from './components/Singletons';
import Category from './pages/Category';
import Home from './pages/Home';
import { theme } from './theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <Header />
        <main>
          <Route path='/' component={Singletons} />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/categories/:categoryId' component={Category} />
          </Switch>
        </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
