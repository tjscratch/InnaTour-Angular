(function () {
    /**
     * BEGIN script.js
     * @type {string}
     */
    /*!
     * $script.js JS loader & dependency manager
     * https://github.com/ded/script.js
     * (c) Dustin Diaz 2014 | License MIT
     */
    (function (e, t) {
        typeof module != "undefined" && module.exports ? module.exports = t() : typeof define == "function" && define.amd ? define(t) : this[e] = t()
    })("$script", function () {
        function p(e, t) {
            for (var n = 0, i = e.length; n < i; ++n)if (!t(e[n]))return r;
            return 1
        }
        
        function d(e, t) {
            p(e, function (e) {
                return !t(e)
            })
        }
        
        function v(e, t, n) {
            function g(e) {
                return e.call ? e() : u[e]
            }
            
            function y() {
                if (!--h) {
                    u[o] = 1, s && s();
                    for (var e in f)p(e.split("|"), g) && !d(f[e], g) && (f[e] = [])
                }
            }
            
            e = e[i] ? e : [e];
            var r = t && t.call, s = r ? t : n, o = r ? e.join("") : t, h = e.length;
            return setTimeout(function () {
                d(e, function t(e, n) {
                    if (e === null)return y();
                    e = !n && e.indexOf(".js") === -1 && !/^https?:\/\//.test(e) && c ? c + e + ".js" : e;
                    if (l[e])return o && (a[o] = 1), l[e] == 2 ? y() : setTimeout(function () {
                        t(e, !0)
                    }, 0);
                    l[e] = 1, o && (a[o] = 1), m(e, y)
                })
            }, 0), v
        }
        
        function m(n, r) {
            var i = e.createElement("script"), u;
            i.charset = "utf-8";
            i.onload = i.onerror = i[o] = function () {
                if (i[s] && !/^c|loade/.test(i[s]) || u)return;
                i.onload = i[o] = null, u = 1, l[n] = 2, r()
            }, i.async = 1, i.src = h ? n + (n.indexOf("?") === -1 ? "?" : "&") + h : n, t.insertBefore(i, t.lastChild)
        }
        
        var e = document, t = e.getElementsByTagName("head")[0], n = "string", r = !1, i = "push", s = "readyState", o = "onreadystatechange", u = {}, a = {}, f = {}, l = {}, c, h;
        return v.get = m, v.order = function (e, t, n) {
            (function r(i) {
                i = e.shift(), e.length ? v(i, r) : v(i, t, n)
            })()
        }, v.path = function (e) {
            c = e
        }, v.urlArgs = function (e) {
            h = e
        }, v.ready = function (e, t, n) {
            e = e[i] ? e : [e];
            var r = [];
            return !d(e, function (e) {
                u[e] || r[i](e)
            }) && p(e, function (e) {
                return u[e]
            }) ? t() : !function (e) {
                f[e] = f[e] || [], f[e][i](t), n && n(r)
            }(e.join("|")), v
        }, v.done = function (e) {
            v([null], e)
        }, v
    })
    /**
     * END script.js
     * @type {string}
     */
    
    var host = 'http://localhost:3000';
    var widget = document.querySelector(".b-inna-search-widget");
    var sources = {
        'css'   : host + '/spa/js/widgets/offer/widget-offer.css',
        'jquery': host + '/spa/js/widgets/offer/jquery.min.js'
    };
    
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    
    function insertCss() {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = sources.css;
        insertAfter(link, widget);
    };
    
    insertCss();
    
    
    $script
        .ready('jquery', function () {
            setTimeout(function () {
                bootstrap()
            }, 150);
        })
    
    $script(sources.jquery, 'jquery');
    
    function bootstrap() {
        console.log('widget init');
        var dataLocation = $('.widget-inna-offer').attr('data-location');
        console.log('widget init');
        var countryIdLocation = '';
        var countryIdTo = '';
        $.when(
            $.ajax('https://inna.ru/api/v1/Dictionary/GetCurrentLocation'),
            $.ajax('https://inna.ru/api/v1/Dictionary/Hotel?term=' + dataLocation)
        ).then(function (result1, result2) {
            console.log('result1', result1);
            console.log('result2', result2);
            countryIdLocation = result1[0].Id;
            console.log('FROM', countryIdLocation);
            countryIdTo = result2[0][0].Id;
            return $.ajax({
                type: 'GET',
                url: 'http://test.inna.ru/api/v1/bestoffer/GetOffersForLocation?ArrivalLocation=' + countryIdTo + '&Location=18820'
            })
        }).then(function (result) {
            if(result.Offers.length) {
                var peopleCount = '';
                if(result.Offers[0].Adults == 1) {
                    peopleCount = 'на одного';
                } else if (result.Offers[0].Adults == 2) {
                    peopleCount = 'на двоих';
                } else if (result.Offers[0].Adults == 3) {
                    peopleCount = 'на троих';
                } else if (result.Offers[0].Adults == 4) {
                    peopleCount = 'на четверых';
                } else if (result.Offers[0].Adults == 5) {
                    peopleCount = 'на пятерых';
                }

                var templ = '<div class="b-offer__container">' +
                    '<div class="b-offer__bg" ' +
                        'style="background-image: url(' + result.Offers[0].ImageL + ')"'+
                    '></div>' +

                    '<a class="b-offer__container-link"' +
                    'href="' + result.Offers[0].Details + '"' +
                    'target="_blank"></a>' +

                    '<div class="b-offer__container-txt">' +
                    '<h2 class="b-offer__title">' +
                    '<div class="b-offer__title-sub">' +
                    result.Offers[0].Country +
                    '</div>' +
                    '<div class="b-offer__title-main">' +
                    result.Offers[0].Location +
                    '</div>' +
                    '<div class="b-offer__title-info">' +
                    result.Offers[0].Nights + ',' +
                    '<span >' + peopleCount + '</span>' +
                    '</div>' +
                    '</h2>' +
                    '<div class="b-offer__price">' +
                    '<div class="b-offer__price-txt">' +
                    'от' +
                    '</div>' +
                    '<div class="b-offer__price-value">' +
                    Math.round(result.Offers[0].Price) +
                    '<i class="fa fa-rub b-offer__price-currency"></i>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $(".widget-inna-offer").append(templ);
            }
        });

        $('#btn-generate-offer').click(function () {
                var code = '&lt;plaintext&gt;&lt;div class="widget-inna-offer" data-location="Франция"&gt;' +
                    '&lt;/div&gt;' +
                    '&lt;script charset="utf-8" src="/spa/js/widgets/offer/inna-offer.js"&ht;&lt;/script&gt;' +
                    '&lt;style&gt;' +
                        '.widget-inna-offer{' +
                            'position: relative;' +
                            'height: 340px;' +
                            'width: 520px;' +
                            'background-color: gray' +
                        '}' +
                        '.b-offer__bg {' +
                            'position: relative;' +
                            'width: 100%;' +
                            'height: 100%;' +
                            'z-index: 1;' +
                            'vertical-align: top;' +
                            'transform: translateZ(0) scale(1.05);' +
                            'transition: all 1.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;' +
                            'background-position: center center;' +
                            'background-size: cover;' +
                        '}' +
                        '.b-offer__container {' +
                            'position: absolute;' +
                            'left: 1,5px;' +
                            'right: 1,5px;' +
                            'top: 1,5px;' +
                            'bottom: 1,5px;' +
                            'overflow: hidden;' +
                        '}' +
                        '.b-offer__container:hover > .b-offer__bg {' +
                            'transform: translateZ(0) scale(1.15);' +
                        '}' +
                        '.b-offer__container-txt {' +
                            'position: absolute;' +
                            'left: 0;' +
                            'right: 0;' +
                            'top: 0;' +
                            'bottom: 0;' +
                            'z-index: 2;' +
                            'padding: 15px;' +
                            'background-color: rgba(0, 0, 0, .3);' +
                        '}'+
                        '.b-offer__container-link {' +
                            'position: absolute;' +
                            'left: 0;' +
                            'right: 0;' +
                            'top: 0;' +
                            'bottom: 0;' +
                            'z-index: 3;' +
                        '}' +
                        '.b-offer__title {' +
                            'position: absolute;' +
                            'top: 15px;' +
                            'font-weight: normal;' +
                        '}' +
                        '.b-offer__title-sub {' +
                            'font-size: 15px;' +
                            'color: #d6d6d6;' +
                            'text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.30);' +
                        '}' +
                        '.b-offer__title-main {' +
                            'font-size: 29px;' +
                            'color: #fff;' +
                            'text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.30);' +
                        '}' +
                        '.b-offer__title-info {' +
                            'font-size: 14px;' +
                            'color: #fff;' +
                            'text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.30);' +
                        '}' +
                        '.b-offer__price {' +
                            'position: absolute;' +
                            'bottom: 15px;' +
                        '}' +
                        '.b-offer__price-txt {' +
                            'font-size: 14px;' +
                            'color: #fff;' +
                            'text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.30);' +
                        '}' +
                        '.b-offer__price-value {' +
                            'font-size: 29px;' +
                            'color: #fff;' +
                            'text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.30);' +
                        '}' +
                        '.b-offer__price-currency {' +
                            'font-size: 25px;' +
                        '}' +
                    '&lt;/style&gt &lt;/plaintext>&gt;';
                $('#textarea-code-offer').append(code);
                $('#head-offer').show();
                $('#generate-code-offer').show();
        });
    }
    
}());