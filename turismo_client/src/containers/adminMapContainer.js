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
    openEventModal: false,
    newEventLatlng: {},
    municipalityOpts: [],
    activityOpts: [],
    modalEventObj: {},
    eventFormData: {
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
        console.log(events);
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
    this.setState({
      openConfirmation: false,
      openEventModal: true,
      modalMode: 'creation'
    });

  // Use for confirmation cancel and modal close
  handleCancel = () =>
    this.setState({
      openConfirmation: false,
      newEventLatlng: {},
      openEventModal: false,
      modalEventObj: {}
    });

  onMapClick = e => {
    // here is displayed a modal, with fields to create a new event,
    // Preserving the clicked coordinate
    this.setState({ openConfirmation: true, newEventLatlng: e.latlng });
  };

  handleInputChange = (ev, data) => {
    const { name, value } = data;
    this.setState(prevState => {
      prevState.eventFormData[name] = value;
      return prevState;
    });
  };

  handleDateChange = date => {
    this.setState(prevState => {
      prevState.eventFormData.date = date;
      return prevState;
    });
  };

  handleSubmit = ev => {
    ev.preventDefault();
    const body = Object.assign({}, this.state.eventFormData);
    body.date = body.date.toString();
    console.log('Body to submit', body);
    let submitRequest;
    if (this.state.modalMode === 'creation') {
      body.coordinates = {
        latitude: this.state.newEventLatlng.lat,
        longitude: this.state.newEventLatlng.lng
      };
      submitRequest = requests.createEvent;
    } else {
      submitRequest = requests.updateEvent;
      body.eventId = this.state.modalEventObj._id;
      body.coordinates = this.state.modalEventObj.coordinates;
    }
    requests
      .findChannel(body)
      .then(submitRequest)
      .then(res => {
        this.handleCancel(); // cleans modal and confirmation
        this.cleanFormData();
        this.fetchEvents(); // to update map markers
      })
      .catch(err => {
        this.addError({
          header: 'Algo salio mal creando el nuevo evento',
          message:
            'Revisa que tengas permisos sobre el municipio o actividad seleccionados'
        });
        this.cleanFormData();
        this.fetchEvents(); // to update map markers
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

  handleEdit = event => {
    console.log('editing');
    this.setState({
      openEventModal: true,
      modalMode: 'edition',
      modalEventObj: event,
      eventFormData: {
        name: event.name,
        description: event.description,
        date: moment.utc(event.date),
        municipality: event.channel.municipality,
        activity: event.channel.activity,
        contactEmail: event.contactEmail || '',
        contactNumber: event.contactNumber || '',
        contactLink: event.contactLink || ''
      }
    });
  };

  cleanFormData = () => {
    this.setState({
      modalMode: '',
      modalEventObj: {},
      eventFormData: {
        name: '',
        description: '',
        date: moment.utc(),
        municipality: '',
        activity: '',
        contactEmail: '',
        contactNumber: '',
        contactLink: ''
      }
    });
  };

  render() {
    const {
      position,
      events,
      openConfirmation,
      openEventModal,
      eventFormData,
      modalMode
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
          open={openEventModal}
          mode={modalMode}
          handleClose={this.handleCancel}
          handleInputChange={this.handleInputChange}
          eventFormData={eventFormData}
          handleDateChange={this.handleDateChange}
          handleSubmit={this.handleSubmit}
          dropdownOpts={dropdownOpts}
        />
        <MapWithEvents
          position={position}
          events={events}
          editable={true}
          handleMapClick={this.onMapClick}
          onEdit={this.handleEdit}
        />
      </div>
    );
  }
}

export default AdminMapContainer;
