const restify = require('restify');
const mongoose = require('mongoose');
const logger = require('morgan');
require('colors');

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 8080;
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

const usersRoutes = require('./routes/users');
const channelsRoutes = require('./routes/channels');

api.db = require('./models/db');

usersRoutes(api, '/api/users');
channelsRoutes(api, '/api/channels');

module.exports = api;
