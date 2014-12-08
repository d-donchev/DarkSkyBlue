(function () {
    var rootUrl = 'https:api.parse.com/1/';
    var operator = application.dataOperator.get(rootUrl);
    var controller = application.controller.get(operator);
    controller.loadSongs();
    controller.loadGenres();
}());