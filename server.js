var express = require('express');
var app = express();
app.use(express.static('views'));
app.listen(process.env.PORT || 8080);

app.get('/user/logs', (req, res) => {
	res.sendFile(__dirname + '/view_logs.html')
});

app.get('/user/start', (req, res) => {
	res.sendFile(__dirname + '/views/start_workout.html');
});

app.get('/user/workout', (req, res) => {
	res.sendFile(__dirname + '/views/workout.html')
});

app.get('/user/create', (req, res) => {
	res.sendFile(__dirname + '/views/create.html')
});

module.exports = {app};