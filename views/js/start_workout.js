//PROTOTYPE FUNCTIONS
	
	//This is used to create a date in the 'yyyy-mm-dd' format:
	
	Date.prototype.yyyymmdd = function() {
  		var mm = this.getMonth() + 1; // getMonth() is zero-based
  		var dd = this.getDate();

  		return [this.getFullYear(),
          	(mm>9 ? '' : '0') + mm,
          	(dd>9 ? '' : '0') + dd
         	].join('-');
	};

function getDate () {
	var date = new Date();
	return date.yyyymmdd()
};

//GLOBAL VARIABLES
var state = {
	date: getDate(),
	workout: [],
	queryStrParams: getQueryStringParameters()
};

const username = state.queryStrParams.params['username'];
state.username = username;

//CREATE FUNCTIONS

function Excercise(){
	this.name = '';
	this.displayName = '';
	this.equipment = '';
	this.category = '';
	this.e_id = '';
	this.sets = [];
}

function Set(){
	this.time = '';
	this.speed_mph = ''; 
	this.speed_kph = '';
	this.incline = '';
	this.calories = '';
	this.reps = '';
	this.weight = '';
}

//STATE FUNCTIONS

function addExercise(state){
	var exerciseName = $('#exercise').val();
	var equipment = $('#equipment-selection option:selected').text();
	var category = $('#category-selection option:selected').attr('data-value');
	var exerciseDisplayName = '';
	if(category === 'cardio' || equipment === 'None') {
		exerciseDisplayName = exerciseName;
	}
	else {
		exerciseDisplayName = (equipment + ' ' + exerciseName);
	};
	var id = generateId(exerciseName);
	
	var newExercise = new Excercise();

	newExercise.name = exerciseName;
	newExercise.displayName = exerciseDisplayName;
	newExercise.equipment = equipment;
	newExercise.category = category;
	newExercise.e_id = id;

	state.workout.push(newExercise);
	renderExercise(newExercise);
};

function removeExercise(state, exerciseId){
	var index = findIndexById(exerciseId);

	var newWorkout = [];

	state.workout.forEach(function(exercise) {

		if (exercise.e_id != exerciseId) {
			newWorkout.push(exercise)
		}
		else{}
	})

	state.workout = newWorkout;
	
	state.workout.forEach(function(exercise) {
		var exerciseId = exercise.e_id;
		
		renderExercise(exercise);
		renderSets(exerciseId);
	});
}

function addSet(state, index){
	var newSet = new Set();
	var category = state.workout[index].category;

	newSet.reps = $('#reps-input-modal').val();
	newSet.weight = $('#weight-input-modal').val();
	newSet.time_hours = $('#time-input-modal-hours').val();
	newSet.time_minutes = $('#time-input-modal-minutes').val();
	newSet.time_seconds = $('#time-input-modal-seconds').val();
	newSet.distance = $('#distance-input-modal').val();
	newSet.speed = $('#speed-input-modal').val();
	newSet.calories = $('#calories-input-modal').val();
	if(category === 'cardio') {
		newSet.distance_unit = $('.select-distance-units option:selected').attr('data-value');
	};

	var validationResponse = validateInputSetsReps(newSet.reps, newSet.weight, newSet.time_hours, newSet.time_minutes, newSet.time_seconds, newSet.distance, newSet.speed, newSet.calories);
	var valid = validationResponse['value'];

	if(valid) {
		//This removes all null set values
		var trimmedSet = {};
		var keysArray = Object.keys(newSet);
		keysArray.forEach(function(key) {
			if(newSet[key] !== '') {
				trimmedSet[key] = newSet[key];
			}
			else{};
		});
		state.workout[index].sets.push(trimmedSet);
	}
	else {
		var cause = validationResponse['cause'];
		switch(cause){
			case('bad_digit'):
				$('#bad-digit-warning-div').removeClass('hidden');
				break;
			case('negative_digit'):
				$('#negative-digit-warning-div').removeClass('hidden');
				break;
			case('exceeded_sixty'):
				$('#exceeded-sixty-warning-div').removeClass('hidden');
				break;
			default:
		};
	};
};

