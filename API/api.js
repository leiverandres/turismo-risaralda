const restify = require('restify');
const mongoose = require('mongoose');
const corsMiddleware = require('restify-cors-middleware');
const logger = require('morgan');
require('colors');

const env = process.env.NODE_ENV || 'development';
const config = require(`./config/${env}`);

const api = {};

api.server = restify.createServer({
  name: 'turismoEjecafeteroAPI',
  version: '1.0.0'
});

const cors = corsMiddleware({
  origins: ['http://localhost:3000'],
  allowHeaders: [
    'Access-Control-Allow-Credentials',
    'Access-Control-Allow-Methods',
    'Access-Control-Expose-Headers',
    'Access-Control-Allow-Origin',
    'Content-Type',
    'accept',
    'authorization'
  ]
});

api.server.use(logger('dev'));
api.server.use(restify.acceptParser(api.server.acceptable));
api.server.use(restify.authorizationParser());
api.server.use(restify.queryParser());
api.server.use(restify.bodyParser());
api.server.pre(cors.preflight);
api.server.pre(cors.actual);

api.db = require('./models/db');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const adminsRoutes = require('./routes/admins');
const channelsRoutes = require('./routes/channels');
const eventsRoutes = require('./routes/events');

authRoutes(api, '/api/auth');
usersRoutes(api, '/api/users');
adminsRoutes(api, '/api/admins');
channelsRoutes(api, '/api/channels');
eventsRoutes(api, '/api/events');

module.exports = api;
