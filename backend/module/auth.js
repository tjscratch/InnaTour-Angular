var request = require('request');
var jar = request.jar();
var Q = require('q');

module.exports = function (req, res, next) {

    var def = Q.defer();

    var objCookie = Object.keys(req.cookies);

    if (objCookie.length && req.cookies['.ASPXAUTH']) {

        request({
                method: 'POST',
                url: 'https://inna.ru/api/v1/Account/Info/Post',
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
