var express  = require('express'),
    router   = express.Router(),
    //counters    = require('./../counters'),
    partners = require('./../partners/data'),
    fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    //статистика
    //counters.print(req, res);

    if (req.xhr) {
        next();
    }
    else {
        partners.get(req, function (err, partner) {
            if (err) {
                res.render('layouts/500', {layout: false}, function (err, html) {
                    res.status(500).send(html);
                });
            }
            else {
                res.render('layouts/index', {
                    partner: partner,
                    isSputnik: partner != null ? partner.isSputnik : null
                });
            }
        });
    }
});


router.get('/print/paymnet', function (req, res, next) {
    res.render('payment/print', {
        layout: 'blank'
    });
});

/**
 * личный кабинет разработка
 */
router.get('/dev/lk', function (req, res, next) {
    res.render('lk/index', {
        layout: 'lk'
    });
});
router.get('/dev/lk/settings', function (req, res, next) {
    res.render('lk/settings', {
        layout: 'lk'
    });
});
router.get('/dev/lk/search-widget', function (req, res, next) {
    res.render('lk/search-widget', {
        layout: 'lk'
    });
});

router.get('/wl-test/:partner/', function(req, res, next){

    var partner = req.params.partner;
    var urlRootGeneric = './spa/wl-test/_generic/';

    var urlRoot;
    if (partner){
        urlRoot = './spa/wl-test/' + partner + '/';
        if (!fs.existsSync(urlRoot)) {
            urlRoot = urlRootGeneric;
        }
    } else {
        urlRoot = urlRootGeneric;
    }

    res.sendFile('index.html', {root: urlRoot });
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
