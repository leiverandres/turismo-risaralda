import axios from 'axios';

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

export default {
  getChannels,
  createUser,
  getPendingUsers,
  getAllAdmins,
  applyPermissions
};
