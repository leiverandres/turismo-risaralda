import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Header,
  Form,
  Container,
  Dropdown,
  Dimmer,
  Loader
} from 'semantic-ui-react';

const genderOpts = [
  { key: 'm', text: 'Masculino', value: 'male' },
  { key: 'f', text: 'Femenino', value: 'female' }
];

const Signup = ({
  handleFieldChange,
  handleCheckboxChange,
  handleDropdownChange,
  handleSubmit,
  formValues,
  dropdownOpts,
  sending,
  fetchingChannels,
  showPassword,
  asAdmin,
  ...rest
}) => {
  return (
    <Container textAlign="center">
      <Dimmer active={sending || fetchingChannels}>
        <Loader active={sending || fetchingChannels} />
      </Dimmer>
      <Header as="h1" textAlign="center" color="blue">
        Registrate
      </Header>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            label="Nombres"
            placeholder="Nombres"
            name="firstName"
            value={formValues.firstName}
            onChange={handleFieldChange}
            required
          />
          <Form.Input
            label="Apellidos"
            placeholder="Apellidos"
            name="lastName"
            value={formValues.lastName}
            onChange={handleFieldChange}
            required
          />
          <Form.Input
            label="Nombre de usuario"
            placeholder="Nombre de usuario"
            name="username"
            value={formValues.username}
            onChange={handleFieldChange}
            required
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label="DNI"
            placeholder="Documento nacional de identidad"
            name="dni"
            value={formValues.dni}
            onChange={handleFieldChange}
            required
          />
          <Form.Input
            label="Correo electrónico"
            placeholder="Correo electrónico"
            name="email"
            value={formValues.email}
            onChange={handleFieldChange}
            type="email"
            required
          />
          <Form.Select
            label="Genero"
            options={genderOpts}
            placeholder="Genero"
            name="gender"
            value={formValues.gender}
            onChange={handleFieldChange}
          />
          <Form.Input
            label="Edad"
            placeholder="Edad"
            name="age"
            value={formValues.age}
            onChange={handleFieldChange}
            type="number"
            min="0"
          />
        </Form.Group>
        <Form.Group inline>
          <Form.Input
            type={showPassword ? '' : 'password'}
            name="password"
            label="Contraseña"
            placeholder="Digita tu contraseña"
            value={formValues.password}
            onChange={handleFieldChange}
            required
          />
          <Form.Checkbox
            name="showPassword"
            onChange={handleCheckboxChange}
            label="Mostrar contraseña"
            checked={showPassword}
          />
        </Form.Group>
        <Form.Group>
          <Form.Dropdown
            label="País"
            search
            selection
            options={dropdownOpts.countryOptions}
            placeholder="Selecciona tu país"
            name="country"
            value={formValues.country}
            onChange={handleDropdownChange}
          />
          <Form.Select
            label="Ciudad"
            search
            selection
            options={dropdownOpts.cityOpts}
            placeholder="Ciudad"
            name="city"
            value={formValues.city}
            onChange={handleDropdownChange}
          />
          <Form.Input
            name="address"
            label="Dirección"
            placeholder="Donde vives?"
            value={formValues.address}
            onChange={handleFieldChange}
          />
          <Form.Input
            name="phoneNumber"
            label="Numero de telefono"
            placeholder="Donde podemos llamarte?"
            value={formValues.phoneNumber}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group inline>
          <Form.Checkbox
            name="asAdmin"
            onChange={handleCheckboxChange}
            label="Solicitar ser administrador"
            checked={asAdmin}
          />
        </Form.Group>
        <div>
          <h1>Suscribirse a:</h1>
          <p>
            * Cuando ingreses como usuario aparecera información sobre los tópicos que elijas aquí
          </p>
          <div className="channel-selector">
            <Dropdown
              fluid
              multiple
              search
              selection
              name="selectedChannelsToSub"
              loading={fetchingChannels}
              options={dropdownOpts.suscriptionOpts}
              placeholder="Selecciona los que quieras"
              onChange={handleDropdownChange}
            />
          </div>
        </div>
        {asAdmin
          ? <div>
              <h1> Para administrar: </h1>
              <p>
                * Los topicos que te gustaria administrar, estan sujetos a la aprovación del administrador de la plataforma
              </p>
              <div className="channel-selector">
                <Dropdown
                  fluid
                  multiple
                  search
                  selection
                  name="selectedChannelsToAdmin"
                  loading={fetchingChannels}
                  options={dropdownOpts.avaibleChannels}
                  placeholder="Selecciona los que quieras"
                  onChange={handleDropdownChange}
                />
              </div>
            </div>
          : null}
        <Form.Button color="green">Crear cuenta</Form.Button>
      </Form>
      <p>¿Ya tienes una cuenta?</p>
      <Link to="/login">Inicia sesion</Link>
    </Container>
  );
};

Signup.propTypes = {
  handleFieldChange: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleDropdownChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  dropdownOpts: PropTypes.object.isRequired,
  sending: PropTypes.bool.isRequired,
  showPassword: PropTypes.bool.isRequired,
  fetchingChannels: PropTypes.bool.isRequired,
  asAdmin: PropTypes.bool.isRequired
};

Signup.defaultProps = {
  asAdmin: false,
  showPassword: false
};

export default Signup;