function removeSet(state, setIndex, exerciseId) {
	var wIndex = findIndexById(exerciseId);
	var target = state.workout[wIndex].sets;
	var newSets = [];

	target.forEach(function(set) {
		
		if((target.indexOf(set)) != setIndex) {
			newSets.push(set);
		}
		else{};
	});

	state.workout[wIndex].sets = newSets;

	renderSetsModal(exerciseId);
};

//MAIN PAGE RENDER FUNCTIONS

function renderExercise(exercise) {
	var exerciseId = exercise.e_id;
	var exerciseName = exercise.name;
	var exerciseDisplayName = exercise.displayName;
	
	var rowHTML = '<tr><td class="exercise-title">' + exerciseDisplayName + '</td><td class="exercise-sets" data-id="' + exerciseId + '"></td>' + 
		'<td class="edit-sets-button-holder"><button type="button" data-name="' + exerciseName + '" data-id="' + exerciseId + '" class="btn btn-cir btn-sm btn-primary modify-set-button" data-toggle="modal" data-target="#add-set-modal">' + 
		'<span class="glyphicon glyphicon-pencil"></span></button></td></tr>';

	$('#logs-body').append(rowHTML); 
}

function renderSets(exerciseId) {
	
	var index = findIndexById(exerciseId);
	var exerciseSets = state.workout[index].sets;
	var category = state.workout[index].category;
	
	var setsHtml = exerciseSets.map(function(set) {
		return generateSetsHtml(set, category);
	});
	
	$('td[data-id|="' + exerciseId + '"]').html(setsHtml);
}

//MODAL RENDER FUNCTIONS

function renderSetsModal(exerciseId) {
	 var index = findIndexById(exerciseId);

	 var target = state.workout[index];
	 var name = target.name;
	 var sets = target.sets;
	 var category = target.category;
	 var equipment = target.equipment;

	 createModalTableHtml(category);

	 var setsArray = []

	 sets.forEach(function(set) {
	 	var set_index = state.workout[index].sets.indexOf(set);
	 	
	 	setsArray.push(generateSetsHtmlModal(set, set_index, category, equipment, exerciseId));
	 });
	 
	 var setsHtml = setsArray.join('');

	 $('#add-set-button-modal').attr('data-id',exerciseId);
	 $('#add-set-modal-title').html(name);
	 $('#logs-body-modal').html(setsHtml);
	 $('#add-set-button-modal').attr('data-index', index);
	 $('#save-sets-modal').attr('data-index', index);
	 $('#save-sets-modal').attr('data-id', exerciseId);
	 $('#btn-confirm-delete').attr('data-id', exerciseId);


	 revealModalInputs(category);
};

//HELPER FUNCTIONS

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
}

