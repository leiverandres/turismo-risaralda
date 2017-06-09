import React, { Component } from 'react';

import requests from '../utils/requests';

class UserBoardContainer extends Component {
  state = {
    events: []
  };

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    requests.getUserEvents().then(res => {
      this.setState({
        events: res.data
      });
    });
  };
  render() {
    return (
      <div>
        <h1> Aquí va el tablero de las ultimas actividades por categoria </h1>
      </div>
    );
  }
}

export default UserBoardContainer;
