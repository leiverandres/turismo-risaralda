import React from 'react';
import PropTypes from 'prop-types';

import Auth from '../utils/auth';
// import AdminNavOptions from
import UserNavOptions from './navbarOptions/userNavOptions';
import RootNavOptions from './navbarOptions/rootNavOptions';

const NavbarOptions = props => {
  const userType = Auth.userTypeLogged();
  if (userType === 'root') {
    return <RootNavOptions {...props} />;
  } else if (userType === 'admin') {
    return <span> admin options </span>;
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
