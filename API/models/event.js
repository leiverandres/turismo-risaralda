const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  coordinates: {
    latitude: { type: Number, min: -85, max: 85, require: true },
    longitude: { type: Number, min: -180, max: 180, require: true }
  },
  description: {
    type: String,
    require: true
  },
  channel: {
    type: Schema.ObjectId,
    ref: 'Channel'
  },
  date: Date,
  contactNumber: String,
  contactEmail: String,
  contactLink: String
});

module.exports = mongoose.model('Event', EventSchema);
