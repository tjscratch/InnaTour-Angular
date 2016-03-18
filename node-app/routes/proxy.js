var express = require('express'),
    router  = express.Router(),
    http    = require('http'),
    https   = require('https');

//var to_json = require('xmljson').to_json;

router.get('/server-proxy/', function (req, res, next) {
    var proxyUrl = req.query['url'];

    if (proxyUrl) {
        getRequestByUrl(res, proxyUrl, null);
    }
    else {
        res.end();
    }
});

/**
router.get('/manager/defined', function (req, res, next) {
    var options = {
        hostname: '5.200.61.62',
        port: 80,
        path: '/bigbluebutton/api/getMeetings?checksum=38cd5a4d4dacf75df8d10b65ddfeb8665cf38080',
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    var req1 = http.request(options, function (res1) {
        if (res1.statusCode == 301 || res1.statusCode == 302) {
            var redirectUrl = res1.headers['location'];
            getRequestByUrl(res1, redirectUrl, onResult);
        }
        else {
            var output = '';
            //console.log('HEADERS: ' + JSON.stringify(res1.headers), 'status:', res1.statusCode);
            res1.setEncoding('binary');

            res1.on('data', function (chunk) {
                output += chunk;
            });

            res1.on('end', function () {
                to_json(output, function (error, data) {
                    // Module returns a JS object
                    //console.log(data);
                    // -> { prop1: 'val1', prop2: 'val2', prop3: 'val3' }

                    // Format as a JSON string
                    //console.log(JSON.stringify(data));
                    // -> {"prop1":"val1","prop2":"val2","prop3":"val3"}

                    res.end(JSON.stringify(data), 'binary');
                });
            });
        }
    });
    req1.on('error', function (err) {
        res1.send('proxy error: ' + err.message);
    });
    req1.end();
});
 */

module.exports = router;

function getRequestByUrl (res, url, callback) {
    var port = 80;
    if (url.indexOf('https://') > -1) {
        port = 443;
    }

    var reUrl = /^(([^:/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/ig;
    /*
     scheme    = $2
     authority = $4
     path      = $5
     query     = $7
     fragment  = $9
     */

    var match = reUrl.exec(url);

    var host = match[4];
    var path = match[5];
    if (match[7])
        path += match[7];
    if (match[9])
        path += match[9];

    var options = {
        host: host,
        port: port,
        path: path,
        method: 'GET'
    };

    if (callback) {
        getRequest(res, options, callback);
    }
    else {
        getRequest(res, options, function (statusCode, headers, result) {
            //проставляем заголовки
            if (headers) {
                for (var key in headers) {
                    res.setHeader(key, headers[key]);
                }
            }

            res.end(result, 'binary');
        });
    }
}

function getRequest (res, options, onResult) {
    var prot = options.port == 443 ? https : http;
    var req1 = prot.request(options, function (res1) {
        if (res1.statusCode == 301 || res1.statusCode == 302) {
            var redirectUrl = res1.headers['location'];
            getRequestByUrl(res, redirectUrl, onResult);
        }
        else {
            var output = '';
            //console.log('HEADERS: ' + JSON.stringify(res1.headers), 'status:', res1.statusCode);
            res1.setEncoding('binary');

            res1.on('data', function (chunk) {
                output += chunk;
            });

            res1.on('end', function () {
                onResult(res1.statusCode, res1.headers, output);
            });
        }
    });

    req1.on('error', function (err) {
        res1.send('proxy error: ' + err.message);
    });

    req1.end();
}
