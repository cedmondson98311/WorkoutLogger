const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
      id: String,
      date: String,
      workout: [
        {
          name: String,
          equipment: String,
          category: String,
          notes: String,
          sets:[
              {
                time: {type:String, required:false},
                speed_mph: {type:String, required:false},
                speed_kph: {type:String, required:false},
                incline: {type:String, required:false},
                calories: {type:String, required:false},
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
    workout: this.workout
  };
}

const Logs = mongoose.model('log', logSchema);

module.exports = {Logs};