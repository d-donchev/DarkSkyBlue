// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
//Parse.Cloud.define("hello", function(request, response) {
//  response.success("Hello world!");
//});

Parse.Cloud.define("show", function(request, response) {
  var query = new Parse.Query("SongsStorage");
  query.find({
    success: function(results) {
      response.success(results);
    },

    error: function(error) {
      // error is an instance of Parse.Error.
    }
  });
});

Parse.Cloud.define("delete", function(request, response) {


  var routeQuery = new Parse.Query("SongsStorage");
  var resultsArray = [];
  routeQuery.each(
    function(result) {
      if (result.get("forDelete") === true) {
        resultsArray.push(result.get("songFileName"));
         Parse.Cloud.httpRequest({
                                       method: 'DELETE',
                                       url: "https://api.parse.com/1/files/" + result.get("songFileName"),
                                       headers: {
                                        "X-Parse-Application-Id": "LlxgjVpQeDR5hNQwUeurn7FvwDsJ5asIediNz4gS",
                                        "X-Parse-Master-Key" : "ymbyUxlC9smIS2c5jfYQFjC9tThumZYWHPlBq9nE"
                                       },
                                       success: function(httpResponse) {
                                            response.success(httpResponse);
                                       },
                                       error: function(httpResponse) {
                                                response.error(httpResponse);
                                       }
                                       }) ;
      }
    }, {
      success: function() {
        response.success(resultsArray);
      },
      error: function(error) {
        // error is an instance of Parse.Error.
        console.log('@error');
        response.error(error.message);
      }
    });
});