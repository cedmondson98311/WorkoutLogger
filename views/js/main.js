var mock_data = {
	logs: [
		{
			id:"111111",
			date:"December 17, 1995 03:24:00",
			workout: [
				{
					name:"Bench Press",
					equipment:"barbell",
					category:"weight_reps",
					notes:"",
					sets:[
							{
								reps:"8",
								weight:"225"
							},
							{
								reps:"8",
								weight:"225"
							},								
							{
								reps:"8",
								weight:"225"
							}
						]
				},
				{
					name:"Triceps Push Down",
					equipment:"cables",
					category:"weight_reps",
					notes:"",
					sets:[
							{
								reps:"8",
								weight:"75"
							},
							{
								reps:"8",
								weight:"75"
							},								
							{
								reps:"6",
								weight:"75"
							}
						]
				},
				{
					name:"Running",
					equipment:"Treadmill",
					category:"time",
					notes:"",
					sets:[
							{
								time:"30",
								speed_mph:"6",
								speed_kph:"",
								incline:"0",
								calories:"350"
							}
						]
				}
			]
		},
		{
			id:"111111",
			date:"December 18, 1995 03:24:00",
			workout: [
				{
					name:"Bench Press",
					equipment:"barbell",
					category:"weight_reps",
					notes:"",
					sets:[
							{
								reps:"8",
								weight:"225"
							},
							{
								reps:"8",
								weight:"225"
							},								
							{
								reps:"8",
								weight:"225"
							}
						]
				},
			]
		}
	],
	user_exercises: [
		{
			name:"weird yoga exercise",
			equipment:"yoga mat",
			category:"reps_only"
		}
	]
};

function displayLogs(data) {
	
	for (index in data.logs) {
		var base = data.logs[index];
		$('body').append('<p>Date: ' + base.date + '</p>')
			for (var i = 0; i < base.workout.length; i ++) {
				$('body').append('<p>Exercise: ' + base.workout[i].name + '<br>')
					for (var s = 0; s < base.workout[i].sets.length; s ++) {

						if(base.workout[i].category == 'weight_reps') {
						
						$('body').append('<ul><li>Reps: ' + base.workout[i].sets[s].reps + '&nbsp&nbsp&nbspWeight: ' + base.workout[i].sets[s].weight + '</li>')

					} else if (base.workout[i].category == 'time') {

						$('body').append('<ul><li>Time: ' + base.workout[i].sets[s].time + '&nbsp&nbsp&nbspEquipment: ' + base.workout[i].equipment + '</li>')
					}
				};
			};
		$('body').append('<br>');
		}
};

displayLogs(mock_data);
				