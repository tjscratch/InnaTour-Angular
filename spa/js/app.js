﻿'use strict';

var app = angular.module('innaApp', [
  'ngRoute',
  'innaApp.Cookie',
  'innaApp.templates',
  'innaApp.filters',
  'innaApp.services',
  'innaApp.directives',
  'innaApp.controllers',
  'innaApp.components',
  'innaApp.Url',
  'innaApp.API',
  'ngSanitize',
  'pasvaz.bindonce'
]);

/* локализация дат moment */
moment.locale('ru');

app.constant('innaApp.Urls', {
    URL_ROOT: '/',
    URL_BUY: '/buy/',
    URL_AVIA: '/avia/',
    URL_AVIA_SEARCH: '/avia/search/',
    URL_AVIA_RESERVATION: '/avia/reservation/',
    URL_AVIA_BUY: '/avia/buy/',
    URL_TOURS: '/tours/',
    URL_DYNAMIC_PACKAGES_BUY_SUCCESS: '/packages/buy/success/',
    URL_DYNAMIC_PACKAGES_BUY: '/packages/buy/',
    URL_DYNAMIC_PACKAGES: '/packages/',
    URL_DYNAMIC_PACKAGES_SEARCH: '/packages/search/',
    URL_DYNAMIC_HOTEL_DETAILS : '/packages/details/',
    URL_DYNAMIC_PACKAGES_RESERVATION: '/packages/reservation/',
    URL_PROGRAMMS: '/individualtours/',
    URL_ABOUT: '/about/',
    URL_CONTACTS: '/contacts/',
    URL_CERTIFICATES: '/certificates/',

    URL_AUTH_RESTORE: '/account/restore-password/',
    URL_AUTH_SIGNUP: '/account/signup/',

    B2B_DISPLAY_ORDER: '/display-order/',

    URL_PACKAGES_LANDING: '/packages/ppc/',

    URL_HELP: '/help/',

    eof: null
});

