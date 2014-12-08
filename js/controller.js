var application = application || {};

Storage.prototype.getObject = function getObject(key) {
    return JSON.parse(this.getItem(key));
};

application.controller = function () {
    var file;

    function Controller(dataOperator) {
        this.operator = dataOperator;
        this.songsUrl = 'classes/SongsStorage/';
        this.genresUrl = 'classes/songGenre/';
        this.filesUrl = 'files/';
        this.functionsUrl = 'functions/';
        this.addEventHandlers();
    }

    Controller.prototype.loadSongs = function () {
        var _this = this;
        _this.operator.song.getAllSongs(_this.songsUrl)
            .then(function (data) {
                showSongs(data);
            })
            .fail(function () {
                showMessage('Cannot load songs', 'error');
            })
    };

    Controller.prototype.addSong = function (extension) {
        var _this = this;
        $('#prog').progressbar({
            value: 0
        });
        var songGenre = $('#songGenre option:selected').text();
        // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
        var songName = file.name.substring(0, file.name.indexOf(extension) - 1);

        _this.operator.song.addSongFile(_this.filesUrl + songName, file)
            .then(function (data) {
                var songUrl = data.url;
                var songData = JSON.stringify({
                    "songName": songName,
                    "songGenre": songGenre,
                    "songFileName": data.name,
                    "forDelete": false,
                    "song": {
                        "__type": "File",
                        "name": data.name,
                        "url": songUrl
                    }
                });
                _this.operator.song.addSongObject(_this.songsUrl, songData)
                    .then(function () {
                        $('#progress-wrapper').html("");
                        $("<div>").attr('id', 'prog').appendTo($("#progress-wrapper"));
                        showMessage('Song successfully uploaded', 'success');
                        _this.operator.song.getAllSongs(_this.songsUrl)
                            .then(function (data) {
                                showSongs(data);
                            })
                    })
            })
            .fail(function () {
                showMessage('Cannot upload song', 'error');
            })
            .progress(function (e) {
                if (e.lengthComputable) {
                    var pct = (e.loaded / e.total) * 100;
                    $('#prog')
                        .progressbar('option', 'value', pct)
                        .children('.ui-progressbar-value')
                        .html(pct.toPrecision(3) + '%')
                        .css('display', 'block');
                } else {
                    console.warn('Content Length not reported!');
                }
            })
    };

    Controller.prototype.deleteSong = function (song) {
        var _this = this;

        var songData = JSON.stringify({"forDelete": true});
        _this.operator.song.editSong(_this.songsUrl, song.objectId, songData)
            .then(function () {
                _this.operator.song.addFunction(_this.functionsUrl + 'delete')
            })
            .then(function () {
                _this.operator.song.deleteSong(_this.songsUrl, song.objectId);
            })
            .then(function () {
                _this.operator.song.getAllSongs(_this.songsUrl)
                    .then(function (data) {
                        showSongs(data);
                    })
            })
            .fail(function () {
                showMessage('Cannot delete song', 'error');
            })
    };

    Controller.prototype.addCommentToSong = function (songId, comment) {
        var _this = this;

        var user = localStorage.getObject('user');
        var userName = user.firstName;

        var obj = {};
        obj[userName] = comment;
        var commentData = JSON.stringify({
            "comments": {"__op": "AddUnique", "objects": [obj]}
        });
        _this.operator.songComment.addComment(_this.songsUrl, songId, commentData)
            .then(function () {
                $('.submit').hide();
                _this.loadSongs();
            })
            .fail(function () {
                showMessage('Cannot add comment', 'error');
            })
    };

    Controller.prototype.loadGenres = function(){
        var _this = this;
        _this.operator.genre.getAllGenres(_this.genresUrl)
            .then(function(data){
                showGenres(data);
            })

    };

    Controller.prototype.createPlaylist = function(){
        //todo
    };

    Controller.prototype.addCommentToPlaylist = function(){
        //todo
    };

    Controller.prototype.addEventHandlers = function () {
        var _this = this;
        var eventWrapper = $('#showSongs');

        // add song
        $('#fileselect').change(function () {
            var extension = this.value.match(/\.(.+)$/)[1];
            switch (extension) {
                case 'mp3':
                case 'wav':
                case 'ogg':
                    $('#uploadbutton').removeAttr('disabled');
                    $('#uploadbutton').click(function () {
                        _this.addSong(extension)
                    });
                    break;
                default:
                    $('#uploadbutton').attr('disabled', "disabled");
                    alert('This is not an allowed file type.');
                    $(this).value = '';
            }
        });

        $('#btn-upload').click(function () {
            $('#fileselect').click();
            // Set an event listener on the Choose File field.
            $('#fileselect').bind("change", function (e) {
                files = e.target.files || e.dataTransfer.files;
                // Our file var now holds the selected file
                file = files[0];
            });
        });

        // delete song
        eventWrapper.on('click', '.delete-song-button', function () {
            var song = $(this).data('song');
            _this.deleteSong(song);
        });

        // add comment to song
        eventWrapper.on('click', '.load-text-area', function () {
            $(this).next().show();
            $(this).next().next().show();
        });
        eventWrapper.on('click', '.submit', function () {
            var songId = $(this).attr('song-id');
            var comment = $(this).prev().val();
            _this.addCommentToSong(songId, comment);
        });
    };


    function showSongs(data) {
        $('#uploadbutton').attr('disabled', "disabled");
        $('#showSongs').html("");
        for (var s in data.results) {
            var songObj = data.results[s]['song'];
            var song = data.results[s];
            var songUrl = songObj.url;
            var songName = data.results[s].songName;
            var songContainer = $('<div>').addClass("displayedSongs");
            var link = $('<a>').attr("href", songUrl);
            var $delete = $('<button>').addClass("delete-song-button").text("Delete");
            $delete.data('song', song);
            $delete.appendTo(songContainer);
            $('<a>').addClass('download-button').attr('href', songUrl).attr('download', songName).text('Download').appendTo(songContainer);
            link.text(songName);
            link.appendTo(songContainer);
            var commentsContainer = $('<div>').addClass('comments');
            var commentsList = $('<div>').addClass('comments-list').attr('song-id', song.objectId).appendTo(commentsContainer);
            var comments = data.results[s].comments;
            if (data.results[s].comments) {
                showSongComments(comments, commentsList)
            }
            $('<button>').addClass('load-text-area').attr('song-id', song.objectId).text('Add comment').appendTo(commentsContainer);
            $('<textarea>').addClass('comment-content').attr('song-id', song.objectId).appendTo(commentsContainer).hide();
            $('<button>').addClass('submit').attr('song-id', song.objectId).text('Add').appendTo(commentsContainer).hide();
            commentsContainer.appendTo(songContainer);
            songContainer.appendTo($('#showSongs'));
        }
    }

    function showSongComments(comments, selector) {
        $.each(comments, function (key) {
            $.each(comments[key], function (key, value) {
                $('<div>').addClass('comment').text(key + ' said ' + "'" + value + "'").appendTo(selector)
            })
        })
    }

    function showGenres(genres){
        $.each(genres.results, function(key, value){
            $('<div>').addClass('comment').text(value.genre).appendTo('#genres-container')
        })
    }

    function showMessage(message, type) {
        noty({
            text: $('<h2>').text(message),
            layout: 'center',
            timeout: 2000,
            type: type
        })
    }

    function getController(dataOperator) {
        return new Controller(dataOperator);
    }

    return {
        get: getController
    }
}();