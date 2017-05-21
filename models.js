const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
      date: String,
      workout: [
        {
          name: String,
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
    workout: this.workout
  };
}

const Logs = mongoose.model('log', logSchema);

module.exports = {Logs};