import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

import requests from '../utils/requests';
import RequestCard from '../components/root/requestCard';

class RequestTable extends Component {
  state = {
    pendingUser: []
  };

  componentDidMount() {
    this.fetchPendings();
  }

  fetchPendings = () => {
    requests
      .getPendingUsers()
      .then(users => {
        this.setState({ pendingUser: users.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <h1>Solicitudes para ser administrador</h1>
        <Card.Group>
          {this.state.pendingUser.map(user => {
            return (
              <RequestCard
                key={user._id}
                user={user}
                onApplyPermision={this.fetchPendings}
              />
            );
          })}
        </Card.Group>
      </div>
    );
  }
}

export default RequestTable;
