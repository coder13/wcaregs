import Home from './pages/Home';
import regulations from './assets/regulationsAndGuidelines.json';

function App() {
  return (
    <div id="app">
      <nav className="navbar is-flex" role="navigation">
        <div className="navbar-brand is-inline-flex">
          <div className="navbar-item" style={{display: 'block', lineHeight: '1em'}} to="/">
            <h1 style={{margin: '0px'}}>WCA-Regs</h1>
            <span style={{fontSize: '.65em'}}>Version: {regulations.version}</span>
          </div>
        </div>
        <div className="navbar-item field is-inline-flex stretch">
          <div className="control stretch">
            <input className="input" v-model="query" type="text"/>
          </div>
        </div>
      </nav>

      <div id="page">
        <Home />
      </div>
    </div>
  );
}

export default App;
