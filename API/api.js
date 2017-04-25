const restify = require('restify');
const mongoose = require('mongoose');
require('colors');

const env = process.env.NODE_ENV || 'development';

const api = {};

api.server = restify.createServer({
  name: 'turismoEjecafeteroAPI',
  version: '1.0.0',
});

api.db = mongoose.createConnection('mongodb://127.0.0.1:27017/turismo');

api.db.on('open', () => {
  console.log('Connected to DB'.yellow);
});
