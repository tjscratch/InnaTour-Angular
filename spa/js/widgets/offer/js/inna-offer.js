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
        
    var host = 'https://inna.ru';
    // var host = 'http://localhost:3000';
    var widget = document.querySelector(".widget-inna-offer");
    var sources = {
        'css'   : host + '/spa/js/widgets/offer/widget-offer.css',
        'jquery': host + '/spa/js/widgets/offer/jquery.min.js'
    };
    // host +
    
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    
    function insertCss() {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = sources.css;
        // insertAfter(link);
        // widget.parentNode.insertBefore(link, widget.nextSibling);
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
        var dataLocation = $('.widget-inna-offer').attr('data-location');
        var countryIdLocation = '';
        var countryIdTo = '';
        $.when(
            $.ajax('https://inna.ru/api/v1/Dictionary/GetCurrentLocation'),
            $.ajax('https://inna.ru/api/v1/Dictionary/Hotel?term=' + dataLocation)
        ).then(function (result1, result2) {
            countryIdLocation = result1[0].Id;
            countryIdTo = result2[0][0].Id;
            return $.ajax({
                type: 'GET',
                url : 'https://inna.ru/api/v1/bestoffer/GetOffersForLocation?ArrivalLocation=' + countryIdTo + '&Location=' + countryIdLocation
            })
        }).then(function (result) {
            console.log(result);
            if (result.Offers.length) {
                var peopleCount = '';
                if (result.Offers[0].Adults == 1) {
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
                var nights = '';
                if (result.Offers[0].Nights == 1) {
                    nights = 'ночь';
                } else if (result.Offers[0].Nights == 2 ||
                    result.Offers[0].Nights == 3 ||
                    result.Offers[0].Nights == 4) {
                    nights = 'ночи';
                } else {
                    nights = 'ночей';
                }
                
                var templ = "<div class='b-offer__container'>" +
                    "<div class='b-offer__bg' " +
                    "style='background-image: url(" + result.Offers[0].ImageL + ")'" +
                    "></div>" +
                    
                    "<a class='b-offer__container-link'" +
                    "href=" + result.Offers[0].Details + " " +
                    "target='_blank'></a>" +
                    
                    "<div class='b-offer__container-txt'>" +
                    "<h2 class='b-offer__title'>" +
                    "<div class='b-offer__title-sub'>" +
                    result.Offers[0].Country +
                    "</div>" +
                    "<div class='b-offer__title-main'>" +
                    result.Offers[0].Location +
                    "</div>" +
                    "<div class='b-offer__title-info'>" +
                    result.Offers[0].Nights + " " + nights + ", " +
                    "<span >" + peopleCount + "</span>" +
                    "</div>" +
                    "</h2>" +
                    "<div class='b-offer__price'>" +
                    "<div class='b-offer__price-txt'>" +
                    "от" +
                    "</div>" +
                    "<div class='b-offer__price-value'>" +
                    Math.round(result.Offers[0].Price) +
                    "<i class='fa fa-rub b-offer__price-currency'></i>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                $(".widget-inna-offer").append(templ);
            }else{
                var templ = "<div class='widget-inna-no-offer'>Предложений для данной локации нет</div>";
                $(".widget-inna-offer").append(templ);
            }
        });
    }
}());