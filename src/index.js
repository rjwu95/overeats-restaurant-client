import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Signup from './Signup';
const routing = (
  <Router>
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          padding: '5px',
          boxShadow: '0px 2px 5px #111'
        }}
      >
        <Link
          to="/"
          style={{ padding: '10px', color: '#51cdca', textDecoration: 'none' }}
        >
          Home
        </Link>
        <Link
          to="/signup"
          style={{
            marginLeft: 20,
            borderColor: 'black',
            borderWidth: 0.5,
            padding: '10px',
            color: '#51cdca',
            textDecoration: 'none'
          }}
        >
          signup
        </Link>
      </div>
      <Route exact path="/" component={App} />
      <Route exact path="/signup" component={Signup} />
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById('root'));
