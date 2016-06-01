var _       = require('lodash'),
    http    = require("http"),
    https   = require("https"),
    fs      = require('fs'),
    conf    = require('../config/config.json');

module.exports = {
    get: function (req, callback) {
        var partner = null;

        var hostName = req.headers.host;
        var partnerName = getPartnerFromHostName(hostName);
        //console.log(partnerName);

        cacheLogic.getData(function (err, partnersMap) {
            if (err) {
                return callback(err, partner);
            }

            if (partnerName){
                //поиск партнера
                var data = _.find(partnersMap, function (item) {
                    return item.name == partnerName || item.domain == hostName;
                });

                if (data){
                    partner = { data: data, jsonData: JSON.stringify(data) };
                }
            }

            if (partner && data.name == 'sputnik'){
                partner.isSputnik = true;
            }

            callback(null, partner);
        });
    }
};

//берем из конфига
var apiHost = 'api.test.inna.ru';
var apiPort = 80;
if (conf.apiHost == '@@api_host'){
    //ничего не делаем
}
else if (conf.apiHost) {
    if (conf.apiHost.indexOf('https://') > -1) {
        //apiPort = 443;
        apiPort = 80;//на бою тоже стучимся по http, https почему-то не работает с app-01
        apiHost = conf.apiHost.replace('https://', '');
    }
    else if (conf.apiHost.indexOf('http://') > -1) {
        apiPort = 80;
        apiHost = conf.apiHost.replace('http://', '');
    }
}
console.log('apiHost:', apiHost, 'port:', apiPort);

var domainsList = ['lh.bookinna.ru', 'test.bookinna.ru', 'beta.bookinna.ru', 'bookinna.ru',
    'lh.inna.ru', 'test.inna.ru', 'beta.inna.ru', 'inna.ru'];

function getPartnerFromHostName(text) {
    if (text) {
        domainsList.forEach(function (item) {
            text = text.replace('.' + item, '');
            text = text.replace(item, '');
        });
    }
    return text;
}

var self = {
    WLType: {
        full: 'full',
        lite: 'lite',
        b2b: 'b2b'
    }
};

