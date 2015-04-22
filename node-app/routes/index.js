var express = require('express'),
    router = express.Router(),
    counters = require('./../counters');

/* GET home page. */
router.get('/', function (req, res, next) {
    //статистика
    //counters.print(req, res);

    res.render('layouts/index');
});

router.get('/500.html', function (req, res, next) {
    res.render('layouts/500', {layout: false}, function (err, html) {
        res.status(500).send(html);
    });
});

router.get('/500', function (req, res, next) {
    throw new Error('Тестовая ошибка');
});

//все остальные запросы, если попадут в обход nginx - ведут на 404
router.get('*', function (req, res, next) {
    res.render('layouts/404', {layout: false}, function (err, html) {
        //статистика
        counters.print(req, res);
        res.status(404).send(html);
    });
});

module.exports = router;
