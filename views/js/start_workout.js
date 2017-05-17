//GLOBAL VARIABLES
var state = {
	date: Date.now(),
	workout: []
}

//CREATE FUNCTIONS

function Excercise(){
	this.name = '';
	this.equipment = '';
	this.category = '' 
	this.notes = '';
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

function addExercise(){
	var exerciseName = $('#exercise').val();
	var equipment = $('input[name=equipment]:checked', '#workout').val();
	var category = $('input[name=category]:checked', '#workout').val();
	var notes = $('#notes').val();
	var id = generateId(exerciseName);
	var newExercise = new Excercise();

	newExercise.name = exerciseName;
	newExercise.equipment = equipment;
	newExercise.category = category;
	newExercise.notes = notes;
	newExercise.id = id;

	state.workout.push(newExercise);
	renderExercise(newExercise);
}

function removeExercise(exerciseId){
	var index = findIndexById(exerciseId);

	var newWorkout = [];

	state.workout.forEach(function(exercise) {

		if (exercise.id != exerciseId) {
			newWorkout.push(exercise)
		}
		else{}
	})

	state.workout = newWorkout;
	
	state.workout.forEach(function(exercise) {
		var exerciseId = exercise.id;
		
		renderExercise(exercise);
		renderSets(exerciseId);
	});
}

function addSet(index){
	var newSet = new Set();

	newSet.reps = $('#reps-input-modal').val();
	newSet.weight = $('#weight-input-modal').val();
	newSet.time= $('#time-input-modal').val();

	var reps = $('#reps-input-modal').val();
	var weight = $('#weight-input-modal').val();

	var valid = validateInputSetsReps(reps,weight);
	console.log('valid: ' + valid);

	if(valid) {
		state.workout[index].sets.push(newSet);
	}
	else {
		$('#bad-input-warning-div').removeClass('hidden');
	}
}

function removeSet(setIndex,exerciseId) {
	console.log('target set index: ' + setIndex);
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
	var exerciseId = exercise.id;
	var exerciseName = exercise.name;
	var exerciseEquipment = exercise.equipment;
	var exerciseNotes = exercise.notes;
	
	var rowHTML = '<tr><td class="exercise-title">' + exerciseName + '</td><td class="exercise-sets" data-id="' + exerciseId + '"></td>' + 
		'<td><button type="button" data-name="' + exerciseName + '" data-id="' + exerciseId + '" class="btn btn-cir btn-sm btn-primary modify-set-button" data-toggle="modal" data-target="#add-set-modal">' + 
		'<span class="glyphicon glyphicon-pencil"></span></button></td></tr>';

	$('#logs-body').append(rowHTML); 
}

function renderSets(exerciseId) {
	
	var index = findIndexById(exerciseId);
	var exerciseSets = state.workout[index].sets;
	
	var setsHtml = exerciseSets.map(function(set) {
		var reps = set.reps;
		var weight = set.weight;

		var html = reps + ' X ' + weight +'<br>';
		
		return html;
	});
	
	$('td[data-id|="' + exerciseId + '"]').html(setsHtml);
}

//MODAL RENDER FUNCTIONS

function renderSetsModal(exerciseId) {
	 var index = findIndexById(exerciseId);

	 var target = state.workout[index];
	 var name = target.name;
	 var sets = target.sets;

	 var setsArray = []

	 sets.forEach(function(set) {
	 	var set_index = state.workout[index].sets.indexOf(set);
	 	
	 	var setHtml = '<tr><td>' + set.reps + '</td><td>' + set.weight + '</td><td><button class="btn btn-sm btn-danger remove-set" data-id="' + exerciseId +'" data-set-index="' + set_index + '"><span class="glyphicon glyphicon-trash"></span></button></tr>';

		setsArray.push(setHtml);
	 });
	 
	 var setsHtml = setsArray.join('');

	 $('#add-set-button-modal').attr('data-id',exerciseId);
	 $('#add-set-modal-title').html(name);
	 $('#logs-body-modal').html(setsHtml);
	 $('#add-set-button-modal').attr('data-index', index);
	 $('#save-sets-modal').attr('data-index', index);
	 $('#save-sets-modal').attr('data-id', exerciseId);
	 $('#btn-confirm-delete').attr('data-id', exerciseId);
};

//HELPER FUNCTIONS

function findIndexById(exerciseId) {
	var index;
	 
	state.workout.forEach(function(exercise) {
	 	if(exercise.id === exerciseId) {
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


function validateInputSetsReps(reps,weight) {
	
	var res = true;

	for(var i = 0; i < reps.length; i ++) {
		
		if(isNaN(reps[i])) {
			res = false;
		} else {}
	};

	for(var s = 0; s < weight.length; s ++) {
		
		if(isNaN(weight[s])) {
			res = false;
		} else {}
	};
	
	return res;
};

//API FUNCTIONS

//EVENT LISTENERS
$(function() {
	//Add Exercise

		//Add Exercise Click
		$('#add-exercise-button').click(function(e) {
			e.preventDefault();
			addExercise();
		});

		//Add Exercise Submit
		$('#add-exercise-form').submit(function(e) {
			e.preventDefault();
			addExercise();
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
			removeExercise(exerciseId);

			$('#delete-warning-div').addClass('hidden');
		});

	//Modify Sets
	$('#logs-body').on('click', '.modify-set-button', function(e) {
		e.preventDefault();

		var exercise = $(this).attr('data-id');
		
		renderSetsModal(exercise);
	});

	//Create Sets Click
	$('#add-set-button-modal').click(function(e) {
		e.preventDefault();

		var index = $(this).attr('data-index');
		var exerciseId = $(this).attr('data-id');

		addSet(index);
		renderSetsModal(exerciseId);
	});

	$('#modal-form').submit(function(e) {
		e.preventDefault();
		console.log('fired');

		var index = $(this).find('.add-set-button-modal').attr('data-index');
		console.log(index);
		var exerciseId = $(this).find('.add-set-button-modal').attr('data-id');

		addSet(index);
		renderSetsModal(exerciseId)
	})

	//Save Sets
	$('#save-sets-modal').click(function(e) {
		var exerciseId = $(this).attr('data-id');
		renderSets(exerciseId);

	});

	//Remove Set
	$('#logs-body-modal').on('click','.remove-set', function(e) {
		var setIndex = $(this).attr('data-set-index');
		var exerciseId = $(this).attr('data-id');
		
		removeSet(setIndex,exerciseId);
	});

	//Acknowledge Sets/Reps Input Error
	$('.btn-notify-bad-input').click(function(e) {
		e.preventDefault();
		$('#bad-input-warning-div').addClass('hidden');
	});
});

                     
                  
               
               
                  
                  
                     
                  
               
               
            