import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

import requests from '../../utils/requests';
import RequestCard from './requestCard';

class RequestTable extends Component {
  state = {
    pendingUser: []
  };

  componentDidMount() {
    requests
      .getPendingUsers()
      .then(users => {
        console.log(users);
        this.setState({ pendingUser: users.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // applyChannels(channels) {}

  render() {
    return (
      <div>
        <h1>Solicitudes para ser administrador</h1>
        <Card.Group>
          {this.state.pendingUser.map(user => {
            return <RequestCard key={user._id} {...user} />;
          })}
        </Card.Group>
      </div>
    );
  }
}

export default RequestTable;
