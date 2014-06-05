﻿'use strict';

var app = angular.module('innaApp', [
  'ngRoute',
  'innaApp.templates',
  'innaApp.filters',
  'innaApp.services',
  'innaApp.directives',
  'innaApp.controllers',
  'innaApp.Url',
  'innaApp.API',
  'ngSanitize'
]);

app.constant('innaApp.Urls', {
    URL_BUY: '/buy/',
    URL_AVIA: '/avia/',
    URL_AVIA_SEARCH: '/avia/search/',
    URL_AVIA_RESERVATION: '/avia/reservation/',
    URL_AVIA_BUY: '/avia/buy/',
    URL_DYNAMIC_PACKAGES_BUY: '/packages/buy/',
    URL_DYNAMIC_PACKAGES: '/packages/',
    URL_DYNAMIC_PACKAGES_SEARCH: '/packages/search/',
    URL_DYNAMIC_PACKAGES_RESERVATION: '/packages/reservation/',
    URL_PROGRAMMS: '/individualtours/',
    URL_ABOUT: '/about/',
    URL_CONTACTS: '/contacts/',

    URL_AUTH_RESTORE: '/account/restore-password/',
    URL_AUTH_SIGNUP: '/account/signup/',

    eof: null
});

app.run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
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
    function ($routeProvider, $locationProvider, $httpProvider, url) {

        //console.log($templateCache.get('pages/tours_grid_page.html'));

        function morda(){
            return {
                templateUrl: '/spa/templates/pages/tours_grid_page.html',
                controller: 'ToursCtrl'
            }
        }

        //чтобы работал кросдоменный post
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.transformRequest = function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? angular.toParam(data) : data;
        };

        $routeProvider.
            //Главная
            when('/', morda()).
            when(url.URL_PROGRAMMS + 'category/:id', {
                templateUrl: '/spa/templates/pages/it_category_page.html',
                controller: 'IndividualToursCategoryCtrl'
            }).
            when(url.URL_PROGRAMMS, {
                templateUrl: '/spa/templates/pages/it_grid_page.html',
                controller: 'IndividualToursCtrl'
            }).
            when(url.URL_ABOUT, {
                templateUrl: '/spa/templates/pages/about_page.html',
                controller: 'AboutCtrl'
            }).
            when(url.URL_CONTACTS, {
                templateUrl: '/spa/templates/pages/contacts_page.html',
                controller: 'ContactsCtrl'
            }).
            when(url.URL_AVIA + ':FromUrl-:ToUrl-:BeginDate-:EndDate?-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible-:PathType', {
                templateUrl: '/spa/templates/pages/avia/search_form.html',
                controller: 'AviaSearchMainCtrl'
            }).
            when(url.URL_AVIA, {
                templateUrl: '/spa/templates/pages/tours_grid_page.html',
                controller: 'AviaSearchMainCtrl'
            }).
            when(url.URL_AVIA_SEARCH + ':FromUrl-:ToUrl-:BeginDate-:EndDate?-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible-:PathType', {
                templateUrl: '/spa/templates/pages/avia/search_results.html',
                controller: 'AviaSearchResultsCtrl'
            }).
            when(url.URL_AVIA_RESERVATION + ':FromUrl-:ToUrl-:BeginDate-:EndDate?-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-' +
                ':IsToFlexible-:IsBackFlexible-:PathType-:QueryId-:VariantId1-:VariantId2', {
                    templateUrl: '/spa/templates/pages/avia/tickets_reserve.html',
                    controller: 'AviaReserveTicketsCtrl'
                }).
            //when(url.URL_AVIA_BUY + ':FromUrl-:ToUrl-:BeginDate-:EndDate?-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-' +
            //    ':IsToFlexible-:IsBackFlexible-:PathType-:QueryId-:VariantId1-:VariantId2-:OrderNum', {
            //        templateUrl: '/spa/templates/pages/avia/tickets_buy.html',
            //        controller: 'AviaBuyTicketsCtrl'
            //    }).
            when(url.URL_BUY + ':OrderNum', {
                templateUrl: '/spa/templates/pages/avia/tickets_buy.html',
                controller: 'AviaBuyTicketsCtrl'
            }).
            when(url.URL_AVIA_BUY + ':OrderNum', {
                templateUrl: '/spa/templates/pages/avia/tickets_buy.html',
                controller: 'AviaBuyTicketsCtrl'
            }).
            when(url.URL_DYNAMIC_PACKAGES_BUY + ':OrderNum', {
                templateUrl: '/spa/templates/pages/avia/tickets_buy.html',
                controller: 'AviaBuyTicketsCtrl'
            }).
            when('/hotelticket/', {
                templateUrl: '/spa/templates/pages/hotelticket_page.html',
                controller: 'HotelPlusTicketCtrl'
            }).
            when('/hotels/', {
                templateUrl: '/spa/templates/pages/hotels_page.html',
                controller: 'HotelsCtrl'
            }).
            ////результаты поиска по отелям
            //when('/hotels/search/:FromCityUrl-:ToCountryUrl-:ToRegionUrl-:StartMinString-:StartDateVariance-:AdultNumber-:ChildAgesString-:DurationMin', {
            //    templateUrl: '/AngularTemplates/Search',
            //    controller: 'SearchResultCtrl'
            //}).
            //when('/hotel/:hotelId/:searchId', {
            //    templateUrl: '/AngularTemplates/HotelDetail',
            //    controller: 'HotelsDetailsCtrl'
            //}).
            //when('/hotel/:hotelId/:searchId/tour/:tourId', {
            //    templateUrl: '/AngularTemplates/TourDetail',
            //    controller: 'TourDetailsCtrl'
            //}).
            //when('/payment/:orderId', {
            //    templateUrl: '/AngularTemplates/PaymentPage',
            //    controller: 'PaymentPageCtrl'
            //}).
            when(url.URL_DYNAMIC_PACKAGES, {
                templateUrl: '/spa/templates/pages/dynamic/page.html',
                controller: 'DynamicPackageMordaCtrl'
            }).
            when(url.URL_DYNAMIC_PACKAGES_SEARCH + ':DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children?', {
                templateUrl: '/spa/templates/pages/dynamic/serp.html',
                controller: 'DynamicPackageSERPCtrl',
                reloadOnSearch: false
            }).
            when(url.URL_DYNAMIC_PACKAGES_RESERVATION + ':DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children?', {
                templateUrl: '/spa/templates/pages/avia/tickets_reserve.html',
                controller: 'DynamicReserveTicketsCtrl'
            }).
            when(url.URL_AUTH_RESTORE, morda()).
            when(url.URL_AUTH_SIGNUP, morda());
            //otherwise({
            //    redirectTo: '/'
            //});

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

var innaAppControllers = angular.module('innaApp.controllers', []);

var innaAppTemlates = angular.module('innaApp.templates', []);

var innaAppDirectives = angular.module('innaApp.directives', []);

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