//GLOBAL VARIABLES
var workout = [];

//API FUNCTIONS

//EVENT LISTENERS
$(function() {
	$('#add_set_button').click(function(e) {
		e.preventDefault();
		var _exercise = {};
		var _sets = [];
		
		_exercise.name = $('#exercise').val();
		_exercise.equipment = $('input[name=equipment]:checked', '#workout').val();
		_exercise.category = $('input[name=category]:checked', '#workout').val();
		_exercise.notes = $('#notes').val();
		_exercise.sets=[]
		var _reps = $('#reps').val();
		var _weight = $('#weight').val();

		var temp_set = {
			reps:_reps,
			weight:_weight
		};

		_exercise.sets.push(temp_set);

		console.log(_exercise); 
	});
});

//CACHED VARIABLES
var weightsAndRepsHTML = '<div id="weight_and_reps"><div class="form-group"><label for="reps" class="col-sm-2 col-form-label">Reps</label><div class="col-sm-3">' +
'<input type="text" class="form-control" id="reps"></div></div><div class="form-group"><label for="weight" class="col-sm-2 col-form-label">Weight</label><div class="col-sm-3">' +
'<input type="text" class="form-control" id="weight"></div></div><button class="btn" id="add_set_button">Add Set</button></div>'
                     
                  
               
               
                  
                  
                     
                  
               
               
            