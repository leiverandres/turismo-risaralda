import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './home';
import Login from './login';
import Signup from '../containers/signupContainer';
import Logout from './logout';
import Root from '../containers/root';
import Pending from './admin/pending';
import AdminsTable from './root/adminsTable';
import RequestTable from '../containers/requestTable';
import RootLogin from './root/rootLogin';
import PrivateRoute from './privateRoute';

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/logout" component={Logout} />

      <Route exact={true} path="/root" component={Root} />
      <Route exact path="/root/login" component={RootLogin} />

      <PrivateRoute
        userType="root"
        exact
        path="/root/admins"
        component={AdminsTable}
      />
      <PrivateRoute
        userType="root"
        path="/root/admins/requests"
        component={RequestTable}
      />
    </Switch>
  );
};

export default Routes;
