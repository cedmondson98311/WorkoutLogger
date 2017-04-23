var express = require('express');
var app = express();
app.use(express.static('views'));
app.listen(process.env.PORT || 8080);

app.get('/',(req, res) => {
	res.sendFile(__dirname + '/views/html/index.html')
});

app.get('/user/logs', (req, res) => {
	res.sendFile(__dirname + '/views/html/view_logs.html')
});

app.get('/user/start', (req, res) => {
	res.sendFile(__dirname + '/views/html/start_workout.html');
});

app.get('/user/workout', (req, res) => {
	res.sendFile(__dirname + '/views/html/workout.html')
});

app.get('/user/create', (req, res) => {
	res.sendFile(__dirname + '/views/html/create.html')
});

module.exports = {app};