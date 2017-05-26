import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu } from 'semantic-ui-react';

import NavbarOptions from './navbarOptions';
import Auth from '../utils/auth';

class Nav extends Component {
  state = {
    activeItem: ''
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;
    return (
      <Menu pointing secondary>
        <Menu.Item
          as={Link}
          to="/"
          active={activeItem === 'home'}
          name="home"
          onClick={this.handleItemClick}
        >
          Home
        </Menu.Item>

        <NavbarOptions
          activeItem={activeItem}
          handleItemClick={this.handleItemClick}
        />
        {!Auth.isLoggedIn()
          ? <Menu.Menu position="right">
              <Menu.Item>
                <Button primary as={Link} to="/signup">Signup</Button>
              </Menu.Item>

              <Menu.Item as={Link} to="/login">
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
