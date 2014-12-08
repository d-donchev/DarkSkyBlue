var application = application || {};

application.dataOperator = (function () {
    function Operator(rootUrl) {
        this.song = new Song(rootUrl);
        this.songComment = new SongComment(rootUrl);
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

    var SongComment = (function(){
        function SongComment(rootUrl){
            this.rootUrl = rootUrl;
        }

        SongComment.prototype.addComment = function(targetUrl, songId, commentData){
            return ajaxRequester.put(this.rootUrl + targetUrl + songId, commentData)
        };

        return SongComment;
    }());

    var Playlist = (function(){
        function Playlist(rootUrl){
            this.rootUrl = rootUrl;
        }

        Playlist.prototype.addComment = function(){
            //todo
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