const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  dni: {
    type: String,
    unique: true,
    require: true
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  username: {
    type: String,
    unique: true,
    require: true
  },
  email: {
    type: String,
    unique: true,
    require: true
  },
  address: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  password: {
    type: String,
    require: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male'
  },
  suscribedChannels: [
    {
      type: Schema.ObjectId,
      ref: 'Channel'
    }
  ],
  adminPermission: {
    state: {
      type: String,
      enum: ['accepted', 'pending', 'noAsked'],
      default: 'noAsked'
    },
    pendingChannels: [
      {
        type: Schema.ObjectId,
        ref: 'Channel'
      }
    ],
    acceptedChannels: [
      {
        type: Schema.ObjectId,
        ref: 'Channel'
      }
    ]
  }
});

userSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt
        .hash(this.password, salt)
        .then(hash => {
          this.password = hash;
          next();
        })
        .catch(err => {
          next(err);
        });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
};

module.exports = mongoose.model('User', userSchema);
