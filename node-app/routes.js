var counters = require('./counters');

module.exports = function (app) {

    //корень - отдаем index
    app.route('/')
        .get(function (req, res, next) {
            //статистика
            counters.print(req, res);

            res.render('layouts/index');
        });

    app.route('/500.html')
        .get(function (req, res, next) {
            app.render('layouts/500', { layout: false }, function (err, html) {
                res.status(500).send(html);
            });
        });

    app.route('/500')
        .get(function (req, res, next) {
            throw new Error('Тестовая ошибка');
        });

    //все остальные запросы, если попадут в обход nginx - ведут на 404
    app.get('*', function (req, res, next) {
        app.render('layouts/404', { layout: false }, function (err, html) {
            //статистика
            counters.print(req, res);
            res.status(404).send(html);
        });
    });
}
