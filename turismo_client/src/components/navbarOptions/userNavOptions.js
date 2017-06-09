import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const UserNavOptions = ({ activeItem, handleItemClick }) => {
  return (
    <Menu.Menu>
      <Menu.Item
        as={Link}
        to="/map"
        name="map"
        content="Mapa"
        active={activeItem === 'map'}
        onClick={handleItemClick}
        icon="map"
      />
      <Menu.Item
        as={Link}
        to="/board"
        name="board"
        content="Explorar"
        active={activeItem === 'board'}
        onClick={handleItemClick}
        icon="rocket"
      />
    </Menu.Menu>
  );
};

export default UserNavOptions;
