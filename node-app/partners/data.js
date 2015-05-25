var _       = require('lodash');

module.exports = {
    get: function (req) {
        var partner = null;

        var hostName = req.headers.host;
        var partnerName = getPartnerFromHostName(hostName);
        //console.log(partnerName);

        if (partnerName){
            //ToDo: тут будет запрос в api, а не просто поиск в массиве
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

        return partner;
    }
};

var domainsList = ['lh.inna.ru', 'test.inna.ru', 'beta.inna.ru', 'inna.ru'];

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

var partnersMap = [
    {
        'name': 'sample',
        'src': '',
        'type': self.WLType.lite,
        'title': 'sample',
        'phone': '+7&nbsp;800 000-1111',
        'email': 'sample@sample.ru',
        'skype': 'sample',
        'aboutLink': 'https://sample.ru/about',
        'contactsLink': 'https://sample.ru/contacts',
        'offertaContractLink': ''
    },
    {
        'name': 'demo',
        'src': '',
        'type': self.WLType.full,
        'title': 'sample',
        'phone': '+7&nbsp;800 000-1111',
        'email': 'demo@demo.ru',
        'skype': 'demo',
        'aboutLink': 'https://demo.ru/about',
        'contactsLink': 'https://demo.ru/contacts',
        'offertaContractLink': '',
        'showOffers': true,
        'horizontalForm': true
    },
    {
        'name': 'sputnik',
        'domain': 'tours.sputnik.travel',
        'b2b_lk': 'https://lk.sputnik.travel',
        'test_b2b_lk': 'http://b2b.sputnik.test.inna.ru',
        'beta_b2b_lk': 'http://b2b.sputnik.beta.inna.ru',
        'src': '/sputnik/sputnik.base.css',
        'type': self.WLType.b2b,
        'title': 'Спутник',
        'phone': '8 (800) 700 000 6',
        'email': '',
        'skype': '',
        'aboutLink': 'http://sputnik.idemstudio.ru/company/',
        'contactsLink': 'http://sputnik.idemstudio.ru/info/contacts/',
        'offertaContractLink': 'https://tours.sputnik.travel/spa/partners/sputnik/offer_sputnik.pdf',
        'showOffers': true,
        'horizontalForm': true,
        'dontScrollAfterSearch': false
    },
    {
        'name': 'biletix',
        'src': '/biletix/biletix.base.css',
        'type': self.WLType.full,
        'title': 'Билетикс',
        'phone': '+7&nbsp;495 741-4672',
        'email': 'support@biletix.ru',
        'skype': '',
        'aboutLink': 'https://biletix.ru/about_biletix/',
        'contactsLink': 'https://biletix.ru/contacts/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_biletix.pdf',
        'showOffers': true,
        'horizontalForm': false,
        'dontScrollAfterSearch': true
    },
    {
        'name': 'rusline',
        'src': '/rusline/rusline.base.css',
        'type': self.WLType.full,
        'title': 'Руслайн',
        'phone': '+7&nbsp;495 933 23 33',
        'email': '',
        'skype': '',
        'aboutLink': 'http://www.rusline.aero/contact_information/',
        'contactsLink': 'http://www.rusline.aero/contact_information/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_rusline.pdf',
        'showOffers': true,
        'horizontalForm': true
    },
    {
        'name': 'ulixes',
        'src': '/ulixes/ulixes.base.css',
        'type': self.WLType.full,
        'title': 'Ulixes',
        'phone': '+7&nbsp;(495) 215 08 09',
        'email': 'ta@ulixes.ru',
        'skype': '',
        'aboutLink': 'http://www.ulixes.ru/o_kompanii/',
        'contactsLink': 'http://www.ulixes.ru/contacti/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_ulixes.pdf',
        'showOffers': true
    },
    {
        'name': 'skycassa',
        'src': '',
        'type': self.WLType.full,
        'title': 'SKYcassa',
        'phone': '+7&nbsp;(495) 287 46 26',
        'email': 'info@skycassa.com',
        'skype': '',
        'aboutLink': 'http://www.skycassa.com/about/',
        'contactsLink': 'http://www.skycassa.com/contacts/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_skycassa.pdf',
        'showOffers': true
    },
    {
        'name': 'atlantravel',
        'src': '',
        'type': self.WLType.full,
        'title': 'Атлантис',
        'phone': '+7&nbsp;(495) 730 21 44',
        'email': 'info@atlantravel.ru',
        'skype': 'Atlantis2073',
        'aboutLink': 'http://www.atlantravel.ru/o-kompanii/',
        'contactsLink': 'http://www.atlantravel.ru/kontakty.html',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_atlantis.pdf',
        'showOffers': true
    },
    {
        'name': 'yourway',
        'src': '',
        'type': self.WLType.full,
        'title': 'Travel company  YOUR WAY',
        'phone': '+7&nbsp;(812) 441 33 65',
        'email': 'zakaz@yourway.spb.ru',
        'skype': 'vashput',
        'aboutLink': 'http://www.yourway.spb.ru/pages/533/',
        'contactsLink': 'http://www.yourway.spb.ru/pages/533/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_yourway.pdf',
        'showOffers': true
    },
    {
        'name': 'kru-god',
        'src': '',
        'type': self.WLType.full,
        'title': 'Турагентство «Отдых круглый год»',
        'phone': '+7&nbsp;(3822) 909303',
        'email': 'info@kru-god.ru',
        'skype': '',
        'aboutLink': 'http://kru-god.ru/about/',
        'contactsLink': 'http://kru-god.ru/about/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_kru-god.pdf',
        'showOffers': true
    },
    {
        'name': 'e-good',
        'src': '',
        'type': self.WLType.full,
        'title': 'ООО "Эконом"',
        'phone': '+7&nbsp;(495) 989 44 21',
        'email': 'inna@e-good.ru',
        'skype': '',
        'aboutLink': 'http://e-good.ru/',
        'contactsLink': 'http://e-good.ru/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_e-good.pdf',
        'showOffers': true
    },
    {
        'name': 'paristour',
        'src': '',
        'type': self.WLType.full,
        'title': 'Туристическое агентство  «Париж-Тур»',
        'phone': '8&nbsp;(8793) 390-400',
        'email': 'parizhtour1@mail.ru',
        'skype': 'daprus',
        'aboutLink': 'http://www.xn--80amf0agcni.xn--p1ai/kontakty/o-kompanii',
        'contactsLink': 'http://www.xn--80amf0agcni.xn--p1ai/kontakty',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_paristour.pdf',
        'showOffers': true
    },
    {
        'name': 'delfin33',
        'src': '',
        'type': self.WLType.full,
        'title': 'ООО «Турагентство Дельфин»',
        'phone': '+74922451478',
        'email': '33delfin@list.ru',
        'skype': '',
        'aboutLink': 'http://www.delfin33.ru/',
        'contactsLink': 'http://www.delfin33.ru/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_delfin.pdf',
        'showOffers': true
    },
    {
        'name': 'valeryclub',
        'src': '',
        'type': self.WLType.full,
        'title': 'Туристическая компания «VALERY CLUB»',
        'phone': '+74957640722',
        'email': 'valeryclub@list.ru',
        'skype': '',
        'aboutLink': 'http://valeryclub.msk.ru/',
        'contactsLink': 'http://valeryclub.msk.ru/contacts.html',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_valery_club.pdf',
        'showOffers': true
    },
    {
        'name': 'vip-cipservice',
        'src': '',
        'type': self.WLType.lite,
        'title': 'ООО «ХИЛЕН»',
        'phone': '+7(495) 971 78 65',
        'email': 'info@vip-cipservice.ru',
        'skype': '',
        'aboutLink': 'http://www.vip-cipservice.ru/',
        'contactsLink': 'http://www.vip-cipservice.ru/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_hilentravel.pdf'
    },
    {
        'name': 'allseasons-tour',
        'src': '',
        'type': self.WLType.full,
        'title': 'ООО «Все сезоны»',
        'phone': '+7(495)755 80 30',
        'email': 'booking@freesboo.ru',
        'skype': '',
        'aboutLink': 'http://www.freesboo.ru',
        'contactsLink': 'http://www.freesboo.ru/kontakty.html',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_allseasons.pdf',
        'showOffers': true
    },
    {
        'name': '24trip',
        'src': '',
        'type': self.WLType.full,
        'title': 'ООО «АЛЬФА»',
        'phone': '+7(495)724-7210',
        'email': 'booking@24trip.ru',
        'skype': '',
        'aboutLink': 'http://www.24trip.ru/index.php?option=com_content&view=category&layout=blog&id=218&Itemid=523',
        'contactsLink': 'http://www.24trip.ru/index.php?option=com_contact&view=category&id=227&Itemid=616',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_24trip.pdf',
        'showOffers': true
    },
    {
        'name': 'svyaznoy',
        'src': '/svyaznoy/svyaznoy.base.css',
        'type': self.WLType.full,
        'title': 'svyaznoy',
        'phone': '+7&nbsp;(495) 287 46 26',
        'email': 'info@svyaznoy.com',
        'skype': '',
        'aboutLink': 'http://www.svyaznoy.ru/about/',
        'contactsLink': 'http://www.svyaznoy.ru/contacts/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_svyaznoy.pdf',
        'horizontalForm': true,
        'showOffers': true
    },
    {
        'name': 'samaraintour',
        'src': '/svyaznoy/svyaznoy.base.css',
        'type': self.WLType.full,
        'title': 'samaraintour',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_samaraintour.pdf',
        'showOffers': true,
        'horizontalForm': true
    },
    {
        'name': 'tntur',
        'src': '',
        'type': self.WLType.full,
        'title': 'tntur',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_tntur.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'ekaterinatours',
        'src': '',
        'type': self.WLType.full,
        'title': 'Екатерина Турс',
        'phone': '+7&nbsp;(985) 427 70 42',
        'email': 'support@ekaterinatours.ru',
        'skype': 'katerina4753',
        'aboutLink': 'http://ekaterinatours.ru/kontakty/',
        'contactsLink': 'http://ekaterinatours.ru/kontakty/',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_ekaterinatours.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'marinika',
        'src': '',
        'type': self.WLType.full,
        'title': 'marinika',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_marinika.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'tur100dorog',
        'src': '',
        'type': self.WLType.full,
        'title': 'tur100dorog',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_tur100dorog.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'cheie-tur',
        'src': '',
        'type': self.WLType.full,
        'title': 'cheie-tur',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_cheie-tur.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'optimist-tur',
        'src': '',
        'type': self.WLType.full,
        'title': 'optimist-tur',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_optimist-tur.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'clubutes',
        'src': '',
        'type': self.WLType.full,
        'title': 'clubutes',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_clubutes.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'tourberi',
        'src': '',
        'type': self.WLType.full,
        'title': 'tourberi',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_tourberi.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'euroset',
        'src': '/euroset/euroset.base.css',
        'type': self.WLType.full,
        'title': 'euroset',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_euroset.pdf',
        'horizontalForm': false,
        'showOffers': false
    },
    {
        'name': 'your-time',
        'src': '',
        'type': self.WLType.full,
        'title': 'your-time',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_your-time.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'balt-west-tur',
        'src': '',
        'type': self.WLType.full,
        'title': 'balt-west-tur',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_balt-west-tur.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
    {
        'name': 'tur-orange',
        'src': '',
        'type': self.WLType.full,
        'title': 'tur-orange',
        'phone': '',
        'email': '',
        'skype': '',
        'aboutLink': '',
        'contactsLink': '',
        'offertaContractLink': 'https://s.inna.ru/files/doc/offer_tur-orange.pdf',
        'showOffers': true,
        'horizontalForm': false
    },
];