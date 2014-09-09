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
            var msg = JSON.stringify({ 'cmd': 'setScrollPos', 'scrollTo': scrollTo });
            window.parent.postMessage(msg, '*');
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

        var lastHeight = 0;
        function sendHeight() {
            var height = $('.main').height();

            if (height != lastHeight) {
                lastHeight = height;
                var msg = JSON.stringify({ 'cmd': 'setHeight', 'height': height });
                window.parent.postMessage(msg, '*');
            }
        }

        //ToDo: поменять интервал на событие
        setInterval(function () {
            sendHeight();
        }, 500);
    }

    var partner = self.getPartner();
    if (partner != null) {
        widgetCode(partner.name);
        insertCss(partner.src);
    }

}(document, window));