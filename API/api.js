const restify = require('restify');
const mongoose = require('mongoose');
const logger = require('morgan');
require('colors');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const adminsRoutes = require('./routes/admins')
const channelsRoutes = require('./routes/channels');

const env = process.env.NODE_ENV || 'development';
const config = require(`./config/${env}`);

const api = {};

api.server = restify.createServer({
  name: 'turismoEjecafeteroAPI',
  version: '1.0.0'
});

api.server.use(logger('dev'));
api.server.use(restify.acceptParser(api.server.acceptable));
api.server.use(restify.queryParser());
api.server.use(restify.bodyParser());

api.db = require('./models/db');

authRoutes(api, '/api/auth');
usersRoutes(api, '/api/users');
adminsRoutes(api, '/api/admins');
channelsRoutes(api, '/api/channels');

module.exports = api;
