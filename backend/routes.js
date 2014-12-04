var _         = require('underscore')
    , url     = require('url')
    , path    = require('path')
    , fs      = require('fs')
    , getUserInfo    = require('./module/auth')
    , request = require('request');


var baseRequest = request.defaults({
    headers: {
        'x-token': 'my-token'
    }
});

module.exports = function (app) {

    /**
     * Перехватываем все GET запросы и проверяем:
     * Если req.xhr, то передаем управление на след. роутер
     * Иначе рендерим шаблон
     */
    app.route('*/?')
        .get(function (req, res, next) {

            if (req.xhr) {
                next();
            }
            else {

                function renderIndexPage(data) {
                    res.render('index', {
                        userData: data
                    });
                };

                getUserInfo(req, res, next).then(function (data) {
                    renderIndexPage(data)
                }).fail(function () {
                    renderIndexPage(null)
                })
            }
        })
}
