import React, { Component } from 'react';
import { Confirm, Message } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';

import requests from '../utils/requests';
import MapWithEvents from '../components/mapWithEvents';
import AddEventModal from '../components/admin/addEventModal';

class AdminMapContainer extends Component {
  state = {
    position: [4.814278, -75.694558],
    events: [],
    openConfirmation: false,
    addNewEvent: false,
    newEventLatlng: {},
    municipalityOpts: [],
    activityOpts: [],
    newEventFormData: {
      name: '',
      description: '',
      date: moment.utc(),
      municipality: '',
      activity: '',
      contactEmail: '',
      contactNumber: '',
      contactLink: ''
    },
    error: {
      state: false,
      message: '',
      header: ''
    }
  };

  componentDidMount() {
    this.fetchDropdownOpts();
    this.fetchEvents();
  }

  fetchDropdownOpts = () => {
    axios
      .all([requests.getActivities(), requests.getMunicipalities()])
      .then(
        axios.spread((activities, municipalities) => {
          const activityOpts = activities.data.map(act => {
            return { key: act, value: act, text: act };
          });

          const municipalityOpts = municipalities.data.map(muni => {
            return { key: muni, value: muni, text: muni };
          });
          this.setState({ activityOpts, municipalityOpts });
        })
      )
      .catch(err => {
        this.addError({
          header: 'Algo ha salido mal',
          message:
            'No se pudo traer cierta información de tu cuenta, intentalo más tarde'
        });
      });
  };

  fetchEvents = () => {
    requests
      .getEvents()
      .then(events => {
        this.setState({ events: events.data });
      })
      .catch(err => {
        this.addError({
          header: 'Algo ha salido mal',
          message: 'No se pudieron traer los eventos, intentalo más tarde.'
        });
      });
  };

  handleConfirm = () =>
    this.setState({ openConfirmation: false, addNewEvent: true });

  // Use for confirmation cancel and modal close
  handleCancel = () =>
    this.setState({
      openConfirmation: false,
      newEventLatlng: {},
      addNewEvent: false
    });

  onMapClick = e => {
    // here is displayed a modal, with fields to create a new event,
    // Preserving the clicked coordinate
    this.setState({ openConfirmation: true, newEventLatlng: e.latlng });
  };

  handleInputChange = (ev, data) => {
    const { name, value } = data;
    this.setState(prevState => {
      prevState.newEventFormData[name] = value;
      return prevState;
    });
  };

  handleDateChange = date => {
    this.setState(prevState => {
      prevState.newEventFormData.date = date;
      return prevState;
    });
  };

  handleSubmit = ev => {
    ev.preventDefault();
    const body = Object.assign({}, this.state.newEventFormData);
    body.coordinates = {
      latitude: this.state.newEventLatlng.lat,
      longitude: this.state.newEventLatlng.lng
    };
    body.date = body.date.toString();
    console.log('Body to submit', body);
    requests
      .findChannel(body)
      .then(requests.createEvent)
      .then(res => {
        this.handleCancel(); // cleans modal and confirmation
        this.fetchEvents(); // to update map markers
      })
      .catch(err => {
        this.addError({
          header: 'Algo salio mal creando el nuevo evento',
          message:
            'Revisa que tengas permisos sobre el municipio o actividad seleccionados'
        });
      });
  };

  addError = body => {
    this.setState({
      error: {
        state: true,
        header: body.header,
        message: body.message
      }
    });
  };

  render() {
    const {
      position,
      events,
      openConfirmation,
      addNewEvent,
      newEventFormData
    } = this.state;

    const dropdownOpts = {
      activities: this.state.activityOpts,
      municipalities: this.state.municipalityOpts
    };

    return (
      <div>
        <Message negative hidden={!this.state.error.state}>
          <Message.Header>
            {this.state.error.header}
          </Message.Header>
          <p>{this.state.error.message}</p>
        </Message>
        <Confirm
          header="Añadir un nuevo evento"
          content="Quieres añadir un evento en este punto"
          cancelButton="Cancelar"
          confirmButton="Si!"
          open={openConfirmation}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
        <AddEventModal
          open={addNewEvent}
          handleClose={this.handleCancel}
          handleInputChange={this.handleInputChange}
          newEventFormData={newEventFormData}
          handleDateChange={this.handleDateChange}
          handleSubmit={this.handleSubmit}
          dropdownOpts={dropdownOpts}
        />
        <MapWithEvents
          position={position}
          events={events}
          editable={true}
          handleMapClick={this.onMapClick}
        />
      </div>
    );
  }
}

export default AdminMapContainer;
