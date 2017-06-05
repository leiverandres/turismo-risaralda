import React, { Component } from 'react';

import MapWithEvents from '../components/mapWithEvents';
import requests from '../utils/requests';

class UserMapContainer extends Component {
  state = {
    position: [4.814278, -75.694558],
    events: []
  };

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    requests
      .getEvents()
      .then(events => {
        this.setState({ events: events.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { position, events } = this.state;
    return <MapWithEvents position={position} events={events} />;
  }
}

export default UserMapContainer;
