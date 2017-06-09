import jwtDecode from 'jwt-decode';
import axios from 'axios';

const apiBaseURI = 'http://localhost:8080';

function getToken() {
  return window.localStorage.getItem('token');
}

function getUserType() {
  const token = getToken();
  const userType = jwtDecode(token).userType;
  return userType;
}

function getUsername() {
  const token = getToken();
  const userType = jwtDecode(token).username;
  return userType;
}

function login(credentials, userType) {
  return axios
    .post(`${apiBaseURI}/api/auth/${userType}Login`, credentials, {
      'Content-Type': 'application/json'
    })
    .then(resp => {
      if (resp.status === 200) {
        return resp.data;
      } else {
        Promise.reject(new Error(resp.statusText));
      }
    })
    .then(json => {
      window.localStorage.setItem('token', json.token);
    });
}

function logout() {
  window.localStorage.removeItem('token');
}

function isLoggedIn() {
  let token = getToken();
  return token !== null;
}

function userTypeLogged() {
  if (isLoggedIn()) {
    const token = getToken();
    const decoded = jwtDecode(token);
    return decoded.userType;
  }
  return null;
}

export default {
  login,
  logout,
  isLoggedIn,
  getToken,
  getUserType,
  getUsername,
  userTypeLogged
};
