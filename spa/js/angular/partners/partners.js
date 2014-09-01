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

    function widgetCode() {
        document.getElementsByTagName('html')[0].style.overflowY = 'hidden';

        var lastHeight = 0;
        function sendHeight() {
            //var body = document.body;
            //var html = document.documentElement;
            //var height = Math.max(body.scrollHeight, body.offsetHeight,
            //                       html.clientHeight, html.scrollHeight, html.offsetHeight);
            var height = $('.main').height();
            //console.log('inna doc height', height);
            //console.log('inna body height', bodyHeight);

            if (height != lastHeight) {
                lastHeight = height;
                var msg = JSON.stringify({ 'height': height });
                window.parent.postMessage(msg, '*');
            }
        }

        //ToDo: �������� �������� �� �������
        setInterval(function () {
            sendHeight();
        }, 500);
    }

    var partner = self.getPartner();
    if (partner != null) {
        widgetCode();
        insertCss(partner.src);
    }

}(document, window));