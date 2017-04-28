const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const config = require('../config/development');
const moment = require('moment');
const userRouter = express.Router();

userRouter.get(`/`, (req, res) => {
  User.find()
    .then(users => {
      console.log('Users', users);
      res.status(200).send({success: true, message: 'ok', data: users});
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({success: false, message: 'Problem getting users'});
    });
});
//needs admin permission
userRouter.post(`/`, (req, res) => {
  if (!req.body) {
    res.status(403).send({success: false, message: 'Body empty'});
  }

  User.findOne({
    email: req.body.email,
  })
    .then(user => {
      if (user) {
        res.status(409).send({
          success: false,
          message: `There is already a User with same email `,
          data: user,
        });
      } else {
        let newUser = new User(req.body);
        return newUser.save();
      }
    })
    .then(newUser => {
      res
        .status(201)
        .send({success: true, message: 'User created', data: newUser});
    })
    .catch(err => {
      console.log('Error getting user from db', err);
      res.status(500).send({success: false, message: 'Internal error'});
    });
});

userRouter.put(`/:id`, auth.isRoot, (req, res) => {
  User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
    .then(userUpdated => {
      if (userUpdated) res.send(200, {success: true, data: userUpdated});
    })
    .catch(err => {
      res.send(500, {success: false, message: 'Problem updating user'});
    });
});

// userRouter.delete(`/:username`, auth, (req, res) => {
//   res.send(201, {success: true, message: 'User deleted'});
// });

module.exports = userRouter;
