const {Router} = require('restify-router');

const authService = require('../helpers/authService');
const User = require('../models/user');
const Root = require('../models/root');

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);
const authRouter = new Router();

module.exports = (app, mountPoint) => {
  authRouter.get(`${mountPoint}/login/`, (req, res) => {
    res.send(200, {
      success: true,
      message: 'Try with a POST to /auth/[loginRoot | adminLogin | userLogin]'
    });
  });

  authRouter.post(`${mountPoint}/rootLogin/`, (req, res) => {
    let rootUsr = null;
    Root.findOne({username: req.body.username})
      .then(root => {
        if (!root) {
          return Promise.resolve(false);
        } else {
          rootUsr = root;
          return root.comparePassword(req.body.password);
        }
      })
      .then(isMatch => {
        if (isMatch) {
          const token = authService.createTokenRoot(rootUsr);
          res.send(200, {
            success: true,
            token: 'JWT ' + token,
            data: rootUsr.username
          });
        } else {
          res.send(401, {
            success: false,
            message: 'Login authentication failed'
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.send(500, {
          success: false,
          message: 'Problem while authenticating'
        });
      });
  });

  authRouter.post(`${mountPoint}/adminLogin`, (req, res) => {
    let adminUser = null;
    User.findOne({
      username: req.body.username,
      'adminPermission.state': 'accepted'
    })
      .then(userFound => {
        if (!userFound) {
          return Promise.resolve(false);
        } else {
          adminUser = userFound;
          return userFound.comparePassword(req.body.password);
        }
      })
      .then(passwordMatch => {
        if (!passwordMatch) {
          res.send(401, {success: false, message: 'Authentication failed'});
        } else {
          const token = authService.createTokenAdmin(adminUser);
          res.send(200, {
            success: true,
            token: `JWT ${token}`,
            data: adminUser.username
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.send(500, {
          success: false,
          message: 'Problem while authenticating'
        });
      });
  });

  authRouter.post(`${mountPoint}/userLogin`, (req, res) => {
    let user = null;
    User.findOne({
      username: req.body.username
    })
      .then(userFound => {
        if (!userFound) {
          return Promise.resolve(false);
        } else {
          user = userFound;
          return userFound.comparePassword(req.body.password);
        }
      })
      .then(passwordMatch => {
        if (!passwordMatch) {
          res.send(401, {success: false, message: 'Authentication failed'});
        } else {
          const token = authService.createTokenUser(user);
          res.send(200, {
            success: true,
            token: `JWT ${token}`,
            data: user.username
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.send(500, {
          success: false,
          message: 'Problem while authenticating'
        });
      });
  });

  authRouter.applyRoutes(app.server);
};
