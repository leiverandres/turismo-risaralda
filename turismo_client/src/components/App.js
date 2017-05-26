import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './home';
import Nav from './nav';
import Login from './login';
import Signup from '../containers/signupContainer';
import Root from '../containers/root';
import Pending from './admin/pending';
import AdminsTable from './root/adminsTable';
import RequestTable from './root/requestTable';
import RootLogin from './root/rootLogin';
import PrivateRoute from './privateRoute';
import Logout from './logout';

function requireAdmin(nextState, replace) {
  if (!window.localStorage.getItem('token')) {
    replace({
      pathname: '/login'
    });
  }
}

class App extends Component {
  state = {
    token: '',
    isAuthenticated: false,
    isAdmin: false
  };

  render() {
    return (
      <Router>
        <div className="container">
          <Nav />
          <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/logout" component={Logout} />

            <Route exact={true} path="/root" component={Root} />
            <Route path="/root/login" component={RootLogin} />

            <PrivateRoute
              userType="root"
              path="/root/admins"
              component={AdminsTable}
            />
            <PrivateRoute
              userType="root"
              path="/root/users/pending"
              component={RequestTable}
            />
            <Route
              path="/admin/pending"
              component={Pending}
              onEnter={requireAdmin}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
