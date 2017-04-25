const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  dni: {
    type: String,
    unique: true,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require,
  },
  address: {
    type: String,
  },
  numbers: {
    type: [String],
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  roles: {
    type: [String],
  },
});

module.exports = mongoose.model('User', userSchema);
