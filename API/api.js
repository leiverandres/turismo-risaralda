const restify = require('restify');

const env = process.env.NODE_ENV || 'development';

const server = restify.createServer({
  name: 'turismoEjecafeteroAPI',
  version: '1.0.0',
});
