var express     = require('express'),
    router      = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.xhr) {
        next();
    }
    else {
        var hostName = req.headers.host;
        var partnerName = getPartnerFromHostName(hostName);
        //console.log(partnerName);

        res.render('layouts/index', {
            partnerName: partnerName
        });
    }
});

var domainsList = ['lh.inna.ru','test.inna.ru','beta.inna.ru', 'inna.ru'];

function getPartnerFromHostName(text){
    if (text) {
        domainsList.forEach(function (item) {
            text = text.replace('.' + item, '');
            text = text.replace(item, '');
        });
    }
    return text;
}

module.exports = router;