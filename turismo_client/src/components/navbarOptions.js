import React from 'react';
import PropTypes from 'prop-types';

import Auth from '../utils/auth';
import RootNavOptions from './navbarOptions/rootNavOptions';
import AdminNavOptions from './navbarOptions/adminNavOptions';
import UserNavOptions from './navbarOptions/userNavOptions';

const NavbarOptions = props => {
  const userType = Auth.userTypeLogged();
  if (userType === 'root') {
    return <RootNavOptions {...props} />;
  } else if (userType === 'admin') {
    return <AdminNavOptions {...props} />;
  } else if (userType === 'user') {
    return <UserNavOptions {...props} />;
  } else {
    return null;
  }
};

NavbarOptions.propTypes = {
  activeItem: PropTypes.string.isRequired,
  handleItemClick: PropTypes.func.isRequired
};

export default NavbarOptions;
