//GLOBAL VARIABLES

//API FUNCTIONS
$(function() {
function getLogs() {
	const logsEndpoint = 'http://localhost:8080/user/logs';
		
		const settings = {
			success:renderLogsBootstrap
		}

	$.ajax(logsEndpoint,settings);
}
});

function renderLogsBootstrap(data) {
	console.log(data);



		for (var i = 0; i < data.length; i ++) {

		var date = '<h2>' + data[i].date + '</h2>';
		var id = i;
		var tableStart = '<table class="table table-striped"><thead><tr><th>Exercise</th><th>Sets (Reps X Weight)</th><th>Notes</th></tr></thead><tbody id=' + id + '>';

		$('.logs').append(date);
		$('.logs').append(tableStart);
		
		data[i].workout.forEach(function(exercise) {
			
			var name = '<tr><td>' + exercise.name + '</td><td>';
			var notes = '<td>' + exercise.notes + '</td>';
			var sets = exercise.sets.map(function(set) {
				if (exercise.category === "weight_reps") {
				return set.reps + ' X ' + set.weight + '<br>';  
			} else if (exercise.category === "reps_only") {
				return set.reps + '<br>'; 
			} else if (exercise.category === "time") {
				return "Time: " + set.time + " (minutes)<br>Calories: " + set.calories + "<br>Incline: " + set.incline;
			}
			});
			console.log(sets);
			var rowHtml = name + sets.join('') + '</td>' + notes + '</tr>';
			var idTag = '#' + id;
			console.log(idTag);
			$(idTag).append(rowHtml);
		});
		
		$('.logs').append('</tbody></table>');
		
	};
	
}

//EVENT LISTENERS
$(function() {

});

/*function renderLogsBootstrap(data) {
	console.log(data)
	data.forEach(function(day) {
		var date = workout.date;
		var header = '<table><thead><tr><th>Exercise</th><th>Sets (Reps X Weight)</th></tr></thead><tbody>';
		var sets = for(var i = 0; i < day.workout.length; i ++) {
					day.workout[i].sets.map(function(set) {
					return set.reps + ' X ' + set.weight + '<br>'
				})
		};
		console.log(sets);
	})
}*/

//$(function() {
//	getLogs();
//});
				