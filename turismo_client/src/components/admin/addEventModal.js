import React, { Component } from 'react';
import { Modal, Grid, Form } from 'semantic-ui-react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

import 'react-dates/lib/css/_datepicker.css';

class AddEventModal extends Component {
  state = {
    eventDate: moment.utc(),
    datePickerFocused: false
  };

  render() {
    const {
      open,
      handleClose,
      newEventFormData,
      handleInputChange,
      handleDateChange,
      handleSubmit,
      dropdownOpts
    } = this.props;
    return (
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>Datos sobre el nuevo evento</Modal.Header>
        <Modal.Content>

          <Modal.Description>
            <Grid centered>
              <Grid.Column>
                <Form size="big" onSubmit={handleSubmit}>
                  <Form.Input
                    required
                    label="Título o Nombre del evento"
                    placeholder="Título"
                    name="name"
                    value={newEventFormData.name}
                    onChange={handleInputChange}
                  />
                  <Form.TextArea
                    required
                    label="Descripción del evento"
                    placeholder="Incluye toda la información relevante"
                    name="description"
                    value={newEventFormData.description}
                    onChange={handleInputChange}
                  />
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label>Fecha del evento</label>
                      <SingleDatePicker
                        date={newEventFormData.date}
                        onDateChange={handleDateChange}
                        focused={this.state.datePickerFocused}
                        onFocusChange={({ focused }) =>
                          this.setState({ datePickerFocused: focused })}
                      />
                    </Form.Field>

                    <Form.Dropdown
                      required
                      label="Municipio"
                      placeholder="Municipio"
                      search
                      selection
                      options={dropdownOpts.municipalities}
                      name="municipality"
                      value={newEventFormData.municipality}
                      onChange={handleInputChange}
                    />

                    <Form.Dropdown
                      required
                      label="Actividad"
                      placeholder="Tipo de actividad"
                      search
                      selection
                      options={dropdownOpts.activities}
                      name="activity"
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <h2> Contacto </h2>
                  <Form.Group widths="4">

                    <Form.Input
                      label="Teléfono"
                      name="contactNumber"
                      placeholder="celular o fijo"
                      value={newEventFormData.contactNumber}
                      onChange={handleInputChange}
                    />
                    <Form.Input
                      label="Correo electrónico"
                      name="contactEmail"
                      placeholder="example@dominio.com"
                      value={newEventFormData.contactEmail}
                      onChange={handleInputChange}
                    />
                    <Form.Input
                      label="Link a tu página"
                      name="contactLink"
                      placeholder="http://"
                      value={newEventFormData.contactLink}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Button positive>Crear</Form.Button>
                </Form>
              </Grid.Column>
            </Grid>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default AddEventModal;
