var request = require('request');
var jar = request.jar();
var urlsHelpers = require('../helpers/urls');
var Q = require('q');

module.exports = function (req, res, next) {

    var href = "http://" + req.headers.host + req.url;

    function AuthUser() {
    }

    AuthUser.prototype.getAuthInfo = function () {
        var def = Q.defer();

        var objCookie = Object.keys(req.cookies);

        if (objCookie.length && req.cookies['.ASPXAUTH']) {

            request({
                    method: 'POST',
                    url: href + urlsHelpers.AUTH,
                    json: true,
                    headers: {
                        'Cookie': '.ASPXAUTH=' + req.cookies['.ASPXAUTH']
                    }
                },
                function (error, response, body) {
                    if (!error) {
                        def.resolve(body);
                    } else {
                        def.reject();
                    }
                });

        } else {
            def.reject();
        }

        return def.promise;
    }


    return new AuthUser();
}