app.run(['$rootScope', '$location', '$window', '$filter', function ($rootScope, $location, $window, $filter) {



    // Ractive.defaults
    Ractive.defaults.data.pluralize = utils.pluralize || null;
    Ractive.defaults.data.moment = moment || null;
    Ractive.defaults.debug = true;
    Ractive.defaults.data.$filter = $filter;

    $rootScope.bodyClickListeners = [];

    $rootScope.addBodyClickListner = function (key, eventDelegate) {
        $rootScope.bodyClickListeners.push({ key: key, eventDelegate: eventDelegate });
    };

    $rootScope.bodyClick = function () {
        //console.log('root bodyClick');
        _.each($rootScope.bodyClickListeners, function (listner) {
            listner.eventDelegate();
        });
    };

    $rootScope.$on('$routeChangeSuccess', function () {
        //аналитика
        //console.log('$window._gaq.push $location.path(): ' + $location.path());
        if ($window.ga != null)
            $window.ga('send', 'pageview', $location.path());

        //console.log('$routeChangeSuccess');
        //скролим наверх
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
}]);

app.config([
    //'$templateCache',
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    'innaApp.Urls',
    '$sceProvider',
    function ($routeProvider, $locationProvider, $httpProvider, url, $sceProvider, $filter) {

        function dynamic() {
            var partner = window.partners.getPartner();
            if (partner != null && partner.name == "biletix") {
                return {
                    templateUrl: 'pages/partners/page.html',
                    controller: 'BiletixMainCtrl'
                }
            }
            else {
                return {
                    templateUrl: 'pages/dynamic/page.html',
                    controller: 'DynamicPackageMordaCtrl'
                }
            }
        }

        //чтобы работал кросдоменный post
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.transformRequest = function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? angular.toParam(data) : data;
        };

        $sceProvider.enabled(false);

        $routeProvider.
            //Главная
            when(url.URL_ROOT, dynamic()).
            when(url.URL_PACKAGES_LANDING + ':sectionId-:Adult?-:DepartureId-:ArrivalId?', dynamic()).
            when(url.URL_PACKAGES_LANDING + ':sectionId-:Adult?-:DepartureId', dynamic()).
            when(url.URL_PACKAGES_LANDING + ':sectionId-:Adult?', dynamic()).
            when(url.URL_PACKAGES_LANDING + ':sectionId', dynamic()).
            when(url.URL_TOURS, {
                templateUrl: 'pages/tours_grid_page.html',
                controller: 'ToursCtrl'
            }).
            when(url.URL_PROGRAMMS + 'category/:id', {
                templateUrl: 'pages/it_category_page.html',
                controller: 'IndividualToursCategoryCtrl'
            }).
            when(url.URL_PROGRAMMS, {
                templateUrl: 'pages/it_grid_page.html',
                controller: 'IndividualToursCtrl'
            }).
            when(url.URL_ABOUT, {
                templateUrl: 'pages/about_page.html',
                controller: 'AboutCtrl'
            }).
            when(url.URL_CONTACTS, {
                templateUrl: 'pages/contacts_page.html',
                controller: 'ContactsCtrl'
            }).
            when(url.URL_CERTIFICATES, {
                templateUrl: 'pages/certificates_page.html',
                controller: 'ContactsCtrl'
            }).
            when(url.URL_AVIA + ':FromUrl-:ToUrl-:BeginDate-:EndDate?-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible-:PathType', {
                templateUrl: 'pages/avia/search_form.html',
                controller: 'AviaSearchMainCtrl'
            }).
            when(url.URL_AVIA + ':FromUrl-:ToUrl', {
                templateUrl: 'pages/tours_grid_page.html',
                controller: 'AviaSearchMainCtrl'
            }).
            when(url.URL_AVIA, {
                templateUrl: 'pages/tours_grid_page.html',
                controller: 'AviaSearchMainCtrl'
            }).
            when(url.URL_AVIA_SEARCH + ':FromUrl-:ToUrl-:BeginDate-:EndDate?-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible-:PathType', {
                templateUrl: 'pages/page-avia/templ/search_results.html',
                controller: 'AviaSearchResultsCtrl'
            }).
            when(url.URL_AVIA_RESERVATION + ':FromUrl-:ToUrl-:BeginDate-:EndDate?-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-' +
                ':IsToFlexible-:IsBackFlexible-:PathType-:QueryId-:VariantId1-:VariantId2', {
                    templateUrl: 'pages/avia/tickets_reserve.html',
                    controller: 'AviaReserveTicketsCtrl'
                }).
            //when(url.URL_AVIA_BUY + ':FromUrl-:ToUrl-:BeginDate-:EndDate?-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-' +
            //    ':IsToFlexible-:IsBackFlexible-:PathType-:QueryId-:VariantId1-:VariantId2-:OrderNum', {
            //        templateUrl: 'pages/avia/tickets_buy.html',
            //        controller: 'AviaBuyTicketsCtrl'
            //    }).
            when(url.URL_BUY + ':OrderNum', {
                templateUrl: 'pages/avia/tickets_buy.html',
                controller: 'AviaBuyTicketsCtrl'
            }).
            when(url.URL_AVIA_BUY + ':OrderNum', {
                templateUrl: 'pages/avia/tickets_buy.html',
                controller: 'AviaBuyTicketsCtrl'
            }).
            when(url.URL_DYNAMIC_PACKAGES_BUY_SUCCESS + ':OrderNum?', {
                templateUrl: 'pages/page-root.html',
                controller: 'PageBuySuccess'
            }).
            when(url.URL_DYNAMIC_PACKAGES_BUY + ':OrderNum', {
                templateUrl: 'pages/avia/tickets_buy.html',
                controller: 'AviaBuyTicketsCtrl'
            }).
            when('/hotelticket/', {
                templateUrl: 'pages/hotelticket_page.html',
                controller: 'HotelPlusTicketCtrl'
            }).
            when('/hotels/', {
                templateUrl: 'pages/hotels_page.html',
                controller: 'HotelsCtrl'
            }).
            when(url.URL_DYNAMIC_PACKAGES + ':DepartureId-:ArrivalId', dynamic()).//URL для контекста по ДП
            when(url.URL_DYNAMIC_PACKAGES, dynamic()).
            when(url.URL_DYNAMIC_PACKAGES_SEARCH + ':DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children?', {
                templateUrl: 'pages/page-dynamic/templ/page-dynamic-controller.html',
                controller: 'PageDynamicPackage',
                reloadOnSearch: false
            }).
            when(url.URL_DYNAMIC_HOTEL_DETAILS + ':DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children?-:HotelId-:TicketId-:TicketBackId-:ProviderId', {
                templateUrl: 'pages/page-dynamic-details/templ/hotel-details.html',
                controller: 'PageHotelDetails',
                reloadOnSearch: false
            }).
            when(url.URL_DYNAMIC_PACKAGES_RESERVATION + ':DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children?', {
                templateUrl: 'pages/avia/tickets_reserve.html',
                controller: 'DynamicReserveTicketsCtrl'
            }).
            when(url.B2B_DISPLAY_ORDER + ':OrderId', {
                templateUrl: 'pages/page-dynamic-details/templ/hotel-details.html',
                controller: 'PageHotelDetails',
                reloadOnSearch: false
                /*templateUrl: 'pages/page-display-order/templ/display-order.html',
                controller: 'B2B_DisplayOrder'*/
            }).
            when(url.URL_AUTH_RESTORE, dynamic()).
            when(url.URL_AUTH_SIGNUP, dynamic()).
            when(url.URL_HELP, {
                templateUrl: 'pages/page-help/templ/base.hbs.html',
                controller: 'HelpPageController',
                reloadOnSearch: false
            }).
            otherwise({
                redirectTo: url.URL_ROOT
            });

        //$locationProvider.html5Mode(true);
    }
]);

app.config([
  '$provide', function ($provide) {
      return $provide.decorator('$rootScope', [
        '$delegate', function ($delegate) {
            $delegate.safeApply = function (fn) {
                var phase = $delegate.$$phase;
                if (phase === "$apply" || phase === "$digest") {
                    if (fn && typeof fn === 'function') {
                        fn();
                    }
                } else {
                    $delegate.$apply(fn);
                }
            };
            return $delegate;
        }
      ]);
  }
]);

var innaAppCookie = angular.module('innaApp.Cookie', ['ngCookies']);

var innaAppControllers = angular.module('innaApp.controllers', []);
var innaAppConponents = angular.module('innaApp.components', []);

var innaAppTemlates = angular.module('innaApp.templates', []);

var innaAppDirectives = angular.module('innaApp.directives', []);

innaAppDirectives.config(['$sceProvider', function($sceProvider) {
    $sceProvider.enabled(false);
}]);

var innaAppServices = angular.module('innaApp.services', []);

var innaAppFilters = angular.module('innaApp.filters', []);

app.factory('cache',['$cacheFactory', function ($cacheFactory) {
    var cache = $cacheFactory('myCache');
    return cache;
}]);

(function () {

    angular.extend(angular, {
        toParam: toParam
    });


    /**
     * Преобразует объект, массив или массив объектов в строку,
     * которая соответствует формату передачи данных через url
     * Почти эквивалент [url]http://api.jquery.com/jQuery.param/[/url]
     * Источник [url]http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object/1714899#1714899[/url]
     *
     * @param object
     * @param [prefix]
     * @returns {string}
     */
    function toParam(object, prefix) {
        var stack = [];
        var value;
        var key;

        for (key in object) {
            value = object[key];
            key = prefix ? prefix + '[' + key + ']' : key;

            if (value === null) {
                value = encodeURIComponent(key) + '=';
            } else if (typeof (value) !== 'object') {
                value = encodeURIComponent(key) + '=' + encodeURIComponent(value);
            } else {
                value = toParam(value, key);
            }

            stack.push(value);
        }

        return stack.join('&');
    }

}());


/**
 * Переопределяем console.log
 * На продакштне можно ввести у url ?DEBUG=TRUE
 * все console.log станут активными
 */
//window.console = (function (origConsole) {

//    if (origConsole == undefined || origConsole.error == undefined || origConsole.error.apply == undefined) {
//        return;
//    }

//    try {
//        var locationSearch = location.hash.split('?')[1].split('&');

//        locationSearch.filter(function (item) {
//            var d = item.split('=');
//            if (d[0].toLowerCase() == 'debug' && d[1].toLowerCase() == 'true') {
//                window.FrontedDebug = true;
//                return true;
//            }
//        })
//    } catch(e){}

//    if (!window.console)
//        console = {};

//    var isDebug = window.FrontedDebug || false,
//        logArray = {
//            logs: [],
//            errors: [],
//            warns: [],
//            infos: []
//        }

//    return {
//        log: function () {
//            logArray.logs.push(arguments)
//            isDebug && origConsole.log && origConsole.log.apply(origConsole, arguments);
//        },
//        warn: function () {
//            logArray.warns.push(arguments)
//            isDebug && origConsole.warn && origConsole.warn.apply(origConsole, arguments);
//        },
//        error: function () {
//            logArray.errors.push(arguments)
//            isDebug && origConsole.error && origConsole.error.apply(origConsole, arguments);
//        },
//        info: function (v) {
//            logArray.infos.push(arguments)
//            isDebug && origConsole.info && origConsole.info.apply(origConsole, arguments);
//        },
//        debug: function (bool) {
//            isDebug = bool;
//        },
//        logArray: function () {
//            return logArray;
//        }
//    };

//}(window.console));


(function ($) {
    $.widget("custom.tooltipX", $.ui.tooltip, {
        options: {
            autoShow: true,
            autoHide: true
        },

        _create: function () {
            this._super();
            if (!this.options.autoShow) {
                this._off(this.element, "mouseover focusin");
            }
        },

        _open: function (event, target, content) {
            this._superApply(arguments);

            if (!this.options.autoHide) {
                this._off(target, "mouseleave focusout");
            }
        }
    });

}(jQuery));