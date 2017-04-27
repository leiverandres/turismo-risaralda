const mongoose = require('mongoose');
const Channel = require('./channel');
const Root = require('./root');
const municipalities = require('../fixtures/municipalities').data;
const activities = require('../fixtures/activities').data;

const env = process.env.NODE_ENV || 'development';
const config = require(`../config/${env}`);

module.exports.initData = () => {
  // init default channels
  for (let mun = 0; mun < municipalities.length; mun++) {
    for (let act = 0; act < activities.length; act++) {
      let newChannel = new Channel({
        municipality: municipalities[mun],
        activity: activities[act]
      });
      newChannel.save();
    }
  }

  // init Root user
  Root.find().then(roots => {
    if (roots.length == 0) {
      const rootUser = new Root(config.root);
      rootUser.save();
    } else {
      console.log('Root already created');
    }
  });
};
