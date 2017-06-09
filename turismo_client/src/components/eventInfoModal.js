import React from 'react';
import { Modal, Container, Divider, Grid, List } from 'semantic-ui-react';

import { formatDateString } from '../utils/general';

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

export default EventInfoModal;
