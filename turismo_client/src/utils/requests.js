import axios from 'axios';

import Auth from './auth';

const apiBaseURI = 'http://localhost:8080';

function getChannels() {
  return axios.get(`${apiBaseURI}/api/channels`).then(resp => {
    if (resp.status >= 200 && resp.status < 300) {
      return resp.data;
    } else {
      throw new Error(resp.statusText);
    }
  });
}

function createUser(body) {
  return axios.post(`${apiBaseURI}/api/users`, body).then(resp => {
    console.log(resp);
    if (resp.status >= 200 && resp.status < 300) {
      return resp.data;
    } else {
      throw new Error(resp.statusText);
    }
  });
}

function getPendingUsers() {
  const token = Auth.getToken();
  console.log('Token: ', token);
  var config = {
    headers: {
      Authorization: token
    }
  };
  return axios
    .get(`${apiBaseURI}/api/admins?filter=pending`, config)
    .then(resp => {
      console.log(resp);
      if (resp.status >= 200 && resp.status < 300) {
        return resp.data;
      } else {
        throw new Error(resp.statusText);
      }
    });
}

export default {
  getChannels,
  createUser,
  getPendingUsers
};
