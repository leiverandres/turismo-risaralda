import React, { Component } from 'react';
import countryCities from 'country-city';
import { Redirect } from 'react-router-dom';

import { countryOptions } from '../utils/countries';
import Auth from '../utils/auth';
import requests from '../utils/requests';
import SignupForm from '../components/signup/signupForm';

class SignupContainer extends Component {
  state = {
    form: {
      firstName: '',
      lastName: '',
      dni: '',
      username: '',
      email: '',
      password: '',
      gender: '',
      age: '',
      address: '',
      country: '',
      city: '',
      phoneNumber: '',
      selectedChannelsToSus: [],
      selectedChannelsToAdmin: []
    },
    sendingSignup: false,
    asAdmin: false,
    shoudlRedirect: false,
    fetchingChannels: false,
    showPassword: false,
    suscriptionOpts: [],
    avaibleChannels: [],
    cityOpts: []
  };

  componentDidMount() {
    this.fetchChannels();
  }

  fetchChannels = () => {
    this.setState({ fetchingChannels: true });
    requests
      .getChannels()
      .then(channels => {
        const suscriptionOpts = channels.data.map(ch => {
          let name = `${ch.municipality}-${ch.activity}`;

          const channelObj = {
            key: ch._id,
            text: name,
            value: ch._id
          };
          return channelObj;
        });

        const avaibleChannels = channels.data
          .filter(ch => !ch.assigned)
          .map(ch => {
            return {
              key: ch._id,
              text: `${ch.municipality}-${ch.activity}`,
              value: ch._id
            };
          });

        this.setState({
          fetchingChannels: false,
          suscriptionOpts: suscriptionOpts,
          avaibleChannels: avaibleChannels
        });
      })
      .catch(err => {
        console.log('Error:', err);
        this.setState({ fetchingChannels: false });
      });
  };

  handleFieldChange = (e, { name, value }) => {
    this.setState(prevState => {
      prevState.form[name] = value;
      return prevState;
    });
  };

  handleCheckboxChange = (ev, { checked, name }) => {
    this.setState({ [name]: checked });
  };

  handleDropdownChange = (ev, { name, value }) => {
    this.setState(prevState => {
      prevState.form[name] = value;
      return prevState;
    });

    if (name === 'country') {
      const curCities = countryCities.getCities(value).map(c => {
        return { key: c, text: c, value: c };
      });
      this.setState({ cityOpts: curCities });
    }
  };

  constructCorrectBoby(formData) {
    const body = {
      dni: formData.dni,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      address: formData.address || null,
      phoneNumber: formData.phoneNumber || null,
      country: formData.country || null,
      city: formData.city || null,
      age: formData.age || null,
      gender: formData.gender || 'male',
      suscribedChannels: formData.selectedChannelsToSub
    };

    if (this.state.asAdmin) {
      body.adminPermission = {};
      body.adminPermission['state'] = 'pending';
      body.adminPermission['pendingChannels'] =
        formData.selectedChannelsToAdmin;
    }

    return body;
  }

  handleSubmit = ev => {
    ev.preventDefault();
    this.setState({
      sendingSignup: true
    });
    const body = this.constructCorrectBoby(this.state.form);
    requests
      .createUser(body)
      .then(res => {
        this.setState({ sendingSignup: false, shoudlRedirect: true });
      })
      .catch(err => {
        console.log(err);
        this.setState({ sendingSignup: false });
      });
  };

  render() {
    if (this.state.shoudlRedirect || Auth.isLoggedIn()) {
      return <Redirect to="/" />;
    } else {
      const dropdownOpts = {
        countryOptions: countryOptions,
        cityOpts: this.state.cityOpts,
        suscriptionOpts: this.state.suscriptionOpts,
        avaibleChannels: this.state.avaibleChannels
      };
      return (
        <SignupForm
          handleFieldChange={this.handleFieldChange}
          handleCheckboxChange={this.handleCheckboxChange}
          handleDropdownChange={this.handleDropdownChange}
          handleSubmit={this.handleSubmit}
          formValues={this.state.form}
          sending={this.state.sendingSignup}
          showPassword={this.state.showPassword}
          fetchingChannels={this.state.fetchingChannels}
          asAdmin={this.state.asAdmin}
          dropdownOpts={dropdownOpts}
        />
      );
    }
  }
}

export default SignupContainer;
