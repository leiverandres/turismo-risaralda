import React from 'react';

import Auth from '../utils/auth';

const NavbarOptions = props => {
  const userType = Auth.userTypeLogged();
  if (userType === 'root') {
    return <span> root options </span>;
  } else if (userType === 'admin') {
    return <span> admin options </span>;
  } else if (userType === 'user') {
    return <span> regular user options </span>;
  } else {
    return null;
  }
};

export default NavbarOptions;
