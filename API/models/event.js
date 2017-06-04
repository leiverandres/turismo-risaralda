const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  coordenates: {
    longitud: { type: Number, require: true },
    latitude: { type: Number, require: true }
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

module.exports = mongoose.model('Event, EventeSchema');
