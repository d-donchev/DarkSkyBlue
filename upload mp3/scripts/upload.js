(function() {
	$(document).ready(function() {
		var file;

		$('#fileselect').change(function() {
			var ext = this.value.match(/\.(.+)$/)[1];
			switch (ext) {
				case 'mp3':
				case 'wav':
				case 'ogg':
					$('#uploadbutton').removeAttr('disabled');
					$('#uploadbutton').click(uploadSong);
					break;
				default:
					$('#uploadbutton').attr('disabled', "disabled");
					alert('This is not an allowed file type.');
					this.value = '';
			}
		});

		$('#btn-upload').click(function() {
			$('#fileselect').click();
			// Set an event listener on the Choose File field.
			$('#fileselect').bind("change", function(e) {
				files = e.target.files || e.dataTransfer.files;
				// Our file var now holds the selected file
				file = files[0];

			});
		});

		

		var PARSE_APP_ID = "LlxgjVpQeDR5hNQwUeurn7FvwDsJ5asIediNz4gS";
		var PARSE_API_KEY = "hSiN54s0we68AaQaQJCauFXNfE4w8J3nPppcRyPE";
		loadSongs();

		function loadSongs() {
			$.ajax({
				method: 'GET',
				headers: {
					"X-Parse-Application-Id": PARSE_APP_ID,
					"X-Parse-REST-API-Key": PARSE_API_KEY
				},
				url: "https://api.parse.com/1/classes/SongsStorage",
				success: songsLoaded,
				error: songsLoadedError
			});
		}

		function songsLoaded(data) {
			$('#uploadbutton').attr('disabled', "disabled");
			$('#showSongs').html("");
			for (var s in data.results) {
				var songObj = data.results[s]['song'];
				var song = songObj.url;
				var songName = data.results[s].songName;
				var div = $('<div>').addClass("dipslayedSongs");
				var link = $('<a>').attr("href", song);
				link.text(songName);
				link.appendTo(div);
				div.appendTo($('#showSongs'));

			}
		}

		function uploadSong() {
			var songGenre = $('#songGenre option:selected').text();
			// This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
			var songName = file.name.match(/(.+).\./)[1];
			var serverUrl = 'https://api.parse.com/1/files/' + songName;

			$.ajax({
				type: "POST",
				beforeSend: function(request) {
					request.setRequestHeader("X-Parse-Application-Id", 'LlxgjVpQeDR5hNQwUeurn7FvwDsJ5asIediNz4gS');
					request.setRequestHeader("X-Parse-REST-API-Key", 'hSiN54s0we68AaQaQJCauFXNfE4w8J3nPppcRyPE');
					request.setRequestHeader("Content-Type", file.type);
				},
				url: serverUrl,
				data: file,
				processData: false,
				contentType: false,
				success: function(data) {

					alert("File available at: " + data.url);
					writeSongToSongsStorage(data, songGenre,songName);
				},
				error: function(data) {
					var obj = jQuery.parseJSON(data);
					alert(obj.error);
				}
			});

		}

		function writeSongToSongsStorage(data, songGenre,songName) {
			var songUrl = data.url;
			$.ajax({
				method: 'POST',
				headers: {
					"X-Parse-Application-Id": PARSE_APP_ID,
					"X-Parse-REST-API-Key": PARSE_API_KEY
				},
				url: "https://api.parse.com/1/classes/SongsStorage",
				data: JSON.stringify({
					"songName": songName,
					"songGenre": songGenre,
					"song": {
						"__type": "File",
						"name": data.name,
						"url": songUrl
					}
				}),
				contentType: "application/json",
				success: loadSongs,
				error: songsLoadedError
			});
		}

		function songUploaded() {
			console.log("uploaded");
		}

		function songsUploadedError() {
			console.log("Error");
		}

		function songsLoadedError(e) {
			console.log(e);
		}
	});
}());

// delete file - https://api.parse.com/1/files/ + file.name
//  "X-Parse-Master-Key": "ymbyUxlC9smIS2c5jfYQFjC9tThumZYWHPlBq9nE" \