function getPartnersMap(callback) {
    var options = {
        host: apiHost,
        port: apiPort,
        path: '/api/v1/partner/getall?key=123',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    getJSON(options, function (statusCode, result) {
        //ToDo: debug err
        //return callback('err', null);

        if (statusCode != 200){
            return callback('err', null);
        }

        //bind model
        result = bindModelAndSetDefaults(result);

        callback(null, result);
    });

    function bindModelAndSetDefaults(result) {
        if (result && result.length > 0){
            for(var i=0; i< result.length; i++){
                var item = result[i];
                var type = self.WLType.full;//по-умолчанию full-wl
                switch (item.type){
                    case 'WLSearch': {
                        type = self.WLType.lite;
                        break;
                    }
                    case 'WLReservation':
                    {
                        type = self.WLType.full;

                        //дефолтное значение стенки и типа формы
                        if (item.showOffers === undefined){
                            item.showOffers = true;
                        }
                        if (item.horizontalForm === undefined){
                            item.horizontalForm = true;
                        }
                        break;
                    }
                }

                item.type = type;

                //приведение name
                //item.cmsName = item.name;
                item.name = item.shortName ? item.shortName.toLowerCase() : '';
                delete item.shortName;

                //пока что удаляю логотип за ненадобностью
                delete item.logoBase64;

                //хак для спутника
                //у него тип - b2b wl
                if (item.name == 'sputnik') {
                    item.type = self.WLType.b2b;
                }
            }
        }
        return result;
    }
}

function getJSON(options, onResult) {
    //console.log("rest::getJSON");

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res)
    {
        var output = '';
        //console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
}

function CacheLogic() {
    var self = this;

    self.CACHE_FILE_NAME = "cache__api_v1_partner_getall.json";

    //время жизни в ms
    self.MAX_LIFE_TIME = 600000;//10 min
    //self.MAX_LIFE_TIME = 20000;//20 sec

    //последний запрос в API
    self.lastApiAccess = 0;

    //кэшированные данные
    self.data = null;

    self.getData = function (callback) {
        var isExpire = false;

        var nowDate = +(new Date());
        //сколько прошло ms с последнего доступа в API
        var timeDiff = nowDate - self.lastApiAccess;
        //если прошло более 10 min - то нужно в API
        if (timeDiff > self.MAX_LIFE_TIME){
            isExpire = true;
        }

        if (self.data && !isExpire) {
            //console.log('CacheLogic:getData - hit cache', 'timeDiff', timeDiff);
            //отдаем кэшированный результат
            callback(null, self.data);
        }
        else {

            //сохраняем время последнего доступа в API
            self.lastApiAccess = +(new Date());
            //прямой запрос в api
            getPartnersMap(function (err, data) {
                //если ошибки
                if (err) {
                    //пробуем отдать последний кэш
                    if (self.data){
                        //console.log('CacheLogic:getData - miss cache', 'timeDiff', timeDiff, 'err, return last cache');
                        return callback(null, self.data);
                    }
                    else {
                        //console.log('CacheLogic:getData - miss cache', 'timeDiff', timeDiff, 'err, return err and null');
                        //а если кэш пуст и первый запрос - то падаем
                        return callback(err, null);
                    }
                }

                //сохраняем данные в кэш
                self.data = data;
                self.saveToFile(data);
                //отдаем
                //console.log('CacheLogic:getData - miss cache', 'timeDiff', timeDiff, 'return data');
                callback(null, data);
            });
        }
    };

    self.saveToFile = function (data) {
        var stringData = JSON.stringify(data);
        fs.writeFile(self.CACHE_FILE_NAME, stringData, function(err) {
            if(err) {
                console.log('CacheLogic:saveToFile err:', err.message);
                return;
            }

            //console.log('CacheLogic:saveToFile success');
        });
    };

    self.readFromFile = function (callback) {
        fs.readFile(self.CACHE_FILE_NAME, function (err, data) {
            if (err) {
                console.log('CacheLogic:readFromFile err:', err.message);
                return callback(err, null);
            }

            //получаем объект
            var objData = JSON.parse(data);

            //проверяем что получился массив, и есть хотя бы 1 элемент
            if(Object.prototype.toString.call(objData) === '[object Array]') {
                if (objData.length > 0){
                    console.log('CacheLogic:readFromFile read success, data ok');
                    return callback(null, objData);
                }
            }

            //не массив - просто возвращает значение null
            console.log('CacheLogic:readFromFile read success, data err');
            callback(null, null);
        });
    };

    //пробуем заполнить кэш данными с диска
    (function tryFillDataFromDisk() {
        self.readFromFile(function (err, data) {
            if (err) {
                return;
            }

            self.data = data;
        })
    })();
}

var cacheLogic = new CacheLogic();


//var partnersMap = [
//    {
//        'name': 'sample',
//        'src': '',
//        'type': self.WLType.lite,
//        'title': 'sample',
//        'phone': '+7&nbsp;800 000-1111',
//        'email': 'sample@sample.ru',
//        'skype': 'sample',
//        'aboutLink': 'https://sample.ru/about',
//        'contactsLink': 'https://sample.ru/contacts',
//        'offertaContractLink': ''
//    },
//    {
//        'name': 'demo',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'sample',
//        'phone': '+7&nbsp;800 000-1111',
//        'email': 'demo@demo.ru',
//        'skype': 'demo',
//        'aboutLink': 'https://demo.ru/about',
//        'contactsLink': 'https://demo.ru/contacts',
//        'offertaContractLink': '',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'demo-vertical',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'sample',
//        'phone': '+7&nbsp;800 000-1111',
//        'email': 'demo@demo.ru',
//        'skype': 'demo',
//        'aboutLink': 'https://demo.ru/about',
//        'contactsLink': 'https://demo.ru/contacts',
//        'offertaContractLink': '',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'sputnik',
//        'domain': 'tours.sputnik.travel',
//        'b2b_lk': 'https://lk.sputnik.travel',
//        'test_b2b_lk': 'http://b2b.sputnik.test.inna.ru',
//        'beta_b2b_lk': 'http://b2b.sputnik.beta.inna.ru',
//        'src': '/sputnik/sputnik.base.css',
//        'type': self.WLType.b2b,
//        'title': 'Спутник',
//        'phone': '8 (800) 700 000 6',
//        'email': '',
//        'skype': '',
//        'aboutLink': 'http://sputnik.idemstudio.ru/company/',
//        'contactsLink': 'http://sputnik.idemstudio.ru/info/contacts/',
//        'offertaContractLink': 'https://tours.sputnik.travel/spa/partners/sputnik/offer_sputnik.pdf',
//        'TCHLink': 'https://tours.sputnik.travel/spa/partners/sputnik/TCH.pdf',
//        'showOffers': true,
//        'horizontalForm': true,
//        'dontScrollAfterSearch': false
//    },
//    {
//        'name': 'biletix',
//        'src': '/biletix/biletix.base.css',
//        'type': self.WLType.full,
//        'title': 'Билетикс',
//        'phone': '+7&nbsp;495 741-4672',
//        'email': 'support@biletix.ru',
//        'skype': '',
//        'aboutLink': 'https://biletix.ru/about_biletix/',
//        'contactsLink': 'https://biletix.ru/contacts/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_biletix.pdf',
//        'showOffers': true,
//        'horizontalForm': false,
//        'dontScrollAfterSearch': true
//    },
//    {
//        'name': 'rusline',
//        'src': '/rusline/rusline.base.css',
//        'type': self.WLType.full,
//        'title': 'Руслайн',
//        'phone': '+7&nbsp;495 933 23 33',
//        'email': '',
//        'skype': '',
//        'aboutLink': 'http://www.rusline.aero/contact_information/',
//        'contactsLink': 'http://www.rusline.aero/contact_information/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_rusline.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'ulixes',
//        'src': '/ulixes/ulixes.base.css',
//        'type': self.WLType.full,
//        'title': 'Ulixes',
//        'phone': '+7&nbsp;(495) 215 08 09',
//        'email': 'ta@ulixes.ru',
//        'skype': '',
//        'aboutLink': 'http://www.ulixes.ru/o_kompanii/',
//        'contactsLink': 'http://www.ulixes.ru/contacti/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_ulixes.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'skycassa',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'SKYcassa',
//        'phone': '+7&nbsp;(495) 287 46 26',
//        'email': 'info@skycassa.com',
//        'skype': '',
//        'aboutLink': 'http://www.skycassa.com/about/',
//        'contactsLink': 'http://www.skycassa.com/contacts/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_skycassa.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'atlantravel',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'Атлантис',
//        'phone': '+7&nbsp;(495) 730 21 44',
//        'email': 'info@atlantravel.ru',
//        'skype': 'Atlantis2073',
//        'aboutLink': 'http://www.atlantravel.ru/o-kompanii/',
//        'contactsLink': 'http://www.atlantravel.ru/kontakty.html',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_atlantis.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'yourway',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'Travel company  YOUR WAY',
//        'phone': '+7&nbsp;(812) 441 33 65',
//        'email': 'zakaz@yourway.spb.ru',
//        'skype': 'vashput',
//        'aboutLink': 'http://www.yourway.spb.ru/pages/533/',
//        'contactsLink': 'http://www.yourway.spb.ru/pages/533/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_yourway.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'kru-god',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'Турагентство «Отдых круглый год»',
//        'phone': '+7&nbsp;(3822) 909303',
//        'email': 'info@kru-god.ru',
//        'skype': '',
//        'aboutLink': 'http://kru-god.ru/about/',
//        'contactsLink': 'http://kru-god.ru/about/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_kru-god.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'e-good',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'ООО "Эконом"',
//        'phone': '+7&nbsp;(495) 989 44 21',
//        'email': 'inna@e-good.ru',
//        'skype': '',
//        'aboutLink': 'http://e-good.ru/',
//        'contactsLink': 'http://e-good.ru/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_e-good.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'paristour',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'Туристическое агентство  «Париж-Тур»',
//        'phone': '8&nbsp;(8793) 390-400',
//        'email': 'parizhtour1@mail.ru',
//        'skype': 'daprus',
//        'aboutLink': 'http://www.xn--80amf0agcni.xn--p1ai/kontakty/o-kompanii',
//        'contactsLink': 'http://www.xn--80amf0agcni.xn--p1ai/kontakty',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_paristour.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'delfin33',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'ООО «Турагентство Дельфин»',
//        'phone': '+74922451478',
//        'email': '33delfin@list.ru',
//        'skype': '',
//        'aboutLink': 'http://www.delfin33.ru/',
//        'contactsLink': 'http://www.delfin33.ru/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_delfin.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'valeryclub',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'Туристическая компания «VALERY CLUB»',
//        'phone': '+74957640722',
//        'email': 'valeryclub@list.ru',
//        'skype': '',
//        'aboutLink': 'http://valeryclub.msk.ru/',
//        'contactsLink': 'http://valeryclub.msk.ru/contacts.html',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_valery_club.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'vip-cipservice',
//        'src': '',
//        'type': self.WLType.lite,
//        'title': 'ООО «ХИЛЕН»',
//        'phone': '+7(495) 971 78 65',
//        'email': 'info@vip-cipservice.ru',
//        'skype': '',
//        'aboutLink': 'http://www.vip-cipservice.ru/',
//        'contactsLink': 'http://www.vip-cipservice.ru/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_hilentravel.pdf'
//    },
//    {
//        'name': 'allseasons-tour',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'ООО «Все сезоны»',
//        'phone': '+7(495)755 80 30',
//        'email': 'booking@freesboo.ru',
//        'skype': '',
//        'aboutLink': 'http://www.freesboo.ru',
//        'contactsLink': 'http://www.freesboo.ru/kontakty.html',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_allseasons.pdf',
//        'showOffers': true
//    },
//    {
//        'name': '24trip',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'ООО «АЛЬФА»',
//        'phone': '+7(495)724-7210',
//        'email': 'booking@24trip.ru',
//        'skype': '',
//        'aboutLink': 'http://www.24trip.ru/index.php?option=com_content&view=category&layout=blog&id=218&Itemid=523',
//        'contactsLink': 'http://www.24trip.ru/index.php?option=com_contact&view=category&id=227&Itemid=616',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_24trip.pdf',
//        'showOffers': true
//    },
//    {
//        'name': 'svyaznoy',
//        'src': '/svyaznoy/svyaznoy.base.css',
//        'type': self.WLType.full,
//        'title': 'svyaznoy',
//        'phone': '+7&nbsp;(495) 287 46 26',
//        'email': 'info@svyaznoy.com',
//        'skype': '',
//        'aboutLink': 'http://www.svyaznoy.ru/about/',
//        'contactsLink': 'http://www.svyaznoy.ru/contacts/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_svyaznoy.pdf',
//        'horizontalForm': true,
//        'showOffers': true
//    },
//    {
//        'name': 'samaraintour',
//        'src': '/svyaznoy/svyaznoy.base.css',
//        'type': self.WLType.full,
//        'title': 'samaraintour',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_samaraintour.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'tntur',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'tntur',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_tntur.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'ekaterinatours',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'Екатерина Турс',
//        'phone': '+7&nbsp;(985) 427 70 42',
//        'email': 'support@ekaterinatours.ru',
//        'skype': 'katerina4753',
//        'aboutLink': 'http://ekaterinatours.ru/kontakty/',
//        'contactsLink': 'http://ekaterinatours.ru/kontakty/',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_ekaterinatours.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'marinika',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'marinika',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_marinika.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'tur100dorog',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'tur100dorog',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_tur100dorog.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'cheie-tur',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'cheie-tur',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_cheie-tur.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'optimist-tur',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'optimist-tur',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_optimist-tur.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'clubutes',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'clubutes',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_clubutes.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'tourberi',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'tourberi',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_tourberi.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'euroset',
//        'src': '/euroset/euroset.base.css',
//        'type': self.WLType.full,
//        'title': 'euroset',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_euroset.pdf',
//        'horizontalForm': false,
//        'showOffers': true
//    },
//    {
//        'name': 'your-time',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'your-time',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_your-time.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'balt-west-tur',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'balt-west-tur',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_balt-west-tur.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'tur-orange',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'tur-orange',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_tur-orange.pdf',
//        'showOffers': true,
//        'horizontalForm': false
//    },
//    {
//        'name': 'relaxxxclub',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'relaxxxclub',
//        'phone': '+7(495) 133-16-97',
//        'email': 'mddmen@yandex.ru',
//        'skype': '',
//        'aboutLink': 'http://relaxxxclub.ru/index.php/about',
//        'contactsLink': 'http://relaxxxclub.ru/index.php/contacts',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_relaxxxclub.pdf'
//    },
//    {
//        'name': 'tur-radugasveta',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'Радуга Света',
//        'phone': '+7(950) 304-34-18',
//        'email': 'raduga-sveta-imiss@yandex.ru',
//        'skype': '',
//        'aboutLink': 'http://tur-radugasveta.ru/about',
//        'contactsLink': 'http://tur-radugasveta.ru/about',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_tur-radugasveta.pdf'
//    },
//    {
//        'name': 'mvm-voyage',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'МВМ-ВОЯЖ',
//        'phone': '+7(495) 585-22-49',
//        'email': 'info@mvm-voyage.ru',
//        'skype': '',
//        'aboutLink': 'http://mvm-voyage.ru/contact-us/about-us',
//        'contactsLink': 'http://mvm-voyage.ru/contact-us',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_mvm-voyage.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'visrael',
//        'src': '',
//        'type': self.WLType.full,
//        'title': 'visrael',
//        'phone': '+7(499) 251-16-61',
//        'email': 'mail@visrael.ru',
//        'skype': '',
//        'aboutLink': 'http://www.visrael.ru/about.html',
//        'contactsLink': 'http://www.visrael.ru/contacts.html',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_visrael.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'otpuskinfo',
//        'src': '',
//        'type': self.WLType.full,
//        'title': '',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_otpuskinfo.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'premiertur76',
//        'src': '',
//        'type': self.WLType.full,
//        'title': '',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_premiertur76.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'wientravel',
//        'src': '',
//        'type': self.WLType.full,
//        'title': '',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_wientravel.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'travel-vienna',
//        'src': '',
//        'type': self.WLType.full,
//        'title': '',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_travel-vienna.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'kolibri-dv',
//        'src': '',
//        'type': self.WLType.full,
//        'title': '',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_kolibri-dv.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'vesntour',
//        'src': '',
//        'type': self.WLType.full,
//        'title': '',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_vesntour.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'onlineservicetour',
//        'src': '',
//        'type': self.WLType.full,
//        'title': '',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_onlineservicetour.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    },
//    {
//        'name': 'viparbat',
//        'src': '',
//        'type': self.WLType.full,
//        'title': '',
//        'phone': '',
//        'email': '',
//        'skype': '',
//        'aboutLink': '',
//        'contactsLink': '',
//        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_viparbat.pdf',
//        'showOffers': true,
//        'horizontalForm': true
//    }
//];
