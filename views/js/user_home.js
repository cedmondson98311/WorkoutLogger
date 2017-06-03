//Globals
var state = {
	queryStrParams: getQueryStringParameters(),
	workouts: []
};

const username = state.queryStrParams.params['username'];

//API Functions
function getLogs() {

	const logsEndpoint = '/user/logs/user/' + username;
		
		const settings = {
			success: function(data) {
				state.workouts = data;
				renderPage();
			}
		}

	$.ajax(logsEndpoint,settings);
};

//Render Functions
function renderPage() {
	renderCalendar();
	renderCurrentLog();
	
	
};

function renderCalendar() {
	$('#calendar').fullCalendar({
		header: {
				left: 'prev,next',
				center: 'title',
				right: ''
			},
			navLinks: false,
			editable: false,
			eventLimit: true,
			height: 500,
			events: generateEvents(state),
			eventClick: function(calEvent, jsEvent, view) {
				renderCurrentLog(calEvent.index, calEvent.start._i);
			},
			//dayClick should do nothing
			dayClick: function(date, jsEvent, view) {}
	});

	$('.fc-title').addClass('glyphicon glyphicon-ok-sign');
	$('#greeting').html('Welcome ' + username);
};

function generateEvents(state) {
	var events = [];

	state.workouts.forEach(function(workout) {
		var event = {
			title:'',
			start: workout.date,
			index: state.workouts.indexOf(workout),
			allDayDefault: true
		};
		events.push(event);
	});
	return events;
};

function renderCurrentLog (_index, date) {
	var targetIndex = 0;
	
	if(_index) {
		targetIndex = _index;
	}

	//Check to see if the user has any logs;
	if(state.workouts[targetIndex]) {
		var workoutId = state.workouts[targetIndex].id;

		$('#table-body-last-workout').html(generateLogHtml(targetIndex));
		$('#h2-current-log').html((date || 'Your Last Workout') + '<a class="btn btn-info" id="edit-button" href="/user/start_workout?id=' + workoutId +'&username=' + username + '">Edit</a>');
	} else {
		$('#h2-current-log').addClass('hidden');
		$('.latest-workout').addClass('hidden');
	}
};

function generateLogHtml (_index) {
	var workout = state.workouts[_index].workout;

	var rowHtmlArray = [];

	workout.forEach(function(exercise) {
		var setsHtml = generateSetsHtml(exercise.sets, exercise.category);
		var row = '<tr><td class="name">' + exercise.equipment + ' ' + exercise.name + '</td><td>' + setsHtml + '</td></tr>';
		rowHtmlArray.push(row);
	});

	return rowHtmlArray.join('');
};

function generateSetsHtml(sets, category) {
	var htmlArray = [];

	sets.forEach(function(set) {
		var html = '';
		switch(category) {
			case('reps_and_weight'):
				html = (set.reps || '-') + ' X ' + (set.weight || '-') + '<br>';
				break;
			case('reps_only'):
				if(set.weight) {
					html = (set.reps || '-') + ' X ' + set.weight + '<br>'; 
				}
				else{
					html = (set.reps || '-') + '<br>';
				};
				break;
			case('time_only'):
				var time = formatTime(set);
				html = (time || '-') + '<br>';
				break;
			case('reps_and_time'):
				var time = formatTime(set);
				html = (set.reps || '-') + ' in ' + (time || '-') + '<br>'; 
				break;
			case('cardio'):
				var time = formatTime(set);
				var distance = '(' + (set.distance_unit || '-') + ')';
				
				html = 'Distance: ' + (set.distance || '-') + ' ' + (distance || '-') + '<br>Time: ' + (time || '-') + '<br>Speed: ' + (set.speed || '-') + '(mph)<br>Calories: ' + (set.calories || '-');
				break;
		};
		htmlArray.push(html);
	});
	return htmlArray.join('');
};

//Helper Functions
function formatTime(set) {
	var hr;
	var min;
	var sec;

	if(set.time_hours && set.time_hours !== '') {
		hr = set.time_hours;
	}
	else {
		hr = '0';
	};
	if(set.time_minutes && set.time_minutes !== '') {
		if(set.time_minutes.length > 1) {
			min = set.time_minutes;
	 	}
	 	else {
	 		min = '0' + set.time_minutes;
	 	}
	}
	else {
		min = '00';
	};
	if(set.time_seconds && set.time_seconds !== '') {
		if(set.time_seconds.length > 1) {
			sec = set.time_seconds;
		}
		else {
			sec = '0' + set.time_seconds;
		}
	}
	else {
	sec = '00';
	};

	return hr + ':' + min + ':' + sec;
};

function getQueryStringParameters() {
	var queryStrParams = {
		params:[],
		hash:[]
	}

    var q = document.URL.split('?')[1];
    if(q != undefined){
        q = q.split('&');
        for(var i = 0; i < q.length; i++){
            queryStrParams.hash = q[i].split('=');
            queryStrParams.params.push(queryStrParams.hash[1]);
            queryStrParams.params[queryStrParams.hash[0]] = queryStrParams.hash[1];
        }
	}

	return queryStrParams
};

//Document Ready
$(function() {
	
	getLogs();

	$('#h2-current-log').on('click', '#e', function(e) {
		e.preventDefault();
		var id = $('#edit-button').attr('data-id');
		location.href='localhost:8080/user/submit_workout?id=' + id;
	});
	if(state.queryStrParams.params['new_user'] === 'true') {
		$('.new-user').removeClass('hidden');
		$('#menu_start_workout').attr('href', '/user/start_workout?username=' + username + '&new_user=true')
		$('#menu_user_home').attr('href', '/user/start_workout?username=' + username + '&new_user=true')
	}
	else {
	$('#menu_start_workout').attr('href', '/user/start_workout?username=' + username)
	$('#menu_user_home').attr('href', '/user/user_home?username=' + username);
	}

});