import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Switch>
          <Route path='/' component={Home} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
