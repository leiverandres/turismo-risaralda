import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import AdminsTable from '../components/root/adminsTable';
// import RequestTable from '../components/root/requestTable';

class Root extends Component {
  render() {
    return (
      <div>
        <h1> Root container </h1>
        <ul>
          <li><Link to="/admins">Tablero de administradores</Link></li>
          <li><Link to="/pending">Solicitudes de administradores</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export default Root;
