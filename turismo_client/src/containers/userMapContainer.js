import React, { Component } from 'react';
import { Modal, Container, Divider, Grid, List } from 'semantic-ui-react';
import moment from 'moment';

import MapWithEvents from '../components/mapWithEvents';
import requests from '../utils/requests';

function formatDateString(dateString) {
  const date = moment.utc(dateString);
  moment.locale('es');
  return date.format('ll');
}

const EventInfoModal = ({ event, open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Header>{event.name}</Modal.Header>
      <Modal.Content>
        <Container text>
          <p>
            {event.description}
          </p>
        </Container>
        <Divider horizontal />
        <Grid columns={2}>
          <Grid.Column textAlign="center">
            <List>
              <List.Item
                icon="calendar"
                content={formatDateString(event.date)}
              />
              {event.channel &&
                <List.Item icon="tag" content={event.channel.activity} />}
              {event.channel &&
                <List.Item
                  icon="map signs"
                  content={event.channel.municipality}
                />}
            </List>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <List>
              {event.contactNumber &&
                <List.Item icon="phone" content={event.contactNumber} />}
              {event.contactEmail &&
                <List.Item icon="mail outline" content={event.contactEmail} />}
              {event.contactLink &&
                <List.Item icon="linkify" content={event.contactLink} />}
            </List>
          </Grid.Column>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

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
    console.log(eventObj);
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
