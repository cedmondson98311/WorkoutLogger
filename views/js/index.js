//Globals
var newUser

$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(300).fadeIn(300);
 		$("#register-form").fadeOut(300);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(300).fadeIn(300);
 		$("#login-form").fadeOut(300);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

	$('#login-form').submit(function(e) {
		e.preventDefault();
		
		var	username = $('#username').val();
		var password = $('#password').val();

		var basic = 'Basic ' + btoa(username + ":" + password)
		var settings = {
			url: '/login',
			method: 'POST',
			headers: {'Authorization': basic},
			success: function(data) {
				if(newUser) {
					window.location = '/user/user_home?username=' + username + '&new_user=true';
				}
				else {
					window.location = '/user/user_home?username=' + username;
				}
			}, 
  			error: function(jqxhr, typeString) {
  				console.log(jqxhr);
  				console.log(typeString);
  			}
		};

		$.ajax(settings);
	});

	
	$('#register-form').submit(function(e) {
		e.preventDefault();

		var firstName = $('#firstName').val();
		var email = $('#email').val();
		var username = $('#register-username').val();
		var password = $('#register-password').val();
		var confirm = $('#confirm-password').val();
		if (password !== confirm) {
			alert('Password and password confirmation must match.');
			return false;
		};
		
		var _data = JSON.stringify({
				"firstName": firstName,
				"email": email,
				"username": username,
				"password": password
			});

		var settings = {
			url: '/user_create',
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			data: _data,
			success: function(data) {
				newUser = true;
				console.log(data.status);
				$('#account-created').removeClass('hidden');
			},
			error: function(data) {
				var alertMessage = '';
				console.log(data.status);
				if(data.status === 422) alertMessage = 'Username is already taken';

				alert(alertMessage);
			}
		};

		$.ajax(settings);
		 
	}); 
});
