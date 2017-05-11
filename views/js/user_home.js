function getLogs() {
	const logsEndpoint = 'http://localhost:8080/user/logs';
		
		const settings = {
			success:renderLogsBootstrap
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

$(function() {
	getLogs();
});