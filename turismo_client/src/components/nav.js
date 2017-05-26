import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button, Menu } from 'semantic-ui-react';

import NavbarOptions from './navbarOptions';
import Auth from '../utils/auth';

// const RootNavbarOptions = props => {
//   return (
//     <Menu.Menu>
//       <Menu.Item>
//         Tablero
//       </Menu.Item>
//     </Menu.Menu>
//   );
// };

class Nav extends Component {
  state = {
    userToken: window.localStorage.getItem('token')
  };

  logoutUser = () => {
    window.localStorage.removeItem('token');
    this.setState({ userToken: null });
  };

  render() {
    return (
      <Menu>
        <Menu.Item as={NavLink} to="/">
          Home
        </Menu.Item>

        <NavbarOptions />
        {!Auth.isLoggedIn()
          ? <Menu.Menu position="right">
              <Menu.Item>
                <Button primary as={Link} to="/signup">Signup</Button>
              </Menu.Item>

              <Menu.Item as={NavLink} to="/login">
                Log-in
              </Menu.Item>
            </Menu.Menu>
          : <Menu.Menu position="right">
              <Menu.Item>
                <Button negative as={Link} to="/logout">Logout</Button>
              </Menu.Item>
            </Menu.Menu>}
      </Menu>
    );
  }
}

export default Nav;
