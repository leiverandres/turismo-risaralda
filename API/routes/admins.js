const {Router} = require('restify-router');

const User = require('../models/user');
const {rootAuth} = require('../helpers/authMiddlewares')

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

const adminRouter = new Router();

module.exports = (app, mountPoint) => {
  adminRouter.get(`${mountPoint}`, rootAuth, (req, res) => {
    const query = {
      'adminPermission.state': 'accepted'
    }
    if (req.params.filter) {
      query['adminPermission.state'] = req.params.filter;
    }
    User.find(query)
      .then(admins => {
        res.send(200, {success: true, message: 'ok', data: admins});
      })
      .catch(err => {
        console.error(err);
        res.send(500, {success: false, message: 'Problem getting admins'});
      });
  });

  adminRouter.applyRoutes(app.server);
};
