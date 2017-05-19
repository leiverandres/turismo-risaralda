const {Router} = require('restify-router');
const Channel = require('../models/channel');
// const jwt = require('jwt-simple');
const config = require('../config/development');
const moment = require('moment');
const channelRouter = new Router();

module.exports = (app, mountPoint) => {
  channelRouter.get(`${mountPoint}`, (req, res) => {
    Channel.find()
      .then(channels => {
        res.send(200, {success: true, data: channels});
      })
      .catch(err => {
        res.send(500, {
          success: false,
          message: 'Error while getting channels'
        });
      });
  });
  //needs admin permission
  // channelRouter.post(`${mountPoint}`, (req, res) => {
  //   res.send(201, {success: true, message: 'channel created'});
  // });
  //
  // channelRouter.put(`${mountPoint}/:id`, (req, res) => {
  //   res.send(200, {success: true, message: 'channel updated'});
  // });
  //
  // channelRouter.del(`${mountPoint}/:id`, (req, res) => {
  //   res.send(201, {success: true, message: 'channel deleted'});
  // });

  channelRouter.applyRoutes(app.server);
};
