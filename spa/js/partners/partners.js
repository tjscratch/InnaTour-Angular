(function (d, w) {
    window.partners = {};
    var self = window.partners;

    self.WLType = {
        full: 'full',
        lite: 'lite'
    }

    self.partnersMap = [
        {
            'name': 'biletix',
            'src': '/biletix/biletix.base.css',
            'type': self.WLType.full,
            'title': 'Билетикс',
            'phone': '+7&nbsp;495 741-4672',
            'aboutLink': 'https://biletix.ru/about_biletix/',
            'contactsLink': 'https://biletix.ru/contacts/',
            'offertaContractLink': 'http://s.test.inna.ru/files/doc/offer_biletix.pdf'
        },
        {
            'name': 'agenda',
            'src': '/agenda/agenda.base.css',
            'type': self.WLType.lite,
            'title': 'agenda',
            'phone': '+7&nbsp;888 742-1212',
            'aboutLink': 'https://www.agenda.travel/Other/About#tab=Agenda',
            'contactsLink': 'http://blog.agenda.travel/',
            'offertaContractLink': ''
        }
    ];

    self.isBookinnaDomain = function () {
        return (location.hostname.indexOf('bookinna') > -1);
    };
    self.getPartnerType = function (partner) {
        if (self.isBookinnaDomain()) {
            return window.partners.WLType.lite;
        }
        return partner.type;
    };

    self.extendProp = function() {
        for (var i = 0; i < self.partnersMap.length; i++) {
            var par = self.partnersMap[i];
            par.realType = self.getPartnerType(par);
        }
    }
    self.extendProp();

    self.commands = {
        setVisible: 'setVisible',
        setFrameScrollTo: 'setFrameScrollTo',
        setScrollTop: 'setScrollTop'
    };

    self.isFullWL = function () {
        var partner = self.getPartner();
        return partner != null && partner.realType == self.WLType.full;
    }
    self.getPartner = function () {
        //return self.partnersMap[0];

        var host = location.hostname;
        for (var i = 0; i < self.partnersMap.length; i++) {
            var partner = self.partnersMap[i];

            if (host.indexOf(partner.name) > -1) {
                return self.partnersMap[i];
            }
        }
        return null;
    };

    self.setScrollTo = function (scrollTo) {
        if (scrollTo) {
            sendCommandToParent(self.commands.setFrameScrollTo, { 'scrollTo': scrollTo });
        }
    }

    function liteWLControl(partner) {
        var self = this;
        self.changePageData = function () {
            if (partner && partner.realType == window.partners.WLType.lite) {
                //document.getElementById('').setAttribute('')
                //logo
                var logoEl = document.getElementsByClassName('js-company-logo')[0];
                logoEl.alt = partner.name;
                logoEl.title = partner.name;

                //телефон в шапке
                document.getElementsByClassName('js-company-phone-head')[0].innerHTML = partner.phone;

                //телефон в футере
                var phoneElement = document.getElementsByClassName('js-company-phone')[0];
                phoneElement.innerHTML = partner.phone;
                phoneElement.className = phoneElement.className.replace('partners-hide', '');

                //ссылка о компании
                document.getElementsByClassName('js-company-about')[0].href = partner.aboutLink;
                document.getElementsByClassName('js-company-about')[1].href = partner.aboutLink;
                //ссылка контакты
                document.getElementsByClassName('js-company-contacts')[0].href = partner.contactsLink;
            }
        }
    }
    //запускается внизу страницы
    self.liteWLControl = new liteWLControl(self.getPartner());

    function insertCssAndAddParnterClass(partner) {
        var src = partner.src;
        var link = d.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";

        if (partner.realType == window.partners.WLType.full) {
            link.href = "/spa/styl/partners" + src;
        }
        else if (partner.realType == window.partners.WLType.lite) {
            link.href = "/spa/styl/partners/lite_wl/lite_wl.base.css";
        }
        insertAfter(link, d.getElementById("partners-css-inject"))
        console.log('partner css loaded', link.href);

        var html = document.getElementsByTagName('html')[0];
        //навешиваем стиль партнера
        html.className = html.className + " partner-" + partner.name;
    };

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function addCommonEventListener(el, event, fn) {
        if (el.addEventListener) {
            el.addEventListener(event, fn, false);
        } else {
            el.attachEvent('on' + event, fn);
        }
    };

    function trackScroll(e) {
        var doc = document.documentElement, body = document.body;
        var top = (doc && doc.scrollTop || body && body.scrollTop || 0);
        sendCommandToParent(self.commands.setScrollTop, { 'top': top });
    }

    function sendCommandToParent(cmd, data) {
        if (arguments && arguments.length > 1) {

            var obj = arguments[1];
            var keys = [];
            for (var k in obj) keys.push(k);

            //ставим команду
            var cmdObj = { 'cmd': arguments[0] };
            var data = arguments[1];

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                //ставим данные
                cmdObj[key] = data[key];
            }
            var msg = JSON.stringify(cmdObj);
            //console.log('msg', msg);
            window.parent.postMessage(msg, '*');
        }
    }

    var partner = self.getPartner();
    if (partner != null) {
        insertCssAndAddParnterClass(partner);

        //просто показываем фрейм
        setTimeout(function () { sendCommandToParent(self.commands.setVisible, { 'visible': true }); }, 0);

        //слушаем скролл
        addCommonEventListener(window, 'scroll', trackScroll);
    }

}(document, window));