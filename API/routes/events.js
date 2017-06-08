const { Router } = require('restify-router');

const Event = require('../models/event');
const User = require('../models/user');
const { adminAuth } = require('../helpers/authMiddlewares');

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

const eventRouter = new Router();

const checkAdminChannel = (req, res, next) => {
  console.log(req.tokenPayload);
  User.findById(req.tokenPayload.sub)
    .then(user => {
      const acceptedChannels = user.adminPermission.acceptedChannels;
      if (acceptedChannels.indexOf(req.body.channel) === -1) {
        res.send(401, {
          succes: false,
          message: 'This user has no permission for this topic'
        });
      }
      next();
    })
    .catch(err => {
      console.log('Error:', err);
      res.send(500, {
        succes: false,
        message: 'Internal problems getting user'
      });
    });
};

module.exports = (app, mountPoint) => {
  eventRouter.get(mountPoint, (req, res) => {
    Event.find()
      .populate('channel')
      .then(events => {
        res.send(200, { succes: true, message: 'ok', data: events });
      })
      .catch(err => {
        res.send(500, { succes: false, message: 'Unable to retrieve events' });
      });
  });
  // TODO: make just admin of certain topic post its events
  eventRouter.post(mountPoint, adminAuth, checkAdminChannel, (req, res) => {
    Event.create(req.body)
      .then(eventCreated => {
        console.log(eventCreated);
        res.send(201, {
          succes: true,
          message: 'Event created',
          data: eventCreated
        });
      })
      .catch(err => {
        res.send(500, { succes: false, message: 'Unable to create new event' });
      });
  });

  eventRouter.put(`${mountPoint}/:id`, adminAuth, (req, res) => {
    Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedEvent => {
        res.send(200, {
          succes: true,
          message: 'Event updated',
          data: updatedEvent
        });
      })
      .catch(err => {
        res.send(500, {
          succes: false,
          message: 'Unable to update the event specified'
        });
      });
  });

  eventRouter.del(`${mountPoint}/:id`, adminAuth, (req, res) => {
    Event.remove({ _id: req.params.id })
      .then(removedEvent => {
        res.send(204);
      })
      .catch(err => {
        res.send(500, { succes: false, message: 'Unable to remove event' });
      });
  });

  eventRouter.applyRoutes(app.server);
};
