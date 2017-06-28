/*
 * npm install -g babel
 *
 * run:
 * babel-node test-api-partners.js
 * */

import http from 'http';
import https from 'https';


var api = {
    getJSON: (options) => {
        var promise = new Promise((resolve, reject) => {
            var prot = options.port == 443 ? https : http;
            var req = prot.request(options, (res) => {
                var output = '';
                res.setEncoding('utf8');

                res.on('data', (chunk) => {
                    output += chunk;
                });

                res.on('end', () => {
                    var obj = JSON.parse(output);
                    resolve({statusCode: res.statusCode, result: obj});
                });
            });

            req.on('error', (err) => {
                //console.log('error: ' + err.message);
                reject(err);
            });

            req.end();
        });

        return promise;
    }
};

getApiPartners();

function getApiPartners() {
    var options = {
        host: 'api.inna.ru',
        port: 443,
        path: '/api/v1/partner/getall?key=123',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    (async () => {
        let {statusCode, result} = await api.getJSON(options);
        // console.log('Всего партнеров:', result.length);

        let wlItems = result.filter((item) => {
            if (item.offertaContractLink && item.offertaContractLink.length > 0
                && (item.type == 'WLReservation' || item.type == 'WLSearch')) {
                return true;
            }
            return false;
        });

        // console.log('Типов WLReservation или WLSearch:', wlItems.length);
        // console.log('');

        processItem(wlItems, 0, () => {
            // console.log('');
            // console.log('status 200 (ok) count:', status200Count);
            // console.log('other status (err) count:', statusNot200Count);
        });
    })();

    var status200Count = 0;
    var statusNot200Count = 0;
    function processItem(wlItems, index, cb) {
        var item = wlItems[index];

        if (item) {
            checkOfertaLink(item).then(() => {
                index++;
                processItem(wlItems, index, cb);
            });
        }
        else {
            cb();
        }
    }

    function checkOfertaLink(item) {
        var promise = new Promise((resolve, reject) => {
            //console.log('checkOfertaLink', item.name, 'oferta', item.offertaContractLink);
            var ofertaUrl = normalizeUrl(item.offertaContractLink);

            var prot = (ofertaUrl.indexOf('https://') > -1) ? https : http;

            prot.get(ofertaUrl, function (res) {

                if (res.statusCode != 200) {
                    statusNot200Count++;
                    console.log(`${res.statusCode} ${ofertaUrl}`);
                }
                else {
                    console.log(`${res.statusCode} ${ofertaUrl}`);
                    status200Count++;
                }

                resolve();
            }).on('error', function (e) {
                console.log("Got error: " + e.message);
                reject();
            });
        });
        return promise;
    }

    function normalizeUrl(url) {
        if (url && url.indexOf('/') == 0) {
            url = 'https://s.inna.ru' + url;
        }
        return url;
    }
}

function getJSON(options, onResult) {

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, (res) => {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            output += chunk;
        });

        res.on('end', () => {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', (err) => {
        console.log('error: ' + err.message);
    });

    req.end();
}