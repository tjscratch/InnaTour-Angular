(function (d, w) {
    var partnersMap = [{
        'name': 'biletix',
        'src': '/biletix/biletix.base.css'
    }, {
        'name': 'somepartner',
        'src': '/somepartner/somepartner.base.css'
    }];

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

    var host = location.hostname;
    for (var i = 0; i < partnersMap.length; i++) {
        var partner = partnersMap[i];

        if (host.indexOf(partner.name) > -1) {
            widgetCode();
            insertCss(partner.src);
            return;
        }
    }

    function widgetCode() {
        document.getElementsByTagName('html')[0].style.overflowY = 'hidden';

        function sendHeight() {
            //var body = document.body;
            //var html = document.documentElement;
            //var height = Math.max(body.scrollHeight, body.offsetHeight,
            //                       html.clientHeight, html.scrollHeight, html.offsetHeight);
            var height = $('.main').height();
            //console.log('inna doc height', height);
            //console.log('inna body height', bodyHeight);

            var msg = JSON.stringify({ 'height': height });
            window.parent.postMessage(msg, '*');
        }

        //ToDo: поменять интервал на событие
        setInterval(function () {
            sendHeight();
        }, 500);
    }

}(document, window));