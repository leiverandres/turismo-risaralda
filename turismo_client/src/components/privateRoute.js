import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import Auth from '../utils/auth'

const PrivateRoute = ({component, userType, ...rest}) => {
  if (Auth.isLoggedIn() && Auth.userTypeLogged() === userType) {
    return (
      <Route {...rest} component={component} />
    )
  } else {
    return (
      <Redirect to={{
        pathname: (userType === 'root')? '/root/login' : '/login'
      }} />
    )
  }
}

export default PrivateRoute
