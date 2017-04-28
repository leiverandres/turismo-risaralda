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
      let newChannel = {
        municipality: municipalities[mun],
        activity: activities[act],
      };
      Channel.findOneAndUpdate(newChannel, newChannel, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
        .then(channel => {})
        .catch(err => {
          console.log(`Error while creating channels ${err}`);
        });
    }
  }

  // init Root user
  Root.find().then(roots => {
    if (roots.length == 0) {
      const rootUser = new Root(config.root);
      rootUser.save();
      console.log('Root created');
    }
  });
};
