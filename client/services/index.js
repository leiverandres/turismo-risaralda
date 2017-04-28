const jwt = require('jwt-simple');
const moment = require('moment');

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

function createToken(user) {
  const payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix(),
  };

  return jwt.encode(payload, config.secret);
}

function decodeToken(token) {
  console.log('token in decode', token);
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.secret);
      console.log('payload', payload);
      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'El token ha expirado',
        });
      }
      resolve(payload.sub);
    } catch (err) {
      reject({
        status: 500,
        message: 'Invalid Token',
      });
    }
  });

  return decoded;
}

function createTokenRoot(rootUser) {
  const payload = {
    sub: rootUser._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix(),
  };

  return jwt.encode(payload, config.secretRoot);
}

function decodeTokenRoot(token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.secretRoot);
      console.log('payload', payload);
      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'El token ha expirado',
        });
      }
      resolve(payload.sub);
    } catch (err) {
      reject({
        status: 500,
        message: 'Invalid Token',
      });
    }
  });

  return decoded;
}

module.exports = {
  createToken,
  decodeToken,
  createTokenRoot,
  decodeTokenRoot,
};
