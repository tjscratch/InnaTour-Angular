(function (d, w) {
    window.partners = window.partners || {};
    var self = window.partners;

    //нужно, чтобы правильно позиционаровать попапы во фрейме
    //позиция скрола у родителя нашего фрейма
    self.parentScrollTop = null;

    self.WLType = {
        full: 'full',
        lite: 'lite',
        b2b: 'b2b'
    };

    self.lastHeight = null;
    self.frameShowed = false;
    self.lastUrl = null;
    self.clientSize = null;
    self.autoHeightTimerId = null;
    self.parentLocation = null;

    //если задан - то при клике на поиск - должен переходить на этот урл + результаты поиска
    self.jumptoUrl = null;

    var maxClientHeight = 730;

    self.getParentLocation = function () {
        return self.parentLocation = null;
    };

    //если фрейм с особой операторской страницы связного
    self.isSvyaznoyOperator = function () {
        if (self.partner!= null && self.partner.name == 'svyaznoy' && location.href.indexOf('full-wl.beta.inna.ru/svyaznoy') > -1){
            return true;
        }
        return false;
    };

    self.isTestDomain = function () {
        return (location.href.indexOf('test.inna.ru') > -1);
    };

    self.isBetaDomain = function () {
        return (location.href.indexOf('beta.inna.ru') > -1);
    };

    self.getB2b_LK = function (partner) {
        if (partner){
            if (self.isTestDomain()) {
                return partner.test_b2b_lk;
            }
            else if (self.isBetaDomain()) {
                return partner.beta_b2b_lk;
            }
            else {
                return partner.b2b_lk;
            }
        }
    };

    //скролим страницу обратно вверх, при нажатии на кнопку поиска
    self.scrollToTop = function () {
        self.parentScrollTop = 0;
        //скроллим родителя фрейма до выбора кол-ва детей
        self.setScrollPage(0, false, maxClientHeight);
    };

    self.checkNotHorizForm = function () {
        var horizForm = false;
        var par = self.getPartner();
        if (par && par.horizontalForm) {
            horizForm = true;
        }
        return !horizForm;
    };

    self.scrollToChildSelector = function () {
        //при горизонтальной форме не скролим
        if (self.checkNotHorizForm()) {
            //скроллим родителя фрейма до выбора кол-ва детей
            self.setScrollPage(120, true, maxClientHeight);
        }
    };

    self.scrollToChildSelectorItem = function () {
        //при горизонтальной форме не скролим
        if (self.checkNotHorizForm()) {
            //скроллим родителя фрейма до выбора кол-ва детей
            self.setScrollPage(200, true, maxClientHeight);
        }
    };

    self.resetParentScrollTop = function () {
        self.parentScrollTop = 0;
    };

    self.getParentLocationWithHash = function () {
        var url = document.referrer + location.hash;
        //console.log('getParentLocationWithHash', url);
        return url;
    };

    self.getParentLocationWithUrl = function (url) {
        //убирает // в урлах типа biletixsite//#/packages
        //var suffix = '\/';
        //var parent = document.referrer;
        //if (url != null && url.length > 0 && url.indexOf(suffix) == 0) {//начинается с '/'
        //    if (parent != null && parent.length > 0 && parent.indexOf(suffix, parent.length - suffix.length) !== -1) {//заканчивается на '/'
        //        parent = parent.substring(0, parent.length - 1);
        //    }
        //}

        var suffix = '\/#\/';
        var parent = document.referrer;
        if (url != null && url.length > 0 && url.indexOf(suffix) == 0) {//начинается с '/#/'
            url = url.replace('/#/', '#/');
        }
        return parent + url;
    };

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
        //for (var i = 0; i < self.partnersMap.length; i++) {
        //    var par = self.partnersMap[i];
        //    par.realType = self.getPartnerType(par);
        //}

        if (self.partner){
            self.partner.realType = self.getPartnerType(self.partner);
        }
    };
    self.extendProp();

    self.commands = {
        setHeight: 'setHeight',
        setVisible: 'setVisible',
        setFrameScrollTo: 'setFrameScrollTo',
        setScrollTop: 'setScrollTop',
        setScrollPage: 'setScrollPage',
        saveUrlToParent: 'saveUrlToParent',
        setParentLocationHref: 'setParentLocationHref',
        setOptions: 'setOptions',
        loaded: 'loaded'
    };

    self.isFullWL = function () {
        var partner = self.getPartner();
        return partner != null && partner.realType == self.WLType.full;
    };
    self.isLiteWL = function () {
        var partner = self.getPartner();
        return partner != null && partner.realType == self.WLType.lite;
    };
    self.isB2BWL = function () {
        var partner = self.getPartner();
        return partner != null && partner.realType == self.WLType.b2b;
    };
    self.isFullWLOrB2bWl = function () {
        var partner = self.getPartner();
        return partner != null && (partner.realType == self.WLType.b2b || partner.realType == self.WLType.full);
    };
    self.isWL = function () {
        return (self.isFullWL() || self.isLiteWL() || self.isB2BWL());
    };
    self.getPartner = function () {
        return self.partner;

        //var host = location.hostname;
        //for (var i = 0; i < self.partnersMap.length; i++) {
        //    var partner = self.partnersMap[i];
        //
        //    if (host.indexOf(partner.name) > -1) {
        //        return self.partnersMap[i];
        //    }
        //}
        //return null;
    };

    self.setScrollTo = function (scrollTo) {
        if (scrollTo) {
            sendCommandToParent(self.commands.setFrameScrollTo, { 'scrollTo': scrollTo });
        }
    };

    self.setScrollPage = function (data, smooth, maxHeight) {
        if (data != null) {
            sendCommandToParent(self.commands.setScrollPage, { 'scrollPage': data, 'smooth': smooth, 'maxHeight': maxHeight });
        }
    };

    self.showFrame = function () {
        if (!self.frameShowed) {
            //console.log('self.showFrame');
            sendCommandToParent(self.commands.setVisible, { 'visible': true });
            sendCommandToParent(self.commands.setHeight, { 'height': getContentHeight() });
            self.frameShowed = true;
        }
    };

    self.afterBodyLoad = function () {
        if (self.isFullWL()) {
            addCssToBody();
        }

        self.liteWLControl.changePageData();

        //отслеживание изменения высоты контента
        //self.contentSizeWatcher = new contentSizeWatcher();
        //self.contentSizeWatcher.init(function (height) {
        //    sendCommandToParent(self.commands.setHeight, { 'height': height });
        //});
    };

    self.saveUrlToParent = function () {
        var url = location.href;
        if (self.lastUrl != url) {
            self.lastUrl = url;
            var hashIndex = url.indexOf('#');
            if (hashIndex > -1) {
                url = url.substring(hashIndex);
                sendCommandToParent(self.commands.saveUrlToParent, { 'url': url });
            }
        }
    };

    self.setFixedContentHeight = function () {
        if (self.clientSize) {
            stopAutoHeightUpdateTimer();

            var height = self.clientSize.height - self.clientSize.top - 4;//высота экрана минус 4px
            //console.log('setFixedContentHeight', height);
            updateHeight(height);
        }
    };

    self.setAutoContentHeight = function () {
        setAutoHeightUpdateTimer();

        updateHeight();
    };

    self.setParentLocationHref = function (url) {
        if (url && url.length > 0) {
            sendCommandToParent(self.commands.setParentLocationHref, { 'url': url });
        }
    };

    function addCssToBody() {
        var cn = document.body.className;
        cn += ' partner-body-noscroll';
        document.body.className = cn;
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
        //var src = '/svyaznoy/svyaznoy.base.css';
        //var src = '/full_wl/full_wl.base.css';
        //var src = '/biletix/biletix.base.css';

        var link = d.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";

        var uniqKey = Math.random(1000).toString(16);

        if (partner.realType == window.partners.WLType.full
            || partner.realType == window.partners.WLType.b2b) {
            //если не задан css партнера - грузим FullWL - по умолчанию
            if (src && src.length > 0)
            {
                link.href = "/spa/styl/partners" + src + '?' + uniqKey;
            }
            else {
                link.href = "/spa/styl/partners/full_wl/full_wl.base.css?" + uniqKey;
            }
        }
        else if (partner.realType == window.partners.WLType.lite) {
            link.href = "/spa/styl/partners/lite_wl/lite_wl.base.css" + '?' + uniqKey;
        }
        insertAfter(link, d.getElementById("partners-css-inject"))
        console.log('partner css loaded', link.href);

        var html = document.getElementsByTagName('html')[0];
        //навешиваем стиль партнера
        html.className = html.className + " partner-wl partner-" + partner.name;
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function addCommonEventListener(el, event, fn) {
        if (el.addEventListener) {
            el.addEventListener(event, fn, false);
        } else {
            el.attachEvent('on' + event, fn);
        }
    }

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
            if (window.parent) {
                window.parent.postMessage(msg, '*');
            }
        }
    }

    function getDocumentSize() {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;
        return { x: x, y: y };
    }

    function getContentHeight() {
        var el = document.getElementById('main-content-div');
        if (el) {
            var height = el.offsetHeight;
            return height;
        }
    }

    function receiveMessage(event) {
        //console.log('receiveMessage, event:', event);
        var data = {};
        try {
            data = JSON.parse(event.data);
        }
        catch (e) {
        }
        //console.log('receiveMessage, data:', data);
        if (data) {
            switch (data.cmd) {
                case 'processScrollTop': processScrollTop(data); break;
                case 'clientSizeChange': processClientSizeChange(data); break;
                case 'frameSetLocationUrl': processFrameSetLocationUrl(data); break;
                case 'frameSaveLocationUrl': processFrameSaveLocationUrl(data); break;
                case 'setOptions': processSetOptions(data); break;
            }
        }
    }

    function processSetOptions(data) {
        //console.log('processSetCustomCss, data:', data);
        if (data.options) {
            //пришло событие, что поменялся location.href в родительском окне
            if (data.options.css != null && data.options.css.length > 0) {
                var link = d.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = data.options.css;
                //var uniqKey = Math.random(1000).toString(16);
                insertAfter(link, d.getElementById("partners-css-inject"))
                console.log('custom partner css loaded', link.href);
            }

            if (data.options.jumpto != null && data.options.jumpto.length > 0) {
                self.jumptoUrl = data.options.jumpto;
                console.log('jumptoUrl set:', self.jumptoUrl);
            }
        }
    }

    function processFrameSaveLocationUrl(data) {
        //console.log('processFrameSaveLocationUrl, data:', data);
        //пришло событие, что поменялся location.href в родительском окне
        if (data.href != null && data.href.length > 0) {
            self.parentLocation = data.href;
        }
    }

    function processFrameSetLocationUrl(data) {
        //пришло событие, что поменялся location.href в родительском окне
        //меняем location в нашем фрейме
        if (data.urlHash != null && data.urlHash.length > 0) {
            var url = location.protocol + '//' + location.hostname + '/' + data.urlHash;
            //console.log('processFrameSetLocationUrl', url);
            location.href = url;
        }
    }

    function processScrollTop(data) {
        //console.log('processScrollTop: ', data.top);
        self.parentScrollTop = data.top;
    }

    function processClientSizeChange(data) {
        if (data && data.doc) {
            self.clientSize = {
                width: data.doc.x,
                height: data.doc.y,
                top: data.top
            };
            //console.log('self.clientSize: ', self.clientSize);
        }
    }

    function updateHeight(contentHeight) {
        var height;
        if (contentHeight != null) {
            height = contentHeight;
        }
        else {
            height = getContentHeight();
        }
        if (self.lastHeight != height) {
            self.lastHeight = height;
            sendCommandToParent(self.commands.setHeight, { 'height': height });
        }
    }

    //function trackWindowResize(e) {
    //    console.log('trackWindowResize');
    //    //нам нужно отслеживать изменение размера контента
    //    if (self.contentSizeWatcher) {
    //        self.contentSizeWatcher.onResize();
    //    }
    //}

    //function contentSizeWatcher() {
    //    var csw = this;
    //    csw.element = document.getElementById('main-content-div');
    //    csw.lastHeight = null;
    //    csw.callbackFn = null;
    //    csw.init = function (fn) {
    //        csw.callbackFn = fn;
    //    }

    //    csw.onResize = function () {
    //        console.log('onResize');
    //        if (csw.lastHeight != csw.element.offsetHeight) {
    //            csw.lastHeight = csw.element.offsetHeight;
    //            if (csw.callbackFn) {
    //                csw.callbackFn(csw.lastHeight);
    //            }
    //        }
    //    }
    //}

    function setAutoHeightUpdateTimer() {
        self.autoHeightTimerId = setInterval(function () {
            updateHeight();
        }, 100);
    }

    function stopAutoHeightUpdateTimer() {
        if (self.autoHeightTimerId) {
            clearInterval(self.autoHeightTimerId);
        }
    }

    var partner = self.getPartner();
    if (partner != null) {
        insertCssAndAddParnterClass(partner);

        //просто показываем фрейм (если он не показался до этого)
        setTimeout(function () {
            //console.log('self.showFrame timeout');
            self.showFrame();
        }, 1500);

        //отслеживание изменения высоты контента
        setAutoHeightUpdateTimer();

        //слушаем скролл
        addCommonEventListener(window, 'scroll', trackScroll);

        //слушаем ресайз
        //addCommonEventListener(window, 'resize', trackWindowResize);

        //слушаем события из window.parent
        addCommonEventListener(window, 'message', receiveMessage);

        //отправляем событие, что фрейм загрузился, и можно ему что-то слать
        sendCommandToParent(self.commands.loaded, { });
    }

}(document, window));