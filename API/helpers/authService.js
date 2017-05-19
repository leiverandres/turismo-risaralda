const jwt = require('jsonwebtoken');
const moment = require('moment');

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

const invalidResp = {
  status: 500,
  message: 'Invalid Token'
};

const expResp = {
  status: 401,
  message: 'Token expired'
};

function composeToken(customParams, secret) {
  let base = {
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  const payload = Object.assign(base, customParams);
  return jwt.sign(payload, secret);
}

function createTokenUser(user) {
  return composeToken({sub: user._id, userType: 'user'}, config.usrSecret);
}

function createTokenRoot(rootUser) {
  return composeToken({sub: rootUser._id, userType: 'root'}, config.rootSecret);
}

function createTokenAdmin(adminUser) {
  return composeToken(
    {sub: adminUser._id, userType: 'admin'},
    config.adminSecret
  );
}

function checkToken(token, secret) {
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.verify(token, secret);
      if (payload.exp <= moment().unix()) {
        reject(expResp);
      }
      resolve(payload);
    } catch (err) {
      reject(invalidResp);
    }
  });

  return decoded;
}

function decodeTokenUser(token) {
  return checkToken(token, config.usrSecret);
}

function decodeTokenRoot(token) {
  return checkToken(token, config.rootSecret);
}

function decodeTokenAdmin(token) {
  return checkToken(token, config.adminSecret);
}

module.exports = {
  createTokenUser,
  decodeTokenUser,
  createTokenRoot,
  decodeTokenRoot,
  createTokenAdmin,
  decodeTokenAdmin
};
