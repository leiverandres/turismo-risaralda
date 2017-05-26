import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Checkbox, Form, Header, Message } from 'semantic-ui-react';

import Auth from '../utils/auth';

class Login extends Component {
  state = {
    loginInProgress: false,
    shoudlRedirect: false,
    username: '',
    password: '',
    asAdmin: false,
    error: false,
    errorMessage: ''
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      loginInProgress: true
    });

    let credentials = {
      username: this.state.username,
      password: this.state.password
    };
    let user = this.state.asAdmin ? 'admin' : 'user';

    Auth.login(credentials, user)
      .then(() => {
        this.setState({
          loginInProgress: false,
          shoudlRedirect: true
        });
      })
      .catch(err => {
        this.setState({
          loginInProgress: false,
          error: true,
          errorMessage: 'Tu contraseña o username no son correctos'
        });
        this.resetFields();
      });
  }

  resetFields() {
    this.setState({
      username: '',
      password: ''
    });
  }

  handleUsernameChange(event) {
    let value = event.target.value;
    this.setState({ username: value });
  }

  handlePasswordChange(event) {
    let value = event.target.value;
    this.setState({ password: value });
  }

  handleCheckChange(event) {
    this.setState({ admin: !this.state.admin });
  }

  render() {
    if (this.state.shoudlRedirect || Auth.isLoggedIn()) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="login-form">
          <Header size="huge" textAlign="center">Iniciar sesión</Header>
          {this.state.error &&
            <Message negative>
              <Message.Header>
                Error iniciando sesión
              </Message.Header>
              <p>{this.state.errorMessage}</p>
            </Message>}
          <Form
            onSubmit={this.handleSubmit}
            loading={this.state.loginInProgress}
          >
            <Form.Field>
              <label>Username</label>
              <input
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />

            </Form.Field>
            <Form.Field>
              <label>Contraseña</label>
              <input
                placeholder="Contraseña"
                type="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                label="Iniciar sesión como administrador"
                checked={this.state.admin}
                onChange={this.handleCheckChange}
              />
            </Form.Field>
            <Button type="submit">Enviar</Button>
          </Form>
        </div>
      );
    }
  }
}

export default Login;
