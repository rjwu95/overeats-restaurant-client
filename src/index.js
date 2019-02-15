import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Signup from './Signup';
const routing = (
  <Router>
    <div>
      <Link to="/">Home</Link>
      <Link
        to="/signup"
        style={{ marginLeft: 20, borderColor: 'black', borderWidth: 0.5 }}
      >
        signup
      </Link>
      <Route exact path="/" component={App} />
      <Route exact path="/signup" component={Signup} />
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById('root'));
