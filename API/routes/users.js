const {Router} = require('restify-router');
const moment = require('moment');

const User = require('../models/user');
const {userAuth, rootAuth} = require('../helpers/authMiddlewares');

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

// TODO: protect get with admin jwt

module.exports = (app, mountPoint) => {
  userRouter.get(`${mountPoint}`, (req, res) => {
    User.find()
      .select('-adminPermission')
      .then(users => {
        console.log('Users', users);
        res.send(200, {success: true, message: 'ok', data: users});
      })
      .catch(err => {
        console.error(err);
        res.send(500, {success: false, message: 'Problem getting users'});
      });
  });

  userRouter.post(`${mountPoint}`, (req, res) => {
    const body = req.body;
    if (!body) {
      res.send(403, {success: false, message: 'Body empty'});
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
        res.send(201, {success: true, message: 'User created', data: newUser});
      })
      .catch(err => {
        console.log('Error: ', err);
        res.send(500, {success: false, message: 'Internal error'});
      });
  });

  userRouter.put(`${mountPoint}/:id`, userAuth, (req, res) => {
    if (!req.body) {
      res.send(403, {success: false, message: 'Body empty'});
    } else if (badBody(req.body)) {
      res.send(403, {
        success: false,
        message: 'Unauthorized type of body for you user'
      });
    }

    User.findOneAndUpdate({_id: req.tokenPayload.sub}, req.body, {new: true})
      .select('-adminPermission')
      .then(userUpdated => {
        res.send(200, {success: true, data: userUpdated});
      })
      .catch(err => {
        res.send(500, {success: false, message: 'Problem updating user'});
      });
  });

  userRouter.del(`${mountPoint}/:id`, userAuth, (req, res) => {
    res.send(201, {success: true, message: 'User deleted'});
    User.remove({_id: req.tokenPayload.sub})
      .then(() => {
        res.send(204);
      })
      .catch(err => {
        console.error('Error removing user', err);
        res.send(500, {success: false, message: 'Problem removing user'});
      });
  });

  userRouter.post(`${mountPoint}/:id/convertInAdmin`, rootAuth, (req, res) => {
    let newData = {
      adminPermission: {
        status: 'accepted',
        pendingChannels: [],
        acceptedChannels: req.body.acceptedChannels
      }
    };
    User.findOneAndUpdate({_id: req.tokenPayload.sub}, newData)
      .then(admin => {
        res.send(200, {success: true, data: admin});
      })
      .catch(err => {
        console.error('Error converting user into admin', err);
        res.send(500, {
          success: false,
          message: 'Problem executing transaction'
        });
      });
  });

  userRouter.applyRoutes(app.server);
};
