const { Router } = require('restify-router');
const moment = require('moment');

const Channel = require('../models/channel');
const config = require('../config/development');
const municipalities = require('../fixtures/municipalities').data;
const activities = require('../fixtures/activities').data;

const channelRouter = new Router();

module.exports = (app, mountPoint) => {
  channelRouter.get(`${mountPoint}`, (req, res) => {
    console.log(req.params);
    const query = {};

    if (req.params.municipality) query.municipality = req.params.municipality;
    if (req.params.activity) query.activity = req.params.activity;
    Channel.find(query)
      .then(channels => {
        res.send(200, { success: true, data: channels });
      })
      .catch(err => {
        res.send(500, {
          success: false,
          message: 'Error while getting channels'
        });
      });
  });

  channelRouter.get(`${mountPoint}/municipalities`, (req, res) => {
    res.send(200, { success: true, data: municipalities });
  });

  channelRouter.get(`${mountPoint}/activities`, (req, res) => {
    res.send(200, { success: true, data: activities });
  });

  channelRouter.applyRoutes(app.server);
};
