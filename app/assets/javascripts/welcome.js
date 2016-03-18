$(document).ready(function() {
	var baseUrl = 'http://devpoint-ajax-example-server.herokuapp.com/api/v1/users';	

	function fullName(first, last) {
		if (first && last) {
			return first + ' ' + last;
		} else if (first && !last) {
			return first;
		} else if ( !first && last ) {
			return last;
		} else {
			return 'No name';
		}
	}

	if(location.pathname === '/') {

		$.ajax({
			url: baseUrl,
			type: 'GET',
			dataType: 'JSON',
			success: function(data) {
				var tbody = $('#users');
				data.users.forEach(function(user) {
					var name = fullName(user.first_name, user.last_name);
					var phoneNumber = user.phone_number ? user.phone_number : '123-456-7890';
					var row = '<tr><td>' + name + '</td>';
							row += '<td>' + phoneNumber + '</td>';
							row += '<td><button data-id="' + user.id + '" class="btn btn-primary">Show</button></td></tr>';
							tbody.append(row);
				});
			},
			error: function(error) {
				alert(error);
			}
		});

		$(document).on('click', '.btn', function() {
			var id = this.dataset.id;
			location.href = '/welcome/' + id;
		});
	}

	var regexr = /\/welcome\/\d+/;
	if(location.pathname.match(regexr)) {
		var panel = $('#panel');
		var id = panel.data('id');
		$.ajax({
			url: baseUrl + '/' + id,
			type: 'GET',
			dataType: 'JSON',
			success: function(data) {
				var user = data.user;
				panel.children('#heading').html(fullName);
				var list = $('#user');
				var nameGame = '<li>Name: ' + user.first_name + user.last_name + '</li>';
				var phoneNumberGame = '<li>Phone Number: ' + user.phone_number + '</li>';
				var remove = '<li><button class="btn btn-danger" id="remove">Delete</button></li>';
				var edit = '<li><button class="btn btn-danger" id="edit">Edit</button></li>';
				list.append(nameGame);
				list.append(phoneNumberGame);
				list.append(remove);
				list.append(edit);
			}
		});

		$(document).on('click', '#remove', function() {
			$.ajax({
				url: baseUrl + '/' + id,
				type: 'DELETE',
				success: function() {
					location.href = '/';
				}
			});
		});
		$(document).on('click', '#edit', function() {
				$.ajax({
					url: baseUrl + '/' + id,
					type: 'EDIT',
					success: function() {
						location.href = '/';
				}
			});
		});
	}

	$('#new_user').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			url: baseUrl,
			type: 'POST',
			dataType: 'JSON',
			data: $(this).serializeArray(),
			success: function(data) {
				alert(data.user);
				location.href = '/';
			}
		});
	});

	$('#edit_user').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			url: baseUrl,
			type: 'PUT',
			dataType: 'JSON',
			data: $(this).serializeArray(),
			success: function(data) {
				alert(data.user);
				location.href = '/';
			}
		});
	});
});