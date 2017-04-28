const mongoose = require('mongoose');
const initData = require('./dbUtils').initData;
require('colors');

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log(`DB connection open to ${config.database}`.yellow);
  initData();
});

mongoose.connection.on('error', function(err) {
  console.log(`Mongoose default connection error: ${err}`.red);
});

mongoose.connection.on('disconnected', function() {
  console.log(`DB disconnected`.yellow);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log(
      'Mongoose default connection disconnected through app termination'.yellow
    );
    process.exit(0);
  });
});

require('./user');
require('./channel');
module.exports = mongoose.connection;
