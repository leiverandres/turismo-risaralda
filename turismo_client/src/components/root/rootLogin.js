import React, { Component } from 'react';
import { Button, Form, Message, Container, Header } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import Auth from '../../utils/auth';

export default class RootLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginInProgress: false,
      shoudlRedirect: false,
      error: false,
      errorMessage: '',
      username: '',
      password: ''
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.sendLogin = this.sendLogin.bind(this);
  }

  onInputChange({ target: { name, value } }) {
    this.setState(prevState => {
      let newState = {};
      newState[name] = value;
      return newState;
    });
  }

  sendLogin(event) {
    event.preventDefault();
    this.setState({ loginInProgress: true });
    let credentials = {
      username: this.state.username,
      password: this.state.password
    };
    Auth.login(credentials, 'root')
      .then(res => {
        this.setState({ loginInProgress: false, shoudlRedirect: true });
      })
      .catch(err => {
        this.setState({
          loginInProgress: false,
          error: true,
          errorMessage: 'Tu username o constraseña son incorrectos'
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

  render() {
    if (this.state.shoudlRedirect || Auth.isLoggedIn()) {
      return <Redirect to="/" />;
    } else {
      return (
        <Container text>
          <Header textAlign="center"> Bienvenido usuario root </Header>
          <Form onSubmit={this.sendLogin} loading={this.state.loginInProgress}>
            {this.state.error
              ? <Message negative>
                  <Message.Header>Algo salio mal</Message.Header>
                  <p>{this.state.errorMessage}</p>
                </Message>
              : null}
            <Form.Field>
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.onInputChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={this.state.password}
                onChange={this.onInputChange}
              />
            </Form.Field>
            <Button type="submit">Submit</Button>
          </Form>
        </Container>
      );
    }
  }
}
