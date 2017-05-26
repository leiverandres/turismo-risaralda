import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Nav from './nav';
import Routes from './routes';

const App = props => {
  return (
    <Router>
      <div className="container">
        <Nav />
        <Routes />
      </div>
    </Router>
  );
};

export default App;
