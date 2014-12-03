var request = require('request');
var jar = request.jar();


module.exports = function (req, res, next) {

    var objCookie = Object.keys(req.cookies);
    var cookieString = "";

    if (objCookie.length) {
        for (var val in req.cookies) {
            var cook = request.cookie(val + '=' + req.cookies[val]);
        }
    }

    request({
            method: 'POST',
            url: 'https://inna.ru/api/v1/Account/Info/Post',
            json: true
        },
        function (error, response, body) {
            if (!error) {
                console.log(body)
            }
        });

    return {
        AgencyActive: true,
        AgencyId: 2,
        AgencyName: "Тестим Агенства",
        Email: "admin@testinna.ru",
        FirstName: "Администратор",
        IsSocial: false,
        LastName: "Агенства",
        MessagesCount: 0,
        Phone: "+79253050336",
        SupportPhone: "+7-495-742-17-17",
        Type: 2
    }
}
