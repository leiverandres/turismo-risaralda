import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const AdminNavOptions = ({ activeItem, handleItemClick }) => {
  return (
    <Menu.Menu>
      <Menu.Item
        as={Link}
        to="/map/edit"
        name="editmap"
        content="Mapa"
        active={activeItem === 'editmap'}
        onClick={handleItemClick}
      />
    </Menu.Menu>
  );
};

export default AdminNavOptions;
