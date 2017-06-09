import React, { Component } from 'react';

import MapWithEvents from '../components/mapWithEvents';
import EventInfoModal from '../components/eventInfoModal';
import requests from '../utils/requests';

class UserMapContainer extends Component {
  state = {
    position: [4.814278, -75.694558],
    events: [],
    showModal: false,
    modalEvent: {}
  };

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    requests
      .getUserEvents()
      .then(events => {
        this.setState({ events: events.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  showModal = eventObj => {
    this.setState({ showModal: true, modalEvent: eventObj });
  };

  closeModal = () => {
    this.setState({ showModal: false, modalEvent: {} });
  };

  render() {
    const { position, events, showModal, modalEvent } = this.state;
    return (
      <div>
        <EventInfoModal
          open={showModal}
          event={modalEvent}
          handleClose={this.closeModal}
        />
        <MapWithEvents
          position={position}
          events={events}
          onSeeMore={this.showModal}
        />
      </div>
    );
  }
}

export default UserMapContainer;
