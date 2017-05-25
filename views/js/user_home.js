var state = [];

function getLogs() {

	const logsEndpoint = '/user/logs';
		
		const settings = {
			success: renderPage
		}

	$.ajax(logsEndpoint,settings);
};

function renderPage(_state) {
	state = _state;
	renderCalendar();
	renderCurrentLog();
};
//CALENDAR############################

function renderCalendar() {
	$('#calendar').fullCalendar({
		header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,basicDay'
			},
			navLinks: true, // can click day/week names to navigate views
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			height: 500,
			events: generateEvents(state),
			eventClick: function(calEvent, jsEvent, view) {
				renderCurrentLog(calEvent.index, calEvent.start._i);
			}
	});
};

		function generateEvents(state) {
			var events = [];

			state.forEach(function(workout) {
				var event = {
					title:'Workout',
					start: workout.date,
					index: state.indexOf(workout)
				};
				events.push(event);
			});
			return events;
		};
//######################################

//LOG###################################
function renderCurrentLog (_index, date) {
	var targetIndex = 0;
	
	if(_index) {
		targetIndex = _index;
	}

	$('#table-body-last-workout').html(generateLogHtml(targetIndex));
	$('#h2-current-log').html((date || 'Your Last Workout') + '<button class="btn btn-lg btn-primary" id="update-button">Update</button>');
};

		function generateLogHtml (_index) {
			var workout = state[_index].workout;

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
//########################################################

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

$(function() {
	
	getLogs();

});