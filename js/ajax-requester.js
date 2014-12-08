var ajaxRequester = (function () {
    var headers = {
        "X-Parse-Application-Id": "LlxgjVpQeDR5hNQwUeurn7FvwDsJ5asIediNz4gS",
        "X-Parse-REST-API-Key": "hSiN54s0we68AaQaQJCauFXNfE4w8J3nPppcRyPE"
    };
    var performRequest = function (method, url, data, processData, contentType) {
        var deferred = $.Deferred();
        $.ajax({
            method: method,
            headers: headers,
            url: url,
            data: data,
            processData: processData,
            contentType: contentType,
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (error) {
                deferred.reject(error);
            },
            progress:function(event){
                deferred.notify(event);
            }
        });

        return deferred.promise();
    };

    function performGetRequest(url) {
        return performRequest('GET', url, null, true, 'application/json');
    }

    function performPostRequest(url, data, processData, contentType) {
        return performRequest('POST', url, data, processData, contentType);
    }

    function performPutRequest(url, data) {
        return performRequest('PUT', url, data, true, 'application/json');
    }

    function performDeleteRequest(url) {
        return performRequest('DELETE', url, null);
    }

    return{
        get: performGetRequest,
        post: performPostRequest,
        put: performPutRequest,
        delete: performDeleteRequest
    }
}());