$(function() {
			
			var PARSE_APP_ID = "LlxgjVpQeDR5hNQwUeurn7FvwDsJ5asIediNz4gS";
			var PARSE_REST_API_KEY = "hSiN54s0we68AaQaQJCauFXNfE4w8J3nPppcRyPE";
			
				Storage.prototype.setObject = function setObject(key, obj) {
					this.setItem(key, JSON.stringify(obj));
				};

				Storage.prototype.getObject = function getObject(key) {
					return JSON.parse(this.getItem(key));
				};
				Storage.prototype.removeKey = function removeKey(key){ 
					this.removeItem(this.key(key)) 
				};
			checkLogin();
			
			$("#submit_login").click(loginUsers);
			$("#submit_create").click(createUsers);
			
			
			function createUsers() {
			    $('.registerForm').css('display', 'block');
			    $('.register').first().css('display', 'none');
                // username, password, againPass, firstName, lastName, email
			    $('#registerSubmit').click(function () {
			        var userName = $("#registerUserName").val();
			        var password = $("#registerPassword").val();
			        var password2 = $("#againPassword").val();
			        var firstName = $("#registerFirstName").val();
			        var lastName = $("#registerLastName").val();
			        var email = $("#registerEmail").val();

			        $.ajax({
			            method: "POST",
			            headers: {
			                "X-Parse-Application-Id": PARSE_APP_ID,
			                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
			            },
			            url: "https://api.parse.com/1/users",
			            data: JSON.stringify(
                            {
                                "username": userName,
                                "password": password,
                                "firstName": firstName,
                                "lastName": lastName,
                                "email": email

                            }),
			            contentType: "application/json",
			            success: loginSuccess,
			            error: showError
			        })
			    });
			}
			
			function loginUsers(){
				var username= $("#username").val();
				var password= $("#password").val();

				$.ajax({
					method: "GET",
					headers: {
					"X-Parse-Application-Id": PARSE_APP_ID,
					"X-Parse-REST-API-Key": PARSE_REST_API_KEY
					},
					url: "https://api.parse.com/1/login?username="+username+"&password="+password,
					success:loginSuccess,
					error: showErrorLogin
				});

			}
			
			function logOutUsers(){
				localStorage.removeKey('user');
				$('.login').hide();
				showLoginForm();	
			}
			
			function hiddenLoginForm(){
				$('.error').hide();
				$('.header').hide();
				$('.content').hide();
				$('.footer').hide();
			}

			function showLoginForm()
			{
				$('.header').show();
				$('.content').show();
				$('.footer').show();
			
			}
			
			function loginSuccess(data){
					var user = data;
					localStorage.setObject('user', user);
					hiddenLoginForm();
					getUserInfo();
					
				}
				
			function getUserInfo(){
				var user;
				if((user=localStorage.getObject('user'))!== null){
					$('.login').show();
					$('.login h1').html('Welcome '+user.username+" <div id='logout'>LogOut</div>");
					
					$("#logout").click(logOutUsers);//Should redirect to our index page
					
				}
			}
			
			function checkLogin(){
					var  user;
					if((user=localStorage.getObject('user'))!== null){
						$.ajax({
							method: "GET",
							headers: {
							"X-Parse-Application-Id": PARSE_APP_ID,
							"X-Parse-REST-API-Key": PARSE_REST_API_KEY,
							"X-Parse-Session-Token": user.sessionToken
							},
							url: "https://api.parse.com/1/users/me",
							success:function() {
								hiddenLoginForm();
								getUserInfo();
								
							},
							error: showError	
						});
				}
			}
			function showError(){
					$('.error').show().text('Error to login');
			}
			function showErrorLogin(){
					$('.error').show().text('Error to login');
			}
		});