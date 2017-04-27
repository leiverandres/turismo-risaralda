#!/usr/bin/env node
const os = require('os');
const app = require('../api');
const debug = require('debug')('Turismo-Ejecafetero:server');

let {server} = app;
const port = process.env.PORT || '8080';

server.listen(port, err => {
  if (err) throw err;
  console.log('Starting server\nAvailable on:'.yellow);
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(dev => {
    ifaces[dev].forEach(details => {
      if (details.family === 'IPv4') {
        console.log(` http://${details.address}:${port}`.green);
      }
    });
  });
});

server.on('error', onError);

process.on('SIGINT', function() {
  console.log('\nShutdown the server, bye (:'.yellow);
  app.db.close();
  process.exit();
});

/*
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