function generateSetsHtmlModal(set, set_index, category, equipment, exerciseId) {
	var setHtml = '';
	
	switch(category) {
		case('reps_and_weight'):
			setHtml = '<tr><td>' + (set.reps || '-') + '</td><td>' + (set.weight || '-') + '</td><td><button class="btn btn-sm btn-danger remove-set" data-id="' + exerciseId +'" data-set-index="' + set_index + '"><span class="glyphicon glyphicon-trash"></span></button></tr>';
			break;
		case('reps_only'):
			if(equipment === "Body Weight") {
			setHtml = '<tr><td>' + (set.reps || '-') + '</td><td>Body Weight</td><td><button class="btn btn-sm btn-danger remove-set" data-id="' + exerciseId +'" data-set-index="' + set_index + '"><span class="glyphicon glyphicon-trash"></span></button></tr>';
			break;
			}
			else{
			setHtml = '<tr><td>' + (set.reps || '-') + '</td><td>-</td><td><button class="btn btn-sm btn-danger remove-set" data-id="' + exerciseId +'" data-set-index="' + set_index + '"><span class="glyphicon glyphicon-trash"></span></button></tr>';
			break;
			}
		case('time_only'):
			var time = formatTime(set);
			setHtml = '<tr><td>' + (time || '-') + '</td><button class="btn btn-sm btn-danger remove-set" data-id="' + exerciseId +'" data-set-index="' + set_index + '"><span class="glyphicon glyphicon-trash"></span></button></tr>';
			break;
		case('reps_and_time'):
			var time = formatTime(set);
			setHtml = '<tr><td>' + (set.reps || '-') + '</td><td>' + (time || '-') + '</td><td><button class="btn btn-sm btn-danger remove-set" data-id="' + exerciseId +'" data-set-index="' + set_index + '"><span class="glyphicon glyphicon-trash"></span></button></tr>';
			break;
		case('cardio'):
			var time = formatTime(set);
			setHtml = '<tr><td>' + (time || '-') + '</td><td>' + (set.speed || '-') + '</td><td>' + (set.distance || '-') + '(' + set.distance_unit + ')</td><td>' + (set.calories || '-') + '</td><td><button class="btn btn-sm btn-danger remove-set" data-id="' + exerciseId +'" data-set-index="' + set_index + '"><span class="glyphicon glyphicon-trash"></span></button></tr>';
			break;
		default:
			setHtml = '<tr><td>' + (set.reps || '-') + '</td><td>' + (set.weight || '-') + '</td><td><button class="btn btn-sm btn-danger remove-set" data-id="' + exerciseId +'" data-set-index="' + set_index + '"><span class="glyphicon glyphicon-trash"></span></button></tr>';
	};

	return setHtml;
}

function generateSetsHtml(set, category) {
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
		
		return html;
	};

function createModalTableHtml(category) {
	var tableHtml = '';
	
	switch(category){
		case('reps_and_weight'):
			tableHtml = '<thead><tr><th>Reps</th><th>Weight</th></tr></thead><tbody id="logs-body-modal"></tbody>'
			break;
		case('reps_only'):
			tableHtml = '<thead><tr><th>Reps</th><th>Weight</th></tr></thead><tbody id="logs-body-modal"></tbody>'
			break;
		case('time_only'):
			tableHtml = '<thead><tr><th>Time</th></tr></thead><tbody id="logs-body-modal"></tbody>'
			break;
		case('reps_and_time'):
			tableHtml = '<thead><tr><th>Reps</th><th>Time</th></tr></thead><tbody id="logs-body-modal"></tbody>'
			break;
		case('cardio'):
			tableHtml = '<thead><tr><th>Time</th><th>Speed</th><th>Distance</th><th>Calories</th></tr></thead><tbody id="logs-body-modal"></tbody>'
			break;
		default:
			tableHtml = '<thead><tr><th>Reps</th><th>Weight</th></tr></thead><tbody id="logs-body-modal"></tbody>'
	};

	$('#table-sets-modal').html(tableHtml);
}

function findIndexById(exerciseId) {
	var index;
	 
	state.workout.forEach(function(exercise) {
	 	if(exercise.e_id === exerciseId) {
	 		 index = state.workout.indexOf(exercise);
	 	} 
	 	else {};
	 });

	return index;
};

function generateId(exerciseName) {
  var min = Math.ceil(1000000000000);
  var max = Math.floor(10000000000000);
  //idInteger will be assigned a random integer between one trillion and ten trillion
  var idInteger = Math.floor(Math.random() * (max - min)) + min;

  return exerciseName.toUpperCase().replace(/\s/g, '-') + ':' + idInteger;
}

