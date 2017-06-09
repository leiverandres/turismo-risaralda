const { Router } = require('restify-router');
const moment = require('moment');

const User = require('../models/user');
const Channel = require('../models/channel');
const Event = require('../models/event');
const { userAuth, rootAuth } = require('../helpers/authMiddlewares');
const mailer = require('../helpers/emailUtils');

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

const userRouter = new Router();

// TODO: fix this
// function badBody(body) {
//   if (body.adminPermission) {
//     if (
//       !body.adminPermission.status &&
//       !body.adminPermission.acceptedChannels
//     ) {
//       return false;
//     }
//   } else {
//     return false;
//   }
//
//   return true;
// }

module.exports = (app, mountPoint) => {
  userRouter.get(`${mountPoint}`, (req, res) => {
    User.find()
      .populate('suscribedChannels')
      .select('-adminPermission')
      .then(users => {
        console.log('Users', users);
        res.send(200, { success: true, message: 'ok', data: users });
      })
      .catch(err => {
        console.error(err);
        res.send(500, { success: false, message: 'Problem getting users' });
      });
  });

  userRouter.get(`${mountPoint}/:id/events`, userAuth, (req, res) => {
    User.findById(req.params.id)
      .then(user => {
        Event.find({
          channel: {
            $in: user.suscribedChannels
          }
        })
          .populate('channel')
          .then(events => {
            res.send(200, { success: 200, message: 'ok', data: events });
          })
          .catch(err => {
            Promise.reject(err);
          });
      })
      .catch(err => {
        res.send(500, { success: false, message: 'Internal problem' });
      });
  });

  userRouter.post(`${mountPoint}`, (req, res) => {
    const body = req.body;
    if (!body) {
      res.send(403, { success: false, message: 'Body empty' });
    }

    User.findOne({
      username: req.body.username
    })
      .then(user => {
        if (user) {
          res.send(409, {
            success: false,
            message: `There is already a User with same email `,
            data: user
          });
        } else {
          let newUser = new User(req.body);
          return newUser.save();
        }
      })
      .then(newUser => {
        res.send(201, {
          success: true,
          message: 'User created',
          data: newUser
        });
      })
      .catch(err => {
        console.log('Error: ', err);
        res.send(500, { success: false, message: 'Internal error' });
      });
  });

  userRouter.put(`${mountPoint}/:id`, userAuth, (req, res) => {
    if (!req.body) {
      res.send(403, { success: false, message: 'Body empty' });
    } else if (badBody(req.body)) {
      res.send(403, {
        success: false,
        message: 'Unauthorized type of body for you user'
      });
    }

    User.findOneAndUpdate({ _id: req.tokenPayload.sub }, req.body, {
      new: true
    })
      .select('-adminPermission')
      .then(userUpdated => {
        res.send(200, { success: true, data: userUpdated });
      })
      .catch(err => {
        res.send(500, { success: false, message: 'Problem updating user' });
      });
  });

  userRouter.del(`${mountPoint}/:id`, userAuth, (req, res) => {
    res.send(201, { success: true, message: 'User deleted' });
    User.remove({ _id: req.tokenPayload.sub })
      .then(() => {
        res.send(204);
      })
      .catch(err => {
        console.error('Error removing user', err);
        res.send(500, { success: false, message: 'Problem removing user' });
      });
  });

  userRouter.post(`${mountPoint}/:id/convertInAdmin`, rootAuth, (req, res) => {
    console.log('applying', req.body.acceptedChannels);
    let newData = {
      adminPermission: {
        state: 'accepted',
        pendingChannels: [],
        acceptedChannels: req.body.acceptedChannels || []
      }
    };
    User.findOneAndUpdate({ _id: req.params.id }, newData, { new: true })
      .populate('adminPermission.acceptedChannels')
      .then(admin => {
        Channel.update(
          { _id: { $in: req.body.acceptedChannels } },
          { assigned: true },
          { multi: true }
        );
        return admin;
      })
      .then(admin => {
        mailer.notifyPermissions(admin, (err, info) => {
          console.log('Notifying permissions');
          if (err) {
            console.log(err);
          } else {
            console.log('Message sent: ' + info.response);
          }
        });
        return admin;
      })
      .then(admin => {
        res.send(200, { success: true, data: admin });
      })
      .catch(err => {
        console.error('Error converting user into admin', err);
        res.send(500, {
          success: false,
          message: 'Problem executing transaction'
        });
      });
  });

  userRouter.get(`${mountPoint}/:id/activities`, userAuth, (req, res) => {
    User.findById(req.params.id)
      .populate('suscribedChannels')
      .then(user => {
        const activities = [];
        for (let ch of user.suscribedChannels) {
          if (activities.indexOf(ch.activity) === -1) {
            activities.push(ch.activity);
          }
        }

        res.send(200, {
          success: true,
          message: "User's activities",
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

  userRouter.get(`${mountPoint}/:id/municipalities`, userAuth, (req, res) => {
    User.findById(req.params.id)
      .populate('suscribedChannels')
      .then(user => {
        const municipalities = [];
        for (let ch of user.suscribedChannels) {
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

  userRouter.applyRoutes(app.server);
};
