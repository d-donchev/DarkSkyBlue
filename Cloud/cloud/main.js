
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
