const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;
const rootSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

rootSchema.pre('save', function(next) {
  let root = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        return next(err);
      }
      if (!root.password) {
        next(Error('Missing password'));
      }
      bcrypt.hash(root.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        root.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

rootSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
};

module.exports = mongoose.model('Root', rootSchema);
