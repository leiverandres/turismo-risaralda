const { Router } = require('restify-router');

const User = require('../models/user');
const Event = require('../models/event');
const { rootAuth, adminAuth } = require('../helpers/authMiddlewares');

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

const adminRouter = new Router();

module.exports = (app, mountPoint) => {
  adminRouter.get(`${mountPoint}`, rootAuth, (req, res) => {
    const query = {
      'adminPermission.state': 'accepted'
    };
    if (req.params.filter) {
      query['adminPermission.state'] = req.params.filter;
    }
    User.find(query)
      .populate([
        'adminPermission.pendingChannels',
        'adminPermission.acceptedChannels'
      ])
      .then(admins => {
        res.send(200, { success: true, message: 'ok', data: admins });
      })
      .catch(err => {
        console.error(err);
        res.send(500, { success: false, message: 'Problem getting admins' });
      });
  });

  adminRouter.get(`${mountPoint}/:id/activities`, adminAuth, (req, res) => {
    User.findById(req.params.id)
      .populate('adminPermission.acceptedChannels')
      .then(user => {
        console.log(user.adminPermission.acceptedChannels);
        const activities = [];
        for (let ch of user.adminPermission.acceptedChannels) {
          if (activities.indexOf(ch.activity) === -1) {
            activities.push(ch.activity);
          }
        }

        res.send(200, {
          success: true,
          message: "User's activities ",
          data: activities
        });
      })
      .catch(err => {
        console.log('Error:', err);
        res.send(500, {
          success: false,
          message: 'Unable to get the admin activities'
        });
      });
  });

  adminRouter.get(`${mountPoint}/:id/municipalities`, adminAuth, (req, res) => {
    User.findById(req.params.id)
      .populate('adminPermission.acceptedChannels')
      .then(user => {
        console.log(user.adminPermission.acceptedChannels);
        const municipalities = [];
        for (let ch of user.adminPermission.acceptedChannels) {
          console.log(
            ch.municipality,
            'is not in municipalities',
            !(ch.municipality in municipalities)
          );
          if (municipalities.indexOf(ch.municipality) === -1) {
            municipalities.push(ch.municipality);
          }
        }

        res.send(200, {
          success: true,
          message: "User's municipalities ",
          data: municipalities
        });
      })
      .catch(err => {
        console.log('Error:', err);
        res.send(500, {
          success: false,
          message: 'Unable to get the admin municipalities'
        });
      });
  });

  adminRouter.get(`${mountPoint}/:id/events`, adminAuth, (req, res) => {
    User.findById(req.params.id)
      .then(user => {
        Event.find({
          channel: {
            $in: user.adminPermission.acceptedChannels
          }
        })
          .populate('channel')
          .then(events => {
            res.send(200, {
              success: true,
              message: 'Events created for admin',
              data: events
            });
          })
          .catch(err => {
            Promise.reject(err);
          });
      })
      .catch(err => {
        res.send(500, {
          success: false,
          message: 'Unable to get the admin events'
        });
      });
  });

  adminRouter.applyRoutes(app.server);
};
