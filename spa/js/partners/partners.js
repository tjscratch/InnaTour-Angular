(function (d, w) {
    window.partners = {};
    var self = window.partners;

    self.partnersMap = [{
        'name': 'biletix',
        'src': '/biletix/biletix.base.css'
    }, {
        'name': 'somepartner',
        'src': '/somepartner/somepartner.base.css'
    }];

    self.commands = {
        setVisible: 'setVisible',
        setHeight: 'setHeight',
        setFrameScrollTo: 'setFrameScrollTo',
        setScrollTop: 'setScrollTop'
    };

    self.isUsingPartners = function () {
        return self.getPartner() != null;
    }
    self.getPartner = function() {
        var host = location.hostname;
        for (var i = 0; i < self.partnersMap.length; i++) {
            var partner = self.partnersMap[i];

            if (host.indexOf(partner.name) > -1) {
                return self.partnersMap[i];
            }
        }
        return null;
    }

    self.setScrollTo = function (scrollTo) {
        if (scrollTo) {
            sendCommandToParent(self.commands.setFrameScrollTo, { 'scrollTo': scrollTo });
        }
    }

    function insertCss(src) {
        var link = d.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = "/spa/styl/partners" + src;
        insertAfter(link, d.getElementById("partners-css-inject"))
        console.log('partner css loaded', link.href);
    };

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function widgetCode(partnerName) {
        var html = document.getElementsByTagName('html')[0];
        //html.style.overflowY = 'hidden';
        html.className = html.className + " partner-" + partnerName;

        //var lastHeight = 0;
        //function sendHeight() {
        //    var height = $('.main').height();

        //    if (height != lastHeight) {
        //        lastHeight = height;
        //        sendCommandToParent(self.commands.setHeight, { 'height': height });
        //    }
        //}

        //function getPos(el) {
        //    for (var lx = 0, ly = 0;
        //         el != null;
        //         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
        //    return { x: lx, y: ly };
        //}

        //function sendPosition() {
        //    var w = window,
        //    d = document,
        //    e = d.documentElement,
        //    g = d.getElementsByTagName('body')[0],
        //    x = w.innerWidth || e.clientWidth || g.clientWidth,
        //    y = w.innerHeight || e.clientHeight || g.clientHeight;

        //    var msg = JSON.stringify({ 'cmd': 'setPosition', 'height': y, 'top': getPos(document.getElementById('inna-frame')).y });
        //    window.parent.postMessage(msg, '*');
        //}

        //просто показываем фрейм
        setTimeout(function () { sendCommandToParent(self.commands.setVisible, { 'visible': true }); }, 0);

        //setTimeout(function () { sendPosition(); }, 300);

        //ToDo: поменять интервал на событие
        //setInterval(function () {
        //    sendHeight();
        //}, 500);
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

    partner = self.getPartner();
    if (partner != null) {
        insertCss(partner.src);
        widgetCode(partner.name);

        addCommonEventListener(window, 'scroll', trackScroll);
    }

}(document, window));