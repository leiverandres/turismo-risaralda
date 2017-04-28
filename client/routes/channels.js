const express = require('express');
const Channel = require('../models/channel');
const config = require('../config/development');
const moment = require('moment');
const channelRouter = express.Router();

channelRouter.get(`/`, (req, res) => {
  Channel.find()
    .then(channels => {
      res.send(200, {success: true, data: channels});
    })
    .catch(err => {
      res.send(500, {
        success: false,
        message: 'Error while getting channels',
      });
    });
});
//needs admin permission
// channelRouter.post(`/`, (req, res) => {
//   res.send(201, {success: true, message: 'User created'});
// });
//
// channelRouter.put(`/:id`, (req, res) => {
//   res.send(200, {success: true, message: 'User updated'});
// });
//
// channelRouter.del(`/:id`, (req, res) => {
//   res.send(201, {success: true, message: 'User deleted'});
// });
