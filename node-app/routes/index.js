var express     = require('express'),
    router      = express.Router(),
    //counters    = require('./../counters'),
    partners    = require('./../partners/data');

/* GET home page. */
router.get('/', function (req, res, next) {
    //статистика
    //counters.print(req, res);

    if (req.xhr) {
        next();
    }
    else {
        var partner = partners.get(req);
        res.render('layouts/index', {
            partner: partner
        });
    }
});


//все остальные запросы, если попадут в обход nginx - ведут на 404
router.get('*', function (req, res, next) {
    res.render('layouts/404', {layout: false}, function (err, html) {
        //статистика
        //counters.print(req, res);
        res.status(404).send(html);
    });
});







//ToDo: test pages
router.get('/500.html', function (req, res, next) {
    res.render('layouts/500', {layout: false}, function (err, html) {
        res.status(500).send(html);
    });
});

router.get('/500', function (req, res, next) {
    throw new Error('Тестовая ошибка');
});

module.exports = router;
