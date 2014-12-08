var application = application || {};

application.dataOperator = (function () {
    function Operator(rootUrl) {
        this.song = new Song(rootUrl);
        this.genre = new Genre(rootUrl);
        this.playlist = new Playlist(rootUrl);
    }

    var Song = (function () {
        function Song(rootUrl) {
            this.rootUrl = rootUrl;
        }

        Song.prototype.getAllSongs = function (targetUrl) {
            return ajaxRequester.get(this.rootUrl + targetUrl);
        };

        Song.prototype.addSongFile = function (targetUrl, songFile) {
            return ajaxRequester.post(this.rootUrl + targetUrl, songFile, false, false);
        };

        Song.prototype.addSongObject = function (targetUrl, songData) {
            return ajaxRequester.post(this.rootUrl + targetUrl, songData, true, true)
        };

        Song.prototype.addFunction = function (targetUrl) {
            return ajaxRequester.post(this.rootUrl + targetUrl, null, true, true);
        };

        Song.prototype.editSong = function (targetUrl, songId, data) {
            return ajaxRequester.put(this.rootUrl + targetUrl + songId, data);
        };

        Song.prototype.deleteSong = function (targetUrl, songId) {
            return ajaxRequester.delete(this.rootUrl + targetUrl + songId);
        };

        Song.prototype.addComment = function(targetUrl, songId, commentData){
            return ajaxRequester.put(this.rootUrl + targetUrl + songId, commentData)
        };

        return Song;
    }());

    var Genre = (function(){
        function Genre (rootUrl){
            this.rootUrl = rootUrl;
        }

        Genre.prototype.getAllGenres = function(targetUrl){
            return ajaxRequester.get(this.rootUrl + targetUrl);
        };

        return Genre;
    }());

    var Playlist = (function(){
        function Playlist(rootUrl){
            this.rootUrl = rootUrl;
        }

        Playlist.prototype.getAllPlaylists = function(targetUrl){
           return ajaxRequester.get(this.rootUrl + targetUrl)
        };

        Playlist.prototype.addPlaylist = function(targetUrl, playlistData){
          return ajaxRequester.post(this.rootUrl + targetUrl, playlistData);
        };

        Playlist.prototype.addComment = function(targetUrl, playlistId, commentData){
            return ajaxRequester.put(this.rootUrl + targetUrl + playlistId, commentData)
        };

        return Playlist;
    }());

    function getOperator(rootUrl) {
        return new Operator(rootUrl);
    }

    return{
        get: getOperator
    }
}());