var state = [];

function getLogs() {
	const logsEndpoint = 'http://localhost:8080/user/logs';
		
		const settings = {
			success: buildCalendar
		}

	$.ajax(logsEndpoint,settings);
}



function renderLogsBootstrap(data) {
	console.log(data);
		
		data[0].workout.forEach(function(exercise) {
			var row = '<tr><td>' + exercise.name + '</td><td>';
			var sets = exercise.sets.map(function(set) {
				if (exercise.category === "weight_reps") {
				return set.reps + ' X ' + set.weight + '<br>';  
			} else if (exercise.category === "reps_only") {
				return set.reps + '<br>'; 
			} else if (exercise.category === "time") {
				return "Time: " + set.time + " (minutes)<br>Calories: " + set.calories + "<br>Incline: " + set.incline;
			}
			});
			var rowHtml = row + sets.join('') + '</td></tr>';
			console.log(rowHtml);
			$('.latest-workout tbody').append(rowHtml);
		});
	
};

function renderExercise(exercise) {
	//var exerciseId = exercise.e_id;
	//var exerciseName = exercise.name;
	var exerciseDisplayName = exercise.displayName;
	//var exerciseEquipment = exercise.equipment;
	
	var rowHTML = '<tr><td class="exercise-title">' + exerciseDisplayName + '</td><td class="exercise-sets"</td></tr>';

	$('#table-body-last-workout').append(rowHTML); 
}

function buildCalendar (_state) {
	state = _state;

	renderCalendar();
}

function generateEvents(state) {
	var events = [];

	state.forEach(function(workout) {
		var event = {
			title:'Workout',
			start: workout.date
		};
		console.log('event: ' + event)
		events.push(event);
	});
	console.log(events);
	return events;
};

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
			events: generateEvents(state)
	});
}

$(function() {
	
	getLogs();

});

//test