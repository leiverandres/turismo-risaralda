import React, {Component} from 'react';
import {NavLink, Link} from 'react-router-dom';
import {Button, Menu} from 'semantic-ui-react';

class AdminNav extends Component {
  render() {
    return (
      <Menu>
        <Menu.Item as={NavLink} to="/" activeClassName="active">
          Home
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button primary as={Link} to="/signup">Tablero</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default AdminNav;
