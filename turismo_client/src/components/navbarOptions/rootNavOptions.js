import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const RootNavOptions = ({ activeItem, handleItemClick }) => {
  return (
    <Menu.Menu>
      <Menu.Item
        as={Link}
        to="/root/admins"
        name="table"
        content="Tablero de administradores"
        active={activeItem === 'table'}
        onClick={handleItemClick}
      />
      <Menu.Item
        as={Link}
        to="/root/admins/requests"
        name="requests"
        content="Solicitudes"
        active={activeItem === 'requests'}
        onClick={handleItemClick}
      />
    </Menu.Menu>
  );
};

export default RootNavOptions;
