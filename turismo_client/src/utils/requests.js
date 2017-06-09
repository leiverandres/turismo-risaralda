import axios from 'axios';
import jwtDecode from 'jwt-decode';

import Auth from './auth';

const apiBaseURI = 'http://localhost:8080';

function checkStatusCode(resp) {
  if (resp.status >= 200 && resp.status < 300) {
    return resp.data;
  } else {
    throw new Error(resp.statusText);
  }
}

function getChannels() {
  return axios.get(`${apiBaseURI}/api/channels`).then(checkStatusCode);
}

function createUser(body) {
  return axios.post(`${apiBaseURI}/api/users`, body).then(checkStatusCode);
}

function getPendingUsers() {
  const token = Auth.getToken();
  var config = {
    headers: {
      Authorization: token
    }
  };
  return axios
    .get(`${apiBaseURI}/api/admins?filter=pending`, config)
    .then(checkStatusCode);
}

function applyPermissions(userId, body) {
  const token = Auth.getToken();
  var config = {
    headers: {
      Authorization: token
    }
  };
  return axios
    .post(`${apiBaseURI}/api/users/${userId}/convertInAdmin`, body, config)
    .then(checkStatusCode);
}

function getAllAdmins() {
  const token = Auth.getToken();
  var config = {
    headers: {
      Authorization: token
    }
  };
  return axios.get(`${apiBaseURI}/api/admins`, config).then(checkStatusCode);
}

function getEvents() {
  const token = Auth.getToken();
  const adminId = jwtDecode(token).sub;
  const config = {
    headers: {
      Authorization: token
    }
  };
  return axios
    .get(`${apiBaseURI}/api/admins/${adminId}/events`, config)
    .then(checkStatusCode);
}

function createEvent(body) {
  console.log('creating event', body);
  const token = Auth.getToken();
  var config = {
    headers: {
      Authorization: token
    }
  };
  return axios
    .post(`${apiBaseURI}/api/events`, body, config)
    .then(checkStatusCode);
}

function updateEvent(body) {
  console.log('updating event', body);
  const token = Auth.getToken();
  const eventId = body.eventId;
  delete body.eventId;

  var config = {
    headers: {
      Authorization: token
    }
  };
  return axios
    .put(`${apiBaseURI}/api/events/${eventId}`, body, config)
    .then(checkStatusCode);
}

function findChannel(body) {
  console.log('finding channel', body);
  const params = `municipality=${body.municipality}&activity=${body.activity}`;
  return axios
    .get(`${apiBaseURI}/api/channels?${params}`)
    .then(checkStatusCode)
    .then(channels => {
      if (channels) {
        body.channel = channels.data[0]._id;
        console.log('channel found', body);
        return Promise.resolve(body);
      } else {
        return Promise.reject('No valid params to get the channel');
      }
    });
}

const getMunicipalities = () => {
  const token = Auth.getToken();
  const adminId = jwtDecode(token).sub;
  const config = {
    headers: {
      Authorization: token
    }
  };
  return axios
    .get(`${apiBaseURI}/api/admins/${adminId}/municipalities`, config)
    .then(checkStatusCode);
};

const getActivities = () => {
  const token = Auth.getToken();
  const adminId = jwtDecode(token).sub;
  const config = {
    headers: {
      Authorization: token
    }
  };
  return axios
    .get(`${apiBaseURI}/api/admins/${adminId}/activities`, config)
    .then(checkStatusCode);
};

const getUserEvents = () => {
  const token = Auth.getToken();
  const userId = jwtDecode(token).sub;
  const config = {
    headers: {
      Authorization: token
    }
  };
  return axios
    .get(`${apiBaseURI}/api/users/${userId}/events`, config)
    .then(checkStatusCode);
};

export default {
  getChannels,
  createUser,
  getPendingUsers,
  getAllAdmins,
  applyPermissions,
  findChannel,
  getEvents,
  createEvent,
  getMunicipalities,
  getActivities,
  getUserEvents,
  updateEvent
};
