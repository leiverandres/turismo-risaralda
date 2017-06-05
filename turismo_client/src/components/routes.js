import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './home';
import Login from './login';
import Logout from './logout';
import RootLogin from './root/rootLogin';
import Signup from '../containers/signupContainer';
import AdminsTable from '../containers/adminsTable';
import RequestTable from '../containers/requestTable';
import UserBoard from '../containers/userBoardContainer';
import UserMap from '../containers/userMapContainer';
import AdminMap from '../containers/adminMapContainer';
import PrivateRoute from './privateRoute';

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/logout" component={Logout} />

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

      <PrivateRoute exact userType="user" path="/map" component={UserMap} />
      <PrivateRoute userType="user" path="/board" component={UserBoard} />

      <PrivateRoute userType="admin" path="/map/edit" component={AdminMap} />
    </Switch>
  );
};

export default Routes;
