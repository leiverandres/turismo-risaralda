var express = require('express');
const User = require('../models/user');
const Root = require('../models/root');
const jwt = require('jwt-simple');
const services = require('../services');
const moment = require('moment');
const authRouter = express.Router();

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

authRouter.get(`/login`, (req, res) => {
  res.send(200, {
    success: true,
    message: 'Are you kidding?, try with a POST',
  });
});

authRouter.post(`/loginRoot`, (req, res) => {
  let usr = null;
  Root.findOne({username: req.body.username})
    .then(root => {
      if (!root) {
        return Promise.resolve(false);
      } else {
        usr = root;
        return root.comparePassword(req.body.password);
      }
    })
    .then(isMatch => {
      if (isMatch) {
        const token = services.createTokenRoot(usr);
        res.status(201).send({
          success: true,
          token: 'JWT ' + token,
          data: usr.username,
        });
      } else {
        res.status(401).send({
          success: false,
          message: 'Login authentication failed',
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(5000).send({success: false, message: 'Server problem'});
    });
});

authRouter.post(`/login`, (req, res) => {
  let usr = null;
  console.log(req.body);
  User.findOne({username: req.body.username})
    .then(user => {
      if (!user) {
        return Promise.resolve(false);
      } else {
        usr = user;
        return user.comparePassword(req.body.password);
      }
    })
    .then(isMatch => {
      if (isMatch) {
        const token = services.createToken(usr);
        res.status(200).send({
          success: true,
          token: 'JWT ' + token,
          data: usr.username,
        });
      } else {
        res.status(401).send({
          success: false,
          message: 'Login authentication failed',
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({success: false, message: 'Server problem'});
    });
});

module.exports = authRouter;
