import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import regulations from "./assets/regulationsAndGuidelines.json";

function Header() {
  const history = useHistory();
  const [query, setQuery] = useState("");

  const search = (e) => {
    e.preventDefault();
    console.log(history);
    history.push(`/search?q=${query}`);
  };

  return (
    <nav className="navbar is-flex" role="navigation">
      <div className="navbar-brand is-inline-flex">
        <Link
          className="navbar-item"
          style={{ display: "block", lineHeight: "1em" }}
          to="/"
        >
          <h1 style={{ margin: "0px" }}>WCA-Regs</h1>
          <span style={{ fontSize: ".65em" }}>
            Version: {regulations.version}
          </span>
        </Link>
      </div>
      <div className="navbar-item field is-inline-flex stretch">
        <form className="control stretch" onSubmit={search}>
          <input
            className="input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input type="submit" style={{ display: "none" }} />
        </form>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div id="app">
        <Header />
        <main>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/search">
              <Search />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
