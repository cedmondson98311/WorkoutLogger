const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ""},
  lastName: {type: String, default: ""}
});

UserSchema.methods.apiRepr = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
}

UserSchema.methods.validatePassword = function(password) {

  return bcrypt
    .compare(password, this.password)
    .then(isValid => {
    	return isValid
    });
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt
    .hash(password, 10)
    .then(hash => hash);
}

const logSchema = mongoose.Schema({
      date: String,
      username: String,
      workout: [
        {
          name: String,
          displayName: String,
          e_id: String,
          equipment: String,
          category: String,
          notes: String,
          sets:[
              {
                time_hours: {type:String, required:false},
                time_minutes: {type:String, required:false},
                time_seconds: {type:String, required:false},
                speed: {type:String, required:false},
                calories: {type:String, required:false},
                distance: {type:String, required:false},
                distance_unit: {type:String, required:false},
                reps: {type:String, required:false},
                weight: {type:String, required:false},
              }
            ]
        }
      ]
    });


logSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    date: this.date,
    workout: this.workout,
    username: this.username
  };
}

const User = mongoose.model('User', UserSchema);
const Logs = mongoose.model('log', logSchema);

module.exports = {User, Logs};