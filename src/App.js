import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Home from './pages/Home';
import regulations from './assets/regulationsAndGuidelines.json';

function App() {
  return (
    <Router>
      <div id="app">
        <nav className="navbar is-flex" role="navigation">
          <div className="navbar-brand is-inline-flex">
            <Link className="navbar-item" style={{display: 'block', lineHeight: '1em'}} to="/">
              <h1 style={{margin: '0px'}}>WCA-Regs</h1>
              <span style={{fontSize: '.65em'}}>Version: {regulations.version}</span>
            </Link>
          </div>
          <div className="navbar-item field is-inline-flex stretch">
            <div className="control stretch">
              <input className="input" v-model="query" type="text"/>
            </div>
          </div>
        </nav>

        <div id="page">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
