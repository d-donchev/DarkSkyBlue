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
        this.playlistsUrl = 'classes/Playlist/';
        this.filesUrl = 'files/';
        this.functionsUrl = 'functions/';
        this.addEventHandlers();
    }

    Controller.prototype.loadSongs = function () {
        var _this = this;
        _this.operator.song.getAllSongs(_this.songsUrl)
            .then(function (data) {
                _this.showSongs(data);
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
                            .then(function (songs) {
                                _this.showSongs(songs);
                            })
                    })
            })
            .fail(function () {
                showMessage('Cannot upload song file', 'error');
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
                        _this.showSongs(data);
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
        _this.operator.song.addComment(_this.songsUrl, songId, commentData)
            .then(function () {
                _this.loadSongs();
            })
            .fail(function () {
                showMessage('Cannot add comment', 'error');
            })
    };

    Controller.prototype.loadGenres = function () {
        var _this = this;
        _this.operator.genre.getAllGenres(_this.genresUrl)
            .then(function (genres) {
                $.each(genres.results, function (_, value) {
                    $('<div>').addClass('genre').text(value.genre).appendTo('#genres-container')
                })
            })
    };

    Controller.prototype.createPlaylist = function (playlistData) {
        var _this = this;
        _this.operator.playlist.addPlaylist(_this.playlistsUrl, playlistData)
            .then(function () {
                showMessage('Playlist successfully created', 'success');
                _this.loadSongs();
            })
            .fail(function () {
                showMessage('Cannot create playlist', 'error');
            })
    };

    Controller.prototype.addSongToPlaylist = function (songId, playlistData) {
        var _this = this;
        _this.operator.song.editSong(this.songsUrl, songId, playlistData)
            .then(function () {
                showMessage('Song added to playlist successfully', 'success');
            })
            .fail(function () {
                showMessage('Cannot add song to playlist', 'error');
            })
    };

    Controller.prototype.loadPlaylists = function () {
        var _this = this;
        _this.operator.playlist.getAllPlaylists(_this.playlistsUrl)
            .then(function (playlists) {
                var select = $('.select-playlist');
                $.each(playlists.results, function (_, value) {
                    $('<option>').data('playlist', value).text(value.name).appendTo(select);
                })
            })
            .fail(function () {
                showMessage('Cannot load playlists', 'error');
            })
    };

    Controller.prototype.loadPlaylistSongs = function () {
        var _this = this;
        _this.operator.song.getAllSongs(_this.songsUrl)
            .then(function (data) {
                var playlistsContainer = $('#playlists-container');
                $.each(data.results, function (_, song) {
                    if (song.playlistName) {
                        var playlistWrapper = $('<div>').addClass('playlist-wrapper').appendTo(playlistsContainer);
                        $('<div>').addClass('playlist-name').text(song.playlistName).appendTo(playlistWrapper);
                        $('<div>').addClass('song').append($('<a>').attr('href', song['song'].url).text(song.songName)).appendTo(playlistWrapper);
                        $('<div>').addClass('playlist-comments-container').appendTo(playlistWrapper);
                        $('<button>').addClass('add-playlist-comment').text('Add Comment').appendTo(playlistWrapper);
                        $('<textarea>').addClass('playlist-comment-content').appendTo(playlistWrapper).hide();
                        $('<button>').addClass('submit-playlist-comment').data('playlist', song.playlist).text('Add').appendTo(playlistWrapper).hide();
                    }
                })
            })
            .fail(function () {
                showMessage('Cannot load playlists', 'error');
            })
    };

    Controller.prototype.addCommentToPlaylist = function (playlistId, comment) {
        var _this = this;
        var user = localStorage.getObject('user');
        var userName = user.firstName;
        var obj = {};
        obj[userName] = comment;
        var commentData = JSON.stringify({
            "comments": {"__op": "AddUnique", "objects": [obj]}
        });
        _this.operator.playlist.addComment(_this.playlistsUrl, playlistId, commentData)
            .then(function (data) {
                $('.current').html('');
                $.each(data.comments, function (_, value) {
                    $.each(value, function (user, comment) {
                        $('<div>').text(user + ' said ' + "'" + comment + "'").appendTo($('.current'))
                    })
                });
                $('.playlist-comments-container').removeClass('current');
            })
            .fail(function () {
                showMessage('Cannot add comment', 'error');
            })
    };

    Controller.prototype.addEventHandlers = function () {
        var _this = this;
        var eventWrapperSongs = $('#songs-container');
        var eventWrapperPlaylists = $('#playlists-container');

        // add song
        $('#fileselect').change(function () {
            var extension = this.value.substr(this.value.length - 3);
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
                    showMessage('File type not allowed', 'error');
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
        eventWrapperSongs.on('click', '.delete-song-button', function () {
            var song = $(this).data('song');
            _this.deleteSong(song);
        });

        // add comment to song
        eventWrapperSongs.on('click', '.load-text-area', function () {
            $(this).next().fadeIn('slow');
            $(this).next().next().fadeIn('slow');
        });
        eventWrapperSongs.on('click', '.submit', function () {
            var songId = $(this).attr('song-id');
            var comment = htmlEntities($(this).prev().val());
            _this.addCommentToSong(songId, comment);
            $(this).fadeOut('slow');
            $(this).prev().fadeOut('slow');
        });

        // create playlist
        var loadPlaylistName = $('#create-playlist');
        var playlistNameField = $('#playlist-name');
        var createButton = $('#create');
        loadPlaylistName.click(function () {
            playlistNameField.fadeIn('slow');
            createButton.fadeIn('slow');
        });

        playlistNameField.change(function () {
            createButton.removeAttr('disabled')
        });

        createButton.click(function () {
            var playListName = htmlEntities($(this).prev().val());
            var playlistData = JSON.stringify({
                'name': playListName
            });
            _this.createPlaylist(playlistData);
        });

        // add song to playlist
        eventWrapperSongs.on('change', '.select-playlist', function () {
            $(this).next().fadeIn('slow');
        });

        eventWrapperSongs.on('click', '.add-to-playlist-button', function () {
            var playlist = $(this).prev().find('option:selected').data('playlist');
            var song = $(this).data('song');
            var playlistData = JSON.stringify({
                "playlistName": playlist.name,
                "playlist": {
                    "__type": "Pointer",
                    "className": "Playlist",
                    "objectId": playlist.objectId
                }
            });

            _this.addSongToPlaylist(song.objectId, playlistData);
            $(this).fadeOut();
        });

        // show playlists with songs
        $('#show-playlists').click(function () {
            _this.loadPlaylistSongs();
        });

        // add comment to playlist
        eventWrapperPlaylists.on('click', '.add-playlist-comment', function () {
            $(this).next().fadeIn('slow');
            $(this).next().next().fadeIn('slow');
        });

        eventWrapperPlaylists.on('click', '.submit-playlist-comment', function () {
            var playlist = $(this).data('playlist');
            var comment = htmlEntities($(this).prev().val());
            _this.addCommentToPlaylist(playlist.objectId, comment);
            $(this).fadeOut('slow');
            $(this).prev().fadeOut('slow');
            $(this).prev().prev().prev().addClass('current');
        })
    };

    Controller.prototype.showSongs = function (songs) {
        var _this = this;
        $('#uploadbutton').attr('disabled', "disabled");
        $('#songs-container').html("");
        for (var s in songs.results) {
            var songObj = songs.results[s]['song'];
            var song = songs.results[s];
            var songUrl = songObj.url;
            var songName = songs.results[s].songName;
            var songContainer = $('<div>').addClass("displayedSongs");
            $('<a>').attr("href", songUrl).text(songName).appendTo(songContainer);
            $('<button>').addClass("delete-song-button").data('song', song).text("Delete").appendTo(songContainer);
            $('<a>').addClass('download-button').attr('href', songUrl).attr('download', songName).text('Download').appendTo(songContainer);
            var select = $('<select>').addClass('select-playlist').data('song', song).text('Add To Playlist').appendTo(songContainer);
            $('<option>').text('Add To Playlist').attr('disabled', 'disabled').appendTo(select);
            $('<button>').addClass('add-to-playlist-button').data('song', song).text('Add').appendTo(songContainer);

            var commentsContainer = $('<div>').addClass('comments');
            var commentsList = $('<div>').addClass('comments-list').attr('song-id', song.objectId).appendTo(commentsContainer);
            var comments = songs.results[s].comments;
            if (songs.results[s].comments) {
                showSongComments(comments, commentsList)
            }
            $('<button>').addClass('load-text-area').attr('song-id', song.objectId).text('Add comment').appendTo(commentsContainer);
            $('<textarea>').addClass('comment-content').attr('song-id', song.objectId).appendTo(commentsContainer).hide();
            $('<button>').addClass('submit').attr('song-id', song.objectId).text('Add').appendTo(commentsContainer).hide();
            commentsContainer.appendTo(songContainer);
            songContainer.appendTo($('#songs-container'));
        }
        _this.loadPlaylists();
    };

    function showSongComments(comments, selector) {
        $.each(comments, function (key) {
            $.each(comments[key], function (key, value) {
                $('<div>').addClass('comment').text(key + ' said ' + "'" + value + "'").appendTo(selector)
            })
        })
    }

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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