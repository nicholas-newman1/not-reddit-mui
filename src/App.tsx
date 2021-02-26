import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={SignIn} />
          <Route exact path='/signup' component={SignUp} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
