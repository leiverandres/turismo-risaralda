const {
  decodeTokenUser,
  decodeTokenRoot,
  decodeTokenAdmin
} = require('./authService');

function userAuth(req, res, next) {
  const authorization = req.headers['authorization'];
  if (authorization) {
    const token = authorization.split(' ')[1];
    decodeTokenUser(token)
      .then(payload => {
        req.tokenPayload = payload;

        next();
      })
      .catch(err => {
        res.send(err.status, {success: false, message: err.message});
      });
  } else {
    return res.send(403, {
      success: false,
      message: 'No token provided.'
    });
  }
}

function rootAuth(req, res, next) {
  console.log('headers: ', req.headers);
  console.log(req.authorization);
  const authorization = req.headers['authorization'];
  if (authorization) {
    const token = authorization.split(' ')[1];
    decodeTokenRoot(token)
      .then(payload => {
        req.tokenPayload = payload;

        next();
      })
      .catch(err => {
        res.send(err.status, {success: false, message: err.message});
      });
  } else {
    return res.send(403, {
      success: false,
      message: 'No token provided.'
    });
  }
}

function adminAuth(req, res, next) {
  const authorization = req.headers['authorization'];
  if (authorization) {
    const token = authorization.split(' ')[1];
    decodeTokenAdmin(token)
      .then(payload => {
        req.tokenPayload = payload;

        next();
      })
      .catch(err => {
        res.send(err.status, {success: false, message: err.message});
      });
  } else {
    return res.send(403, {
      success: false,
      message: 'No token provided.'
    });
  }
}

module.exports = {
  userAuth,
  adminAuth,
  rootAuth
};
