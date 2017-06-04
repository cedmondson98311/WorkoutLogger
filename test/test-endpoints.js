

const {app, runServer, closeServer} = require('../server.js');

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const {Logs, User} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedLogsData() {
	Logs.insertMany(seedData);
}



function tearDownDb() {
	console.warn(`

		Dropping database - test complete

		`);
	return mongoose.connection.db.dropCollection('logs',function(err, result) {});
}

const seedData = [{"date":"2016-12-17T11:24:00.000Z","username":"test","workout":[{"name":"Bench Press","equipment":"barbell","category":"weight_reps","notes":"","sets":[{"reps":"8","weight":"225"},{"reps":"8","weight":"225"},{"reps":"8","weight":"225"}]},{"name":"Triceps Push Down","equipment":"cables","category":"weight_reps","notes":"","sets":[{"reps":"8","weight":"75"},{"reps":"8","weight":"75"},{"reps":"6","weight":"75"}]},{"name":"Running","equipment":"Treadmill","category":"time","notes":"","sets":[{"time":"30","speed_mph":"6","speed_kph":"","incline":"0","calories":"350"}]}]},
{"date":"2016-12-18T11:24:00.000Z","username":"test","workout":[{"name":"One-arm Rows","equipment":"dumbell","category":"weight_reps","notes":"","sets":[{"reps":"8","weight":"95"},{"reps":"8","weight":"95"},{"reps":"8","weight":"95"}]},{"name":"Pullups","equipment":"bodyweight","category":"reps_only","notes":"","sets":[{"reps":"15"},{"reps":"12"},{"reps":"10"}]},{"name":"Eliptical Machine","equipment":"eliptical","category":"time","notes":"","sets":[{"time":"30","speed_mph":"","speed_kph":"","incline":"","calories":"350"}]}]},
{"date":"2016-12-19T11:24:00.000Z","username":"test","workout":[{"name":"Squats","equipment":"barbell","category":"weight_reps","notes":"","sets":[{"reps":"8","weight":"225"},{"reps":"8","weight":"225"},{"reps":"8","weight":"225"}]},{"name":"Leg Press","equipment":"machine","category":"weight_reps","notes":"","sets":[{"reps":"8","weight":"300"},{"reps":"8","weight":"300"},{"reps":"6","weight":"300"}]},{"name":"Running","equipment":"Treadmill","category":"time","notes":"","sets":[{"time":"15","speed_mph":"6","speed_kph":"","incline":"0","calories":"150"}]}]}]

describe('Logger API resource', function() {

	before(function() {
		runServer(TEST_DATABASE_URL);
		seedLogsData();
	});

	//beforeEach(function() {
	//	seedLogsData();
	//});

	//afterEach(function() {
	//	return tearDownDb();
	//});

	//after(function() {
		//tearDownDb();
	//	return closeServer();
	//});

	describe('GET endpoint', function() {
		it('should return index.html on request to root directory', function() {
			return chai.request(app)
			.get('/')
			.then(function(res) {
				res.should.have.status(200);
				res.should.have.header('content-type', 'text/html; charset=UTF-8');
			})
		});
		/*it('should return all user logs for user \'test\' on request to /logs/user/:username', function() {
			
			let res;
			
			return chai.request(app)
			.get('/logs/user/test')
			.then(function(_res) {
				console.log('IT ACTUALLY MADE IT HERE###############');
				console.log(_res.body);
				res = _res;
				res.should.have.status(200);
				res.body.should.have.length.of.at.least(1);
				return Logs.count();
			})
			.then(function(count) {
				res.body.should.have.length.of(count);
			});
			
		});
		it('should return a specific log on request to /logs/:id', function() {
			let logId = '';

			return Logs
			.findOne()
			.then(function(log, err) {
			
				logId = log._id;
				
				return chai.request(app)
				.get('/logs/' + logId)
				.then(function(res) {
					
					res.should.have.status(200);
					res.body.should.include.keys('id','date','workout','username');
				});
			
			});
		});
	});
	describe('POST endpoint', function() {
		it('should POST a new log on POST request to /logs', function() {
			const postData = {log:{"date":"Tue, 20 Dec 2016 11:24:00 GMT","workout":[{"name":"Upper nut pelvic power thrusts","equipment":"your upper nuts","category":"weight_reps","notes":"those were some good nut thrusts","sets":[{"reps":"10","weight":"225"},{"reps":"8","weight":"225"},{"reps":"8","weight":"225"}]},{"name":"Triceps Push Down","equipment":"cables","category":"weight_reps","notes":"","sets":[{"reps":"8","weight":"75"},{"reps":"8","weight":"75"},{"reps":"6","weight":"75"}]},{"name":"Chest Dips","equipment":"bodyweight","category":"reps_only","notes":"","sets":[{"reps":"8"},{"reps":"8"},{"reps":"6"}]},{"name":"Running","equipment":"Treadmill","category":"time","notes":"","sets":[{"time":"30","speed_mph":"6","speed_kph":"","incline":"0","calories":"350"}]}]}};

			return chai.request(app)
			.post('/logs')
			.send(postData)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('date','id','workout');
				res.body.date.should.equal(postData.log.date);
				for(var i = 0; i < res.body.workout.length; i ++) {
					res.body.workout[i].name.should.equal(postData.log.workout[i].name);
					res.body.workout[i].equipment.should.equal(postData.log.workout[i].equipment);
				}
				return Logs.findById(res.body.id)
			})
			.then(function(log) {
				for(var i = 0; i < log.workout.length; i ++) {
					log.workout[i].name.should.equal(postData.log.workout[i].name);
					log.workout[i].equipment.should.equal(postData.log.workout[i].equipment);
					log.workout[i].category.should.equal(postData.log.workout[i].category);
					log.workout[i].notes.should.equal(postData.log.workout[i].notes);
				}
			});
		});
	});
	describe('DELETE endpoint', function() {
		it('should delete an existing log on DELETE request',function() {
			
			let log;

			return Logs
			.findOne()
			.exec()
			.then(function(_log) {
				console.log(_log.id);
				log = _log;

				return chai.request(app)
				.delete(`/logs/${log._id}`);
			})
			.then(function(res) {
				
				res.should.have.status(204);
				return Logs.findById(log._id).exec()
			})
			.then(function(_log) {
				should.not.exist(_log);
			});
		});
	}); 
	describe('PUT endpoint', function() {
		it('should update an existing log on PUT request', function() {

			let updateData = {
				date: "1/2/2020"
			}

			Logs
			.findOne()
			.exec()
			.then(function(log) {
				updateData.id = log.id;
				
				return chai.request(app)
				.put(`/logs/${updateData.id}`)
				.send(updateData);
				})
				.then(function(res) {
					
					res.should.have.status(201);

					return Logs.findById(updateData.id).exec();
				})
				.then(function(log) {
					log.date.should.equal(updateData.date);
					log.workout.should.equal(updateData.workout);
			});
		});
	}); */
});
});


