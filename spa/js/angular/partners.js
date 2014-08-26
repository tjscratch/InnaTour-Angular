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
        console.log('src', s.href);
    };

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    var host = location.hostname;
    for (var i = 0; i < partnersMap.length; i++) {
        var partner = partnersMap[i];

        if (host.indexOf(partner.name) > -1) {
            insertCss(partner.src);
            return;
        }
    }

}(document, window));