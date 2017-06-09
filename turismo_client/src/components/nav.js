import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, Icon, Label } from 'semantic-ui-react';

import NavbarOptions from './navbarOptions';
import Auth from '../utils/auth';

const userTypeName = {
  user: 'Usuario',
  admin: 'Administrador',
  root: 'Superusuario'
};

const Username = props => {
  return (
    <Menu.Item>
      <Label color="blue" size="big" circular>
        <Icon name="user" />
        {userTypeName[Auth.getUserType()]}
        <Label.Detail>{Auth.getUsername()}</Label.Detail>
      </Label>
    </Menu.Item>
  );
};

class Nav extends Component {
  state = {
    activeItem: 'home'
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;
    return (
      <Menu pointing size="huge">
        <Menu.Item
          as={Link}
          to="/"
          active={activeItem === 'home'}
          name="home"
          onClick={this.handleItemClick}
        >
          <Icon name="home" />
          Home
        </Menu.Item>

        <NavbarOptions
          activeItem={activeItem}
          handleItemClick={this.handleItemClick}
        />

        {/*Auth.isLoggedIn &&
          <Menu.Menu position="right">
            <Menu.Item>
              <Label color="blue" size="huge">
                <Icon name="user" />
                {userTypeName[Auth.getUserType()]}
                <Label.Detail>{Auth.getUsername()}</Label.Detail>
              </Label>
            </Menu.Item>
          </Menu.Menu>*/}

        {!Auth.isLoggedIn()
          ? <Menu.Menu position="right">
              <Menu.Item>
                <Button
                  primary
                  as={Link}
                  to="/signup"
                  content="Signup"
                  icon="id badge"
                />
              </Menu.Item>

              <Menu.Item>
                <Button
                  positive
                  as={Link}
                  to="/login"
                  content="Log-in"
                  icon="sign in"
                />
              </Menu.Item>
            </Menu.Menu>
          : <Menu.Menu position="right">
              <Username />
              <Menu.Item>
                <Button
                  negative
                  as={Link}
                  to="/logout"
                  icon="sign out"
                  content="Logout"
                />
              </Menu.Item>
            </Menu.Menu>}
      </Menu>
    );
  }
}

export default Nav;