function validateInputSetsReps(reps, weight, hr, min, sec, distance, speed, calories) {
	var res = {
		value:true,
		cause:''
	};

	if(isNaN(reps) || isNaN(weight) || isNaN(hr) || isNaN(min) || isNaN(sec) || isNaN(distance) || isNaN(speed) || isNaN(calories)) {
		res['value'] = false;
		res['cause'] = 'bad_digit';
	}
	else if ( Math.sign(reps) === -1 || Math.sign(weight) === -1 || Math.sign(hr) === -1 || Math.sign(min) === -1 || Math.sign(sec) === -1 || 
		Math.sign(distance) === -1 || Math.sign(speed) === -1 || Math.sign(calories) === -1) {
		
		res['value'] = false;
		res['cause'] = 'negative_digit';
	}
	else if (min > 60 || sec > 60) {
		res['value'] = false;
		res['cause'] = 'exceeded_sixty';
	}
	else{};
	
	return res;
};

function revealModalInputs(category) {
	$('#div-modal-input-reps').addClass('hidden');
	$('#div-modal-input-weight').addClass('hidden');
	$('#div-modal-input-time').addClass('hidden');
	$('#div-modal-input-distance').addClass('hidden');
	$('#div-modal-input-calories').addClass('hidden');
	$('#div-modal-input-speed').addClass('hidden');

	switch(category) {
		case('reps_and_weight'):
			$('#div-modal-input-reps').removeClass('hidden');
			$('#div-modal-input-weight').removeClass('hidden');
			break;
		case('reps_only'):
			$('#div-modal-input-reps').removeClass('hidden');
			break;
		case('time_only'):
			$('#div-modal-input-time').removeClass('hidden');
			break;
		case('reps_and_time'):
			$('#div-modal-input-reps').removeClass('hidden');
			$('#div-modal-input-time').removeClass('hidden');
			break;
		case('cardio'):
			$('#div-modal-input-time').removeClass('hidden');
			$('#div-modal-input-distance').removeClass('hidden');
			$('#div-modal-input-calories').removeClass('hidden');
			$('#div-modal-input-speed').removeClass('hidden');
			break;
		default:
			$('#div-modal-input-reps').removeClass('hidden');
			$('#div-modal-input-weight').removeClass('hidden');
	};
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

//API FUNCTIONS
function submitWorkout(state) {
	
	var data = {"log":state};
	
	var settings = {
		url: '/logs',
		data: JSON.stringify(data),
		method: 'POST',
		dataType: 'json',
		headers: {"Content-Type":"application/json"},
		success:function(data){
			window.location = '/user/user_home?username=' + username;
		},
		error: function(jqxhr) {
			alert(jqxhr.responseText);
		}
	};
	
	$.ajax(settings);
}

function updateWorkout(state) {
	
	var settings = {
		url: '/logs/' + state.id,
		data: JSON.stringify(state),
		method: 'PUT',
		dataType: 'json',
		headers: {"Content-Type":"application/json"},
		success:function(data){
			window.location = '/user/user_home?username=' + username;
		},
		error: function(jqxhr) {
			alert(jqxhr.responseText);
		}
	};
	
	$.ajax(settings);
}

function loadUpdateWorkout(id) {
	var settings = {
		url: '/logs/' + id,
		method: 'GET',
		success:function(data){
			console.log(data);
			state = data;
			state.queryStrParams = getQueryStringParameters();
			state.workout.forEach(function(exercise) {
				renderExercise(exercise);
				renderSets(exercise.e_id);
			});
			$('#button-submit-workout').addClass('hidden');
			$('#button-update-workout').removeClass('hidden');
			$('#btn-delete-workout').removeClass('hidden');
		},
		error: function(err) {
			console.error(err);
		}
	};

	$.ajax(settings);
};

function deleteWorkout(id) {
	var settings = {
		url: '/logs/' + id,
		method: 'DELETE',
		success: function(data) {
			window.location = '/user/user_home';
		},
		error: function(err) {
			console.error(err);
		}
	};
	$.ajax(settings);
};

//EVENT LISTENERS
$(function() {
	//Add Exercise

		//Add Exercise Click
		$('#add-exercise-button').click(function(e) {
			e.preventDefault();
			addExercise(state);
		});

		//Add Exercise Submit
		$('#add-exercise-form').submit(function(e) {
			e.preventDefault();
			addExercise(state);
		});

	//Remove Exercise
		
		//Reveal Warning Footer
		$('#delete-exercise-button').click(function(e) {
			e.preventDefault();
			$('#delete-warning-div').removeClass('hidden');
		});

		//Confirm Delete
		$('#btn-confirm-delete').click(function(e) {
			e.preventDefault();

			$('#logs-body').html('');

			var exerciseId = $(this).attr('data-id');
			removeExercise(state, exerciseId);

			$('#delete-warning-div').addClass('hidden');
		});

	//Modify Sets
	$('#logs-body').on('click', '.modify-set-button', function(e) {
		e.preventDefault();

		var exerciseId = $(this).attr('data-id');
		
		renderSetsModal(exerciseId);
	});

	//Create Sets

		//Create Sets by Click Event
		$('#add-set-button-modal').click(function(e) {
			e.preventDefault();

			var index = $(this).attr('data-index');
			var exerciseId = $(this).attr('data-id');

			addSet(state, index);
			renderSetsModal(exerciseId);
		});

		//Create Sets By Submit Event
		$('#modal-form').submit(function(e) {
			e.preventDefault();

			var index = $(this).find('.add-set-button-modal').attr('data-index');
			var exerciseId = $(this).find('.add-set-button-modal').attr('data-id');

			addSet(state, index);
			renderSetsModal(exerciseId);
		});

	//Save Sets
	$('#save-sets-modal').click(function(e) {
		var exerciseId = $(this).attr('data-id');
		renderSets(exerciseId);
		$('#modal-form')[0].reset();

	});

	//Remove Set
	$('#table-sets-modal').on('click','.remove-set', function(e) {
		var setIndex = $(this).attr('data-set-index');
		var exerciseId = $(this).attr('data-id');
		
		removeSet(state, setIndex, exerciseId);
	});

	//Acknowledge Sets/Reps Input Error
	$('.btn-notify-bad-digit').click(function(e) {
		e.preventDefault();
		$('#bad-digit-warning-div').addClass('hidden');
	});
	$('.btn-notify-negative-digit').click(function(e) {
		e.preventDefault();
		$('#negative-digit-warning-div').addClass('hidden');
	});
	$('.btn-notify-exceeded-sixty').click(function(e) {
		e.preventDefault();
		$('#exceeded-sixty-warning-div').addClass('hidden');
	});

	//Submit Workout
	$('#button-submit-workout').click(function(e) {
		e.preventDefault();
		submitWorkout(state);
	});

	//Display new-user alerts for first-time users to give directions on using the app
	if(state.queryStrParams.params['new_user'] === 'true') {
		$('.new-user').removeClass('hidden');
		$('#menu_user_home').attr('href', '/user/user_home?username=' + username + '&new_user=true');
		$('#menu_start_workout').attr('href', '/user/start_workout?username=' + username + '&new_user=true')
	}
	else {
	$('#menu_user_home').attr('href', '/user/user_home?username=' + username);
	$('#menu_start_workout').attr('href', '/user/start_workout?username=' + username)
	}

	//UPDATE SECTION
	//this section will cause the page to be populated with a previous workout that
	//can be updated if the url is called with an 'id' query string parameter
	if(state.queryStrParams.params['id']) {
		loadUpdateWorkout(state.queryStrParams.params['id']);
	}

	$('#button-update-workout').click(function(e) {
		e.preventDefault();
		updateWorkout(state);
	});

	$('#btn-delete-workout').click(function(e) {
		e.preventDefault();
		$('.div-delete-well').removeClass('hidden');
	});

	$('#btn-delete-well').click(function(e) {
		e.preventDefault();
		console.log('delete fired');
		deleteWorkout(state.queryStrParams.params['id']);
	})
}); 

//test
                     
                  
               
               
                  
                  
                     
                  
               
               
            