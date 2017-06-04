const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {BasicStrategy} = require('passport-http');
const passport = require('passport');

const {Logs} = require('./models.js');
const {User} = require('./models.js');
const {DATABASE_URL, PORT} = require('./config.js');

const app = express();

app.use(express.static('views'));
app.use(bodyParser.json());
app.use(session({
  secret: 'squirrel',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

mongoose.Promise = global.Promise;

//NAVIGATION ENDPOINTS
app.get('/',(req, res) => {
	res.sendFile(__dirname + '/views/html/index.html')
});

app.get('/user/start_workout', ensureAuthenticated, (req, res) => {
	res.sendFile(__dirname + '/views/html/start_workout.html');
});

app.get('/user/start_workout/:id', ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/views/html/start_workout.html');
});

app.get('/user/user_home', ensureAuthenticated, (req, res) => { 
	res.sendFile(__dirname + '/views/html/user_home.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/html/login.html')
});

//API ENDPOINTS
app.get('/logs/user/:username', ensureAuthenticated, (req, res) => {
	Logs
	.find({"username":req.params.username})
	.exec()
	.then(logs => {
		res.json(logs.map((log) => log.apiRepr()));
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'something went horribly wrong'});
	});
});

app.get('/logs/:id', ensureAuthenticated, (req, res) => {
  
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

app.post('/logs', ensureAuthenticated, (req, res) => {
  Logs
    .create(req.body.log)
    .then(log => {
      res.status(201).json(log.apiRepr());
    })
    .catch(err => {
      res.status(500).json({error: err.message});
    });
});

app.delete('/logs/:id', ensureAuthenticated, (req, res) => {
  Logs
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

app.put('/logs/:id', ensureAuthenticated, (req, res) => {
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
		
		//USER CREATE ENPOINT
     	app.post('/user_create', ensureAuthenticated, (req, res) => {
		  if (!req.body) {
		    return res.status(400).json({message: 'No request body'});
		  }

		  if (!('username' in req.body)) {
		    return res.status(422).json({message: 'Missing field: username'});
		  }

		  let {username, password, firstName, email} = req.body;

		  if (typeof username !== 'string') {
		    return res.status(422).json({message: 'Incorrect field type: username'});
		  }

		  username = username.trim();

		  if (username === '') {
		    return res.status(422).json({message: 'Incorrect field length: username'});
		  }

		  if (!(password)) {
		    return res.status(422).json({message: 'Missing field: password'});
		  }

		  if (typeof password !== 'string') {
		    return res.status(422).json({message: 'Incorrect field type: password'});
		  }

		  password = password.trim();

		  if (password === '') {
		    return res.status(422).json({message: 'Incorrect field length: password'});
		  }

		  // check for existing user
		  return User
		    .find({username})
		    .count()
		    .exec()
		    .then(count => {
		      if (count > 0) {
		        return Promise.reject({
		          name: 'AuthenticationError',
		          message: 'username already taken'
		        });
		      }
		      // if no existing user, hash password
		      return User.hashPassword(password)
		    })
		    .then(hash => {
		      return User
		        .create({
		          username: username,
		          password: hash,
		          firstName: firstName,
		          email: email
		        })
		    })
		    .then(user => {
		      return res.status(201).json(user.apiRepr());
		    })
		    .catch(err => {
		      if (err.name === 'AuthenticationError') {
		        return res.status(422).json({message: err.message});
		      }
		      res.status(500).json({message: 'Internal server error'})
		    });
		});


//AUTHORIZATION
const basicStrategy = new BasicStrategy(function(username, password, done) {
  let user;
  
  User
    .findOne({"username": username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return done(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return done(null, false, {message: 'Incorrect password'});
      }
      else {
        return done(null, user)
      }
    });
});

passport.use(basicStrategy);

app.post('/login', passport.authenticate('basic', {session: true}), (req, res) => {
  res.status(200).json({'message':'login successful'});
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/');
	}
};

//SERVER FUNCTIONS
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