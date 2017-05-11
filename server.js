const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {Logs} = require('./models.js');
const {DATABASE_URL,PORT} = require('./config.js');


const app = express();
app.use(express.static('views'));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;

app.get('/',(req, res) => {
	res.sendFile(__dirname + '/views/html/index.html')
});

app.get('/user/user_home',(req, res) => {
	res.sendFile(__dirname + '/views/html/user_home.html')
});

app.get('/user/view_logs',(req, res) => {
  res.sendFile(__dirname + '/views/html/view_logs.html')
});

app.get('/user/logs', (req, res) => {
	
	Logs
	.find()
	.exec()
	.then(logs => {
		console.log(logs)
		res.json(logs.map((log) => log.apiRepr()));
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'something went horribly wrong'});
	});
});

app.get('/user/logs/:id', (req, res) => {
  Logs
    .findOne({"_id":req.params.id})
    .exec()
    .then(log => {
      res.status(200).json(log.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly wrong'});
    });
});

app.get('/user/start_workout', (req, res) => {
	res.sendFile(__dirname + '/views/html/start_workout.html');
});

app.get('/user/workout', (req, res) => {
	res.sendFile(__dirname + '/views/html/workout.html')
});

app.get('/user/create', (req, res) => {
	res.sendFile(__dirname + '/views/html/create.html')
});

app.post('/user/logs', (req, res) => {
  const _workout = [];
    for (var i = 0; i < req.body.workout.length; i ++) {
      const _exercise = {
        name: req.body.workout[i].name,
        equipment: req.body.workout[i].equipment,
        category: req.body.workout[i].category,
        notes: req.body.workout[i].notes,
        sets: []
      }
       for (var s = 0; s < req.body.workout[i].sets.length; s ++) {
            const _set = {
            reps: req.body.workout[i].sets[s].reps,
            weight: req.body.workout[i].sets[s].weight,
            time: req.body.workout[i].sets[s].time,
            speed_mph: req.body.workout[i].sets[s].speed_mph,
            speed_kph: req.body.workout[i].sets[s].speed_kph,
            incline: req.body.workout[i].sets[s].incline,
            calories: req.body.workout[i].sets[s].calories
            };
            _exercise.sets.push(_set);
          };
      _workout.push(_exercise);
  };
  Logs
    .create({
        date: req.body.date,
        workout: _workout
    })
    .then(log => res.status(201).json(log.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});
    });
});

app.delete('/user/logs/:id', (req, res) => {
  Logs
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

app.put('/user/logs/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'The request path id and request body id must match'
    });
  }

  const updated = {};
  const updateableFields = ['date', 'workout'];
  updateableFields.forEach(field => {
    updated[field] = req.body[field];
  });

  Logs
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updatedLog => res.status(201).json(updatedLog.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};


module.exports = {runServer, app, closeServer};