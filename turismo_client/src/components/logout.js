import React from 'react'
import {Redirect} from 'react-router-dom'

import Auth from '../utils/auth'

const Logout = (props) => {
  Auth.logout()
  return (
    <Redirect to='login' />
  )
}

export default Logout
