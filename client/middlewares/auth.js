const services = require('../services');

function isRoot(req, res, next) {
  console.log('Is Auth');
  console.log(req.headers);

  if (!req.headers.authorization) {
    return res.status(403).send({message: 'No tienes autorización'});
  }
  const token = req.headers.authorization.split(' ')[1];

  console.log('token', token);
  services
    .decodeTokenRoot(token)
    .then(response => {
      console.log('after decode res', response);
      req.user = response;
      next();
    })
    .catch(response => {
      res.status(response.status).send(response);
    });
}

function isAuth(req, res, next) {
  console.log('Is Auth');
  console.log(req.headers);

  if (!req.headers.authorization) {
    return res.status(403).send({message: 'No tienes autorización'});
  }
  const token = req.headers.authorization.split(' ')[1];

  console.log('token', token);
  services
    .decodeTokenRoot(token)
    .then(response => {
      console.log('after decode res', response);
      req.user = response;
      next();
    })
    .catch(response => {
      res.status(response.status).send(response);
    });
}

module.exports.isAuth = isAuth;
module.exports.isRoot = isRoot;
