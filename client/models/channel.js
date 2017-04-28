const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const channelSchema = new Schema({
  municipality: {
    type: String,
    require: true,
  },
  activity: {
    type: String,
    require: true,
  },
  assigned: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Channel', channelSchema);
