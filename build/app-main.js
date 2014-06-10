'use strict';

var app = angular.module('innaApp', [
  'ngRoute',
  'innaApp.Cookie',
  'innaApp.templates',
  'innaApp.filters',
  'innaApp.services',
  'innaApp.directives',
  'innaApp.controllers',
  'innaApp.Url',
  'innaApp.API',
  'ngSanitize'
]);

var testInnaTest = 123;

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
    '$sceProvider',
    function ($routeProvider, $locationProvider, $httpProvider, url, $sceProvider) {

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

        $sceProvider.enabled(false);

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

var innaAppCookie = angular.module('innaApp.Cookie', ['ngCookies']);

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
﻿
'use strict';

/* Filters */

innaAppFilters.filter('interpolate', ['version', function (version) {
      return function (text) {
          return String(text).replace(/\%VERSION\%/mg, version);
      }
  }]);

//фильтр для поиска элемента в массиве, аналог ko.utils.arrayFirst
innaAppFilters.filter('arrayFirst', function () {
      return function (input, equalsCallback) {
          if (input != null) {
              for (var i = 0; i < input.length; i++) {
                  if (equalsCallback(input[i]) == true) {
                      return input[i];
                  }
              }
          }
          return null;
      }
});

innaAppFilters.filter('breakFilter', function () {
    return function (text) {
        if (text !== undefined) return text.replace(/\n/g, '<br />');
    };
});

//приводит цену (123567) к виду (123 567)
innaAppFilters.filter('price', function () {
    return function (val) {
        if(!val) return val;

        var digits = ("" + val).split('');
        var result = [];

        if (digits.length > 3) {
            digits = digits.reverse();
            for(var i = 0, len = digits.length; i < len; i++) {
                if((i !== 0) && (i % 3 === 0)) result.push(' ');
                result.push(digits[i]);
            }

            return result.reverse().join('');
        } else return val;
    };
});

innaAppFilters.filter('asQuantity', ['$filter', function($filter){
    return function(n, f1, f2, f5, f0){
        if(n == 0) return f0;

        return [n, $filter('choosePlural')(n, f1, f2, f5)].join(' ');
    }
}]);

innaAppFilters.filter('choosePlural', function(){
    return function (n, f1, f2, f5) {
        if(!f2 && !f5) {
            var bits = f1.split(',');
            f1 = bits[0];
            f2 = bits[1];
            f5 = bits[2];
        }

        //only 2 last digits
        n = n % 100;

        //11, 12, ..., 19
        if(n % 10 + 10 == n) return f5;

        //only one last digit
        n = n % 10;

        if(n == 1) return f1;
        if(n == 2 || n == 3 || n == 4) return f2;

        return f5;
    }
});

innaAppFilters.filter('signed', ['$filter', function($filter){
    return function(n){
        var price = $filter('price');

        if(n > 0) return '+ ' + price(n);
        if(n < 0) return '– ' + price(-n);

        return 0;
    }
}]);

innaAppFilters.filter('visibleOnly', [function(){
    var TICKET_HEIGHT = 201;

    return function(list, scrollTop){
        var scrolledTickets = parseInt(scrollTop / TICKET_HEIGHT);
        var limit = scrolledTickets * 1.1 + 5;

        var result = [];

        for(var i = 0, item = null; (item = list[i++]) && result.length <= limit;) {
            if(!item.hidden) {
                item.currentlyInvisible = (i < (scrolledTickets - 1));

                result.push(item);
            }
        }

        return result;
    }
}]);

innaAppFilters.filter('defined', function(){
    var undef = typeof(void(0));

    return function(input){
        return (typeof input !== undef);
    }
});

innaAppFilters.filter('isFloat', function(){
    return function (n) {
      return n === +n && n !== (n|0);
    }
});
﻿
var track = {
    gotoBooking: function () {
        //отслеживаем в mixpanel
        if (window.mixpanel != null)
            mixpanel.track("redirect", { "service": "booking" });
        //отслеживаем в гугл аналитике
        if (window.ga != null)
            ga('send', 'pageview', 'bookingcom');

    },
    offerClick: function (sectionName, type, name, position, fn) {
        //type -  XXL, XL, L...
        //name - название офера
        //position - порядковый номер в секции оферов
        if (window.mixpanel != null)
            mixpanel.track("offer.click", { "section": sectionName, "type": type, "name": name, "position": position }, fn);
        else
            if (fn != null) fn();
    },
    formSearch: function (departure_city_name, country_name, departure_date, flex_date, search_depth, duration, adt_count, chd_count, source, fn) {
        //departure_city_name - город вылета
        //country_name - страна
        //departure_date - дата отправления
        //flex_date - выбор чекбокса +- 5 дней (true/false)
        //search_depth - как далеко вперед дата поиска в днях (дата отправления минус текущая дата)
        //duration - продолжительность (например 7-10)
        //adt_count - количество взр
        //chd_count -  количество детей
        //source - откуда вызван поиск (main/search_result)
        if (window.mixpanel != null)
            mixpanel.track("form.search", {
                "departure_city_name": departure_city_name, "country_name": country_name, "departure_date": departure_date,
                "flex_date": flex_date, "search_depth": search_depth, "duration": duration, "adt_count": adt_count,
                "chd_count": chd_count, "source": source
            }, fn);
        else
            if (fn != null) fn();
    },
    programDownload: function (name, program_country, category, fn)
    {
        //name - название программы
        //program_country - страна программы
        //category - категория
        name = name == null ? "" : name;
        program_country = program_country == null ? "" : program_country;
        category = category == null ? "" : category;
        if (window.mixpanel != null)
            mixpanel.track("program.download", { "name": name, "program_country": program_country, "category": category }, fn);
        else
            if (fn != null) fn();
    },
    requestOpened: function (type, url) {
        //type - откуда кликали на форму из заявки или из блока сбоку (side/program)
        //category - главная страница, раздел экскурсионные туры, образование за рубежом и т.д.
        if (window.mixpanel != null) {
            mixpanel.track("inquiry.form", { "type": type, "url": url });
        }
        if (window.ga != null) {
            ga('send', 'pageview', url + '/inquiry');
        }
    },
    requestSend: function (type, url) {
        //type - откуда кликали на форму из заявки или из блока сбоку (side/program)
        //category - главная страница, раздел экскурсионные туры, образование за рубежом и т.д.
        if (window.mixpanel != null) {
            mixpanel.track("inquiry.send", { "type": type, "url": url });
        }
        if (window.ga != null) {
            ga('send', 'pageview', url + '/inquiry_sent');
        }
    }
};

//$("#gotoBooking").click(function (e) {
//    var href = $(this).attr("href");
//    var isTargetBlank = ($(this).attr("target") == "_blank");

//    function track(fn) {
//        mixpanel.track("redirect", { "service": "booking" }, fn);
//    }

//    if (!isTargetBlank) {
//        e.preventDefault();
//        track(function () { location.href = href; });
//    }
//    else {
//        track();
//    }
//});
angular.module('innaApp.services')
    .factory('AjaxHelper', [
        function(){
            var ajax = {};
            var cache = {};

            function doAjax(options) {
                //console.log('doAjax, url: %s, useCache: %s', options.url, options.cache);
                return $.ajax(options);
            }

            function buildOptions(url, data, method, useCache) {
                var o = {
                    url: url,
                    type: method,
                    dataType: 'json',
                    traditional: !hasObjects(data),
                    data: data,
                    xhrFields: { withCredentials: true },
                    crossDomain: true,
                    //async: typeof async !== 'undefined' ? async : true,
                    
                    eol: null
                }

                if (typeof useCache !== 'undefined'){
                    o.cache = useCache;
                }

                //if (async == false) {
                //    //при синхронных вызовах последний FF ругается и блочит запрос, нужно удалить withCredentials
                //    delete o.xhrFields;
                //}
                return o;
            }

            function hasObjects(data) {
                for(var key in data) if(data.hasOwnProperty(key)){
                    if(_.isObject(data[key])) return true;
                }

                return false;
            }

            ajax.cancelRequest = function (url) {
                if (cache[url]) {
                    cache[url].abort();
                }
            };

            ajax.getCancelable = function (url, data, success, error) {
                var request = doAjax(buildOptions(url, data, 'GET', false));

                request.done(success || angular.noop).fail(error || angular.noop).always(function () {
                    delete cache[url];
                });

                cache[url] = request;

                return request;
            };

            ajax.getNoCache = function (url, data, success, error) {
                var request = doAjax(buildOptions(url, data, 'GET', false));

                request.done(success || angular.noop).fail(error || angular.noop);

                return request;
            };

            ajax.get = function (url, data, success, error, useCache) {
                var request = doAjax(buildOptions(url, data, 'GET', useCache));

                request.done(success || angular.noop).fail(error || angular.noop);

                return request;
            };

            ajax.post = function (url, data, success, error, useCache) {
                var request = doAjax(buildOptions(url, data, 'POST', useCache));

                request.done(success || angular.noop).fail(error || angular.noop);

                return request;
            };

            ajax.getDebounced = function (url, data, success, error, useCache) {
                if(cache[url]) {
                    cache[url].abort();
                }

                var req = ajax.get(url, data, success, error, useCache).always(function () {
                    delete cache[url];
                });

                cache[url] = req;

                return req;
            };

            ajax.postDebaunced = function (url, data, success, error, useCache) {
                if(cache[url]) {
                    cache[url].abort();
                }

                var req = ajax.post(url, data, success, error, useCache).always(function () {
                    delete cache[url];
                });

                cache[url] = req;

                return req;
            };

            return ajax;
        }
    ]);
angular.module('innaApp.API', [])
    .factory('innaApp.API.const', function () {
        function url(s) {
            var host = app_main.host || 'http://api.test.inna.ru';
            if (window.DEV) host = 'http://api.lh.inna.ru:8077';
            if (window.DEV2) host = 'http://api.lh.inna.ru';

            return host + '/api/v1' + s;
        }

        return {
            GET_SECTION_TOURS: url('/Section/Get/1'),
            GET_SECTION_INDIVIDUAL_TOURS: url('/Section/Get/2'),
            GET_INDIVIDUAL_TOURS_CATEGORY: url('/IndividualTourCategory/Get'),

            SEND_IT_CATEGORY_REQUEST: url('/RequestsTour/Post'),

            DYNAMIC_FROM_SUGGEST: url('/Packages/From'),
            DYNAMIC_TO_SUGGEST: url('/Packages/To'),
            DYNAMIC_GET_OBJECT_BY_ID: url('/Packages/DirectoryById'),
            DYNAMIC_SEARCH: window.DEV_DYNAMIC_SEARCH_PACKAGE_STUB || url('/Packages/Search'),
            DYNAMIC_SEARCH_HOTELS: url('/Packages/SearchHotels'),
            DYNAMIC_SEARCH_TICKETS: window.DEV_DYNAMIC_SEARCH_TICKETS_STUB || url('/Packages/SearchTickets'),
            DYNAMIC_HOTEL_DETAILS: url('/Packages/SearchHotel'),
            DYNAMIC_GET_DIRECTORY_BY_IP: url('/Packages/DirectoryByIP'),

            AUTH_SIGN_UP: url('/Account/Register/Post'),
            AUTH_SIGN_UP_STEP_2: url('/Account/Confirm/Post'),
            AUTH_SIGN_IN: url('/Account/Login/Post'),
            AUTH_RESTORE_A: url('/Account/ForgotPassword/Post'),
            AUTH_RESTORE_B: url('/Account/ResetPassword/Post'),
            AUTH_SOCIAL_BROKER: app_main.host + '/Account/ExternalLogin',
            AUTH_LOGOUT: url('/Account/Logoff'),
            AUTH_CHANGE_INFO: url('/Account/ChangeInfo/Post'),
            AUTH_RECOGNIZE: url('/Account/Info/Post'),
            AUTH_CHANGE_PASSWORD: url('/Account/ChangePassword/Post'),

            PURCHASE_TRANSPORTER_GET_ALLIANCE: url('/Transporter/GetAllianceByName'),
            DICTIONARY_ALL_COUNTRIES: url('/Dictionary/Country'),
            AVIA_FROM_SUGGEST: url('/Dictionary/Directory/Get'),
            AVIA_RESERVATION: url('/AviaOrder/Reservation'),
            AVIA_RESERVATION_GET_VARIANT: url('/AviaOrder/GetVariant'),
            AVIA_RESERVATION_GET_PAY_DATA: url('/Payment/Index'),
            AVIA_PAY: url('/Psb/Pay'),
            AVIA_PAY_CHECK: url('/AviaOrder/CheckOrder'),
            AVIA_TARIFS: url('/Avia/GetRule'),

            AVIA_BEGIN_SEARCH: url('/Avia/Get'),
            AVIA_CHECK_AVAILABILITY: url('/avia/IsActual'),
            PACKAGE_CHECK_AVAILABILITY: url('/Packages/IsPackageAvailable'),
            PACKAGE_RESERVATION: url('/PackagesOrder/Reservation'),

            "*_PAGE_CONTENT": url('/Section/Get/'),

            eof: null
        }
    })
    .factory('innaApp.API.events', function(){
        return {
            build: function(eventName, subs){
                return eventName.split('*').join(subs);
            },

            DYNAMIC_SERP_FILTER_HOTEL: 'inna.Dynamic.SERP.Hotel.Filter',
            DYNAMIC_SERP_FILTER_TICKET: 'inna.Dynamic.SERP.Ticket.Filter',
            DYNAMIC_SERP_FILTER_ANY_CHANGE: 'inna.Dynamic.SERP.*.Filter',
            DYNAMIC_SERP_FILTER_ANY_DROP: 'inna.Dynamic.SERP.*.Filter.Drop',
            DYNAMIC_SERP_TICKET_DETAILED_REQUESTED: 'inna.Dynamic.SERP.Tickets.Detailed',
            DYNAMIC_SERP_TICKET_SET_CURRENT_BY_IDS: 'inna.Dynamic.SERP.Tickets.SetCurrentById',
            DYNAMIC_SERP_HOTEL_DETAILS_LOADED: 'inna.Dynamic.SERP.Hotel.DetailedInfo.Loaded',

            AUTH_FORGOTTEN_LINK_CLICKED: 'inna.Auth.Forgotten-link-clicked',
            AUTH_SIGN_IN: 'inna.Auth.SignIn',
            AUTH_SIGN_OUT: 'inna.Auth.SignOut',

            eol: null
        }
    })
    .constant('innaApp.API.pageContent.DYNAMIC', 4)
    .constant('innaApp.API.pageContent.AVIA', 3)
    .directive('innaWith', function(){
        return {
            scope: false,
            link: function($scope, $elem, $attrs){
                var expr = $attrs.innaWith;
                var bits = expr.split(',');

                bits.forEach(function(bit){
                    var keyVal = bit.split('as');
                    var val = keyVal[0].trim();
                    var key = keyVal[1].trim();

                    $scope[key] = $scope.$eval(val);
                });
            }
        }
    });

﻿innaAppServices.
    factory('aviaHelper', [
        '$rootScope',
        '$http',
        '$log',
        '$filter',
        '$timeout',
        '$location',
        'innaApp.Urls',
        'eventsHelper',
        'urlHelper',
        function ($rootScope, $http, $log, $filter, $timeout, $location, Urls, eventsHelper, urlHelper) {
            function log(msg) {
                $log.log(msg);
            }

            var manyCode = "many";
            var manyName = "Несколько авиакомпаний";
            var emptyCode = "empty";

            var timeFormat = "HH:mm";
            var dateFormat = "dd MMM yyyy, EEE";
            var shortDateFormat = "dd MMM, EEE";

            function dateToMillisecs(date) {
                var res = dateHelper.apiDateToJsDate(date);
                if (res != null)
                    return res.getTime();
                else
                    return null;
            };

            function getTimeFormat(dateText) {
                return $filter("date")(dateText, timeFormat);
            }

            function getDateFormat(dateText, customDateFormat, useShort) {
                if (customDateFormat == null) {
                    customDateFormat = useShort ? shortDateFormat : dateFormat;
                }
                return changeEnToRu($filter("date")(dateText, customDateFormat), useShort);
            }

            //формат дат
            var monthEnToRus = [
                { En: "Jan", Ru: "января" },
                { En: "Feb", Ru: "февраля" },
                { En: "Mar", Ru: "марта" },
                { En: "Apr", Ru: "апреля" },
                { En: "May", Ru: "мая" },
                { En: "Jun", Ru: "июня" },
                { En: "Jul", Ru: "июля" },
                { En: "Aug", Ru: "августа" },
                { En: "Sep", Ru: "сентября" },
                { En: "Oct", Ru: "октября" },
                { En: "Nov", Ru: "ноября" },
                { En: "Dec", Ru: "декабря" }
            ];

            var monthEnToRusShort = [
                { En: "Jan", Ru: "янв" },
                { En: "Feb", Ru: "фев" },
                { En: "Mar", Ru: "мар" },
                { En: "Apr", Ru: "апр" },
                { En: "May", Ru: "мая" },
                { En: "Jun", Ru: "июн" },
                { En: "Jul", Ru: "июл" },
                { En: "Aug", Ru: "авг" },
                { En: "Sep", Ru: "сен" },
                { En: "Oct", Ru: "окт" },
                { En: "Nov", Ru: "ноя" },
                { En: "Dec", Ru: "дек" }
            ];

            var weekDaysEnToRus = [
                { En: "Mon", Ru: "пн" },
                { En: "Tue", Ru: "вт" },
                { En: "Wed", Ru: "ср" },
                { En: "Thu", Ru: "чт" },
                { En: "Fri", Ru: "пт" },
                { En: "Sat", Ru: "сб" },
                { En: "Sun", Ru: "вс" }
            ];

            function changeEnToRu(text, useShort) {
                if (text == null || text.length == 0)
                    return text;

                var dic = useShort ? monthEnToRusShort : monthEnToRus;
                for (var i = 0; i < dic.length; i++) {
                    var dicItem = dic[i];
                    if (text.indexOf(dicItem.En) > -1) {
                        text = text.replace(dicItem.En, dicItem.Ru);
                        break;
                    }
                }
                dic = weekDaysEnToRus;
                for (var i = 0; i < dic.length; i++) {
                    var dicItem = dic[i];
                    if (text.indexOf(dicItem.En) > -1) {
                        text = text.replace(dicItem.En, dicItem.Ru);
                        break;
                    }
                }
                return text;
            }

            //время в пути
            function getFlightTimeFormatted(time) {
                if (time != null) {
                    //вычисляем сколько полных часов
                    var h = Math.floor(time / 60);
                    var addMins = time - h * 60;
                    //return h + " ч " + addMins + " мин" + " (" + time + ")";//debug
                    if (addMins == 0)
                        return h + " ч";
                    else if (h == 0)
                        return addMins + " мин";
                    else
                        return h + " ч " + addMins + " мин";
                }
                return "";
            }

            function pluralForm(i, str1, str2, str3) {
                function plural(a) {
                    if (a % 10 == 1 && a % 100 != 11) return 0
                    else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) return 1
                    else return 2;
                }

                switch (plural(i)) {
                    case 0:
                        return str1;
                    case 1:
                        return str2;
                    default:
                        return str3;
                }
            }

            var baloonType = {
                msg: 'msg',
                err: 'err',
                msgClose: 'msgClose',
                success: 'success',
                payExpires: 'payExpires'
            };

            var host = app_main.host.replace('api.', 's.'); //http://api.test.inna.ru
            var helper = {
                sexType: { man: 1, woman: 2 },

                directionType: { departure: 'departure', arrival: 'arrival', backDeparture: 'backDeparture', backArrival: 'backArrival' },
                dayTime: { morning: 'morning', day: 'day', evening: 'evening', night: 'night' },

                cabinClassList: [
                    { name: 'Эконом', value: 0 },
                    { name: 'Бизнес', value: 1 }
                ],
                getCabinClassName: function (value) {
                    var res = _.find(helper.cabinClassList, function (item) {
                        return item.value == value
                    });
                    return res != null ? res.name : "";
                },

                getTransferCountText: function (count) {
                    switch (count) {
                        case 0:
                            return "пересадок";
                        case 1:
                            return "пересадка";
                        case 2:
                            return "пересадки";
                        case 3:
                            return "пересадки";
                        case 4:
                            return "пересадки";
                        case 5:
                            return "пересадок";
                        case 6:
                            return "пересадок";
                        case 7:
                            return "пересадок";
                        case 8:
                            return "пересадок";
                        case 9:
                            return "пересадок";
                        case 10:
                            return "пересадок";
                        default:
                            return "пересадок";
                    }
                },

                getSliderTimeFormat: function (text) {
                    if (text != null) {
                        text = $filter("date")(text, 'EEE HH:mm');
                        return changeEnToRu(text);
                    }
                    return '';
                },

                getRuDateFormat: function (text, enFormat, useShort) {
                    if (text != null && enFormat != null) {
                        text = $filter("date")(text, enFormat);
                        return changeEnToRu(text, useShort);
                    }
                    return '';
                },

                addFormattedDatesFields: function (item) {
                    //дополняем полями с форматированной датой и временем
                    item.DepartureTimeFormatted = getTimeFormat(item.DepartureDate);
                    item.DepartureDateFormatted = getDateFormat(item.DepartureDate, null, true);
                    item.ArrivalTimeFormatted = getTimeFormat(item.ArrivalDate);
                    item.ArrivalDateFormatted = getDateFormat(item.ArrivalDate, null, true);

                    item.BackDepartureTimeFormatted = getTimeFormat(item.BackDepartureDate);
                    item.BackDepartureDateFormatted = getDateFormat(item.BackDepartureDate, null, true);
                    item.BackArrivalTimeFormatted = getTimeFormat(item.BackArrivalDate);
                    item.BackArrivalDateFormatted = getDateFormat(item.BackArrivalDate, null, true);
                },

                //код компании
                getTransporterLogo: function (etapsTo) {
                    if (etapsTo != null) {
                        if (etapsTo.length == 1) {
                            return { name: etapsTo[0].TransporterName, logo: etapsTo[0].TransporterLogo };
                        }
                        else if (etapsTo.length > 1) {
                            var firstCode = etapsTo[0].TransporterLogo;
                            var firstName = etapsTo[0].TransporterName;
                            for (var i = 1; i < etapsTo.length; i++) {
                                if (etapsTo[i].TransporterLogo != firstCode) {
                                    //коды отличаются - возвращаем
                                    return { name: manyName, logo: manyCode };
                                }
                            }
                            //коды не отличаются - возвращаем код
                            return { name: firstName, logo: firstCode };
                        }
                    }
                },

                setTransporterListText: function (item, codeEtapsTo, codeEtapsBack) {
                    item.TransporterListText = "Разные авиакомпании";
                    if (codeEtapsBack != null) {
                        if (codeEtapsTo.code != manyCode && codeEtapsBack.code != manyCode) {
                            if (codeEtapsTo.code == codeEtapsBack.code)
                                item.TransporterListText = codeEtapsTo.name;
                            else
                                item.TransporterListText = codeEtapsTo.name + " / " + codeEtapsBack.name;
                        }
                    }
                    else {
                        if (codeEtapsTo.code != manyCode) {
                            item.TransporterListText = codeEtapsTo.name;
                        }
                    }
                },


                setEtapsTransporterCodeUrl: function (logo) {
                    //return "http://adioso.com/media/i/airlines/" + logo + ".png";
                    if (logo == null || logo.length == 0) {
                        logo = emptyCode;
                    }

                    if (logo == manyCode) {
                        return "/spa/img/group.png";
                    }
                    else {
                        return host + "/Files/logo/" + logo + ".png";
                    }
                },

                addCustomFields: function (item) {
                    var departureDate = dateHelper.apiDateToJsDate(item.DepartureDate);
                    var arrivalDate = dateHelper.apiDateToJsDate(item.ArrivalDate);
                    var backDepartureDate = dateHelper.apiDateToJsDate(item.BackDepartureDate);
                    var backArrivalDate = dateHelper.apiDateToJsDate(item.BackArrivalDate);

                    item.sort = {
                        DepartureDate: departureDate.getTime(),
                        ArrivalDate: arrivalDate.getTime(),
                        BackDepartureDate: backDepartureDate ? backDepartureDate.getTime() : null,
                        BackArrivalDate: backArrivalDate ? backArrivalDate.getTime() : null,

                        DepartureHours: departureDate.getHours(),
                        ArrivalHours: arrivalDate.getHours(),
                        BackDepartureHours: backDepartureDate ? backDepartureDate.getHours() : null,
                        BackArrivalHours: backArrivalDate ? backArrivalDate.getHours() : null,
                    };

                    //console.log(item.DepartureDate + ' hours: ' + item.sort.DepartureHours);
                    //console.log(item.ArrivalDate + ' hours: ' + item.sort.ArrivalHours);
                    //console.log(item.BackDepartureDate + ' hours: ' + item.sort.BackDepartureHours);
                    //console.log(item.BackArrivalDate + ' hours: ' + item.sort.BackArrivalHours);

                    //дополняем полями с форматированной датой и временем
                    helper.addFormattedDatesFields(item);

                    //TransporterCode
                    var codeEtapsTo = helper.getTransporterLogo(item.EtapsTo);
                    var codeEtapsBack = helper.getTransporterLogo(item.EtapsBack);
                    item.EtapsToTransporterCodeUrl = helper.setEtapsTransporterCodeUrl(codeEtapsTo.logo);
                    item.EtapsToTransporterName = codeEtapsTo.name;
                    if (codeEtapsBack != null) {
                        item.EtapsBackTransporterCodeUrl = helper.setEtapsTransporterCodeUrl(codeEtapsBack.logo);
                        item.EtapsBackTransporterName = codeEtapsBack.name;
                    }

                    //список транспортных компаний
                    var transportersList = [];
                    _.each(item.EtapsTo, function (etap) {
                        transportersList.push({ code: etap.TransporterCode, name: etap.TransporterName, logo: etap.TransporterLogo });
                    });
                    if (item.EtapsBack != null && item.EtapsBack.length > 0) {
                        _.each(item.EtapsBack, function (etap) {
                            transportersList.push({ code: etap.TransporterCode, name: etap.TransporterName, logo: etap.TransporterLogo });
                        });
                    }
                    transportersList = _.uniq(transportersList, false, function (tr) {
                        return tr.code
                    });
                    _.each(transportersList, function (tr) {
                        tr.logoUrl = helper.setEtapsTransporterCodeUrl(tr.logo);
                    });
                    item.transportersList = transportersList;

                    //время в пути
                    item.TimeToFormatted = getFlightTimeFormatted(item.TimeTo);
                    item.TimeBackFormatted = getFlightTimeFormatted(item.TimeBack);

                    //авиакомпании, текст Разные авиакомпании, список
                    helper.setTransporterListText(item, codeEtapsTo, codeEtapsBack);

                    //этапы
                    if (item.EtapsTo.length > 1) {
                        item.EtapsToItems = [];
                        for (var k = 0; k < item.EtapsTo.length - 1; k++) {
                            var etap = item.EtapsTo[k];
                            var waitTime = getFlightTimeFormatted(etap.TransferWaitTime);
                            item.EtapsToItems.push({ code: etap.InCode, name: etap.InPort, waitTime: waitTime });
                        }
                    }
                    if (item.EtapsBack.length > 1) {
                        item.EtapsBackItems = [];
                        for (var k = 0; k < item.EtapsBack.length - 1; k++) {
                            var etap = item.EtapsBack[k];
                            var waitTime = getFlightTimeFormatted(etap.TransferWaitTime);
                            item.EtapsBackItems.push({ code: etap.InCode, name: etap.InPort, waitTime: waitTime });
                        }
                    }

                    function addFieldsToEtap(etap, etapNext) {
                        etap.TransporterCodeUrl = helper.setEtapsTransporterCodeUrl(etap.TransporterLogo);
                        etap.OutTimeFormatted = getTimeFormat(etap.OutTime);
                        etap.OutDateFormatted = getDateFormat(etap.OutTime);
                        etap.InTimeFormatted = getTimeFormat(etap.InTime);
                        etap.InDateFormatted = getDateFormat(etap.InTime);
                        etap.WaitTimeFormatted = getFlightTimeFormatted(etap.TransferWaitTime);
                        etap.WayTimeFormatted = getFlightTimeFormatted(etap.WayTime);

                        if (etapNext != null) {
                            etap.NextOutPort = etapNext.OutPort;
                            etap.NextOutPortId = etapNext.OutPortId;
                            etap.NextOutCity = etapNext.OutCity;
                            etap.NextOutCode = etapNext.OutCode;
                            etap.NextOutCountryName = etapNext.OutCountryName;
                        }
                    }

                    for (var e = 0; e < item.EtapsTo.length; e++) {
                        var etap = item.EtapsTo[e];
                        var etapNext = null;
                        if ((e + 1) < item.EtapsTo.length) {
                            etapNext = item.EtapsTo[e + 1];
                        }
                        addFieldsToEtap(etap, etapNext);
                    }
                    for (var e = 0; e < item.EtapsBack.length; e++) {
                        var etap = item.EtapsBack[e];
                        var etapNext = null;
                        if ((e + 1) < item.EtapsBack.length) {
                            etapNext = item.EtapsBack[e + 1];
                        }
                        addFieldsToEtap(etap, etapNext);
                    }


                    function addAirPortFromToFields(item) {
                        if (item.EtapsTo.length > 0) {
                            var startEtapTo = item.EtapsTo[0];
                            var endEtapTo = item.EtapsTo[item.EtapsTo.length - 1];

                            if (item.AirportFrom === undefined) {
                                item.AirportFrom = startEtapTo.OutPort;
                            }
                            if (item.OutCode === undefined) {
                                item.OutCode = startEtapTo.OutCode;
                            }
                            if (item.AirportTo === undefined) {
                                item.AirportTo = endEtapTo.InPort;
                            }
                            if (item.InCode === undefined) {
                                item.InCode = endEtapTo.InCode;
                            }
                        }
                    }

                    addAirPortFromToFields(item);
                },

                addAggInfoFields: function (item) {
                    //для звезд (особенности верстки)
                    item.starsList = item.Stars > 0 ? _.generateRange(1, item.Stars) : null;
                    item.taStarsList = item.TaFactor > 0 ? _.generateRange(1, item.TaFactor) : null;

                    item.CheckInDate = dateHelper.apiDateToJsDate(item.CheckIn);
                    item.CheckOutDate = dateHelper.apiDateToJsDate(item.CheckOut);
                },

                baloonType: baloonType,

                baloon: {
                    isVisible: false,
                    caption: '',
                    text: '',
                    data: null,
                    type: baloonType.msg,
                    closeFn: null,
                    showGlobalAviaErr: function () {
                        helper.baloon.show("Что-то пошло не так", "Свяжитесь с оператором по телефону <b>+7 495 742-1212</b>",
                            baloonType.err, function () {
                                $location.path(Urls.URL_AVIA);
                            });
                    },
                    showErr: function (caption, text, closeFn) {
                        helper.baloon.show(caption, text, baloonType.err, closeFn);
                    },
                    showWithClose: function (caption, text, closeFn) {
                        helper.baloon.show(caption, text, baloonType.msgClose, closeFn);
                    },
                    show: function (caption, text, type, closeFn, data) {
                        //console.log('show', caption, text, type);
                        if (type == null) {
                            helper.baloon.type = baloonType.msg;
                        }
                        else {
                            helper.baloon.type = type;
                        }

                        helper.baloon.caption = caption;
                        helper.baloon.text = text;
                        helper.baloon.closeFn = closeFn;
                        helper.baloon.isVisible = true;
                        //data: { buttonCaption: '', successFn: fn }
                        helper.baloon.data = data;

                        //$rootScope.$broadcast('baloon.show');
                    },
                    hide: function () {
                        //console.log('baloon hide');
                        helper.baloon.isVisible = false;
                        //$rootScope.$broadcast('baloon.hide');
                    }
                },

                getDateFormat: function (dateText, customDateFormat) {
                    return getDateFormat(dateText, customDateFormat);
                },

                pluralForm: function (i, str1, str2, str3) {
                    return pluralForm(i, str1, str2, str3);
                },

                getNumSeatsText: function (countLeft, ticketsCount) {
                    countLeft = parseInt(countLeft);
                    function getPluralTickets(count) {
                        return helper.pluralForm(count, 'билет', 'билета', 'билетов');
                    }

                    if (countLeft < 0 || ticketsCount < 0)
                        return '';

                    switch (ticketsCount) {
                        case 1:
                        {
                            if (countLeft == 1) {
                                return 'Остался последний билет';
                            }
                            else if (countLeft <= 3) {
                                return 'Последние ' + countLeft + ' ' + getPluralTickets(countLeft);
                            }
                            break;
                        }
                        case 2:
                        {
                            if (countLeft <= 3) {
                                return 'Остались последние билеты';
                            }
                            else if (countLeft <= 6) {
                                return 'Последние ' + countLeft + ' ' + getPluralTickets(countLeft);
                            }
                            break;
                        }
                        case 3:
                        {
                            if (countLeft <= 5) {
                                return 'Остались последние билеты';
                            }
                            else if (countLeft <= 9) {
                                return 'Последние ' + countLeft + ' ' + getPluralTickets(countLeft);
                            }
                            break;
                        }
                        case 4:
                        {
                            if (countLeft <= 7) {
                                return 'Остались последние билеты';
                            }
                            else if (countLeft <= 9) {
                                return 'Последние ' + countLeft + ' ' + getPluralTickets(countLeft);
                            }
                            break;
                        }
                        case 5:
                        case 6:
                        {
                            if (countLeft <= 9) {
                                return 'Остались последние билеты';
                            }
                            break;
                        }
                    }

                    return '';
                },

                getTicketsCount: function (adultCount, childCount, infantsCount) {
                    var iAdultCount = parseInt(adultCount);
                    var infWithPlaces = parseInt(infantsCount) - iAdultCount;
                    if (infWithPlaces < 0) {
                        infWithPlaces = 0;
                    }
                    return iAdultCount + parseInt(childCount) + infWithPlaces;
                },

                popupItemInfo: function (ticketsCount, cabinClass) {
                    var self = this;
                    self.isShow = false;
                    self.item = null;

                    self.ticketsCount = ticketsCount;
                    self.hideBuyButton = false;

                    var cabinClass = parseInt(cabinClass);
                    self.ticketsClass = helper.getCabinClassName(cabinClass).toLowerCase();

                    self.show = function ($event, item, criteria, searchId, hideBuyButton) {
                        eventsHelper.preventBubbling($event);
                        self.isShow = true;
                        self.hideBuyButton = hideBuyButton;
                        item = self.addAggFields(item);
                        self.item = item;
                        console.log(item);

                        if (criteria != null && searchId != null) {
                            var buyCriteria = angular.copy(criteria);
                            buyCriteria.QueryId = searchId;
                            buyCriteria.VariantId1 = item.VariantId1;
                            buyCriteria.VariantId2 = item.VariantId2 != null ? item.VariantId2 : 0;

                            var url = app_main.host.replace('api.', '') + '/#' + urlHelper.UrlToAviaTicketsReservation(buyCriteria);
                            self.link = url;
                        }
                    }

                    self.addAggFields = function (item) {
                        if (item != null) {
                            item.etapsAgg = [];

                            var maxEtapsLen = item.EtapsTo.length;
                            if (item.EtapsBack != null && item.EtapsBack.length > maxEtapsLen) {
                                maxEtapsLen = item.EtapsBack.length;
                            }

                            for (var i = 0; i < maxEtapsLen; i++) {
                                var etapTo = i < item.EtapsTo.length ? item.EtapsTo[i] : null;
                                var etapBack = i < item.EtapsBack.length ? item.EtapsBack[i] : null;

                                var nextEtapTo = (i + 1) < item.EtapsTo.length ? item.EtapsTo[i+1] : null;
                                var nextEtapBack = (i + 1) < item.EtapsBack.length ? item.EtapsBack[i + 1] : null;
                                
                                if (etapTo != null) {
                                    etapTo.nextEtapTo = nextEtapTo;
                                }
                                if (etapBack != null) {
                                    etapBack.nextEtapBack = nextEtapBack;
                                }

                                item.etapsAgg.push({ etapTo: etapTo, etapBack: etapBack });
                            }
                        }

                        return item;
                    }

                    self.print = function ($event, item) {
                        eventsHelper.preventBubbling($event);
                        alert('Не реализовано');
                    }

                    self.isGetLinkOpen = false;
                    self.link = '';
                    self.getLink = function ($event, item) {
                        eventsHelper.preventBubbling($event);
                        self.isGetLinkOpen = !self.isGetLinkOpen;
                    }
                    self.getLinkClose = function ($event) {
                        eventsHelper.preventBubbling($event);
                        self.isGetLinkOpen = false;
                    }

                    self.share = function ($event, item) {
                        eventsHelper.preventBubbling($event);
                        alert('Не реализовано');
                    }
                },

                eof: null
            };
            return helper;
        }]);
angular.module('innaApp.controllers')
    .controller('PopupCtrlMixin', [
        '$scope', '$element',
        function($scope, $element) {
            $scope.popup = {
                isOpen: false,
                toggle: function(){
                    $scope.popup.isOpen = !$scope.popup.isOpen;
                }
            }

            var doc = $(document);
            var onClick = function(event) {
                var isInsideComponent = $.contains($($element)[0], event.target);

                if(!isInsideComponent) {
                    $scope.$apply(function($scope){
                        $scope.popup.isOpen = false;
                    });
                }
            }

            doc.on('click', onClick);

            $scope.$on('$destroy', function(){
                doc.off('click', onClick);
            });
        }
    ])
﻿angular.module('innaApp.Url', [])
    .factory('urlHelper', ['innaApp.Urls', function (appUrls) {

        var helper = {
            ver: app_main.version,
            Prefix: '#',
            Delimiter: '-',
            DelimiterReplace: '_',

            addPathAndVersion: function (url) {
                //версия нужна чтобы обновлялись шаблоны
                //return url + '?v=' + helper.ver;
                return url;
            },
            getInnerTemplate: function () {
                return 'grid/_item_inner.html';
            },
            getTemplateUrlByBlockType: function (type) {
                var bType = tours.grid.blockType;
                //switch (type) {
                //    case bType.bXL: return helper.addPathAndVersion('templates/grid/item_XL.html');
                //    case bType.b2SL: return helper.addPathAndVersion('templates/grid/item_2SL.html');
                //    case bType.bL2S: return helper.addPathAndVersion('templates/grid/item_L2S.html');
                //    case bType.b2M: return helper.addPathAndVersion('templates/grid/item_2M.html');
                //    case bType.bLSS: return helper.addPathAndVersion('templates/grid/item_LSS.html');
                //    case bType.bSSL: return helper.addPathAndVersion('templates/grid/item_SSL.html');
                //    case bType.bL3L3L3: return helper.addPathAndVersion('templates/grid/item_L3L3L3.html');
                //    case bType.bP2P1P1: return helper.addPathAndVersion('templates/grid/item_P2P1P1.html');
                //    case bType.bP1P2P1: return helper.addPathAndVersion('templates/grid/item_P1P2P1.html');
                //    case bType.bP1P1P2: return helper.addPathAndVersion('templates/grid/item_P1P1P2.html');
                //    default: return helper.addPathAndVersion('templates/grid/item_XL.html');
                //}

                //шаблоны тянутся с главной, чтобы не было проблем с кэшированием
                switch (type) {
                    case bType.bXL: return 'grid/item_XL.html';
                    case bType.b2SL: return 'grid/item_2SL.html';
                    case bType.bL2S: return 'grid/item_L2S.html';
                    case bType.b2M: return 'grid/item_2M.html';
                    case bType.bLSS: return 'grid/item_LSS.html';
                    case bType.bSSL: return 'grid/item_SSL.html';
                    case bType.bL3L3L3: return 'grid/item_L3L3L3.html';
                    case bType.bP2P1P1: return 'grid/item_P2P1P1.html';
                    case bType.bP1P2P1: return 'grid/item_P1P2P1.html';
                    case bType.bP1P1P2: return 'grid/item_P1P1P2.html';
                    default: return 'grid/item_XL.html';
                }
            },

            getUrlFromData: function (data) {
                if (data != null) {
                    if (data.CodeIata != null && data.CodeIata.length > 0)
                        return data.CodeIata;
                    else if (data.NameEn != null && data.NameEn.length > 0)
                        return data.NameEn;
                }

                return '';
            },

            changeNullsToAny: function (obj) {
                var dl = this.Delimiter;
                var dlReplace = this.DelimiterReplace;

                for (var prop in obj) {
                    var val = obj[prop];
                    if (val == undefined || val === '')
                        obj[prop] = 'any';

                    //меняем '-' на '.'
                    if (angular.isString(val)) {
                        while (val.indexOf(dl) > -1) {
                            val = val.replace(dl, dlReplace);
                        }
                    }
                    obj[prop] = val;
                    //console.log(prop + ': ' + obj[prop]);
                }
                return obj;
            },

            restoreAnyToNulls: function (obj) {
                var dl = this.Delimiter;
                var dlReplace = this.DelimiterReplace;

                for (var prop in obj) {
                    var val = obj[prop];
                    if (val == 'any')
                        obj[prop] = null;

                    //меняем '.' на '-'
                    if (angular.isString(val)) {
                        while (val.indexOf(dlReplace) > -1) {
                            val = val.replace(dlReplace, dl);
                        }
                    }
                    obj[prop] = val;
                    //console.log(prop + ': ' + obj[prop]);
                }
                return obj;
            },

            UrlToHotelDetails: function (hotelId, searchId) {
                //если открываем в новом окне - то нужен префикс #
                return this.Prefix + '/hotel/' + hotelId + '/' + searchId;
            },

            UrlToTourDetails: function (hotelId, searchId, tourId) {
                //открываем в том же окне - префикс # не нужен
                return '/hotel/' + hotelId + '/' + searchId + '/tour/' + tourId;
            },

            UrlToPaymentPage: function (orderId) {
                //открываем в том же окне - префикс # не нужен
                return '/payment/' + orderId;
            },

            UrlToSearch: function (criteria) {

                criteria = this.changeNullsToAny(criteria);

                var dl = this.Delimiter;
                return '/hotels/search/' + criteria.FromCityUrl + dl + criteria.ToCountryUrl + dl + criteria.ToRegionUrl + dl + criteria.StartMinString
                    + dl + criteria.StartDateVariance + dl + criteria.AdultNumber + dl + criteria.ChildAgesString + dl + criteria.DurationMin;

                //return '/search/' + criteria.FromCityUrl + dl + criteria.ToCountryUrl + dl + criteria.ToRegionUrl + dl + criteria.StartMinString
                //	+ dl + criteria.StartDateVariance + dl + criteria.AdultNumber + dl + criteria.ChildAgesString + dl + criteria.DurationMin
                //	+ dl + criteria.HotelStarsMin + dl + criteria.HotelStarsMax;
            },

            UrlToAvia: function (criteria) {
                criteria = this.changeNullsToAny(criteria);
                //console.log('UrlToAvia changeNullsToAny: ' + angular.toJson(criteria));

                var dl = this.Delimiter;
                var res = '' + criteria.FromUrl + dl + criteria.ToUrl + dl + criteria.BeginDate + dl;
                if (criteria.EndDate) {
                    res += criteria.EndDate;
                }
                    
                res += dl + criteria.AdultCount + dl + criteria.ChildCount + dl + criteria.InfantsCount + dl + criteria.CabinClass
                + dl + criteria.IsToFlexible + dl + criteria.IsBackFlexible + dl + criteria.PathType;

                return res;
            },

            UrlToAviaAddBuy: function (criteria) {
                var dl = this.Delimiter;
                var res = url;
                if (criteria.OrderNum > 0) {
                    res += dl + criteria.OrderNum;
                }
                return res;
            },
            UrlToAviaMain: function (criteria) {
                return appUrls.URL_AVIA + helper.UrlToAvia(criteria);
            },
            UrlToAviaSearch: function (criteria) {
                return appUrls.URL_AVIA_SEARCH + helper.UrlToAvia(criteria);
            },
            UrlToAviaTicketsReservation: function (criteria) {
                var dl = this.Delimiter;
                var res = appUrls.URL_AVIA_RESERVATION + helper.UrlToAvia(criteria);
                res += dl + criteria.QueryId + dl + criteria.VariantId1 + dl + criteria.VariantId2;
                return res;
            },
            //UrlToAviaTicketsBuy: function (criteria) {
            //    var dl = this.Delimiter;
            //    var res = appUrls.URL_AVIA_BUY + helper.UrlToAvia(criteria);
            //    res += dl + criteria.QueryId + dl + criteria.VariantId1 + dl + criteria.VariantId2;
            //    res += dl + criteria.OrderNum;

            //    return res;
            //},

            UrlToAviaTicketsBuy: function (orderNum) {
                return appUrls.URL_AVIA_BUY + orderNum;
            },

            UrlToSletatTours: function (city, country, resort, hotel, date, nightsMin, nightsMax, adults, kids, kids_ages) {
                return "/tours/?sta=on&city=" + city + "&country=" + country + "&resorts=" + resort + "&hotels=" + hotel + "&stars=&meals=&currency=RUB&adults=" + adults + "&kids=" + kids + "&kids_ages=" + kids_ages + "&priceMin=0&priceMax=0&nightsMin=" + nightsMin + "&nightsMax=" + nightsMax + "&date=" + date;
            },
            UrlToSletatToursDatesInterval: function (city, country, resort, hotel, dateFrom, dateTo, nightsMin, nightsMax, adults, kids, kids_ages) {
                return "/tours/?sta=on&city=" + city + "&country=" + country + "&resorts=" + resort + "&hotels=" + hotel + "&stars=&meals=&currency=RUB&adults=" + adults + "&kids=" + kids + "&kids_ages=" + kids_ages + "&priceMin=0&priceMax=0&nightsMin=" + nightsMin + "&nightsMax=" + nightsMax + "&date1=" + dateFrom + "&date2=" + dateTo;
            },

            eof: null
        };
        return helper;
    }])
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('AboutCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService',
        function AboutCtrl($log, $scope, $routeParams, $filter, dataService) {
        	var self = this;
        	function log(msg) {
        		$log.log(msg);
        	}

        	$scope.hellomsg = "Привет из AboutCtrl";
        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('ContactsCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService',
        function ContactsCtrl($log, $scope, $routeParams, $filter, dataService) {
            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            $scope.hellomsg = "Привет из ContactsCtrl";
        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('IndividualToursCtrl', ['$log', '$scope', '$routeParams', '$filter', '$location', 'dataService', 'sharedProperties',
        function IndividualToursCtrl($log, $scope, $routeParams, $filter, $location, dataService, sharedProperties) {
            function log(msg) {
                $log.log(msg);
            }

            //карусель
            $scope.myInterval = 5000;

            $scope.hellomsg = "Привет из IndividualToursCtrl";

            //log('$scope.getSectionIndividualTours');
            var params = {
                sectionLayoutId: QueryString.getFromUrlByName(location.href, 'sectionLayoutId'),
                sliderId: QueryString.getFromUrlByName(location.href, 'sliderId'),
                layoutOffersId: QueryString.getFromUrlByName(location.href, 'layoutOffersId')
            };
            dataService.getSectionIndividualTours(params, function (data) {
                //обновляем данные
                if (data != null) {
                    //log('data: ' + angular.toJson(data));
                    //log('$scope.getSectionIndividualTours success');
                    updateModel(data);
                    //$scope.blocks = angular.fromJson(data);
                }
            }, function (data, status) {
                //ошибка получения данных
                log('getSectionIndividualTours error; status:' + status);
            });

            function updateModel(data) {
                $scope.sections = data.SectionLayouts;
                $scope.slides = data.Slider;
                //данные для слайдера - нужны другому контроллеру
                sharedProperties.setSlider($scope.slides);
            }
        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('IndividualToursCategoryCtrl', [
        '$log',
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',
        'dataService',
        'sharedProperties',
        function ($log, $scope, $rootScope, $routeParams, $location, dataService, sharedProperties) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.hellomsg = "Привет из IndividualToursCategoryCtrl";
            $scope.offersList = [];
            $scope.filteredOffersList = [];

            $scope.programsTypeList = [];
            $scope.countriesList = [];
            $scope.isProgrammOpened = false;
            $scope.isCountryOpened = false;

            $scope.filter = {
                selectedProgramm: null,
                selectedCountry: null
            };

            //отключаем бабблинг событий
            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            var skipCloseType = { prog: 'prog', country: 'country' };
            function closeAllPopups(skipClose) {
                if (skipClose != skipCloseType.prog)
                    $scope.isProgrammOpened = false;
                if (skipClose != skipCloseType.country)
                    $scope.isCountryOpened = false;
            };

            $scope.programmClick = function ($event) {
                closeAllPopups(skipCloseType.prog);
                $scope.isProgrammOpened = !$scope.isProgrammOpened;
                preventBubbling($event);
            };
            $scope.countryClick = function ($event) {
                closeAllPopups(skipCloseType.country);
                $scope.isCountryOpened = !$scope.isCountryOpened;
                preventBubbling($event);
            };
            $scope.programmItemClick = function (item) {
                $scope.filter.selectedProgramm = item;
                $location.search('type', item.id);
                applyFilter();
                scrollToTop();
            };
            $scope.countryItemClick = function (item) {
                $scope.filter.selectedCountry = item;
                $location.search('country', item.id);
                applyFilter();
            };

            //слушаем клик на body
            $rootScope.addBodyClickListner('it_category_tours', function () {
                //log('IndividualToursCategoryCtrl bodyClick');
                closeAllPopups();
            });

            //получаем категорию
            var categoryId = $routeParams.id;
            //log('$scope.getIndividualToursCategory, categoryId:' + categoryId);
            dataService.getIndividualToursCategory(categoryId, function (data) {
                //обновляем данные
                if (data != null) {
                    //log('data: ' + angular.toJson(data));
                    //log('$scope.getIndividualToursCategory success');
                    updateModel(data);
                    //$scope.blocks = angular.fromJson(data);
                }
            }, function (data, status) {
                //ошибка получения данных
                log('getIndividualToursCategory error; status:' + status);
            });

            $scope.programClick = function (offer) {
                track.programDownload(offer.Name, offer.DirectoryName, offer.IndividualTourCategoryName);
            }

            function updateModel(data) {
                $scope.data = data;

                //список категорий
                $scope.categoryList = data.CategoryList;
                //корневая
                $scope.rootCategory = {
                    Id: data.Id,
                    Name: data.Name,
                    Description: data.Description
                };
                //выбранная
                $scope.selectedCategory = $scope.rootCategory;

                //разбираем типы программ и страны (города)
                var programsTypeList = [];
                var countriesList = [];
                //составляем список
                _.each(data.IndividualTourList, function (item) {
                    programsTypeList.push(new idNameItem(item.IndividualTourCategoryId, item.IndividualTourCategoryName));
                    countriesList.push(new idNameItem(item.DirectoryId, item.DirectoryName));
                });
                //оставляем только уникальные
                programsTypeList = _.uniq(programsTypeList, false, function (item) {
                    return item.id;
                });

                programsTypeList.unshift(new idNameItem(0, "Все"));
                $scope.programsTypeList = programsTypeList;

                //оставляем только уникальные
                countriesList = _.uniq(countriesList, false, function (item) {
                    return item.id;
                });
                //пропускаем пустые страны
                countriesList = _.filter(countriesList, function (item) { return item.id > 0; });
				countriesList = _.sortBy(countriesList, function(item) { return item.name; });
                //добавляем путнкт все в начало
                countriesList.unshift(new idNameItem(0, "Все"));
                $scope.countriesList = countriesList;

                //ставим выбранные
                $scope.filter.selectedProgramm = $location.search().type &&
                    _.find($scope.programsTypeList, function(type){ return type.id == $location.search().type; }) ||
                    $scope.programsTypeList[0];
                $scope.filter.selectedCountry = $location.search().country &&
                    _.find($scope.countriesList, function(country){ return country.id == $location.search().country }) ||
                    $scope.countriesList[0];

                $scope.offersList = data.IndividualTourList;


                applyFilter();

                $scope.slides = data.Slider;
                //данные для слайдера - нужны другому контроллеру
                sharedProperties.setSlider($scope.slides);

                $scope.$broadcast('comboboxDataLoaded');
            };

            function scrollToTop() {
                //$(document.body).animate({
                //    scrollTop: 0
                //}, 50);
                //$(document.documentElement).animate({
                //    scrollTop: 0
                //}, 50);
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            };

            function applyFilter() {
                var filteredOffersList = [];
                _.each($scope.offersList, function (item) {
                    if (($scope.filter.selectedProgramm.id == 0
                        || item.IndividualTourCategoryId == $scope.filter.selectedProgramm.id)
                        &&
                        ($scope.filter.selectedCountry.id == 0
                        || item.DirectoryId == $scope.filter.selectedCountry.id)) {
                        filteredOffersList.push(item);
                    }
                });

                $scope.filteredOffersList = filteredOffersList;

                //меняем описание для категории в шапке
                if ($scope.filter.selectedProgramm.id > 0)
                {
                    $scope.selectedCategory = _.find($scope.categoryList, function (cat) { return cat.Id == $scope.filter.selectedProgramm.id });
                }
                else
                {
                    //устанавливаем корневую
                    $scope.selectedCategory = $scope.rootCategory;
                }
            };
        }
    ]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('MainCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService',
        function MainCtrl($log, $scope, $routeParams, $filter, dataService) {
        	var self = this;
        	function log(msg) {
        		$log.log(msg);
        	}

        	$scope.hellomsg = "Привет из MainCtrl";
        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('OffersListCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$location', 'dataService', 'sharedProperties', 'urlHelper',
        function OffersListCtrl($log, $scope, $rootScope, $routeParams, $filter, $location, dataService, sharedProperties, urlHelper) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.getInnerTemplate = function () {
                return urlHelper.getInnerTemplate();
            };

            $scope.getTemplateUrlByBlockType = function (type) {
                return urlHelper.getTemplateUrlByBlockType(type);
            };

            $scope.isNullOrEmpty = function (item) {
                if (item == null || item.length == 0)
                    return true;
                else
                    return false;
            };

            $scope.showImgOnly = function (item) {
                if (
                    //!$scope.isNullOrEmpty(item.FrontPrice) ||
                    //!$scope.isNullOrEmpty(item.FrontTitleRow1) ||
                    //!$scope.isNullOrEmpty(item.FrontTitleRow2) ||
                    //!$scope.isNullOrEmpty(item.FrontSubTitleRow1) ||
                    //!$scope.isNullOrEmpty(item.FrontSubTitleRow2) ||
                    !$scope.isNullOrEmpty(item.BackTitleRow1) ||
                    !$scope.isNullOrEmpty(item.BackTitleRow2) ||
                    !$scope.isNullOrEmpty(item.BackSubTitleRow1) ||
                    !$scope.isNullOrEmpty(item.BackSubTitleRow2) ||
                    !$scope.isNullOrEmpty(item.BackPrice))
                    return false;
                else
                    return true;
            };

            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            $scope.getHref = function (item) {
                var url = item.Url;
                //Url : "http://test.inna.ru/#/individualtours/category/12"
                //отрезаем нежнужное (нужен урл типа /individualtours/category/12)
                var ind = url.indexOf("/#");
                if (ind > -1) {
                    url = url.substring(ind + 2, url.length);
                }
                //url = '/#' + url;
                //log('getHref, url: ' + url);
                return url;
            };

            //нужно, чтобы кликалось со второго раза на планшетах
            $scope.lastClickedItem = null;

            $scope.offerClick = function (item, $event, position, block, section) {
                $scope.offerClickInternal(item, $event, position, block.OfferLayoutType, section.Name);
            };

            $scope.offerClickInternal = function (item, $event, position, blockType, sectionName) {
                preventBubbling($event);

                function click(item) {
                    //var url = $scope.getHref(item);
                    //url = '/tours/?sta=on&city=832&country=77&resorts=&hotels=&stars=&meals=&currency=RUB&adults=2&kids=0&kids_ages=0,0,0&priceMin=0&priceMax=0&nightsMin=10&nightsMax=14&date1=25%2F03%2F2014&date2=04%2F04%2F2014';
                    //url = '#/individualtours/category/12';
                    //url = 'http://beta.inna.ru/tours/?sta=on&city=832&country=125&resorts=&hotels=&stars=401&meals=114&currency=RUB&adults=1&kids=0&kid1=0&kid2=0&kid3=0&priceMin=0&priceMax=0&nightsMin=7&nightsMax=7&date1=03%2F05%2F2014&date2=03%2F05%2F2014';
                    //log('offerClick, sectionName: ' + section.Name + '; name: ' + item.Name + '; url: ' + item.Url + '; position: ' + position + '; type: ' + block.OfferLayoutType);
                    track.offerClick(sectionName, blockType, item.Name, position, function () {
                        location.href = item.Url;
                    });
                    //location.href = item.Url;
                }

                //если без хувера, просто картинка - то сразу кликаем
                var showImgOnly = $scope.showImgOnly(item);

                if (!showImgOnly && !!('ontouchstart' in window)) {//check for touch device
                    //первый клик пропускаем
                    if (item == $scope.lastClickedItem) {
                        click(item);
                    }
                    else
                    {
                        //кликаем на второй клик
                        $scope.lastClickedItem = item;
                    }
                }
                else
                {
                    //на компе - кликаем сразу
                    click(item);
                }
            };
        }]);
﻿'use strict';

/* Controllers */

innaAppControllers.
    controller('RootCtrl', ['$log', '$scope', '$location', 'dataService', 'eventsHelper', 'urlHelper', 'innaApp.Urls', 'aviaHelper',
        function NavigationCtrl($log, $scope, $location, dataService, eventsHelper, urlHelper, appUrls, aviaHelper) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.baloon = aviaHelper.baloon;

        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('SliderCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$location', 'dataService', 'sharedProperties',
        function SliderCtrl($log, $scope, $rootScope, $routeParams, $filter, $location, dataService, sharedProperties) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.isNullOrEmpty = function (item) {
                if (item == null || item.length == 0)
                    return true;
                else
                    return false;
            };

            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            $scope.getHref = function (item) {
                var url = item.Url;
                //Url : "http://test.inna.ru/#/individualtours/category/12"
                //отрезаем нежнужное (нужен урл типа /individualtours/category/12)
                var ind = url.indexOf("/#");
                if (ind > -1) {
                    url = url.substring(ind + 2, url.length);
                }
                //url = '/#' + url;
                //log('getHref, url: ' + url);
                return url;
            };

            $scope.offerClickSlider = function (slide, $event, position) {
                $scope.offerClickSliderInternal(slide, $event, position, "slider", "слайдер");
            };

            $scope.offerClickSliderInternal = function (item, $event, position, blockType, sectionName) {
                preventBubbling($event);
                //на компе - кликаем сразу
                click(item);

                function click(item) {
                    //var url = $scope.getHref(item);
                    ////log('offerClick, url: ' + url);
                    //$location.path(url);

                    //пишем статистику и делаем переход
                    track.offerClick(sectionName, blockType, item.Name, position, function () {
                        location.href = item.Url;
                    });
                    //location.href = item.Url;
                }
            };

            //регистрируемся для получения данных для слайдера
            sharedProperties.sliderUpdateCallback(function (data) {
                $scope.slides = sharedProperties.getSlider();
                //log('slider, sliderUpdateCallback, len: ' + $scope.slides.length);

                //событие - после которого отрабатывают jq скрипты для слайдера
                $scope.$broadcast('sliderDataLoaded');
            });

            $('.Mouse-scroll').on('click', function () {
                var $body = $('html, body'),
                    headerHeight = $('.Header').height(),
                    position = $('.Offers-anchor').position();

                $body.animate({ scrollTop: position.top - headerHeight }, 500)
            });

            $scope.$on('$destroy', function () {
                $('.Mouse-scroll').off();
            });
        }]);
﻿//function CarouselDemoCtrl($scope) {
//    $scope.myInterval = 5000;
//    $scope.slides = angular.fromJson(carouselStub);
//}
app.directive('bindOnce', function() {
    return {
        scope: true,
        link: function($scope) {
            setTimeout(function() {
                $scope.$destroy();
            }, 0);
        }
    }
});
﻿﻿innaAppDirectives.directive('dropdownInput', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
    return {
        replace: true,
        template: $templateCache.get('components/dropdown_input.html'),
        scope: {
            provideSuggestCallback: '=', //callback for ngChange
            suggest: '=', //list of suggested objects
            result: '=',
            setResultCallback: '&',
            setResultItem: '=',
            theme: '@',
            askForData: '=',
            placeholder: '@'
        },
        controller: ['$scope', function($scope){
            /*Properties*/
            $scope.fulfilled = false;

            $scope.getPlaceholder = function () {
                if ($scope.placeholder == null || $scope.placeholder.length == 0)
                    return 'Откуда';
                else
                    return $scope.placeholder;
            }

            $scope.doResultCallback = function (item) {
                if ($scope.setResultCallback) {
                    $scope.setResultCallback({ item : item });
                }
            }

            //эта хуйня нужна чтобы можно было присвоить и id и name сразу, без доп запросов
            var unwatch = $scope.$watch('setResultItem', function (item) {
                if (item != null) {
                    init(item);
                    //unwatch();
                }
            }, true);

            function init(item) {
                if ($scope.input) {
                    $scope.input.val(item.Name);
                }
                $scope.result = item.Id;
            }

            /*Events*/
            $scope.setCurrent = function ($event, option, airport) {
                //запрещаем баблинг
                $event && eventsHelper.preventBubbling($event);

                if (option != null) {
                    if (airport != null) {
                        $scope.input.val(airport.Name);
                        $scope.result = airport.Id;
                        $scope.doResultCallback(airport);
                    }
                    else {
                        $scope.input.val(option.Name);
                        $scope.result = option.Id;
                        $scope.doResultCallback(option);
                    }
                }
                $scope.fulfilled = true;
            }
            $scope.unfulfill = function(){
                $scope.fulfilled = false;
                $scope.result = null;
            }

            /*Watchers*/
            $scope.$watch('result', function (newValue, oldValue) {
                //console.log('$scope.$watch(result: %s', newValue);
                if(newValue instanceof Error) {
                    $scope.result = oldValue;

                    $scope.input.tooltip({
                        position: {
                            my: 'center top+22',
                            at: 'center bottom'
                        },
                        items: "[data-title]",
                        content: function () {
                            return $scope.input.data("title");
                        }
                    }).tooltip('open');
                } else if(!$scope.input.val()) {
                    if(newValue != null && newValue != 'null' && $scope.askForData) {
                        $scope.askForData(newValue, function (data) {
                            $scope.setCurrent(null, data);
                        });
                    }
                }
            });
        }],
        link: function(scope, elem, attrs){
            scope.input = $('input[type="text"]', elem);

            /*Events*/
            scope.input.keyup(function(event){
                var value = scope.input.val();
                var preparedText = value.split(', ')[0].trim();

                if(preparedText.length) {
                    scope.provideSuggestCallback(preparedText, value);
                }
            });

            scope.input.focus(function () {
                scope.$apply(function($scope){
                    $scope.fulfilled = false;
                });

                try{
                    scope.input.tooltip('destroy');
                } catch(e) {}
            });

            $(document).click(function (event) {
                var isInsideComponent = !!$(event.target).closest(elem).length;

                if (!isInsideComponent) {
                    scope.$apply(function ($scope) {
                        scope.fulfilled = true;
                        //select all
                        $(event.target).select();
                    });
                }
            });
        }
    }
}]);
﻿﻿'use strict';

/* Directives */

innaAppDirectives.
    directive('baloon', [
        '$templateCache',
        'aviaHelper',
        'eventsHelper',
        function ($templateCache, aviaHelper, eventsHelper) {
            return {
                replace: true,
                template: $templateCache.get('components/baloon.html'),
                scope: {
                    isShow: '=',
                    caption: '=',
                    text: '=',
                    type: '=',
                    closeFn: '=',
                    data: '='
                },
                controller: function ($scope) {
                    //$scope.isShow = false;
                    //updateDisplay();

                    function updateDisplay() {
                        //console.log('updateDisplay, isVisible: ' + $scope.isVisible);

                        if ($scope.isShow) {
                            $scope.display = 'block';
                        }
                        else {
                            $scope.display = 'none';
                        }
                    }

                    $scope.$watch('data', function (newVal, oldVal) {
                        //console.log('$scope.data: ' + angular.toJson($scope.data));
                        //доп данные для названий нкопок и т.д.
                        if ($scope.data != null && _.has($scope.data, 'buttonCaption')) {
                            $scope.buttonCaption = $scope.data.buttonCaption;
                        }
                        if ($scope.data != null && _.has($scope.data, 'successFn')) {
                            $scope.successFn = $scope.data.successFn;
                        }
                    });

                    $scope.baloonType = aviaHelper.baloonType;

                    //if ($scope.isShow != null) {
                    //    //$scope.isVisible = $scope.isShow;
                    //    updateDisplay();
                    //}

                    //$scope.$on('baloon.show', function () {
                    //    console.log('$scope.$on baloon.show');
                    //    //$scope.caption = data.caption;
                    //    //$scope.text = data.text;
                    //    show();
                    //});

                    //$scope.$on('baloon.hide', function () {
                    //    console.log('$scope.$on baloon.hide');
                    //    $scope.isShow = false;
                    //    updateDisplay();
                    //});

                    //function show() {
                    //    if ($scope.caption != null && $scope.caption.length > 0 &&
                    //        $scope.text != null && $scope.text.length > 0) {

                    //        //доп данные для названий нкопок и т.д.
                    //        if ($scope.data != null && data.hasOwnProperty('buttonCaption')) {
                    //            $scope.buttonCaption = data.buttonCaption;
                    //        }
                    //    }

                    //    $scope.isShow = true;
                    //    updateDisplay();
                    //}

                    $scope.$watch('isShow', function (newVal, oldVal) {
                        updateDisplay();
                    });

                    $scope.close = function ($event) {
                        //console.log('baloon dir close');
                        eventsHelper.preventBubbling($event);
                        if ($scope.closeFn != null) {
                            $scope.closeFn();
                        }

                        $scope.isShow = false;
                        updateDisplay();
                    };

                    $scope.clickFn = function ($event) {
                        eventsHelper.preventBubbling($event);
                        if ($scope.successFn != null) {
                            $scope.successFn();
                        }
                    };

                    //$scope.$on('$destroy', function () {
                    //    console.log("destroy");
                    //    $scope.isShow = false;
                    //});
                },
                link: function ($scope, $element, attrs) {
                    //Dirty DOM hack
                    //$(function(){
                    //    $element.appendTo(document.body);
                    //});
                }
            };
        }]);
﻿'use strict';

/* Directives */

innaAppDirectives.directive('combobox', ['$templateCache', '$timeout', function ($templateCache, $timeout) {
    return {
        link: function ($scope, $element, attrs) {
            $scope.$on('comboboxDataLoaded', function () {
                $timeout(function () {
                    var $list = $element.find('.combo-box-list');
                    $list.css('display', 'block !important');


//                    console.log($list.show().width());
//                    $list.hide();

                }, 0, false);
            });
        }
    };
}]);
innaAppDirectives.directive('counterPeople', ['$templateCache', function($templateCache){
    return {
        template: $templateCache.get('components/counter_people.html'),
        scope: {
            adultCount: '=',
            childrenCount: '=',
            childrensAge: '='
        },
        controller: ['$scope', function($scope){
            function ChildAgeSelector() {
                this.value = 0;
            }

            /*Properties*/
            $scope.isOpen = false;

            /*Methods*/
            $scope.range = _.generateRange;

            /*Events*/
            $scope.onCounterClick = function(model, count){
                $scope[model] = count;

                if(model == 'childrenCount') {
                    $scope.childrensAge = [];
                    for(var i = 0; i < $scope.childrenCount; i++) {
                        $scope.childrensAge.push(new ChildAgeSelector());
                    }
                }
            }

            $scope.onAgeSelectorClick = function(num){
                var selector = $scope.childrensAge[num];
                selector.isOpen = !selector.isOpen;
            }

            $scope.sum = function(a, b){
                return +a + +b;
            }

            /*Watchers*/
            $scope.$watch('adultCount', function(newValue, oldValue){
                if(newValue instanceof Error) {
                    $scope.adultCount = oldValue;

                    $scope.rootElement.tooltip({
                        position: {
                            my: 'center top+22',
                            at: 'center bottom'
                        },
                        items: "[data-title]",
                        content: function () {
                            return $scope.rootElement.data("title");
                        }
                    });
                    $scope.rootElement.tooltip('open');
                }
            });

            $scope.$watch('isOpen', function(newValue){
                if(newValue === true) try {
                    $scope.rootElement.tooltip('destroy');
                } catch(e) {}
            });
        }],
        link: function(scope, element, attrs){
            scope.rootElement = $('.search-form-item-current', element);

            $(document).click(function bodyClick(event){
                var isInsideComponent = !!$(event.target).closest(element).length;

                scope.$apply(function($scope){
                    $scope.isOpen = isInsideComponent;
                });
            });
        }
    }
}]);

innaAppDirectives.directive('counterPeopleChildAgeSelector', ['$templateCache', function($templateCache){
    return {
        template: $templateCache.get('components/counter_people.subcomponent.html'),
        scope: {
            'selector': '='
        },
        controller: ['$scope', function($scope){
            /*Properties*/
            $scope.isOpen = false;

            /*Methods*/
            $scope.range = _.generateRange

            /*Events*/
            $scope.onChoose = function(age){
                $scope.selector.value = age;
            }
        }],
        requires: '^counterPeople',
        link: function(scope, element, attrs){
            $(document).click(function(event){
                var isInsideComponent = !!$(event.target).closest(element).length;

                if(isInsideComponent) {
                    scope.$apply(function($scope){
                        $scope.isOpen = !$scope.isOpen;
                    });
                } else {
                    scope.$apply(function($scope){
                        $scope.isOpen = false;
                    });
                }
            });
        }
    }
}])
﻿innaAppDirectives.directive('datePickerWidget', [
    '$templateCache',
    'eventsHelper', function ($templateCache, eventsHelper) {
    return {
        replace: true,
        template: $templateCache.get('components/date_picker_widget.html'),
        scope: {
            date1: '=',
            date2: '=',
            minDate: '=',
            addButtons: '=',
            data: '='
        },
        controller: ['$scope', function($scope){
            /*Properties*/
            $scope.isOpen = false;
            //флаг - выбираем дату туда, или дату обратно
            $scope.isFromSelecting = true;//дата туда

            function getPopupOptions($element) {
                var popupOptions = {
                    position: {
                        my: 'center top+22',
                        at: 'center bottom'
                    },
                    items: "[data-title]",
                    content: function () {
                        return $element.data("title");
                    }
                };
                return popupOptions;
            }
            

            /*Watchers*/
            $scope.$watch('date1', function(newValue, oldValue){
                if(newValue instanceof Error) {
                    $scope.date1 = oldValue;

                    $scope.input1.tooltip(getPopupOptions($scope.input1)).tooltip('open');
                }
                else {
                    if ($scope.datePicker) {
                        updateThrottled();
                    }
                }
            });

            $scope.$watch('date2', function (newValue, oldValue) {
                if (newValue instanceof Error) {
                    $scope.date2 = oldValue;

                    $scope.input2.tooltip(getPopupOptions($scope.input2)).tooltip('open');
                }
                else {
                    if ($scope.datePicker) {
                        updateThrottled();
                    }
                }
            });

            /*Methods*/
            $scope.short = function(date) {
                if (!date || date == '01.01.1970') return '';

                var bits = date.split('.');
                return [bits[0], bits[1]].join('.');
            };

            $scope.headClicked = false;

            $scope.setLastSel = function (lastSel) {
                if ($scope.datePicker) {
                    //при клике будет выбрана дата от
                    $scope.datePicker.SetLastSel(lastSel);
                }
            }
            $scope.toggleFrom = function ($event) {
                eventsHelper.preventDefault($event);
                $scope.headClicked = true;
                if ($scope.isFromSelecting) {
                    $scope.isOpen = !$scope.isOpen;
                }
                else {
                    $scope.isOpen = true;
                }
                $scope.isFromSelecting = true;
                //при клике будет выбрана дата от
                $scope.setLastSel(false);
            }
            $scope.toggleTo = function ($event) {
                eventsHelper.preventDefault($event);
                $scope.headClicked = true;
                if (!$scope.isFromSelecting) {
                    $scope.isOpen = !$scope.isOpen;
                } else {
                    $scope.isOpen = true;
                }
                $scope.isFromSelecting = false;
                //при клике будет выбрана дата до
                $scope.setLastSel(true);
            }

            $scope.oneWayChanged = function () {
                //console.log($scope.data.isOneWaySelected);
                if ($scope.data.isOneWaySelected) {
                    //сбрасываем дату обратно
                    $scope.date2 = '';
                }
            }

            $scope.getPickerDates = function () {
                var defaultDates = [];
                if ($scope.date1) defaultDates.push(Date.fromDDMMYY($scope.date1));
                else defaultDates.push(new Date());

                if ($scope.date2) defaultDates.push(Date.fromDDMMYY($scope.date2));
                else defaultDates.push(new Date());
                return defaultDates;
            }

            //обновляем раз в 100мс
            var updateThrottled = _.debounce(function () {
                updateDelayed();
            }, 100);
            var updateDelayed = function () {
                $scope.datePicker.DatePickerSetDate($scope.getPickerDates(), true);
            };
        }],
        link: function ($scope, element) {
            var defaultDates = $scope.getPickerDates();


            $scope.input1 = $('.search-date-block', element).eq(0);
            $scope.input2 = $('.search-date-block', element).eq(1);

            $scope.datePicker = $('.js-datepicker', element).DatePicker({
                flat: true,
                date: defaultDates,
                initDateToIsSet: ($scope.date1 != null),
                initDateFromIsSet: ($scope.date2 != null),
                calendars: 2,
                mode: 'range',
                format: 'd.m.Y',
                starts: 1,
                onChange: function (formated, dates, el, lastSel, initDateFromIsSet) {
                    $scope.$apply(function ($scope) {
                        $scope.date1 = formated[0];
                        if (initDateFromIsSet) {//проставляем, только если руками выбрали дату до
                            $scope.date2 = formated[1];
                        }

                        $scope.isFromSelecting = lastSel;
                        if (lastSel) {
                            $scope.isOpen = false;

                            //если выбираем дату обратно, и установлена галка в одну сторону - снимаем ее
                            if ($scope.data != null && $scope.data.isOneWaySelected) {
                                $scope.data.isOneWaySelected = false;
                            }
                        }
                        else {
                            //если выбираем дату туда, и стоит галка в одну сторону
                            if ($scope.data != null && $scope.data.isOneWaySelected) {
                                $scope.setLastSel(true);
                                $scope.isFromSelecting = true;
                                $scope.isOpen = false;
                            }
                        }
                    });

                    try {
                        $scope.input1.tooltip('destroy');
                    } catch (e) { }
                    try {
                        $scope.input2.tooltip('destroy');
                    } catch (e) { }
                }
            });

            $(document).click(function(event){
                var isInsideComponent = $.contains(element.get(0), event.target);

                //console.log('click', isInsideComponent);

                //$scope.$apply(function($scope){
                //    $scope.isOpen = isInsideComponent;
                //});

                $scope.$apply(function ($scope) {
                    if (isInsideComponent && $scope.headClicked) {
                        //ничего не делаем, уже кликнули по шапке
                    } else {
                        $scope.isOpen = isInsideComponent;
                    }
                });
            });
        }
    }
}])
﻿﻿'use strict';

/* Directives */

// Datepicker
if ($.datepicker._updateDatepicker_original == null) {
    $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function (inst) {
        $.datepicker._updateDatepicker_original(inst);
        var afterShow = this._get(inst, 'afterShow');
        if (afterShow)
            afterShow.apply((inst.input ? inst.input[0] : null));
    }
}

innaAppDirectives.
    directive('datePickerTwoMonths', [
        '$templateCache',
        '$parse',
        '$rootScope',
        function ($templateCache, $parse, $rootScope) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    //клики по форме пикера гасим, чтобы не срабатывал клик по body
                    element.datepicker("widget").on("click", function (event) {
                        event.stopPropagation();
                    });

                    var ngModel = $parse(attrs.ngModel);
                    //чекбокс
                    var ngCheckModel = $parse(attrs.ngCheckModel);

                    //отпределяем from или to контрол
                    var ngModelFrom = scope.$eval(attrs.ngModelFrom);
                    var ngModelTo = scope.$eval(attrs.ngModelTo);
                    //console.log('ngModelFrom: ' + ngModelFrom + '; ngModelTo: ' + ngModelTo);

                    element.datepicker({
                        onSelect: function (dateText) {
                            scope.$apply(function (scope) {
                                // Change binded variable
                                ngModel.assign(scope, dateText);
                                //уведмляем dateTo контрол о выборе в первом контроле
                                if (ngModelFrom == true)
                                    scope.$broadcast("date.from.close", dateText);
                            });
                        },
                        defaultDate: "+1w",
                        numberOfMonths: 2,
                        minDate: 0,
                        dateFormat: 'dd.mm.yy',
                        onClose: function (selectedDate) {

                        },
                        afterShow: function (input, inst) {

                            var dp = $('.ui-datepicker');
                            dp.appendTo(element.parent());
                            dp.prepend('<div class="dtpk-head"><span class="dtpk-caption">Дата вылета</span><label class="dtpk-checkbox-label"><input type="checkbox" /><span class="dtpk-checkbox"></span>+/- 5 дней</label></div>');
                            updateCheck();

                            $(":checkbox", dp).on("click", function (event) {
                                event.stopPropagation();
                                //клик по чекбоксу
                                var isDateChecked = scope.$eval(attrs.ngCheckModel);
                                isDateChecked = (isDateChecked == 0 ? 1 : 0);

                                scope.$apply(function (scope) {
                                    ngCheckModel.assign(scope, isDateChecked);
                                });
                            });
                        }
                    });

                    $(window).resize(function () {
                        element.datepicker('hide');
                        $('.Calendar-input').blur();
                    });

                    function updateCheck() {
                        //обновляем checkbox
                        var isDateChecked = scope.$eval(attrs.ngCheckModel);
                        var dp = $('.ui-datepicker');
                        //console.log('updateCheck: ' + isDateChecked);
                        if (isDateChecked == true)
                            $(":checkbox", dp).attr('checked', true);
                        else
                            $(":checkbox", dp).attr('checked', false);
                    }

                    //ловим изменение флага
                    scope.$watch(attrs.ngCheckModel, function (value) {
                        updateCheck();
                    });

                    if (ngModelTo == true) {
                        scope.$on('date.from.close', function (event, args) {
                            //console.log('date.from.close params: ' + angular.toJson(args));
                            $(element).datepicker("option", "minDate", args);
                        });
                    }

                    scope.$on('$destroy', function () {
                        element.datepicker("widget").off();
                        var dp = $('.ui-datepicker');
                        $(":checkbox", dp).off();
                    });
                }
            };
        }]);
﻿﻿'use strict';

/* Directives */

// Datepicker
if ($.datepicker._updateDatepicker_original == null) {
    $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function (inst) {
        $.datepicker._updateDatepicker_original(inst);
        var afterShow = this._get(inst, 'afterShow');
        if (afterShow)
            afterShow.apply((inst.input ? inst.input[0] : null));
    }
}

innaAppDirectives.
    directive('datePickerCustom', [
        '$templateCache',
        '$parse',
        function ($templateCache, $parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var minDate = new Date();
                    minDate.setDate(minDate.getDate());

                    var ngModel = $parse(attrs.ngModel);
                    //чекбокс
                    var ngModelCheck = $parse(attrs.ngModelCheck);
                    var isDateChecked = scope.$eval(attrs.ngModelCheck);

                    //клики по форме пикера гасим, чтобы не срабатывал клик по body
                    element.datepicker("widget").on("click", function (event) {
                        event.stopPropagation();
                    });

                    element.datepicker({
                        minDate: minDate,
                        onSelect: function (dateText) {
                            scope.$apply(function (scope) {
                                // Change binded variable
                                ngModel.assign(scope, dateText);
                            });
                        },
                        afterShow: function () {
                            var cont = element.datepicker("widget");
                            //рендер плашки
                            cont.prepend("<div class='calendar-head'><span class='caption'>Дата вылета</span><div class='check-container'><span class='checkbox'></span><label class='checkbox-label'>+/- 5 дней</label></div></div>");
                            updateCheck();

                            $(".check-container", cont).on("click", function (event) {
                                event.stopPropagation();
                                //клик по чекбоксу
                                var isDateChecked = scope.$eval(attrs.ngModelCheck);
                                isDateChecked = !isDateChecked;

                                scope.$apply(function (scope) {
                                    ngModelCheck.assign(scope, isDateChecked);
                                });
                            });
                        }
                    });

                    $(window).resize(function () {
                        element.datepicker('hide');
                        $('.Calendar-input').blur();
                    });

                    function updateCheck() {
                        //обновляем checkbox
                        var isDateChecked = scope.$eval(attrs.ngModelCheck);
                        var cont = element.datepicker("widget");
                        //console.log('updateCheck: ' + isDateChecked);
                        if (isDateChecked)
                            $(".checkbox", cont).addClass("checked");
                        else
                            $(".checkbox", cont).removeClass("checked");
                    }

                    //ловим изменение флага
                    scope.$watch(attrs.ngModelCheck, function (value) {
                        updateCheck();
                    });

                    scope.$on('$destroy', function () {
                        element.datepicker("widget").off();
                        var cont = element.datepicker("widget");
                        $(".check-container", cont).off();
                    });
                }
            };
        }]);
(function () {
    /*Common models*/
    var Sorter = function (caption, sortingFn) {
        this.caption = caption;
        this.sortingFn = sortingFn;
    };

    angular.module('innaApp.directives')
        .directive('innaDynamicSerpSorter', [
            '$templateCache',
            function ($templateCache) {
                return {
                    template: $templateCache.get('components/dynamic-serp-sorter.html'),
                    scope: {
                        items: '=innaDynamicSerpSorterItems',
                        sortersFillerCtrlName: '@innaDynamicSerpSorterSortersFillerCtrlName'
                    },
                    controller: [
                        '$scope', '$controller', '$element',
                        function ($scope, $controller, $element) {
                            /*Mixins*/
                            $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                            /*Models*/
                            var Sorters = function () {
                                this.all = [];
                                this.current = null;
                            };

                            Sorters.prototype.add = function (sorter) {
                                this.all.push(sorter);
                            };

                            /*Properties*/
                            $scope.sorters = new Sorters();
                            $controller($scope.sortersFillerCtrlName, {$scope: $scope});


                            /*Methods*/
                            $scope.select = function (sorter) {
                                $scope.sorters.current = sorter;
                                $scope.items.sort(sorter.sortingFn);
                                $scope.popup.isOpen = false;
                            }

                            /*Initial*/
                            $scope.select($scope.sorters.all[0]);
                        }
                    ]
                }
            }])
        .controller('innaDynamicSerpSorter_TicketsMixin', [
            '$scope',
            function ($scope) {
                $scope.sorters.add(new Sorter('По рекомендованности', function (ticket1, ticket2) {
                    return ticket2.data.RecommendedFactor - ticket1.data.RecommendedFactor;
                }));
                $scope.sorters.add(new Sorter('По цене', function (ticket1, ticket2) {
                    return ticket2.data.Price - ticket2.data.Price;
                }));
                $scope.sorters.add(new Sorter('По времени в пути', function (ticket1, ticket2) {
                    return (ticket2.data.TimeTo + ticket2.data.TimeBack) - (ticket1.data.TimeTo + ticket1.data.TimeBack)
                }));
                $scope.sorters.add(new Sorter('По дате/времени отправления ТУДА', function (ticket1, ticket2) {
                    return +ticket2.data.DepartureDate - +ticket1.data.DepartureDate;
                }));
                $scope.sorters.add(new Sorter('По дате/времени отправления ОБРАТНО', function (ticket1, ticket2) {
                    return +ticket2.data.BackDepartureDate - +ticket1.data.BackDepartureDate;
                }));
                $scope.sorters.add(new Sorter('По дате/времени прибытия ТУДА', function (ticket1, ticket2) {
                    return +ticket2.data.ArrivalDate - +ticket1.data.ArrivalDate;
                }));
                $scope.sorters.add(new Sorter('По дате/времени прибытия ОБРАТНО', function (ticket1, ticket2) {
                    return +ticket2.data.BackArrivalDate - +ticket1.data.BackArrivalDate;
                }));
            }
        ])
        .controller('innaDynamicSerpSorter_HotelsMixin', [
            '$scope',
            function ($scope) {
                $scope.sorters.add(new Sorter('По стоимости за пакет', function (hotel1, hotel2) {
                    return hotel2.data.MinimalPackagePrice - hotel1.data.MinimalPackagePrice;
                }));
                $scope.sorters.add(new Sorter('По рекомендованности', function (hotel1, hotel2) {
                    return hotel2.data.RecommendFactor - hotel1.data.RecommendFactor;
                }));
                $scope.sorters.add(new Sorter('По рейтингу TripAdvisor', function (hotel1, hotel2) {
                    return hotel1.data.TaFactor - hotel2.data.TaFactor;
                }));
                $scope.sorters.add(new Sorter('По названию', function (hotel1, hotel2) {
                    var a = (hotel2.data.HotelName || '').toLowerCase();
                    var b = (hotel1.data.HotelName || '').toLowerCase();

                    //suddenly it works like so
                    if (a < b) return 1;
                    else return -1;
                }));
                $scope.sorters.add(new Sorter('По размеру скидки в %', function (hotel1, hotel2) {
                    return hotel2.data.MinimalPackagePrice / hotel2.data.MinimalPrice -
                        hotel1.data.MinimalPackagePrice / hotel1.data.MinimalPrice;
                }));
                $scope.sorters.add(new Sorter('По размеру скидки в руб.', function (hotel1, hotel2) {
                    return (hotel2.data.MinimalPackagePrice - hotel2.data.MinimalPrice) -
                        (hotel1.data.MinimalPackagePrice - hotel1.data.MinimalPrice);
                }));
            }
        ]);
})();
angular.module('innaApp.directives')
    .directive('innaGallery', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/gallery.html'),
            scope: {
                urls: '=innaGalleryPicList'
            },
            controller: [
                '$scope',
                function ($scope) {
                    console.log('innaGallery', $scope);

                    /*Models*/
                    function PicList(){
                        this.list = [];
                        this.current = null;
                    }

                    PicList.prototype.setCurrent = function(pic){
                        this.current = pic;
                    };

                    PicList.prototype.isCurrent = function(pic) {
                        return this.current == pic;
                    };

                    PicList.prototype.next = function(){
                        var index = this.list.indexOf(this.current) + 1;

                        if(index >= this.list.length) index = 0;

                        this.setCurrent(this.list[index]);
                    };

                    PicList.prototype.prev = function(){
                        var index = this.list.indexOf(this.current) - 1;

                        if(index < 0) index = this.list.length - 1;

                        this.setCurrent(this.list[index]);
                    };

                    /*Properties*/
                    $scope.pics = new PicList();

                    /*Methods*/
                    $scope.getViewportStyle = function(){
                        if(!$scope.pics.current) return {};

                        var MAX_WIDTH = 960, MAX_HEIGHT = 480;

                        var kw = 1, kh = 1, k;

                        var width = $scope.pics.current.width;
                        var height = $scope.pics.current.height;

                        if(width > MAX_WIDTH) kw = MAX_WIDTH / width;
                        if(height > MAX_HEIGHT) kh = MAX_HEIGHT / height;

                        k = Math.min(kh, kw);

                        return {
                            backgroundImage: 'url(~)'.split('~').join($scope.pics.current.src),
                            width: parseInt(width * k),
                            height: parseInt(height * k)
                        };
                    };

                    /*Initial*/
                    (function(){
                        var deferreds = [];

                        $scope.urls.forEach(function(url, _index){
                            var deferred = new $.Deferred();

                            deferreds.push(deferred.promise());

                            var pic = new Image();

                            pic.onload = function(){
                                $scope.pics.list.push(pic);

                                if(_index === 0) {
                                    $scope.pics.setCurrent(pic);
                                }

                                deferred.resolve();
                            };

                            pic.onerror = function(){
                                deferred.resolve();
                            };

                            pic.src = url.Large;

                            pic.__order = _index;
                        });

                        $.when.apply($, deferreds).then(function(){
                            $scope.pics.list.sort(function(p1, p2){
                                return p1.__order - p2.__order;
                            });
                        });
                    })();
                }
            ]
        }
    }]);
angular.module('innaApp.directives')
    .directive('innaHotelDetails', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/hotel-details.html'),
            scope: {
                hotel: '=innaHotelDetailsHotel',
                collection: '=innaHotelDetailsCollection',
                back: '=innaHotelDetailsBack',
                next: '=innaHotelDetailsNext',
                combination: '=innaHotelDetailsBundle',
                goReservation: '=innaHotelDetailesReservationFn'
            },
            controller: [
                '$scope', '$element', '$timeout', 'aviaHelper', 'innaApp.API.events',
                function($scope, $element, $timeout, aviaHelper, Events){
                    /*Dom*/
                    document.body.scrollTop = document.documentElement.scrollTop = 0;

                    /*Private*/
                    var backgrounds = [
                        '/spa/img/hotels/back-0.jpg',
                        '/spa/img/hotels/back-1.jpg',
                        '/spa/img/hotels/back-2.jpg'
                    ];

                    var map = null;

                    /*Properties*/
                    $scope.background = 'url($)'.split('$').join(
                        backgrounds[parseInt(Math.random() * 100) % backgrounds.length]
                    );

                    $scope.showFullDescription = false;

                    $scope.showMapFullScreen = false;

                    $scope.bundle = new inna.Models.Dynamic.Combination();
                    $scope.bundle.setTicket($scope.combination.ticket);
                    $scope.bundle.setHotel($scope.hotel);

                    $scope.dataFullyLoaded = false;

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;
                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;

                    /*Methods*/
                    $scope.toggleDescription = function(){
                        $scope.showFullDescription = !$scope.showFullDescription;
                    };

                    $scope.toggleMapDisplay = function(){
                        function closeByEsc(event){
                            if(event.which == 27) { //esc
                                $scope.$apply(function(){
                                    $scope.showMapFullScreen = false;
                                });
                            }
                        }

                        $scope.showMapFullScreen = !$scope.showMapFullScreen;

                        if(map) {
                            $timeout(function(){
                                $(window).trigger('resize');
                                google.maps.event.trigger(map, 'resize');
                            }, 1);
                        }

                        $(document)[$scope.showMapFullScreen ? 'on' : 'off']('keyup', closeByEsc);
                    };

                    $scope.toggleRoom = function(room){
                        //converts undefined into boolean on the fly
                        room.isOpen = !!!room.isOpen;
                    };

                    /*Watchers*/
                    $scope.$watch('hotel', function(hotel){
                        console.log('innaHotelDetails:hotel=', hotel);

                        if(!hotel) return;

                        if(!hotel.data.Latitude || !hotel.data.Longitude) return;

                        var point = new google.maps.LatLng(hotel.data.Latitude, hotel.data.Longitude)

                        /*map is from Private section*/
                        map = new google.maps.Map($element.find('#hotel-details-map')[0], {
                            zoom: 8,
                            center: point
                        });

                        var marker = new google.maps.Marker({
                            position: point,
                            icon: '/spa/img/map/pin-grey.png?' + Math.random().toString(16),
                            title: hotel.data.HotelName
                        });

                        marker.setMap(map);

                        $scope.dataFullyLoaded = false;
                    });

                    $scope.$on(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED, function(){
                        $scope.dataFullyLoaded = true;
                    })
                }
            ],
            link : function($scope, $element){

            }
        }
    }]);
﻿﻿'use strict';

/* Directives */

innaAppDirectives.
    directive('jqUiSliderRange', [
        '$templateCache',
        '$parse',
        function ($templateCache, $parse) {
            return {
                require: 'ngModel',
                scope: {
                    initMinValue: '=',
                    initMaxValue: '=',
                    minValue: '=',
                    maxValue: '='
                },
                link: function ($scope, element, attrs, ngModel) {

                    $(element).slider({
                        range: true,
                        min: $scope.initMinValue,
                        max: $scope.initMaxValue,
                        values: [$scope.minValue, $scope.maxValue],
                        slide: function (event, ui) {
                            $scope.$apply(function ($scope) {
                                $scope.minValue = ui.values[0];
                                $scope.maxValue = ui.values[1];
                            });
                        }
                    });

                    //обновляем раз в 100мс
                    var applyWatchThrottled = _.debounce(function (filter) {
                        applyWatchDelayed(filter);
                    }, 100);

                    var applyWatchDelayed = function (filter) {
                        //console.log('slider option change');
                        $(element).slider("option",
                            {
                                min: $scope.initMinValue,
                                max: $scope.initMaxValue,
                                values: [$scope.minValue, $scope.maxValue]
                            });
                    };

                    //мониторим изменения filter
                    $scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function (filter) {
                        applyWatchThrottled(filter);
                    }, true);
                }
            };
        }]);

innaAppDirectives.
    directive('jqUiSlider', ['$parse', function ($parse) {
        return {
            require: 'ngModel',
            scope: {
                initMinValue: '=',
                initMaxValue: '=',
                value: '='
            },
            //controller: ['$scope', function ($scope) {
            //}],
            link: function ($scope, element, attrs, ngModel) {

                $(element).slider({
                    range: "min",
                    min: $scope.initMinValue,
                    max: $scope.initMaxValue,
                    value: $scope.value,
                    slide: function (event, ui) {
                        $scope.$apply(function ($scope) {
                            $scope.value = ui.value;
                        });
                    }
                });

                //обновляем раз в 100мс
                var applyWatchThrottled = _.debounce(function () {
                    applyWatchDelayed();
                }, 100);

                var applyWatchDelayed = function () {
                    //console.log('slider option change');
                    $(element).slider("option",
                        {
                            min: $scope.initMinValue,
                            max: $scope.initMaxValue,
                            value: $scope.value
                        });
                };

                //мониторим изменения filter
                $scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (newValue) {
                    applyWatchThrottled();
                }, true);
            }
        };
    }]);
﻿innaAppDirectives.directive('ymap', ['$templateCache', function ($templateCache) {
    return {
        link: function (scope, element, attrs) {
            //console.log('ymap');
            ymaps.ready(function () {
                var map = new ymaps.Map($('.Map-container')[0], {
                    center: [55.76, 37.64],
                    zoom: 7
                });
                var placemarkCollection = new ymaps.GeoObjectCollection();
                var $cityMenu = $('.City-menu');
                var $current;
                var $contactsItems = $('.Contacts-list').children();

                map.controls.add('zoomControl');

                map.geoObjects.add(placemarkCollection);

                $cityMenu.on('click', 'a', function (evt) {
                    evt.preventDefault();

                    if ($current) {
                        $current.removeClass('active');
                    }

                    $current = $(evt.target);
                    var id = $current.data('id');
                    $current.addClass('active');

                    $contactsItems.hide();

                    var $items = $contactsItems.filter('[data-city="' + id + '"]')

                    $items.show();

                    placemarkCollection.removeAll();

                    $items.each(function (i, item) {
                        var $item = $(item);
                        var coords = [$item.data('lat'), $item.data('lng')];
                        var placemark = new ymaps.Placemark(coords);

                        map.setCenter(coords, 15);
                        placemarkCollection.add(placemark);
                    });

                    if ($items.length > 1) {
                        map.setBounds(placemarkCollection.getBounds());
                    }
                });

                setTimeout(function () {
                    $cityMenu.find('a').eq(0).trigger('click');
                }, 0);

                scope.$on('$destroy', function () {
                    $cityMenu.off();
                });
            });
        }
    };
}]);

innaAppDirectives.directive('partialSelect', ['$templateCache', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get('components/partial_select.html'),
        scope: {
            list: '=',
            result: '=',
            isOpen: '='
        },
        controller: function ($scope) {

            /*Events*/
            $scope.itemClick = function (option) {
                $scope.result = { id: option.Id, name: option.Name };
            }

            function setResultIfOneItem() {
                if ($scope.list != null && $scope.list.length == 1) {
                    var option = $scope.list[0];
                    $scope.result = { id: option.Id, name: option.Name };
                }
            }

            $scope.$watch('list', function (newVal, oldVal) {
                setResultIfOneItem();
            });
        },
        link: function ($scope, element, attrs) {
            $(document).click(function (event) {
                var isInsideComponent = !!$(event.target).closest(element).length;

                if (!isInsideComponent) {
                    $scope.$apply(function ($scope) {
                        if ($scope.isOpen != undefined)
                            $scope.isOpen = false;
                    });
                } else {
                    $scope.$apply(function ($scope) {
                        if ($scope.isOpen != undefined)
                            $scope.isOpen = !$scope.isOpen;
                    });
                }
            });
        }
    }
}]);
﻿innaAppDirectives.directive('peopleComponent', [
    '$templateCache', 'eventsHelper', 'aviaHelper',
    function ($templateCache, eventsHelper, aviaHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/people_component.html'),
            scope: {
                adultCount: '=',
                childCount: '=',
                infantsCount: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.aviaHelper = aviaHelper;

                $scope.getPeopleCount = function () {
                    return parseInt($scope.adultCount, 10) + parseInt($scope.childCount, 10) + parseInt($scope.infantsCount, 10);
                }

                $scope.preventBubbling = eventsHelper.preventBubbling;

                function countPlus(value) {
                    value = parseInt(value, 10);
                    var value = value + 1;
                    if (value > 6)
                        value = 6;
                    return value;
                }

                function countMinus(key) {
                    var value = $scope[key];
                    value = parseInt(value, 10);
                    value = value - 1;
                    if (value < 0)
                        value = 0;

                    if (key == 'adultCount' && value < 1) {
                        value = 1;
                    }

                    return value;
                }

                function canAddPeoples(data) {
                    var adultCount = parseInt(data.adultCount, 10);
                    var childCount = parseInt(data.childCount, 10);
                    var infantsCount = parseInt(data.infantsCount, 10);
                    //Один взрослый может провести не более одного младенца без места
                    var infFree = adultCount;
                    var infPaid = infantsCount - infFree;
                    if (infPaid < 0) {
                        infPaid = 0;
                    }
                    var maxPeople = adultCount + childCount + infPaid;
                    return maxPeople <= 6;
                }

                $scope.minusClick = function ($event, key) {
                    eventsHelper.preventBubbling($event);

                    var val = countMinus(key);
                    $scope[key] = val;
                }
                $scope.plusClick = function ($event, key) {
                    eventsHelper.preventBubbling($event);

                    var data = { adultCount: $scope.adultCount, childCount: $scope.childCount, infantsCount: $scope.infantsCount };
                    data[key] = countPlus(data[key]);
                    if (canAddPeoples(data)) {
                        $scope[key] = countPlus($scope[key]);
                    }
                }
            }],
            link: function ($scope, element, attrs) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.$apply(function ($scope) {
                        if ($scope.isOpen && isInsideComponent) {//повторный клик закрывает
                            $scope.isOpen = false;
                        }
                        else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });

                $scope.hover = { timeoutId: null, element: null };
                $('.js-people-minus,.js-people-plus').on('mouseout', function () {
                    var el = $(this);
                    el.removeClass('hover');

                    if ($scope.hover.timeoutId) {
                        clearInterval($scope.hover.timeoutId);
                    }
                });
                $('.js-people-minus,.js-people-plus').on('click', function () {
                    var el = $(this);
                    el.addClass('hover');

                    if ($scope.hover.timeoutId) {
                        clearInterval($scope.hover.timeoutId);
                    }

                    $scope.hover.element = el;
                    $scope.hover.timeoutId = setTimeout(function () {
                        if ($scope.hover.element) {
                            $scope.hover.element.removeClass('hover');
                        }
                    }, 1000);
                });

                $scope.$on('$destroy', function () {
                    $('.js-people-minus,.js-people-plus').off();
                });
            }
        };
    }]);

﻿'use strict';

/* Directives */

innaAppDirectives.directive('popupForm', ['$templateCache', function ($templateCache) {
    return {
        controller: ['$scope', '$log', 'dataService', function ($scope, $log, dataService) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.isOpened = false;

            $scope.isOfferHaveUrl = function (offer) {
                if (offer != null && offer.Url != null && offer.Url.length > 0) {
                    return true;
                }
                return false;
            }

            $scope.popupForm_Show = function (offer) {
                if (offer == null) {
                    //аналитика
                    track.requestOpened('side', location.href);
                    //
                    $scope.request.init_main();
                }
                else {
                    //аналитика
                    track.requestOpened('program', location.href);
                    //
                    $scope.request.init_ITCategory(offer);
                }
                $scope.isOpened = true;
            };
            $scope.popupForm_Close = function () {
                $scope.isOpened = false;
            };

            $scope.requestType = { main: "main", cat_it: "cat_it" };//тип заявки: главная(main), или на категории ИТ(cat_it)

            $scope.request = {};
            $scope.request.type = $scope.requestType.main;
            $scope.request.offersCategoriesId = null;
            $scope.request.isValid = true;
            $scope.request.offer = null;
            $scope.request.isSubscribe = true;
            $scope.request.name = "";
            $scope.request.phone = "";
            $scope.request.email = "";
            $scope.request.comments = "";

            $scope.request.subscribeClick = function () {
                $scope.request.isSubscribe = !$scope.request.isSubscribe;
            };

            $scope.request.init_main = function () {
                //log('request.init_main');
                $scope.request.type = $scope.requestType.main;
                $scope.request.offersCategoriesId = null;
                $scope.request.offer = null;
                $scope.request.name = "";
                $scope.request.phone = "";
                $scope.request.email = "";
                $scope.request.comments = "\
Откуда: (Город вылета)\n\
Куда: (Страна, курорт или отель)\n\
Кто едет: (Сколько взрослых и детей, возраст детей)\n\
Дата вылета и продолжительность:\n\
Примерный бюджет: (руб.)";
                $scope.request.isSubscribe = true;
                $scope.request.isValid = true;
                $scope.isOpened = true;
            };

            $scope.request.init_ITCategory = function (offer) {
                //log('request.init_ITCategory');
                $scope.request.type = $scope.requestType.cat_it;
                $scope.request.offersCategoriesId = app_main.constants.offersCategoriesProgramm;//тип заявки
                $scope.request.offer = offer;
                $scope.request.name = "";
                $scope.request.phone = "";
                $scope.request.email = "";
                $scope.request.comments = "";
                $scope.request.isSubscribe = null;
                $scope.request.isValid = true;
                $scope.isOpened = true;
            };

            $scope.request.send = function () {
                function validate() {
                    if ($scope.request.phone.length > 0)
                        $scope.request.isValid = true;
                    else
                        $scope.request.isValid = false;

                    return $scope.request.isValid;
                }

                if (validate()) {
                    //alert($scope.request.comments);
                    //return;
                    $scope.popupForm_Close();

                    if ($scope.request.offer == null) {
                        //аналитика
                        track.requestSend('side', location.href);
                    } else {
                        track.requestSend('program', location.href);
                    }

                    //send
                    dataService.sendITCategoryRequest($scope.request, function (data) {
                        //log('send request success');
                        //success
                        //alert('Заявка отправлена');
                    }, function (data, status) {
                        //log('send request error');
                        //error
                        //alert('Ошибка при отправке заявки');
                    });

                }
            };

        }]
    };
}]);

innaAppDirectives.directive('select', ['$templateCache', function($templateCache){
    return {
        template: $templateCache.get('components/select.html'),
        scope: {
        	options: '=',
        	caption: '@',
        	current: '='
        },
        controller: function($scope){
        	/*Properties*/
        	$scope.isOpen = false;
        	
        	/*Events*/
        	$scope.setCurrent = function(option){
        		$scope.current = option;
        	}
        },
        link: function(scope, element, attrs){
        	$(document).click(function(event){
        		var isInsideComponent = !!$(event.target).closest(element).length;
        		
        		if(!isInsideComponent) {
        			scope.$apply(function($scope){ 
        				$scope.isOpen = false;
        			});
        		} else {
        			scope.$apply(function($scope){ 
        				$scope.isOpen = !$scope.isOpen; 
        			});
        		}
        	});
        }
    }
}]);
innaAppDirectives.directive('tripPreferences', ['$templateCache', function($templateCache){
    return {
        template: $templateCache.get('components/trip_preferences.html'),
        replace: true,
        scope: {
            showBackTripOptions: '@',
            klassModel: '='
        },
        controller: ['$scope', function($scope){
            /*Properties*/
            $scope.isOpen = false;

            /*Events*/
            $scope.onChoose = function(option) {
                $scope.klassModel = option;
            }
        }],
        link: function(scope, element, attrs){
            $(document).click(function(event){
                var isInsideComponent = !!$(event.target).closest(element).length;

                if(isInsideComponent) {
                    scope.$apply(function($scope){
                        $scope.isOpen = !$scope.isOpen;
                    });
                } else {
                    scope.$apply(function($scope){
                        $scope.isOpen = false;
                    });
                }
            });
        }
    }
}])
﻿'use strict';

/* Directives */

innaAppDirectives.
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);

innaAppDirectives.directive('closePopup', [function () {
    return {
        scope: {
            isShow: '='
        },
        link: function ($scope, element, attrs) {
            $(document).click(function bodyClick(event) {
                var isInsideComponent = !!$(event.target).closest(element).length;
                $scope.$apply(function ($scope) {
                    if (!isInsideComponent) {
                        $scope.isShow = false;
                    }
                });
            });

            $scope.$on('$destroy', function () {
                element.off();
            });
        }
    };
}]);

innaAppDirectives.directive('priceFormat', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter('price')(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter('price')(plainNumber));
                return plainNumber;
            });
        }
    };
}]);

innaAppDirectives.
    directive('datePicker', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModelCtrl) {
                var minDate = new Date();
                minDate.setDate(minDate.getDate());

                var ngModel = $parse(attrs.ngModel);
                element.datepicker({
                    minDate: minDate,
                    onSelect: function (dateText) {
                        scope.$apply(function (scope) {
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                        });
                    }
                });

                $(window).resize(function () {
                    element.datepicker('hide');
                    $('.Calendar-input').blur();
                });
            }
        };
    }]);

innaAppDirectives.
    directive('autoComplete', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModelCtrl) {
                var ngModel = $parse(attrs.ngModel);
                //var ngHidModel = $parse(attrs.ngHidModel);
                var ngIdModel = $parse(attrs.ngIdModel);
                var ngUrlModel = $parse(attrs.ngUrlModel);
                var getUrl = eval(attrs.ngGetUrl);

                element.autocomplete({
                    source: getUrl,
                    minLength: 1,
                    select: function (event, ui) {
                        scope.$apply(function (scope) {
                            // Change binded variable
                            ngModel.assign(scope, ui.item.name);
                            //ngHidModel.assign(scope, ui.item.id);
                            ngIdModel.assign(scope, ui.item.id);
                            ngUrlModel.assign(scope, ui.item.url);
                        });

                        return false;
                    }
                })
                .focus(function () {
                    $(this).autocomplete("search", "");
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    return $("<li>")
                        .append("<a>(" + item.id + ")  " + item.name + "</a>")
                        .appendTo(ul);
                };
            }
        };
    }]);

innaAppDirectives.
    directive('autoCompleteDirectory', ['$parse', 'cache', 'urlHelper', function ($parse, cache, urlHelper) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModelCtrl) {
                var ngModel = $parse(attrs.ngModel);
                //var ngHidModel = $parse(attrs.ngHidModel);
                var ngIdModel = $parse(attrs.ngIdModel);
                var ngUrlModel = $parse(attrs.ngUrlModel);
                var getUrl = eval(attrs.ngGetUrl);

                element.autocomplete({
                    source: getUrl,
                    minLength: 1,
                    select: function (event, ui) {
                        scope.$apply(function (scope) {
                            //получаем то, что будет ключом в урле
                            var urlKey = urlHelper.getUrlFromData(ui.item);

                            // Change binded variable
                            ngModel.assign(scope, ui.item.Name);
                            //ngHidModel.assign(scope, ui.item.Id);
                            ngIdModel.assign(scope, ui.item.Id);
                            ngUrlModel.assign(scope, urlKey);
                        });

                        return false;
                    }
                })
                .focus(function () {
                    $(this).autocomplete("search", "");
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    var code = "";
                    if (item.CodeIata != null && item.CodeIata.length > 0)
                        code = ' ' + item.CodeIata + ' ';
                    return $("<li>")
                        .append("<a>(" + item.Id + ")  " + code + item.Name + "</a>")
                        .appendTo(ul);
                };
            }
        };
    }]);

innaAppDirectives.directive('appSlider', ['$timeout', function ($timeout) {
    return {
        link: function ($scope, element, attrs) {
            //console.log('appSlider');
            $scope.$on('sliderDataLoaded', function () {
                //console.log('sliderDataLoaded');
                $timeout(function () { // You might need this timeout to be sure its run after DOM render.
                    //jq script
                    var $banners = $('.Offer-card-banners > .offer-card-banner-item'),
                        length = $banners.length,
                        $dotsContainer = $('.Banner-dots'),
                        currentI = 0,
                        $dots,
                        animate = false;

                    if (length > 1) {
                        $banners.each(function () {
                            $dotsContainer.append('<li class="dot" />');
                        });

                        $dots = $dotsContainer.children();

                        $banners.eq(currentI).css('zIndex', 2);
                        $dots = $dotsContainer.children();
                        $dots.eq(currentI).addClass('active');

                        $dotsContainer.on('click', ':not(.active)', function (evt) {
                            if (animate) {
                                return;
                            }

                            var index = $dots.index(evt.target);

                            scroll(currentI, index)
                        });

                        setInterval($.proxy(function () {
                            var next = currentI + 1;

                            if (next === length) {
                                next = 0;
                            }

                            scroll(currentI, next);
                        }, this), 7000);
                    }

                    function scroll(fromI, toI) {
                        if (animate) {
                            return;
                        }
                        var $from = $banners.eq(fromI);
                        var $fromInfo = $from.find('.info-container');
                        var fromInfoWidth = $fromInfo.width();
                        var $to = $banners.eq(toI);
                        var $toInfo = $to.find('.info-container');
                        var toInfoWidth = $toInfo.width();
                        var $fromImg = $from.find('.img');

                        animate = true;
                        $dots
                            .removeClass('active')
                            .eq(toI)
                            .addClass('active');
                        $banners.css('zIndex', 0);
                        $to.css('zIndex', 1);
                        $fromImg.css('width', $fromImg.width());
                        $from
                            .css('zIndex', 2)
                            .animate({
                                'width': 0
                            }, {
                                duration: 1000,
                                ease: 'linear',
                                queue: false,
                                complete: function () {
                                    $to.css('zIndex', 2);
                                    $from.css({
                                        'width': '100%',
                                        'zIndex': 0
                                    });

                                    currentI = toI;
                                    animate = false
                                }
                            });

                        if ($fromInfo.length && $toInfo.length) {

                            $fromInfo
                                .css('width', fromInfoWidth)
                                .animate({
                                    'left': -fromInfoWidth
                                }, {
                                    duration: 1000,
                                    ease: 'linear',
                                    queue: false,
                                    complete: function () {
                                        $fromInfo.css({
                                            'left': 0,
                                            'width': '100%'
                                        });
                                    }
                                });

                            $toInfo
                                .css('left', toInfoWidth)
                                .animate({
                                    'left': 0
                                }, {
                                    duration: 1000,
                                    ease: 'linear',
                                    queue: false,
                                    complete: function () {
                                        $toInfo.css({
                                            'width': '100%'
                                        });
                                    }
                                });
                        }
                    }

                    function updateBannerSize() {
                        var w = $(window).width();
                        var h = $('.Offer-card-banners').height();

                        $banners.each(function (i, banner) {
                            var $banner = $(banner);
                            var $img = $banner.find('.img');
                            var naturalWidth = $img[0].naturalWidth;
                            var naturalHeight = $img[0].naturalHeight;

                            var scaleH = w / naturalWidth;
                            var scaleV = h / naturalHeight;
                            var scale = scaleH > scaleV ? scaleH : scaleV;

                            $img.css({
                                width: scale * naturalWidth,
                                height: scale * naturalHeight
                            });

                        })
                    }

                    $(window).on('resize', updateBannerSize);


                    $timeout(function () {
                        updateBannerSize();
                    }, 500, false)

                    $scope.$on('$destroy', function () {
                        $dotsContainer.off();
                        $(window).off('resize');
                    });
                }, 0, false);
            });
        }
    };
}]);


innaAppDirectives.directive('tooltip', [function () {
    return {
        link: function ($scope, element, attrs) {
            //console.log('jqUITooltip');
            var $to = $(element);
            $to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
            //$to.tooltip("open");
            $to.tooltip("disable");

            $scope.$on('$destroy', function () {
                $to.off();
            });
        }
    };
}]);

innaAppDirectives.directive('tooltipTitle', [function () {
    return {
        link: function ($scope, element, attrs) {
            var $to = $(element);
            $to.tooltip({
                position: {
                    my: "center top+10", at: 'center bottom'
                }
            });

            $scope.$on('$destroy', function () {
                $to.off();
            });
        }
    };
}]);

innaAppDirectives.directive('maskedInput', ['$parse', function ($parse) {
    return {
        link: function ($scope, element, attrs) {
            var m = attrs.mask;
            var ngModel = $parse(attrs.ngModel);
            element.mask(m, {
                completed: function () {
                    var val = element.val();
                    $scope.$apply(function ($scope) {
                        ngModel.assign($scope, val);
                    })
                }
            });
        }
    };
}]);

innaAppDirectives.directive('phoneInput', ['$parse', function ($parse) {
    return {
        link: function ($scope, element, attrs) {
            var $elem = $(element);

            $elem.on('keypress', function (event) {
                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;

                //console.log('phoneInput, key: ' + key);
                //48-57 - цифры
                //43 +

                var plusEntered = $elem.val() == '+' || $elem.val().substring(0, 1) == '+';

                if (!plusEntered) {
                    //плюс не введен, даем ввести, или дописываем сами
                    if (key != 43)
                    {
                        $elem.val("+");
                        event.preventDefault();
                        return false;
                    }
                }
                else {
                    //введен плюс, даем вводить только цифры
                    if (!(key >= 48 && key <= 57)) {
                        event.preventDefault();
                        return false;
                    }
                }
            });

            $scope.$on('$destroy', function () {
                $elem.off();
            });
        }
    };
}]);

innaAppDirectives.directive('digitsInput', ['$parse', function ($parse) {
    return {
        link: function ($scope, element, attrs) {
            var $elem = $(element);
            $elem.on('keypress', function (event) {
                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;

                //введен плюс, даем вводить только цифры
                if (!(key >= 48 && key <= 57)) {
                    event.preventDefault();
                    return false;
                }
            });

            $scope.$on('$destroy', function () {
                $elem.off();
            });
        }
    };
}]);

innaAppDirectives.directive('upperLatin', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ngModel) {

            var ruLetters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
            var latLetters = ['A', 'B', 'V', 'G', 'D', 'E', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', '', 'Y', '', 'E', 'IU', 'IA'];

            var capitalize = function (inputValue) {
                if (inputValue == null) return;

                var capitalized = inputValue.toUpperCase();

                var letters = [];
                _.each(capitalized, function (l) {
                    var index = ruLetters.indexOf(l);
                    if (index > -1)
                    {
                        l = latLetters[index];
                    }
                    letters.push(l);
                });

                capitalized = letters.join('');

                if (capitalized !== inputValue) {
                    ngModel.$setViewValue(capitalized);
                    ngModel.$render();
                }
                return capitalized;
            }

            ngModel.$parsers.push(capitalize);
            capitalize($scope[attrs.ngModel]);// capitalize initial value
        }
    };
}]);

innaAppDirectives.directive('toUpper', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ngModel) {

            var capitalize = function (inputValue) {
                if (inputValue == null) return;

                var capitalized = inputValue.toUpperCase();

                if (capitalized !== inputValue) {
                    ngModel.$setViewValue(capitalized);
                    ngModel.$render();
                }
                return capitalized;
            }

            ngModel.$parsers.push(capitalize);
            capitalize($scope[attrs.ngModel]);// capitalize initial value
        }
    };
}]);

innaAppDirectives.directive('validateSimple', [function () {
    return {
        require: 'ngModel',
        scope: {
            validate: '&',
            key: '@',
            len: '@',
            goNext: '&'
        },
        link: function ($scope, element, attrs, ngModel) {
            function validate(isUserAction) {
                var type = null;
                if (isUserAction)
                    type = 'userAction';

                $scope.validate({ key: $scope.key, value: ngModel.$modelValue });
            };

            element.on('blur', function () {
                if (!$scope.$$phase) {
                    validate(true);
                }
                else {
                    $scope.$apply(function () {
                        validate(true);
                    });
                }
            }).on('keypress', function (event) {
                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;
                if (key == 13) {//enter
                    $scope.$apply(function () {
                        validate(true);
                    });
                }
            }).on('click', function (event) {
                var val = ngModel.$modelValue;
                if (val != null && val.length > 0){
                    $(this).select();
                }
            });

            if ($scope.len != null) {
                $scope.$watch(function () { return ngModel.$modelValue; }, function (newVal, oldVal) {
                    if (newVal != null && newVal.length == $scope.len) {
                        $scope.goNext({ key: $scope.key });
                    }
                })
            }

            $scope.$on('$destroy', function () {
                element.off();
            });
        }
    };
}]);

innaAppDirectives.directive('validateEventsDir', ['$rootScope', '$parse', function ($rootScope, $parse) {
    return {
        scope: {
            ngValidationModel: '=',
            validateType: '=',
            dependsOn: '=',
            validate: '&',
            supressSelectOnValue: '='
        },
        link: function ($scope, element, attrs) {
            var isInitDone = false;
            var eid = 'dir_inp_' + _.uniqueId();
            var $elem = $(element);

            function validate(isUserAction) {
                var type = null;
                if (isUserAction)
                    type = 'userAction';

                $scope.validate({ item: $scope.ngValidationModel, type: type });
            };

            $elem.on('blur', function () {
                $scope.$apply(function () {
                    validate(true);
                });
            //}).on('change', function () {
            //    validate();
            }).on('keypress', function (event) {
                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;
                if (key == 13) {//enter
                    $scope.$apply(function () {
                        validate(true);
                    });
                }
            }).on('click', function (event) {
                var val = $scope.ngValidationModel.value;

                if (val != null && val.length > 0 && ($scope.supressSelectOnValue == null || val != $scope.supressSelectOnValue))//+7 для телефона
                {
                    $(this).select();
                }
            });


            //обновляем раз в 300мс
            var validateThrottled = _.debounce(function (isUserAction) {
                applyValidateDelayed(isUserAction);
            }, 200);

            var applyValidateDelayed = function (isUserAction) {
                $scope.$apply(function () {
                    validate(isUserAction);
                });

            };

            //когда придет модель - проставим аттрибут id элементу
            function updateAttrId(model) {
                if (!isInitDone && model != null)
                {
                    //проставляем уникальный id элементу
                    $elem.attr("id", eid);
                    isInitDone = true;

                    //заполняем поля в модели
                    if ($scope.ngValidationModel != null &&
                        $scope.ngValidationModel.validationType == null &&
                        $scope.ngValidationModel.id == null) {

                        //console.log('key: %s, validationType: %s, value: %s',  $scope.ngValidationModel.key, $scope.ngValidationModel.validationType, $scope.ngValidationModel.value)
                        $scope.ngValidationModel.validationType = $scope.validateType;
                        $scope.ngValidationModel.id = eid;
                        //валидация зависит от поля
                        $scope.ngValidationModel.dependsOnField = $scope.dependsOn;
                    }
                }
            }

            //мониторим изменения ngModel
            $scope.$watch('ngValidationModel.value', function (newVal, oldVal) {
                updateAttrId(newVal);
                //console.log('validateEventsDir watch: val: ' + newVal);

                //validateThrottled();
            });

            $scope.$on('$destroy', function () {
                $elem.off();
            });
        }
    };
}]);

//innaAppDirectives.directive('onTouch', function () {
//    return {
//        restrict: 'A',
//        link: function (scope, elm, attrs) {
//            var ontouchFn = scope.$eval(attrs.onTouch);
//            elm.bind('touchstart', function (evt) {
//                scope.$apply(function () {
//                    ontouchFn.call(scope, evt.which);
//                });
//            });
//            elm.bind('click', function (evt) {
//                scope.$apply(function () {
//                    ontouchFn.call(scope, evt.which);
//                });
//            });
//        }
//    };
//});

﻿//без пересадок
//var apiSearchAviaDataJsonStub = '{"Filter":{"FromCityName":"Москва","FromCityUrl":"MOW","FromId":6733,"ToCityName":"Мюнхен","ToCityUrl":"MUC","ToId":1357,"BeginDate":"2014-04-30T00:00:00","ReturnDate":"2014-05-16T00:00:00","AdultsNumber":2,"ChildCount":0,"BabyCount":0,"CabinClass":0,"IsToFlexible":false,"IsBackFlexible":false},"History":[],"QueryId":81998557,"Items":[{"DepartureDate":"2014-04-30T05:10:00","ArrivalDate":"2014-04-30T06:20:00","BackDepartureDate":"2014-05-15T21:15:00","BackArrivalDate":"2014-05-16T02:20:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":31181.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":185,"EtapsTo":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T05:10:00","InTime":"2014-04-30T06:20:00","Number":"8283","WayTime":190,"VehicleName":"Boeing 737-800","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-15T21:15:00","InTime":"2014-05-16T02:20:00","Number":"8282","WayTime":185,"VehicleName":"Boeing 737-800","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705732,"VariantId2":773705791,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqNNIQissyWpMsQPwJe4RdrPZnyvjSQ3BMRze%2b1BODxmY%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T05:10:00","ArrivalDate":"2014-04-30T06:20:00","BackDepartureDate":"2014-05-16T14:05:00","BackArrivalDate":"2014-05-16T19:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":33074.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":205,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T05:10:00","InTime":"2014-04-30T06:20:00","Number":"4025","WayTime":190,"VehicleName":"Boeing 737","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T14:05:00","InTime":"2014-05-16T19:30:00","Number":"898","WayTime":205,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705735,"VariantId2":773705771,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqkCMPFdV0Qnr7mY%2bff%2bE%2b3%2bKXC6yhpN29Y5iB7beLlww%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T05:10:00","ArrivalDate":"2014-04-30T06:20:00","BackDepartureDate":"2014-05-16T10:30:00","BackArrivalDate":"2014-05-16T15:55:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":33074.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":205,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T05:10:00","InTime":"2014-04-30T06:20:00","Number":"4025","WayTime":190,"VehicleName":"Boeing 737","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T10:30:00","InTime":"2014-05-16T15:55:00","Number":"796","WayTime":205,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705723,"VariantId2":773705792,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoq7BNI7913cWKfdNYgFtX%2boq%2fcIZNbaFnSPD2JPxckE4c%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T15:40:00","ArrivalDate":"2014-04-30T16:45:00","BackDepartureDate":"2014-05-16T12:35:00","BackArrivalDate":"2014-05-16T17:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":36704.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":185,"TimeBack":175,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T15:40:00","InTime":"2014-04-30T16:45:00","Number":"2326","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T12:35:00","InTime":"2014-05-16T17:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705746,"VariantId2":773705778,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqMleqAKSZzVrWAveotc1lm09Ud052zBocgX5Vo1vj1gI%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T10:35:00","ArrivalDate":"2014-04-30T11:45:00","BackDepartureDate":"2014-05-16T12:35:00","BackArrivalDate":"2014-05-16T17:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":36704.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":175,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T10:35:00","InTime":"2014-04-30T11:45:00","Number":"2322","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T12:35:00","InTime":"2014-05-16T17:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705731,"VariantId2":773705786,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqREQTce3gZbE40L89PsT1MJle9lAhsZsJJsVAb5qtAas%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T05:10:00","ArrivalDate":"2014-04-30T06:20:00","BackDepartureDate":"2014-05-15T21:50:00","BackArrivalDate":"2014-05-16T03:15:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":34035.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":205,"EtapsTo":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T05:10:00","InTime":"2014-04-30T06:20:00","Number":"8283","WayTime":190,"VehicleName":"Boeing 737-800","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-15T21:50:00","InTime":"2014-05-16T03:15:00","Number":"5904","WayTime":205,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705751,"VariantId2":773705775,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqIm8hovBXMRaiZq%2fql9xR3VDwbvIs31zyKAayIkd4v6k%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T15:40:00","ArrivalDate":"2014-04-30T16:45:00","BackDepartureDate":"2014-05-15T23:20:00","BackArrivalDate":"2014-05-16T04:10:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":36704.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":185,"TimeBack":170,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T15:40:00","InTime":"2014-04-30T16:45:00","Number":"2326","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-15T23:20:00","InTime":"2014-05-16T04:10:00","Number":"2595","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705736,"VariantId2":773705780,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqHTbr2rj1w8JfRC4GVyMRVIwc2lWDsFisffwblGi9Q6o%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T10:35:00","ArrivalDate":"2014-04-30T11:45:00","BackDepartureDate":"2014-05-15T23:20:00","BackArrivalDate":"2014-05-16T04:10:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":36704.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":170,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T10:35:00","InTime":"2014-04-30T11:45:00","Number":"2322","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-15T23:20:00","InTime":"2014-05-16T04:10:00","Number":"2595","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705733,"VariantId2":773705779,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqL3039Wc0gnWeaqiSHplpP0ztBiT21WL504Ki3Abefzw%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T05:50:00","ArrivalDate":"2014-04-30T07:00:00","BackDepartureDate":"2014-05-16T07:35:00","BackArrivalDate":"2014-05-16T12:40:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":37241.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":185,"EtapsTo":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T05:50:00","InTime":"2014-04-30T07:00:00","Number":"2531","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T07:35:00","InTime":"2014-05-16T12:40:00","Number":"2526","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705724,"VariantId2":773705765,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoq7Q6IWOS3FVAWYOfMkw%2bz%2f26wQV67VyBAz4AV9XCN8qc%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T12:00:00","ArrivalDate":"2014-04-30T13:20:00","BackDepartureDate":"2014-05-16T10:30:00","BackArrivalDate":"2014-05-16T15:55:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":38874.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":205,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T12:00:00","InTime":"2014-04-30T13:20:00","Number":"897","WayTime":200,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T10:30:00","InTime":"2014-05-16T15:55:00","Number":"796","WayTime":205,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705741,"VariantId2":773705762,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoq3jE9P%2fHjj9TK1cC87QNvLiHOVB7ZBKO2L4bHoxQsOqA%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T12:00:00","ArrivalDate":"2014-04-30T13:20:00","BackDepartureDate":"2014-05-16T14:05:00","BackArrivalDate":"2014-05-16T19:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":38874.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":205,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T12:00:00","InTime":"2014-04-30T13:20:00","Number":"897","WayTime":200,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T14:05:00","InTime":"2014-05-16T19:30:00","Number":"898","WayTime":205,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705742,"VariantId2":773705763,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqHeJQ6fWFd59rQFt4VyrlDH47SZKPCHfeLxIQj14kuOU%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T08:20:00","ArrivalDate":"2014-04-30T09:40:00","BackDepartureDate":"2014-05-16T10:30:00","BackArrivalDate":"2014-05-16T15:55:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":38874.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":205,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T08:20:00","InTime":"2014-04-30T09:40:00","Number":"795","WayTime":200,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T10:30:00","InTime":"2014-05-16T15:55:00","Number":"796","WayTime":205,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705739,"VariantId2":773705772,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoq20%2f2gHyVHRn81FYDHIFqFFSN57YTimhAzJiK6EgeUYM%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T08:20:00","ArrivalDate":"2014-04-30T09:40:00","BackDepartureDate":"2014-05-16T14:05:00","BackArrivalDate":"2014-05-16T19:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":38874.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":205,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T08:20:00","InTime":"2014-04-30T09:40:00","Number":"795","WayTime":200,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T14:05:00","InTime":"2014-05-16T19:30:00","Number":"898","WayTime":205,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705749,"VariantId2":773705788,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqvCx47aGWwc2UrLtcfx1HzyjxyNftuieU5Q7GATj3dlM%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T15:40:00","ArrivalDate":"2014-04-30T16:45:00","BackDepartureDate":"2014-05-16T17:35:00","BackArrivalDate":"2014-05-16T22:25:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":39462.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":185,"TimeBack":170,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T15:40:00","InTime":"2014-04-30T16:45:00","Number":"2326","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T17:35:00","InTime":"2014-05-16T22:25:00","Number":"2327","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705730,"VariantId2":773705770,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoq%2bpTt8SfS%2bd59nuOzQYoMUuEnrg40Z%2flv7eg%2fegojz2M%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T10:35:00","ArrivalDate":"2014-04-30T11:45:00","BackDepartureDate":"2014-05-16T17:35:00","BackArrivalDate":"2014-05-16T22:25:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":39462.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":170,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T10:35:00","InTime":"2014-04-30T11:45:00","Number":"2322","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T17:35:00","InTime":"2014-05-16T22:25:00","Number":"2327","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705738,"VariantId2":773705757,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqoceARG7TtsNV1VH%2bU602%2fygtwWOdX9l5ElneTH5QGcY%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T05:10:00","ArrivalDate":"2014-04-30T06:20:00","BackDepartureDate":"2014-05-16T12:35:00","BackArrivalDate":"2014-05-16T17:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":41164.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":175,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T05:10:00","InTime":"2014-04-30T06:20:00","Number":"4025","WayTime":190,"VehicleName":"Boeing 737","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T12:35:00","InTime":"2014-05-16T17:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705727,"VariantId2":773705761,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoq%2bXaGWSYQkEZky6kwsCqdRnNhbH6evzlI3IBT%2f7OLx70%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T05:10:00","ArrivalDate":"2014-04-30T06:20:00","BackDepartureDate":"2014-05-16T17:35:00","BackArrivalDate":"2014-05-16T22:25:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":41164.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":170,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T05:10:00","InTime":"2014-04-30T06:20:00","Number":"4025","WayTime":190,"VehicleName":"Boeing 737","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T17:35:00","InTime":"2014-05-16T22:25:00","Number":"2327","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705726,"VariantId2":773705782,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoq1c8YIdmdy%2bef66wbjr9I94U%2bp6UK0Yrf%2fBxqwe1ouNs%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T05:50:00","ArrivalDate":"2014-04-30T07:00:00","BackDepartureDate":"2014-05-16T11:10:00","BackArrivalDate":"2014-05-16T16:15:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":41791.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":185,"EtapsTo":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T05:50:00","InTime":"2014-04-30T07:00:00","Number":"2531","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T11:10:00","InTime":"2014-05-16T16:15:00","Number":"2528","WayTime":185,"VehicleName":"Airbus A321","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705754,"VariantId2":773705773,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoqn2NxTTk0UG2hy06cSc%2ffXevdV3fbxjAHtexTBwTqE6Q%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T20:40:00","ArrivalDate":"2014-04-30T21:50:00","BackDepartureDate":"2014-05-16T12:35:00","BackArrivalDate":"2014-05-16T17:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":42516.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":175,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T20:40:00","InTime":"2014-04-30T21:50:00","Number":"2594","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T12:35:00","InTime":"2014-05-16T17:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705721,"VariantId2":773705785,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoqot2Kzc2MM8WjJusUp1SyygyF0fuZ%2f9YwFO6i84QysvE%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T19:35:00","ArrivalDate":"2014-04-30T20:55:00","BackDepartureDate":"2014-05-16T10:30:00","BackArrivalDate":"2014-05-16T15:55:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":43510.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":205,"EtapsTo":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T19:35:00","InTime":"2014-04-30T20:55:00","Number":"5905","WayTime":200,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T10:30:00","InTime":"2014-05-16T15:55:00","Number":"5908","WayTime":205,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705737,"VariantId2":773705768,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqRLVNQYBa%2fdbCxdfcJ7uup0fFd3nSyFMiGA%2bnL39GmTI%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T19:35:00","ArrivalDate":"2014-04-30T20:55:00","BackDepartureDate":"2014-05-16T14:05:00","BackArrivalDate":"2014-05-16T19:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":43510.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":205,"EtapsTo":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T19:35:00","InTime":"2014-04-30T20:55:00","Number":"5905","WayTime":200,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T14:05:00","InTime":"2014-05-16T19:30:00","Number":"5902","WayTime":205,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705752,"VariantId2":773705781,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqOCMgbgGxBVdms8thpH3tz9hFNAbEb2kXnw%2fa2aW5NkI%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T17:10:00","ArrivalDate":"2014-04-30T18:20:00","BackDepartureDate":"2014-05-16T07:35:00","BackArrivalDate":"2014-05-16T12:40:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":44904.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":185,"EtapsTo":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T17:10:00","InTime":"2014-04-30T18:20:00","Number":"2529","WayTime":190,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T07:35:00","InTime":"2014-05-16T12:40:00","Number":"2526","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705744,"VariantId2":773705776,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoq1X5cemrr2MdvzWu7oEumPHiqxxCq6VYFsUxMtoA8VVg%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T20:40:00","ArrivalDate":"2014-04-30T21:50:00","BackDepartureDate":"2014-05-16T17:35:00","BackArrivalDate":"2014-05-16T22:25:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":45274.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":170,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T20:40:00","InTime":"2014-04-30T21:50:00","Number":"2594","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T17:35:00","InTime":"2014-05-16T22:25:00","Number":"2327","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705725,"VariantId2":773705769,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqrVshSiS3QcZnTIJBKGtAjogrfuOM%2fquOgShOb9qemkc%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T17:10:00","ArrivalDate":"2014-04-30T18:20:00","BackDepartureDate":"2014-05-16T11:10:00","BackArrivalDate":"2014-05-16T16:15:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":49462.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":185,"EtapsTo":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T17:10:00","InTime":"2014-04-30T18:20:00","Number":"2529","WayTime":190,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T11:10:00","InTime":"2014-05-16T16:15:00","Number":"2528","WayTime":185,"VehicleName":"Airbus A321","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705734,"VariantId2":773705760,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoq4nD9kYaBgDCerBmY6sZO9i2%2b5MuH%2bl78pxjiCXjkS4g%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T13:30:00","ArrivalDate":"2014-04-30T14:40:00","BackDepartureDate":"2014-05-16T07:35:00","BackArrivalDate":"2014-05-16T12:40:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":49462.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":185,"EtapsTo":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T13:30:00","InTime":"2014-04-30T14:40:00","Number":"2527","WayTime":190,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T07:35:00","InTime":"2014-05-16T12:40:00","Number":"2526","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705722,"VariantId2":773705789,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqVBBCYdqM3yv%2bKsnO8SiYeORus6Nx7jGo26q7W%2fnKGHw%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T13:30:00","ArrivalDate":"2014-04-30T14:40:00","BackDepartureDate":"2014-05-16T11:10:00","BackArrivalDate":"2014-05-16T16:15:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":54020.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":185,"EtapsTo":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T13:30:00","InTime":"2014-04-30T14:40:00","Number":"2527","WayTime":190,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T11:10:00","InTime":"2014-05-16T16:15:00","Number":"2528","WayTime":185,"VehicleName":"Airbus A321","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705740,"VariantId2":773705777,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqhCZJAnQsNwh0cpxV8Oww3UUsQ7ydmboAWPvxN%2fvi%2bak%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T15:40:00","ArrivalDate":"2014-04-30T16:45:00","BackDepartureDate":"2014-05-16T14:05:00","BackArrivalDate":"2014-05-16T19:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":61342.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":185,"TimeBack":205,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T15:40:00","InTime":"2014-04-30T16:45:00","Number":"2326","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T14:05:00","InTime":"2014-05-16T19:30:00","Number":"898","WayTime":205,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705729,"VariantId2":773705764,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqxLggH0wgliZ3XeMmDf2W9oV5fKgqGOExHHLqh4pYh6M%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T20:40:00","ArrivalDate":"2014-04-30T21:50:00","BackDepartureDate":"2014-05-16T10:30:00","BackArrivalDate":"2014-05-16T15:55:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":61342.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":205,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T20:40:00","InTime":"2014-04-30T21:50:00","Number":"2594","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T10:30:00","InTime":"2014-05-16T15:55:00","Number":"796","WayTime":205,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705753,"VariantId2":773705766,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5Xoqs7A6asTW0kb38m0JeoW1%2bGIFVg6UKzvIvuOIh8Bgw1U%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T10:35:00","ArrivalDate":"2014-04-30T11:45:00","BackDepartureDate":"2014-05-16T14:05:00","BackArrivalDate":"2014-05-16T19:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":61342.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":205,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T10:35:00","InTime":"2014-04-30T11:45:00","Number":"2322","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T14:05:00","InTime":"2014-05-16T19:30:00","Number":"898","WayTime":205,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705728,"VariantId2":773705774,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqfNnRIGyAqr9cqsWoibeNJM3mSUSQjn3VuVU2WeLzRyI%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T10:35:00","ArrivalDate":"2014-04-30T11:45:00","BackDepartureDate":"2014-05-16T10:30:00","BackArrivalDate":"2014-05-16T15:55:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":61342.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":205,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T10:35:00","InTime":"2014-04-30T11:45:00","Number":"2322","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T10:30:00","InTime":"2014-05-16T15:55:00","Number":"796","WayTime":205,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705755,"VariantId2":773705783,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqMcegeaUp3DGOgy7n2XT%2fAoJR0QCJJpO781xQ4SpjBMk%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T20:40:00","ArrivalDate":"2014-04-30T21:50:00","BackDepartureDate":"2014-05-16T14:05:00","BackArrivalDate":"2014-05-16T19:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":61342.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":190,"TimeBack":205,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T20:40:00","InTime":"2014-04-30T21:50:00","Number":"2594","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T14:05:00","InTime":"2014-05-16T19:30:00","Number":"898","WayTime":205,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705720,"VariantId2":773705793,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqZxx%2baaGcOgfkD15QDubh86pLiajQN1uLzWjS8HnN3TU%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T15:40:00","ArrivalDate":"2014-04-30T16:45:00","BackDepartureDate":"2014-05-16T10:30:00","BackArrivalDate":"2014-05-16T15:55:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":61342.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":185,"TimeBack":205,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T15:40:00","InTime":"2014-04-30T16:45:00","Number":"2326","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-05-16T10:30:00","InTime":"2014-05-16T15:55:00","Number":"796","WayTime":205,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"DME","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705747,"VariantId2":773705787,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqQZSZ9KLUcaWSbQI5I87Lk8gHvsmUQYzDHNsmt6JzI2U%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-04-30T12:00:00","ArrivalDate":"2014-04-30T13:20:00","BackDepartureDate":"2014-05-16T12:35:00","BackArrivalDate":"2014-05-16T17:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":71926.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":175,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T12:00:00","InTime":"2014-04-30T13:20:00","Number":"897","WayTime":200,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T12:35:00","InTime":"2014-05-16T17:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705718,"VariantId2":773705767,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqQLslkJvzk0p48ULvLgpPtR2EGWdILoCxZOr6cLPEy0M%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T08:20:00","ArrivalDate":"2014-04-30T09:40:00","BackDepartureDate":"2014-05-16T12:35:00","BackArrivalDate":"2014-05-16T17:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":71926.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":175,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T08:20:00","InTime":"2014-04-30T09:40:00","Number":"795","WayTime":200,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T12:35:00","InTime":"2014-05-16T17:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705748,"VariantId2":773705790,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqicZ9A4aV3kBowZh7FYbe7L%2buaOdMGD5CYtYiUCFCsws%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T19:35:00","ArrivalDate":"2014-04-30T20:55:00","BackDepartureDate":"2014-05-16T12:35:00","BackArrivalDate":"2014-05-16T17:30:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":75846.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":175,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T19:35:00","InTime":"2014-04-30T20:55:00","Number":"797","WayTime":200,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T12:35:00","InTime":"2014-05-16T17:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705719,"VariantId2":773705759,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqJ9DxYooaqBREvmJlnhhM1QH2EckSFnSJFXq2yRY%2bkWU%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T12:00:00","ArrivalDate":"2014-04-30T13:20:00","BackDepartureDate":"2014-05-16T17:35:00","BackArrivalDate":"2014-05-16T22:25:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":87154.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":170,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T12:00:00","InTime":"2014-04-30T13:20:00","Number":"897","WayTime":200,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T17:35:00","InTime":"2014-05-16T22:25:00","Number":"2327","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705745,"VariantId2":773705756,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqQN9EHfZk%2b1mI%2fnzKur22RdU2b%2f02t2XpsgyvsIPwNs4%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T08:20:00","ArrivalDate":"2014-04-30T09:40:00","BackDepartureDate":"2014-05-16T17:35:00","BackArrivalDate":"2014-05-16T22:25:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":87154.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":170,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T08:20:00","InTime":"2014-04-30T09:40:00","Number":"795","WayTime":200,"VehicleName":"Airbus A319","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T17:35:00","InTime":"2014-05-16T22:25:00","Number":"2327","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705743,"VariantId2":773705784,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqbW3s3%2bZ49fV0qIBVPrsM8l36z1F9ml5hcsaJc%2fq%2bPe8%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-04-30T19:35:00","ArrivalDate":"2014-04-30T20:55:00","BackDepartureDate":"2014-05-16T17:35:00","BackArrivalDate":"2014-05-16T22:25:00","ToTransferCount":0,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":100454.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":200,"TimeBack":170,"EtapsTo":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Домодедово","InPort":"Мюнхен","OutTime":"2014-04-30T19:35:00","InTime":"2014-04-30T20:55:00","Number":"797","WayTime":200,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-16T17:35:00","InTime":"2014-05-16T22:25:00","Number":"2327","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773705750,"VariantId2":773705758,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6MXFBHWnyOPOpVZ7wJ5XoqKKASr8phf4ok38UB%2bqOSB00djDhf%2b8THd%2bd5pzHP7vI%3d","IsNightFlight":false,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"}]}';
//с пересадками
//var apiSearchAviaDataJsonStub = '{"Filter":{"FromCityName":"Новосибирск","FromCityUrl":"OVB","FromId":1706,"ToCityName":"Мюнхен","ToCityUrl":"MUC","ToId":1357,"BeginDate":"2014-04-30T00:00:00","ReturnDate":"2014-05-16T00:00:00","AdultsNumber":2,"ChildCount":0,"BabyCount":0,"CabinClass":0,"IsToFlexible":false,"IsBackFlexible":false},"History":[],"QueryId":81998561,"Items":[{"DepartureDate":"2014-04-30T06:50:00","ArrivalDate":"2014-04-30T11:45:00","BackDepartureDate":"2014-05-15T23:20:00","BackArrivalDate":"2014-05-16T17:15:00","ToTransferCount":2,"BackTransferCount":1,"CityFrom":"Новосибирск","AirportFrom":"Новосибирск","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":50904.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":595,"TimeBack":775,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Новосибирск","InPort":"Шереметьево","OutTime":"2014-04-30T06:50:00","InTime":"2014-04-30T08:00:00","NextTime":"2014-04-30T10:35:00","Number":"1549","WayTime":250,"VehicleName":"Airbus A321","TransferWaitTime":-35,"OutCode":"SVO","InCode":"OVB","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T10:35:00","InTime":"2014-04-30T11:45:00","Number":"2322","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"UTAir","TransporterCode":"UT","TransporterLogo":"Utair.gif","OutPort":"Внуково","InPort":"Анапа","OutTime":"2014-04-10T10:15:00","InTime":"2014-04-10T13:00:00","Number":"183","WayTime":165,"VehicleName":"Antonov An-24","TransferWaitTime":0,"OutCode":"VKO","InCode":"AAQ","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-15T23:20:00","InTime":"2014-05-16T04:10:00","NextTime":"2014-05-16T10:25:00","Number":"2595","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":-15,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Новосибирск","OutTime":"2014-05-16T10:25:00","InTime":"2014-05-16T17:15:00","Number":"1460","WayTime":230,"VehicleName":"Boeing 737-800","TransferWaitTime":0,"OutCode":"OVB","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"VariantId1":773706220,"VariantId2":773706223,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6OmVONPqpggZ1QnfGi1kxPUfDsc0iOCIegkYmAbB3pJjB%2bzQ7dcouG4a%2bNLhDCpjI%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"OVB"},{"DepartureDate":"2014-04-30T06:50:00","ArrivalDate":"2014-04-30T11:45:00","BackDepartureDate":"2014-05-15T12:35:00","BackArrivalDate":"2014-05-16T05:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Новосибирск","AirportFrom":"Новосибирск","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":53904.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":595,"TimeBack":715,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Новосибирск","InPort":"Шереметьево","OutTime":"2014-04-30T06:50:00","InTime":"2014-04-30T08:00:00","NextTime":"2014-04-30T10:35:00","Number":"1549","WayTime":250,"VehicleName":"Airbus A321","TransferWaitTime":-35,"OutCode":"SVO","InCode":"OVB","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T10:35:00","InTime":"2014-04-30T11:45:00","Number":"2322","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-15T12:35:00","InTime":"2014-05-15T17:30:00","NextTime":"2014-05-15T22:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Новосибирск","OutTime":"2014-05-15T22:30:00","InTime":"2014-05-16T05:30:00","Number":"1548","WayTime":240,"VehicleName":"Airbus A321","TransferWaitTime":0,"OutCode":"OVB","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"VariantId1":773706212,"VariantId2":773706233,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6OmVONPqpggZ1QnfGi1kxP%2b%2f7i3EpkiWHKDDVigJ9DLO3QYjsc9itEOr4lo%2baoDGU%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"OVB"},{"DepartureDate":"2014-04-30T06:50:00","ArrivalDate":"2014-04-30T11:45:00","BackDepartureDate":"2014-05-15T12:35:00","BackArrivalDate":"2014-05-16T07:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Новосибирск","AirportFrom":"Новосибирск","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":51904.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":595,"TimeBack":860,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Новосибирск","InPort":"Шереметьево","OutTime":"2014-04-30T06:50:00","InTime":"2014-04-30T08:00:00","NextTime":"2014-04-30T10:35:00","Number":"1549","WayTime":250,"VehicleName":"Airbus A321","TransferWaitTime":-35,"OutCode":"SVO","InCode":"OVB","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T10:35:00","InTime":"2014-04-30T11:45:00","Number":"2322","WayTime":190,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-15T12:35:00","InTime":"2014-05-15T17:30:00","NextTime":"2014-05-16T01:00:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":-30,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Новосибирск","OutTime":"2014-05-16T01:00:00","InTime":"2014-05-16T07:55:00","Number":"1306","WayTime":235,"VehicleName":"Airbus A321","TransferWaitTime":0,"OutCode":"OVB","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"VariantId1":773706219,"VariantId2":773706234,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6OmVONPqpggZ1QnfGi1kxPYbL7pzPlYbQ7nYFrqtOfSBWOmBwfjsTAsNSMJXZVGQw%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"OVB"},{"DepartureDate":"2014-04-30T09:05:00","ArrivalDate":"2014-04-30T16:45:00","BackDepartureDate":"2014-05-15T12:35:00","BackArrivalDate":"2014-05-16T05:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Новосибирск","AirportFrom":"Новосибирск","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":51904.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":760,"TimeBack":715,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Новосибирск","InPort":"Шереметьево","OutTime":"2014-04-30T09:05:00","InTime":"2014-04-30T10:15:00","NextTime":"2014-04-30T15:40:00","Number":"1307","WayTime":250,"VehicleName":"Airbus A321","TransferWaitTime":-25,"OutCode":"SVO","InCode":"OVB","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T15:40:00","InTime":"2014-04-30T16:45:00","Number":"2326","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-15T12:35:00","InTime":"2014-05-15T17:30:00","NextTime":"2014-05-15T22:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Новосибирск","OutTime":"2014-05-15T22:30:00","InTime":"2014-05-16T05:30:00","Number":"1548","WayTime":240,"VehicleName":"Airbus A321","TransferWaitTime":0,"OutCode":"OVB","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"VariantId1":773706222,"VariantId2":773706232,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6OmVONPqpggZ1QnfGi1kxPWKaKO%2b84TfN6bMKhEILKGTajoLaLHpM%2bNdPuP64igWA%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"OVB"},{"DepartureDate":"2014-04-30T09:05:00","ArrivalDate":"2014-04-30T16:45:00","BackDepartureDate":"2014-05-15T23:20:00","BackArrivalDate":"2014-05-16T17:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Новосибирск","AirportFrom":"Новосибирск","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Эконом","Price":55904.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":760,"TimeBack":775,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Новосибирск","InPort":"Шереметьево","OutTime":"2014-04-30T09:05:00","InTime":"2014-04-30T10:15:00","NextTime":"2014-04-30T15:40:00","Number":"1307","WayTime":250,"VehicleName":"Airbus A321","TransferWaitTime":-25,"OutCode":"SVO","InCode":"OVB","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Мюнхен","OutTime":"2014-04-30T15:40:00","InTime":"2014-04-30T16:45:00","Number":"2326","WayTime":185,"VehicleName":"Airbus A320","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-05-15T23:20:00","InTime":"2014-05-16T04:10:00","NextTime":"2014-05-16T10:25:00","Number":"2595","WayTime":170,"VehicleName":"Airbus A320","TransferWaitTime":-15,"OutCode":"SVO","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Новосибирск","OutTime":"2014-05-16T10:25:00","InTime":"2014-05-16T17:15:00","Number":"1460","WayTime":230,"VehicleName":"Boeing 737-800","TransferWaitTime":0,"OutCode":"OVB","InCode":"SVO","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""}],"VariantId1":773706216,"VariantId2":773706227,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6OmVONPqpggZ1QnfGi1kxPxButxRRd6L%2fXaW6wzkZ7XykP%2flTsPUWJkbVheL8uxh8%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"OVB"}]}';
//real
var apiSearchAviaDataJsonStub = '{"Filter":{"FromCityName":"Москва","FromCityUrl":"MOW","FromId":6733,"ToCityName":"Мюнхен","ToCityUrl":"MUC","ToId":1357,"BeginDate":"2014-03-31T00:00:00","ReturnDate":"2014-04-05T00:00:00","AdultsNumber":2,"ChildCount":0,"BabyCount":0,"CabinClass":1,"IsToFlexible":false,"IsBackFlexible":false},"History":[],"QueryId":81998720,"Items":[{"DepartureDate":"2014-03-31T21:25:00","ArrivalDate":"2014-04-01T21:30:00","BackDepartureDate":"2014-04-05T10:30:00","BackArrivalDate":"2014-04-05T20:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":115344.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1565,"TimeBack":475,"EtapsTo":[{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Внуково","InPort":"Стамбул","OutTime":"2014-03-31T21:25:00","InTime":"2014-03-31T23:35:00","NextTime":"2014-04-01T19:40:00","Number":"416","WayTime":190,"VehicleName":"Airbus A321-231","TransferWaitTime":1205,"OutCode":"VKO","InCode":"IST","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Стамбул","InPort":"Мюнхен","OutTime":"2014-04-01T19:40:00","InTime":"2014-04-01T21:30:00","Number":"1637","WayTime":170,"VehicleName":"Boeing 737-8F2","TransferWaitTime":0,"OutCode":"IST","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Мюнхен","InPort":"Стамбул","OutTime":"2014-04-05T10:30:00","InTime":"2014-04-05T14:05:00","NextTime":"2014-04-05T16:35:00","Number":"1630","WayTime":155,"VehicleName":"Airbus A321-231","TransferWaitTime":150,"OutCode":"MUC","InCode":"IST","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Стамбул","InPort":"Внуково","OutTime":"2014-04-05T16:35:00","InTime":"2014-04-05T20:25:00","Number":"415","WayTime":170,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"IST","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710259,"VariantId2":773710366,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4qPsDp8dFTNb28y0%2bpq9kFHjUzhhTPkzm6SiVPmoGdiY%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T21:25:00","ArrivalDate":"2014-04-01T09:30:00","BackDepartureDate":"2014-04-05T10:30:00","BackArrivalDate":"2014-04-05T20:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":115344.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":845,"TimeBack":475,"EtapsTo":[{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Внуково","InPort":"Стамбул","OutTime":"2014-03-31T21:25:00","InTime":"2014-03-31T23:35:00","NextTime":"2014-04-01T07:45:00","Number":"416","WayTime":190,"VehicleName":"Airbus A321-231","TransferWaitTime":490,"OutCode":"VKO","InCode":"IST","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Стамбул","InPort":"Мюнхен","OutTime":"2014-04-01T07:45:00","InTime":"2014-04-01T09:30:00","Number":"1629","WayTime":165,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"IST","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Мюнхен","InPort":"Стамбул","OutTime":"2014-04-05T10:30:00","InTime":"2014-04-05T14:05:00","NextTime":"2014-04-05T16:35:00","Number":"1630","WayTime":155,"VehicleName":"Airbus A321-231","TransferWaitTime":150,"OutCode":"MUC","InCode":"IST","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Стамбул","InPort":"Внуково","OutTime":"2014-04-05T16:35:00","InTime":"2014-04-05T20:25:00","Number":"415","WayTime":170,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"IST","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710274,"VariantId2":773710479,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4DHZKZa30TtFdtbMXmTwKAp%2bnpA2BZ9mMPJ2%2bTkL2GH8%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T21:25:00","ArrivalDate":"2014-04-01T13:40:00","BackDepartureDate":"2014-04-05T10:30:00","BackArrivalDate":"2014-04-05T20:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":115344.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1095,"TimeBack":475,"EtapsTo":[{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Внуково","InPort":"Стамбул","OutTime":"2014-03-31T21:25:00","InTime":"2014-03-31T23:35:00","NextTime":"2014-04-01T12:00:00","Number":"416","WayTime":190,"VehicleName":"Airbus A321-231","TransferWaitTime":745,"OutCode":"VKO","InCode":"IST","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Стамбул","InPort":"Мюнхен","OutTime":"2014-04-01T12:00:00","InTime":"2014-04-01T13:40:00","Number":"1631","WayTime":160,"VehicleName":"Boeing 737-8F2","TransferWaitTime":0,"OutCode":"IST","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Мюнхен","InPort":"Стамбул","OutTime":"2014-04-05T10:30:00","InTime":"2014-04-05T14:05:00","NextTime":"2014-04-05T16:35:00","Number":"1630","WayTime":155,"VehicleName":"Airbus A321-231","TransferWaitTime":150,"OutCode":"MUC","InCode":"IST","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Стамбул","InPort":"Внуково","OutTime":"2014-04-05T16:35:00","InTime":"2014-04-05T20:25:00","Number":"415","WayTime":170,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"IST","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710290,"VariantId2":773710438,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4uwrbPxQBB8e5VyfuY2qFz3lCMZE4CmulRnm4dCtzTPs%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T21:25:00","ArrivalDate":"2014-04-01T17:45:00","BackDepartureDate":"2014-04-05T10:30:00","BackArrivalDate":"2014-04-05T20:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":115344.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1340,"TimeBack":475,"EtapsTo":[{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Внуково","InPort":"Стамбул","OutTime":"2014-03-31T21:25:00","InTime":"2014-03-31T23:35:00","NextTime":"2014-04-01T16:05:00","Number":"416","WayTime":190,"VehicleName":"Airbus A321-231","TransferWaitTime":990,"OutCode":"VKO","InCode":"IST","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Стамбул","InPort":"Мюнхен","OutTime":"2014-04-01T16:05:00","InTime":"2014-04-01T17:45:00","Number":"1635","WayTime":160,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"IST","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Мюнхен","InPort":"Стамбул","OutTime":"2014-04-05T10:30:00","InTime":"2014-04-05T14:05:00","NextTime":"2014-04-05T16:35:00","Number":"1630","WayTime":155,"VehicleName":"Airbus A321-231","TransferWaitTime":150,"OutCode":"MUC","InCode":"IST","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Turkish Airlines","TransporterCode":"TK","TransporterLogo":"Turkish Airlines.gif","OutPort":"Стамбул","InPort":"Внуково","OutTime":"2014-04-05T16:35:00","InTime":"2014-04-05T20:25:00","Number":"415","WayTime":170,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"IST","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710216,"VariantId2":773710488,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4%2b1EgCAldftAshaVlDqi177m48A5%2bU%2fB9U3g7g%2bpo9Uk%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T10:30:00","BackArrivalDate":"2014-04-05T15:55:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":184211.0,"IsRecomendation":true,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":205,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T10:30:00","InTime":"2014-04-05T15:55:00","Number":"796","WayTime":205,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710334,"VariantId2":773710466,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4a8LVewovmvqhvMV52JKWEUa%2fn8RN%2bcVe02RsuMMA6Tc%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T10:30:00","BackArrivalDate":"2014-04-05T15:55:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":184211.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1280,"TimeBack":205,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T17:25:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":1020,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"S7 Airlines","TransporterCode":"S7","TransporterLogo":"S7 Airlines.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T10:30:00","InTime":"2014-04-05T15:55:00","Number":"796","WayTime":205,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710331,"VariantId2":773710367,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4HrXAkrJrt5HIJtK3mGo0l8PcyFNqAdclDoBoCyO%2fjW0%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T11:10:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":186408.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":185,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T11:10:00","InTime":"2014-04-05T16:15:00","Number":"2528","WayTime":185,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710293,"VariantId2":773710433,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4B9Fh7UxaRsrVviANpuQwvNJdTCtCnklmkiX8Id8Ha0k%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T11:10:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":186408.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":185,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T11:10:00","InTime":"2014-04-05T16:15:00","Number":"2528","WayTime":185,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710246,"VariantId2":773710468,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4bKztluRthd2WM7q6hkBqx9%2bULABqp7lIMtbnGVMgP9U%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:35:00","BackArrivalDate":"2014-04-05T12:40:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":186408.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":185,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T07:35:00","InTime":"2014-04-05T12:40:00","Number":"2526","WayTime":185,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710262,"VariantId2":773710412,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4kgmVFnr2mZZTC23QeH8MJlFV43xay1dP19RTewPVGig%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:35:00","BackArrivalDate":"2014-04-05T12:40:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":186408.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":185,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T07:35:00","InTime":"2014-04-05T12:40:00","Number":"2526","WayTime":185,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710222,"VariantId2":773710422,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4poZKapO2CEtGEBKUtsQG8AUziSTi75gf5C3wcesNu6o%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:35:00","BackArrivalDate":"2014-04-05T12:40:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":186832.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":185,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T07:35:00","InTime":"2014-04-05T12:40:00","Number":"2526","WayTime":185,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710215,"VariantId2":773710432,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4e2vBvJILQKKLL72boHo87IDlEBhgvpkIBIMX29ixhOg%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:35:00","BackArrivalDate":"2014-04-05T12:40:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":186832.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":185,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T07:35:00","InTime":"2014-04-05T12:40:00","Number":"2526","WayTime":185,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710306,"VariantId2":773710371,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4zx8CPlqd9qpG74P8OQf38qhJ0dcpQ63zXdpR3eiYZAI%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T14:45:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":187796.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":270,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T10:00:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":35,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T14:45:00","Number":"601","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710264,"VariantId2":773710375,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4fl0EetsSedlVFPH5liRWj82FCQ7APF97pD6wtcDfvTk%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":187796.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":510,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T12:45:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":285,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710218,"VariantId2":773710447,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4de0cd3zSCRRwdYN0yysNRkJOeo9%2f%2fGYtaSVIB042TqY%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T14:45:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":187796.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":345,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T10:00:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":120,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T14:45:00","Number":"601","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710219,"VariantId2":773710458,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4Ww%2fjWurmoMS16BGr5qnKlMFLHMaqVRwYpNL2XOOBNuU%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T14:45:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":187796.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":345,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T10:00:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":120,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T14:45:00","Number":"601","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710350,"VariantId2":773710418,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4vJf9SlMPVTdVjpY%2fJUbD8wHLqLZJkYkEiFxTm3tQB6Y%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":187796.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":435,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T12:45:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":200,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710297,"VariantId2":773710399,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4VUL5fqCNqqLkJ4WrhDghaqsB5HlRY1dyp9gquekRQYU%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":187796.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":510,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T12:45:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":285,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710232,"VariantId2":773710435,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4vkddn4T6c5yVCdwCcFeCl%2fAAiaQ%2fpU%2fRC85WuKPKAsY%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":187796.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":435,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T12:45:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":200,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710346,"VariantId2":773710421,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4VpKhQnzWnHVz1uWjEoevV1fZ7J877qCb9Lb%2binbiO1A%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T14:45:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":187796.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":270,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T10:00:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":35,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T14:45:00","Number":"601","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710356,"VariantId2":773710423,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4VJo8YQ%2b0viIYrU9pa5vJHAdp7O5sE0fiOEzkgcaANzg%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T14:45:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188220.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":270,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T10:00:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":35,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T14:45:00","Number":"601","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710355,"VariantId2":773710467,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs44UIBRP49yM8uSJncIZr8tDA9VlpIbAp5CkuzI2ors9w%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188220.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":510,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T12:45:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":285,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710236,"VariantId2":773710487,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4G1X%2fNjHZjEB1DFqtyH7Ciy3cQ5QAkJD6YiXPoLI6SWo%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188220.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":510,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T12:45:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":285,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710248,"VariantId2":773710478,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4Z9QnoKsU4DsfYanS4J38J%2f8BWsvOyuuVx2CLcczHLMU%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T14:45:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188220.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":345,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T10:00:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":120,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T14:45:00","Number":"601","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710253,"VariantId2":773710455,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4qTPlzG0uM%2fGhuX3Ag3i08lUQ4RvY1dh6j3Ubuh4d10c%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T14:45:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188220.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":270,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T10:00:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":35,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T14:45:00","Number":"601","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710287,"VariantId2":773710434,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4Wog8Fa28RcJRC1JiGCTVM0D3U%2f%2fGarQ8iX05ni1M4XI%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188220.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":435,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T12:45:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":200,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710307,"VariantId2":773710415,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4XQ6ks%2f896iDCk6g0pOPx5PoKU73YVg%2f4uVWdUX5Ma48%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188220.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":435,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T12:45:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":200,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710252,"VariantId2":773710417,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4jCm3t1rX3gH117Vz0D75snDwCFzSbeOrKnn%2bidK1uN8%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T14:45:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188220.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":345,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T10:00:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":120,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T14:45:00","Number":"601","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710312,"VariantId2":773710420,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4ErQhgbjjK7h5NaSX339Y4TvrCbWfUNq3h9z%2bCPMGwL4%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188656.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":505,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T12:40:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":280,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Внуково","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T17:25:00","Number":"7071","WayTime":165,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"VIE","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710250,"VariantId2":773710391,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4YUhE28mdu8ikGR5VduXtqQrrDbLaK8UBvWLPMdVxW%2bc%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188656.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":505,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T12:40:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":280,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Внуково","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T17:25:00","Number":"7071","WayTime":165,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"VIE","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710296,"VariantId2":773710382,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4nBLbc%2fyMZDrSYaMt4zSWZtDT4aCyVpwwc%2fmofiCAlgk%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T17:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188656.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":430,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T12:40:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":195,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Внуково","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T17:25:00","Number":"7071","WayTime":165,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"VIE","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710235,"VariantId2":773710393,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs476WzaGk5mtvuzaHTQBm5gHsI9NuS1ocBZGBCqFw%2f5sg%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T17:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188656.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":430,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T12:40:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":195,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Внуково","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T17:25:00","Number":"7071","WayTime":165,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"VIE","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710276,"VariantId2":773710364,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4oI69XunnxqtCjelWngH4GDknR4F3c0hO1BtDVZ5%2bOjs%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T17:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188656.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":430,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T12:40:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":195,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Внуково","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T17:25:00","Number":"7071","WayTime":165,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"VIE","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710225,"VariantId2":773710489,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4bCkQye3YVCZpCbnr0PSD8OIEez%2bqKS2myu8J3R7yDfs%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188656.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":505,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T12:40:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":280,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Внуково","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T17:25:00","Number":"7071","WayTime":165,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"VIE","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710271,"VariantId2":773710492,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4WyxM0rU8nIXSFVbQICkql%2fCmVL0dg30qgM43BMBADyE%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T17:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188656.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":430,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T12:40:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":195,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Внуково","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T17:25:00","Number":"7071","WayTime":165,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"VIE","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710341,"VariantId2":773710424,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4qB%2bLD3%2bTaPJRkmk7kHXQ6iwhD8vgjPCfO9iI7P0ZPn8%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188656.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":505,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T12:40:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":280,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Внуково","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T17:25:00","Number":"7071","WayTime":165,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"VIE","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710345,"VariantId2":773710443,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4TZtMYZ%2b1ogYL4yr6WIqyHSpQ%2fu8%2bU3TCZ9KtAzTMjPA%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T17:35:00","BackArrivalDate":"2014-04-05T22:25:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188678.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":170,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-04-05T17:35:00","InTime":"2014-04-05T22:25:00","Number":"2327","WayTime":170,"TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710348,"VariantId2":773710431,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4pVeZA4yI0fv1okjCl4P0w2iYs8g7hHP0PcQthjQQSPw%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T17:35:00","BackArrivalDate":"2014-04-05T22:25:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":188678.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":170,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-04-05T17:35:00","InTime":"2014-04-05T22:25:00","Number":"2327","WayTime":170,"TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710268,"VariantId2":773710475,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4A2wea%2fYd1YbEWlh2doIZi%2fqZU1a8yIOxG58XLiMKfQs%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T17:35:00","BackArrivalDate":"2014-04-05T22:25:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189102.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":170,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-04-05T17:35:00","InTime":"2014-04-05T22:25:00","Number":"2327","WayTime":170,"TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710311,"VariantId2":773710428,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4OF2Nr%2b7vF22vJv5qzpihyL1AXFPdZMWRiFbkmfUEElE%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T17:35:00","BackArrivalDate":"2014-04-05T22:25:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189102.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":170,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-04-05T17:35:00","InTime":"2014-04-05T22:25:00","Number":"2327","WayTime":170,"TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710354,"VariantId2":773710471,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4qhBOEbQgWL1p2aIx%2fbL%2fmNQyLty3mkXx7CvZCZpAQJ0%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:40:00","BackArrivalDate":"2014-04-05T17:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189112.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":375,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Мюнхен","InPort":"Цюрих","OutTime":"2014-04-05T09:40:00","InTime":"2014-04-05T10:45:00","NextTime":"2014-04-05T12:20:00","Number":"1101","WayTime":65,"VehicleName":"British Aerospace 146-RJ100-","TransferWaitTime":95,"OutCode":"MUC","InCode":"ZRH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Цюрих","InPort":"Домодедово","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T17:55:00","Number":"1326","WayTime":215,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"ZRH","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710313,"VariantId2":773710456,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs47JCOrJGxxBMswUeZs7EoCOeJ%2flEJwuZbZf3AKISDb%2f8%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:50:00","BackArrivalDate":"2014-04-05T17:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189112.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":485,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Мюнхен","InPort":"Цюрих","OutTime":"2014-04-05T07:50:00","InTime":"2014-04-05T08:50:00","NextTime":"2014-04-05T12:20:00","Number":"3619","WayTime":60,"VehicleName":"Airbus A319-112","TransferWaitTime":210,"OutCode":"MUC","InCode":"ZRH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Цюрих","InPort":"Домодедово","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T17:55:00","Number":"1326","WayTime":215,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"ZRH","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710273,"VariantId2":773710429,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs46LWJvQEBqStD0bBATAYHealeQlkMtM0GMoLKJZVaqQM%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:50:00","BackArrivalDate":"2014-04-05T17:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189544.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":485,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Мюнхен","InPort":"Цюрих","OutTime":"2014-04-05T07:50:00","InTime":"2014-04-05T08:50:00","NextTime":"2014-04-05T12:20:00","Number":"3619","WayTime":60,"VehicleName":"Airbus A319-112","TransferWaitTime":210,"OutCode":"MUC","InCode":"ZRH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Цюрих","InPort":"Домодедово","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T17:55:00","Number":"1326","WayTime":215,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"ZRH","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710281,"VariantId2":773710426,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4dIjJPPrdsO5IwoKPp5tQ0z9TWJlQIZLVarI0kBlaSRw%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:50:00","BackArrivalDate":"2014-04-05T17:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189544.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":485,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Мюнхен","InPort":"Цюрих","OutTime":"2014-04-05T07:50:00","InTime":"2014-04-05T08:50:00","NextTime":"2014-04-05T12:20:00","Number":"3619","WayTime":60,"VehicleName":"Airbus A319-112","TransferWaitTime":210,"OutCode":"MUC","InCode":"ZRH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Цюрих","InPort":"Домодедово","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T17:55:00","Number":"1326","WayTime":215,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"ZRH","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710265,"VariantId2":773710450,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4TjJSctDALwnpXHQJw%2fugTreZ55oIRqYiDezuKhJqPcs%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:40:00","BackArrivalDate":"2014-04-05T17:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189544.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":375,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Мюнхен","InPort":"Цюрих","OutTime":"2014-04-05T09:40:00","InTime":"2014-04-05T10:45:00","NextTime":"2014-04-05T12:20:00","Number":"1101","WayTime":65,"VehicleName":"British Aerospace 146-RJ100-","TransferWaitTime":95,"OutCode":"MUC","InCode":"ZRH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Цюрих","InPort":"Домодедово","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T17:55:00","Number":"1326","WayTime":215,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"ZRH","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710244,"VariantId2":773710365,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4GwXPcl9yAmZUkg%2b%2bC0%2bR6SGI0CAESrWQDVdEEP8CeHk%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:40:00","BackArrivalDate":"2014-04-05T17:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189544.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":375,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Мюнхен","InPort":"Цюрих","OutTime":"2014-04-05T09:40:00","InTime":"2014-04-05T10:45:00","NextTime":"2014-04-05T12:20:00","Number":"1101","WayTime":65,"VehicleName":"British Aerospace 146-RJ100-","TransferWaitTime":95,"OutCode":"MUC","InCode":"ZRH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Swiss","TransporterCode":"LX","TransporterLogo":"Swiss.gif","OutPort":"Цюрих","InPort":"Домодедово","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T17:55:00","Number":"1326","WayTime":215,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"ZRH","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710295,"VariantId2":773710376,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4M%2bDRgoU3%2bOXbAEoJVqucCaSwHcvvyERXwAIX0kT3oQM%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T11:10:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189677.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":185,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T11:10:00","InTime":"2014-04-05T16:15:00","Number":"2528","WayTime":185,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710228,"VariantId2":773710387,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4mnkK77Q%2fBIcY0kJpWZmvBVsSkE%2b3DOiYaqJSiMeb43A%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:35:00","BackArrivalDate":"2014-04-05T12:40:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":189677.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":185,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Домодедово","OutTime":"2014-04-05T07:35:00","InTime":"2014-04-05T12:40:00","Number":"2526","WayTime":185,"VehicleName":"Airbus A319-114","TransferWaitTime":0,"OutCode":"MUC","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710329,"VariantId2":773710398,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4grmc1OOOMkjGnbn3EErxb8uudGV7hU6WECS2cHfj%2b6c%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":191065.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":510,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T12:45:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":285,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710247,"VariantId2":773710464,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4NAP3nu1J7WKR1KZvVb46Ub5%2bppPEgGjaIShw3W71nuo%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T14:45:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":191065.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":345,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:00:00","NextTime":"2014-04-05T10:00:00","Number":"7232","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":120,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T14:45:00","Number":"601","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710260,"VariantId2":773710477,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4MNMqgqrKgV88Onwia8Ry30RH%2bmeQK0nBqaPy%2fklESYA%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:15:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":191065.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":435,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Мюнхен","InPort":"Вена","OutTime":"2014-04-05T08:15:00","InTime":"2014-04-05T09:25:00","NextTime":"2014-04-05T12:45:00","Number":"112","WayTime":70,"VehicleName":"Fokker F-100-","TransferWaitTime":200,"OutCode":"MUC","InCode":"VIE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Austrian Airlines","TransporterCode":"OS","TransporterLogo":"Austrian Airlines.gif","OutPort":"Вена","InPort":"Домодедово","OutTime":"2014-04-05T12:45:00","InTime":"2014-04-05T17:30:00","Number":"603","WayTime":165,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"VIE","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710305,"VariantId2":773710386,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs46S9dsANt2Sjx0DqpPZBc%2b21ANWtqEx0GXMdUdCENUJA%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:50:00","BackArrivalDate":"2014-04-05T16:10:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192142.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":320,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T08:50:00","InTime":"2014-04-05T10:00:00","NextTime":"2014-04-05T11:05:00","Number":"2006","WayTime":70,"TransferWaitTime":65,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Дюссельдорф","InPort":"Внуково","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T16:10:00","Number":"2990","WayTime":185,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710226,"VariantId2":773710381,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4xrqA431AIZ3rH1suUfiofl96B5KH%2fSC%2frGhdrosrUtU%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:50:00","BackArrivalDate":"2014-04-05T16:10:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192142.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":320,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T08:50:00","InTime":"2014-04-05T10:00:00","NextTime":"2014-04-05T11:05:00","Number":"2006","WayTime":70,"TransferWaitTime":65,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Дюссельдорф","InPort":"Внуково","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T16:10:00","Number":"2990","WayTime":185,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710278,"VariantId2":773710410,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4Ih4o5aTnscDUv834S%2bY8nyUmf57cz7yAUUTWQiTJaWA%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T11:05:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192212.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":320,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"SAS","TransporterCode":"SK","TransporterLogo":"SAS.gif","OutPort":"Мюнхен","InPort":"Копенгаген","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T12:35:00","NextTime":"2014-04-05T14:05:00","Number":"3636","WayTime":90,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":90,"OutCode":"MUC","InCode":"CPH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"SAS","TransporterCode":"SK","TransporterLogo":"SAS.gif","OutPort":"Копенгаген","InPort":"Шереметьево","OutTime":"2014-04-05T14:05:00","InTime":"2014-04-05T18:25:00","Number":"734","WayTime":140,"VehicleName":"Airbus A320-232","TransferWaitTime":0,"OutCode":"CPH","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710227,"VariantId2":773710444,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4%2byPqCB75mBbrfJ3uhbECdwEqQCuOjGTKAwnLSBCDR1A%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T11:05:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192212.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":320,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"SAS","TransporterCode":"SK","TransporterLogo":"SAS.gif","OutPort":"Мюнхен","InPort":"Копенгаген","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T12:35:00","NextTime":"2014-04-05T14:05:00","Number":"3636","WayTime":90,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":90,"OutCode":"MUC","InCode":"CPH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"SAS","TransporterCode":"SK","TransporterLogo":"SAS.gif","OutPort":"Копенгаген","InPort":"Шереметьево","OutTime":"2014-04-05T14:05:00","InTime":"2014-04-05T18:25:00","Number":"734","WayTime":140,"VehicleName":"Airbus A320-232","TransferWaitTime":0,"OutCode":"CPH","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710324,"VariantId2":773710379,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4mE%2fQfVHvYELpGPeiTDTgyYrd1qfP5KoTCqf0BbEhbfo%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T16:10:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192566.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":430,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:10:00","NextTime":"2014-04-05T11:05:00","Number":"2004","WayTime":70,"VehicleName":"Airbus A321-231","TransferWaitTime":175,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Дюссельдорф","InPort":"Внуково","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T16:10:00","Number":"2990","WayTime":185,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710239,"VariantId2":773710414,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4MsCkzJ4i3HqL9TMVHLHhY0fawi%2fmvvUIr7pcJqWUX3c%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T08:50:00","BackArrivalDate":"2014-04-05T16:10:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192566.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":320,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T08:50:00","InTime":"2014-04-05T10:00:00","NextTime":"2014-04-05T11:05:00","Number":"2006","WayTime":70,"TransferWaitTime":65,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Дюссельдорф","InPort":"Внуково","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T16:10:00","Number":"2990","WayTime":185,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710344,"VariantId2":773710373,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs42nHUJCeTX4bTtlwex%2fKLR%2bIU3jXuMK29sF2gtR2SG1Q%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T08:50:00","BackArrivalDate":"2014-04-05T16:10:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192566.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":320,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T08:50:00","InTime":"2014-04-05T10:00:00","NextTime":"2014-04-05T11:05:00","Number":"2006","WayTime":70,"TransferWaitTime":65,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Дюссельдорф","InPort":"Внуково","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T16:10:00","Number":"2990","WayTime":185,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710286,"VariantId2":773710409,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4ZURrcB9DBnGXFcw7yl0u4Q6BIq%2b5hJEx%2bOTv9EM1HeQ%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T16:10:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192566.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":430,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:10:00","NextTime":"2014-04-05T11:05:00","Number":"2004","WayTime":70,"VehicleName":"Airbus A321-231","TransferWaitTime":175,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Дюссельдорф","InPort":"Внуково","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T16:10:00","Number":"2990","WayTime":185,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710272,"VariantId2":773710407,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4DDBEy9Ibc75qsm9%2bzYl61IPxs7J6BtDqY2q0w1B98m8%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T16:10:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192566.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":430,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:10:00","NextTime":"2014-04-05T11:05:00","Number":"2004","WayTime":70,"VehicleName":"Airbus A321-231","TransferWaitTime":175,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Дюссельдорф","InPort":"Внуково","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T16:10:00","Number":"2990","WayTime":185,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710327,"VariantId2":773710396,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4CD%2fPAaUmVU2%2feDJ8wVZKzQ%2fKIPhOp1FPrE4cBlK3DNg%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T16:10:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192566.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":430,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:10:00","NextTime":"2014-04-05T11:05:00","Number":"2004","WayTime":70,"VehicleName":"Airbus A321-231","TransferWaitTime":175,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Дюссельдорф","InPort":"Внуково","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T16:10:00","Number":"2990","WayTime":185,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710283,"VariantId2":773710470,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs49Q5ClIG3FHTVwO%2bijN8rF0a7llZbmZWDzqJjplfo%2bpQ%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T11:05:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192636.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":320,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"SAS","TransporterCode":"SK","TransporterLogo":"SAS.gif","OutPort":"Мюнхен","InPort":"Копенгаген","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T12:35:00","NextTime":"2014-04-05T14:05:00","Number":"3636","WayTime":90,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":90,"OutCode":"MUC","InCode":"CPH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"SAS","TransporterCode":"SK","TransporterLogo":"SAS.gif","OutPort":"Копенгаген","InPort":"Шереметьево","OutTime":"2014-04-05T14:05:00","InTime":"2014-04-05T18:25:00","Number":"734","WayTime":140,"VehicleName":"Airbus A320-232","TransferWaitTime":0,"OutCode":"CPH","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710288,"VariantId2":773710465,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4PDdzgjFqyHvgbNA2iyW%2fkrmmr6onrB3dRLwEKFEarVg%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:10:00","BackArrivalDate":"2014-04-05T16:05:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192678.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":415,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Тегель Аэропорт","OutTime":"2014-04-05T07:10:00","InTime":"2014-04-05T08:20:00","NextTime":"2014-04-05T11:30:00","Number":"2030","WayTime":70,"VehicleName":"Airbus A320-211","TransferWaitTime":190,"OutCode":"MUC","InCode":"TXL","OutCity":"","OutCityCode":"","InCityCode":"BER","InCity":"Берлин"},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Тегель Аэропорт","InPort":"Внуково","OutTime":"2014-04-05T11:30:00","InTime":"2014-04-05T16:05:00","Number":"3018","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"TXL","InCode":"VKO","OutCity":"Берлин","OutCityCode":"BER","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710309,"VariantId2":773710403,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4u65ANNKxJpzr1Wc71gOQQII4n5UbvWgnUIHpjzz0y9U%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:05:00","BackArrivalDate":"2014-04-05T16:05:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192678.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":300,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Тегель Аэропорт","OutTime":"2014-04-05T09:05:00","InTime":"2014-04-05T10:15:00","NextTime":"2014-04-05T11:30:00","Number":"2034","WayTime":70,"VehicleName":"Airbus A321-231","TransferWaitTime":75,"OutCode":"MUC","InCode":"TXL","OutCity":"","OutCityCode":"","InCityCode":"BER","InCity":"Берлин"},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Тегель Аэропорт","InPort":"Внуково","OutTime":"2014-04-05T11:30:00","InTime":"2014-04-05T16:05:00","Number":"3018","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"TXL","InCode":"VKO","OutCity":"Берлин","OutCityCode":"BER","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710249,"VariantId2":773710402,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4T0UnK%2fAxR9dSdDXIr86LH65UWEWfOl8EhVb6kT4cjU4%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:05:00","BackArrivalDate":"2014-04-05T16:05:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192678.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":300,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Тегель Аэропорт","OutTime":"2014-04-05T09:05:00","InTime":"2014-04-05T10:15:00","NextTime":"2014-04-05T11:30:00","Number":"2034","WayTime":70,"VehicleName":"Airbus A321-231","TransferWaitTime":75,"OutCode":"MUC","InCode":"TXL","OutCity":"","OutCityCode":"","InCityCode":"BER","InCity":"Берлин"},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Тегель Аэропорт","InPort":"Внуково","OutTime":"2014-04-05T11:30:00","InTime":"2014-04-05T16:05:00","Number":"3018","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"TXL","InCode":"VKO","OutCity":"Берлин","OutCityCode":"BER","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710304,"VariantId2":773710378,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4zTgSt5%2bp9pnZ2eFXUZc7F5yqMFR5kO4Bi2mRFNEcSNc%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:10:00","BackArrivalDate":"2014-04-05T16:05:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192678.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":415,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Тегель Аэропорт","OutTime":"2014-04-05T07:10:00","InTime":"2014-04-05T08:20:00","NextTime":"2014-04-05T11:30:00","Number":"2030","WayTime":70,"VehicleName":"Airbus A320-211","TransferWaitTime":190,"OutCode":"MUC","InCode":"TXL","OutCity":"","OutCityCode":"","InCityCode":"BER","InCity":"Берлин"},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Тегель Аэропорт","InPort":"Внуково","OutTime":"2014-04-05T11:30:00","InTime":"2014-04-05T16:05:00","Number":"3018","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"TXL","InCode":"VKO","OutCity":"Берлин","OutCityCode":"BER","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710310,"VariantId2":773710368,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4kjLBP1KYPCVsj0059ZSOZhJv72bHHSALt8Kgvj5CC8A%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T15:00:00","BackArrivalDate":"2014-04-05T22:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":340,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T15:00:00","InTime":"2014-04-05T16:05:00","NextTime":"2014-04-05T17:25:00","Number":"111","WayTime":65,"VehicleName":"Airbus A320-211","TransferWaitTime":80,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T17:25:00","InTime":"2014-04-05T22:40:00","Number":"1450","WayTime":195,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710258,"VariantId2":773710380,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4dzXIZeTl%2bN3%2bfyWz0g27M1w2Wh20%2bu%2fsy3dTU%2bpyK9Y%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":375,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T08:00:00","InTime":"2014-04-05T09:05:00","NextTime":"2014-04-05T11:00:00","Number":"95","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":115,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710261,"VariantId2":773710388,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4WYtfEK22%2f9SoJukKKVwWXwdq%2b1BcD6%2fmldN1TmwVfFk%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T14:00:00","BackArrivalDate":"2014-04-05T22:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":400,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T14:00:00","InTime":"2014-04-05T15:05:00","NextTime":"2014-04-05T17:25:00","Number":"109","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":140,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T17:25:00","InTime":"2014-04-05T22:40:00","Number":"1450","WayTime":195,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710342,"VariantId2":773710359,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4v6F4wAyWstkK7Thks7hZYoLZuQ9UUuJY7a27zg4MFaQ%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":375,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T08:00:00","InTime":"2014-04-05T09:05:00","NextTime":"2014-04-05T11:00:00","Number":"95","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":115,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710221,"VariantId2":773710457,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4kJQBIxqTTkFLFSTuVnQgcYIa4H%2blHSHpEK86kP%2fDyiE%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":315,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T11:00:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":55,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710322,"VariantId2":773710480,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4gECWuyGQfkyjFcZR0f3DiON8y5NeS0WaM5kVhrJ0ktc%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T14:00:00","BackArrivalDate":"2014-04-05T22:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":400,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T14:00:00","InTime":"2014-04-05T15:05:00","NextTime":"2014-04-05T17:25:00","Number":"109","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":140,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T17:25:00","InTime":"2014-04-05T22:40:00","Number":"1450","WayTime":195,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710298,"VariantId2":773710427,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4gUeHSaWPDr8JBCYx1tHzWZNjSvrYTJxVWwYQ%2b24RyQo%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":400,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T12:25:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":140,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710308,"VariantId2":773710437,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4FAVoqExWS1EVQ4quGgOj%2bRc4oKwgiVDixoRLvprZybI%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":315,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T11:00:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":55,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710277,"VariantId2":773710451,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4OPq4U0mrpBBaUh1kjQK%2bSAXTv%2btqYewykwtZLATVQRA%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":400,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T12:25:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":140,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710234,"VariantId2":773710440,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4%2bPHZGMSJR9GnxcRJkJzbQWxOuZRiLyRhhimetA6s6bs%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T10:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":340,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T11:05:00","NextTime":"2014-04-05T12:25:00","Number":"101","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":80,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710340,"VariantId2":773710448,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4odmpdcIMTPRRqZ4q3rmQiFs0tPE0W2eOV9rsP9VE8cg%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T15:00:00","BackArrivalDate":"2014-04-05T22:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":340,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T15:00:00","InTime":"2014-04-05T16:05:00","NextTime":"2014-04-05T17:25:00","Number":"111","WayTime":65,"VehicleName":"Airbus A320-211","TransferWaitTime":80,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T17:25:00","InTime":"2014-04-05T22:40:00","Number":"1450","WayTime":195,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710352,"VariantId2":773710445,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4MTCbpcyq70AJOmrce%2bHO04sfyIVVLYeGgrOjWFxuoGI%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T10:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":192746.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":340,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T11:05:00","NextTime":"2014-04-05T12:25:00","Number":"101","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":80,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710337,"VariantId2":773710460,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4xuaF2dMh1X%2barz75fQ9bXZZZvOu0aI5PER5AyOueY5o%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T11:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193164.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":325,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T12:05:00","NextTime":"2014-04-05T13:15:00","Number":"103","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":70,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710233,"VariantId2":773710454,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4FNROPG0ZqH1evOeJC2UJgNQlZtyoUbiiPctD8ZFgRfc%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T11:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193164.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":325,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T12:05:00","NextTime":"2014-04-05T13:15:00","Number":"103","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":70,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710279,"VariantId2":773710484,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4ZtkMRzs44LCPockQ8YTEAt6Hoj4cyYhoD76LBlvJAak%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T10:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193164.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":385,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T11:05:00","NextTime":"2014-04-05T13:15:00","Number":"101","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":130,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710269,"VariantId2":773710362,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4PG9SD3yFxr8qwNJM3ULZXOkTrCWTVcDJEwb3vi%2ffrYo%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":435,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T11:00:00","Number":"93","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":175,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710245,"VariantId2":773710361,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4EKFp%2fruQpaguVpGyVFkUR%2fdXsZ9ucaGq9DQXO5EmLIY%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":315,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T11:00:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":55,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710238,"VariantId2":773710383,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4mv%2fLeCOHp3PPgOpb90%2fFMEf4f1dLJeUsjlwOWwldEiM%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":315,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T11:00:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":55,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710323,"VariantId2":773710452,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4e95Ue3d6S5BmWD0eFOi9YaDuDciC9jUc8l%2fFqfBgaNo%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T10:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":340,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T11:05:00","NextTime":"2014-04-05T12:25:00","Number":"101","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":80,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710230,"VariantId2":773710453,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs43hH%2fsQckp2TmzafOEtQe4O0C0pGDR2ODJGQJ6a97QmU%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":460,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T08:00:00","InTime":"2014-04-05T09:05:00","NextTime":"2014-04-05T12:25:00","Number":"95","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":200,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710357,"VariantId2":773710401,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4trQZ1KmGwKAAFJnjB0q2KCTBmqS3gDMCq5BzBYtYasU%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":435,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T11:00:00","Number":"93","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":175,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710224,"VariantId2":773710439,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4Uu1%2f7g6zYBen%2feAvqh3G78QuFT%2b8jAGfdjnrT3ZMUig%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T08:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":375,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T08:00:00","InTime":"2014-04-05T09:05:00","NextTime":"2014-04-05T11:00:00","Number":"95","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":115,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710289,"VariantId2":773710404,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4YhyY4dB8ZiB4mc3wZbHW9BxqVu4M5dgzkwFTuLppe7Q%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":520,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T12:25:00","Number":"93","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":260,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710267,"VariantId2":773710416,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs43%2bod2yZltuiaT6ZwIjdXoxQeXZaBTBX8hgkiN69qljg%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T12:00:00","BackArrivalDate":"2014-04-05T22:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":520,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T12:00:00","InTime":"2014-04-05T13:05:00","NextTime":"2014-04-05T17:25:00","Number":"105","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":260,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T17:25:00","InTime":"2014-04-05T22:40:00","Number":"1450","WayTime":195,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710254,"VariantId2":773710411,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4ztnJjacoSuVF8WQPgMv697iBAAE1bBleJ5pfRv0ou%2f4%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":520,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T12:25:00","Number":"93","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":260,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710263,"VariantId2":773710397,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs43TBepAOFlDPYwAdFHGYn1gypb%2fgh91ey1q%2fS666p57s%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":520,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T12:25:00","Number":"93","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":260,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710338,"VariantId2":773710476,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4ja7bXsfSzrFgT7yOzRfoM8ytt3bh4mDUkiIp7OSkq7s%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":435,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T11:00:00","Number":"93","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":175,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710330,"VariantId2":773710446,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4KYoHjnzuTb39DaYfZIUeKDPQtfBoGWR4qZOXMiDSIvg%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T12:00:00","BackArrivalDate":"2014-04-05T22:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":520,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T12:00:00","InTime":"2014-04-05T13:05:00","NextTime":"2014-04-05T17:25:00","Number":"105","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":260,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T17:25:00","InTime":"2014-04-05T22:40:00","Number":"1450","WayTime":195,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710332,"VariantId2":773710430,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4NiecfVZ46EH9ZAiVNOOjLUn%2br1n0aNf4NEd9uJ0okDo%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":520,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T12:25:00","Number":"93","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":260,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710353,"VariantId2":773710461,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4havatWDrYehynXztzAvTp4k6D2HnvuQLvNaUhBchiGE%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":460,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T08:00:00","InTime":"2014-04-05T09:05:00","NextTime":"2014-04-05T12:25:00","Number":"95","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":200,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710349,"VariantId2":773710481,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4Rr5pTGnz9F3OvBBEgFH%2fn2SfBRV4lY6KEoBg9Z%2bwEx8%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T12:00:00","BackArrivalDate":"2014-04-05T22:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":520,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T12:00:00","InTime":"2014-04-05T13:05:00","NextTime":"2014-04-05T17:25:00","Number":"105","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":260,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T17:25:00","InTime":"2014-04-05T22:40:00","Number":"1450","WayTime":195,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710302,"VariantId2":773710490,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4QnWjuoGvW5jVPR%2f5cMDInsZgqpZekBxVfjcIjOk5Oic%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T10:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1255,"TimeBack":340,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T17:25:00","Number":"6186","WayTime":95,"TransferWaitTime":990,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T11:05:00","NextTime":"2014-04-05T12:25:00","Number":"101","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":80,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710335,"VariantId2":773710494,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4Bx6np8Knu3T0BPejD7TXRWMz5dKvCW2BEeB3J1dgPhY%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T18:15:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":1230,"TimeBack":400,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T17:25:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":980,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T17:25:00","InTime":"2014-04-01T18:15:00","Number":"2565","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T12:25:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":140,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710251,"VariantId2":773710495,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs40vXLEAy7PAAA0Eji6nd9FBXha6az%2bTNZoghN73MQ%2bwM%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193170.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":435,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T11:00:00","Number":"93","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":175,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710242,"VariantId2":773710493,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4BF4cVB%2fDv%2fEZPVEpl79AXtiKLZG5JzbNzOhWZFzL%2b0c%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193588.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":505,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T08:00:00","InTime":"2014-04-05T09:05:00","NextTime":"2014-04-05T13:15:00","Number":"95","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":250,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710351,"VariantId2":773710486,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4%2fP5a7%2bVE2EDOYQwnRhx%2btjPcsdDMG1L6EtNn4Kqcrgk%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193588.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":445,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T13:15:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":190,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710347,"VariantId2":773710474,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4F0aey5gfOQfBQ4O%2fYpX5W0jf3tpEzs2HeijzcDzCt74%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T10:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193588.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":385,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T11:05:00","NextTime":"2014-04-05T13:15:00","Number":"101","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":130,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710328,"VariantId2":773710472,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4l1AVP0LMZ%2be1p%2fBRSlo65us%2fnKoWiJLo7%2fnHnhgE7wo%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193588.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":445,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T13:15:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":190,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710280,"VariantId2":773710369,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4HZ26Dexi5OdJhTtdM4ef9OAYvLh%2b%2fRIpBYoF5r9VtCI%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":193588.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":505,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T08:00:00","InTime":"2014-04-05T09:05:00","NextTime":"2014-04-05T13:15:00","Number":"95","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":250,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710299,"VariantId2":773710370,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4W5xxIMQ4yjprAMUflHRJ1k8Im08KQjJCrVXzw0OHtpI%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:50:00","BackArrivalDate":"2014-04-05T16:10:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":195417.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":320,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T08:50:00","InTime":"2014-04-05T10:00:00","NextTime":"2014-04-05T11:05:00","Number":"2006","WayTime":70,"TransferWaitTime":65,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Дюссельдорф","InPort":"Внуково","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T16:10:00","Number":"2990","WayTime":185,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710282,"VariantId2":773710394,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4ihFujGJfK%2fDdljcuyY41RvdC2mkRV6hSvcn2F6%2fFjI0%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T11:05:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":195488.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":320,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"SAS","TransporterCode":"SK","TransporterLogo":"SAS.gif","OutPort":"Мюнхен","InPort":"Копенгаген","OutTime":"2014-04-05T11:05:00","InTime":"2014-04-05T12:35:00","NextTime":"2014-04-05T14:05:00","Number":"3636","WayTime":90,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":90,"OutCode":"MUC","InCode":"CPH","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"SAS","TransporterCode":"SK","TransporterLogo":"SAS.gif","OutPort":"Копенгаген","InPort":"Шереметьево","OutTime":"2014-04-05T14:05:00","InTime":"2014-04-05T18:25:00","Number":"734","WayTime":140,"VehicleName":"Airbus A320-232","TransferWaitTime":0,"OutCode":"CPH","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710285,"VariantId2":773710482,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4vUdfLNV46wnoRfasvwM8oA6VIr8BqFF59k1s1pwvaec%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:10:00","BackArrivalDate":"2014-04-05T16:05:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":195954.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":415,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Тегель Аэропорт","OutTime":"2014-04-05T07:10:00","InTime":"2014-04-05T08:20:00","NextTime":"2014-04-05T11:30:00","Number":"2030","WayTime":70,"VehicleName":"Airbus A320-211","TransferWaitTime":190,"OutCode":"MUC","InCode":"TXL","OutCity":"","OutCityCode":"","InCityCode":"BER","InCity":"Берлин"},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Тегель Аэропорт","InPort":"Внуково","OutTime":"2014-04-05T11:30:00","InTime":"2014-04-05T16:05:00","Number":"3018","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"TXL","InCode":"VKO","OutCity":"Берлин","OutCityCode":"BER","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710294,"VariantId2":773710449,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4nKGQRD%2bAMOUvDNWGnN%2fc9iMEG5wQGI0xSAwZhsvx858%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:05:00","BackArrivalDate":"2014-04-05T16:05:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":195954.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":300,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Тегель Аэропорт","OutTime":"2014-04-05T09:05:00","InTime":"2014-04-05T10:15:00","NextTime":"2014-04-05T11:30:00","Number":"2034","WayTime":70,"VehicleName":"Airbus A321-231","TransferWaitTime":75,"OutCode":"MUC","InCode":"TXL","OutCity":"","OutCityCode":"","InCityCode":"BER","InCity":"Берлин"},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Тегель Аэропорт","InPort":"Внуково","OutTime":"2014-04-05T11:30:00","InTime":"2014-04-05T16:05:00","Number":"3018","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"TXL","InCode":"VKO","OutCity":"Берлин","OutCityCode":"BER","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710275,"VariantId2":773710419,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4KMH5lt%2fk6ugc5j48z0PsnTRyJb8pJwizE3RSm1IbIh0%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":196021.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":375,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T08:00:00","InTime":"2014-04-05T09:05:00","NextTime":"2014-04-05T11:00:00","Number":"95","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":115,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710333,"VariantId2":773710413,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs45wLKVrApMhtLErm%2blGhCfxWRao9umWUuM3o1V9pWC2Y%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T10:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":196021.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":340,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T11:05:00","NextTime":"2014-04-05T12:25:00","Number":"101","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":80,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710343,"VariantId2":773710390,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4oiU15GHtsgZafE5i5brBedzxoOHyuv9WdxfTnjWjV9s%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":196021.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":315,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T11:00:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":55,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710339,"VariantId2":773710385,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs47Ro71m55tLvLGBUrjp5sovYM30x4JW%2fCBkyfhIeV%2fnk%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T15:00:00","BackArrivalDate":"2014-04-05T22:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":196021.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":340,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T15:00:00","InTime":"2014-04-05T16:05:00","NextTime":"2014-04-05T17:25:00","Number":"111","WayTime":65,"VehicleName":"Airbus A320-211","TransferWaitTime":80,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T17:25:00","InTime":"2014-04-05T22:40:00","Number":"1450","WayTime":195,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710301,"VariantId2":773710374,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4ks1Davd5MQKtyAWd00KFbdNhlhHgK%2bxGXb%2bmFSnujJo%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:00:00","BackArrivalDate":"2014-04-05T17:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":196021.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":400,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T09:00:00","InTime":"2014-04-05T10:05:00","NextTime":"2014-04-05T12:25:00","Number":"99","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":140,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T12:25:00","InTime":"2014-04-05T17:40:00","Number":"1448","WayTime":195,"TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710303,"VariantId2":773710384,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4t6ZuVSJtWDtQVmzy3di5MT7u%2bd657ofjVDxzVS3BfMQ%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:00:00","BackArrivalDate":"2014-04-05T16:15:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":196021.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":435,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T07:00:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T11:00:00","Number":"93","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":175,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T16:15:00","Number":"1446","WayTime":195,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710223,"VariantId2":773710400,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4EL5MGPNDqgaD0mooxt1SmHJP7Hy2%2fU5xvojXeBr2MqE%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T14:00:00","BackArrivalDate":"2014-04-05T22:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":196021.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":400,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T14:00:00","InTime":"2014-04-05T15:05:00","NextTime":"2014-04-05T17:25:00","Number":"109","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":140,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Домодедово","OutTime":"2014-04-05T17:25:00","InTime":"2014-04-05T22:40:00","Number":"1450","WayTime":195,"VehicleName":"Airbus A321-231","TransferWaitTime":0,"OutCode":"FRA","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710240,"VariantId2":773710485,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4OxHVwHubDihX%2bPJIhev%2fQkBgz9Pq9%2fJJVhizJtrIv%2f4%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T11:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":196441.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":325,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T11:00:00","InTime":"2014-04-05T12:05:00","NextTime":"2014-04-05T13:15:00","Number":"103","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":70,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710292,"VariantId2":773710469,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs459ekKsqcgTc0O84gK78eNfWUSKTmYTcPjAbEAodA2WI%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T10:00:00","BackArrivalDate":"2014-04-05T18:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":196441.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":385,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T11:05:00","NextTime":"2014-04-05T13:15:00","Number":"101","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":130,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T13:15:00","InTime":"2014-04-05T18:25:00","Number":"1470","WayTime":190,"VehicleName":"Airbus A320-214(SL)","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710325,"VariantId2":773710442,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4Q%2bt3Etfy29LusD0DoZu%2fxzqp%2fQ5WRJW%2bh%2bJi2niTSA4%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T12:10:00","BackArrivalDate":"2014-04-05T20:30:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":200595.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":380,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Baltic","TransporterCode":"BT","TransporterLogo":"Air Baltic.gif","OutPort":"Мюнхен","InPort":"Рига","OutTime":"2014-04-05T12:10:00","InTime":"2014-04-05T15:40:00","NextTime":"2014-04-05T17:50:00","Number":"222","WayTime":150,"VehicleName":"Boeing 737-36Q","TransferWaitTime":130,"OutCode":"MUC","InCode":"RIX","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Air Baltic","TransporterCode":"BT","TransporterLogo":"Air Baltic.gif","OutPort":"Рига","InPort":"Шереметьево","OutTime":"2014-04-05T17:50:00","InTime":"2014-04-05T20:30:00","Number":"422","WayTime":100,"VehicleName":"Boeing 737-33V","TransferWaitTime":0,"OutCode":"RIX","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710284,"VariantId2":773710441,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4K3gRSnmkEI81H5MPAHyYW0RPuXtmhEzt6lvrS1YsY68%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T12:35:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":203544.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":175,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-04-05T12:35:00","InTime":"2014-04-05T17:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A321-211","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710241,"VariantId2":773710459,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4%2ftNFKtpmc3KrzeZPf40lInkcJe6Sqb6MEgvXrJUODQc%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T12:35:00","BackArrivalDate":"2014-04-05T17:30:00","ToTransferCount":1,"BackTransferCount":0,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":203544.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":175,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Мюнхен","InPort":"Шереметьево","OutTime":"2014-04-05T12:35:00","InTime":"2014-04-05T17:30:00","Number":"2323","WayTime":175,"VehicleName":"Airbus A321-211","TransferWaitTime":0,"OutCode":"MUC","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710229,"VariantId2":773710473,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs47nPZc%2bM8Ixw1FhLQJh7nAU2kB%2f%2bk5GdzuvbWaNuK7gY%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T06:45:00","BackArrivalDate":"2014-04-05T15:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":208776.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":400,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Brussels Airline","TransporterCode":"SN","TransporterLogo":"Brussels Airlines.gif","OutPort":"Мюнхен","InPort":"Брюссель","OutTime":"2014-04-05T06:45:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T09:55:00","Number":"7050","WayTime":80,"VehicleName":"Airbus A319-114","TransferWaitTime":110,"OutCode":"MUC","InCode":"BRU","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Brussels Airline","TransporterCode":"SN","TransporterLogo":"Brussels Airlines.gif","OutPort":"Брюссель","InPort":"Домодедово","OutTime":"2014-04-05T09:55:00","InTime":"2014-04-05T15:25:00","Number":"2835","WayTime":210,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"BRU","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710255,"VariantId2":773710425,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4zc3i4JePGQZ%2fN3jqoeka28VHhd%2fFzfqWr2n61JwGpTA%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T06:45:00","BackArrivalDate":"2014-04-05T15:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":208776.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":400,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Brussels Airline","TransporterCode":"SN","TransporterLogo":"Brussels Airlines.gif","OutPort":"Мюнхен","InPort":"Брюссель","OutTime":"2014-04-05T06:45:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T09:55:00","Number":"7050","WayTime":80,"VehicleName":"Airbus A319-114","TransferWaitTime":110,"OutCode":"MUC","InCode":"BRU","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Brussels Airline","TransporterCode":"SN","TransporterLogo":"Brussels Airlines.gif","OutPort":"Брюссель","InPort":"Домодедово","OutTime":"2014-04-05T09:55:00","InTime":"2014-04-05T15:25:00","Number":"2835","WayTime":210,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"BRU","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710291,"VariantId2":773710483,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4AuN1rKOt9UJn8yJr9TKnNAXX37Injdm110AaXwt1PoY%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T06:45:00","BackArrivalDate":"2014-04-05T15:25:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":211642.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":400,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Brussels Airline","TransporterCode":"SN","TransporterLogo":"Brussels Airlines.gif","OutPort":"Мюнхен","InPort":"Брюссель","OutTime":"2014-04-05T06:45:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T09:55:00","Number":"7050","WayTime":80,"VehicleName":"Airbus A319-114","TransferWaitTime":110,"OutCode":"MUC","InCode":"BRU","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Brussels Airline","TransporterCode":"SN","TransporterLogo":"Brussels Airlines.gif","OutPort":"Брюссель","InPort":"Домодедово","OutTime":"2014-04-05T09:55:00","InTime":"2014-04-05T15:25:00","Number":"2835","WayTime":210,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"BRU","InCode":"DME","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710336,"VariantId2":773710372,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs49Iu7UHOEBUCO8SzhtAuws%2bRAynUj8DKM%2b7nq7LVoy74%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:50:00","BackArrivalDate":"2014-04-05T16:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":217438.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":350,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"LOT Polish","TransporterCode":"LO","TransporterLogo":"LOT Polish Airlines.gif","OutPort":"Мюнхен","InPort":"Варшава","OutTime":"2014-04-05T08:50:00","InTime":"2014-04-05T10:20:00","NextTime":"2014-04-05T12:40:00","Number":"352","WayTime":90,"TransferWaitTime":140,"OutCode":"MUC","InCode":"WAW","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"LOT Polish","TransporterCode":"LO","TransporterLogo":"LOT Polish Airlines.gif","OutPort":"Варшава","InPort":"Шереметьево","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T16:40:00","Number":"5677","WayTime":120,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"WAW","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710220,"VariantId2":773710406,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4jNaVrGD5SW0ABKJpg%2bp0K0bytggcmExfNPKU8pK44rw%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:50:00","BackArrivalDate":"2014-04-05T16:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":217438.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":350,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"LOT Polish","TransporterCode":"LO","TransporterLogo":"LOT Polish Airlines.gif","OutPort":"Мюнхен","InPort":"Варшава","OutTime":"2014-04-05T08:50:00","InTime":"2014-04-05T10:20:00","NextTime":"2014-04-05T12:40:00","Number":"352","WayTime":90,"TransferWaitTime":140,"OutCode":"MUC","InCode":"WAW","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"LOT Polish","TransporterCode":"LO","TransporterLogo":"LOT Polish Airlines.gif","OutPort":"Варшава","InPort":"Шереметьево","OutTime":"2014-04-05T12:40:00","InTime":"2014-04-05T16:40:00","Number":"5677","WayTime":120,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"WAW","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710257,"VariantId2":773710462,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4K5efHZPBuCNyiKwLSnWfh4fWYSI2H%2bpOgL9bIpCvThg%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:50:00","BackArrivalDate":"2014-04-05T20:05:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":217438.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":555,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"LOT Polish","TransporterCode":"LO","TransporterLogo":"LOT Polish Airlines.gif","OutPort":"Мюнхен","InPort":"Варшава","OutTime":"2014-04-05T08:50:00","InTime":"2014-04-05T10:20:00","NextTime":"2014-04-05T16:00:00","Number":"352","WayTime":90,"TransferWaitTime":340,"OutCode":"MUC","InCode":"WAW","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"LOT Polish","TransporterCode":"LO","TransporterLogo":"LOT Polish Airlines.gif","OutPort":"Варшава","InPort":"Шереметьево","OutTime":"2014-04-05T16:00:00","InTime":"2014-04-05T20:05:00","Number":"677","WayTime":125,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":0,"OutCode":"WAW","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710300,"VariantId2":773710389,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4RAvHcaLmnXJt7nzzpO2%2fx3l2bGDW8%2fVSolxv%2bAQDTm0%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T08:50:00","BackArrivalDate":"2014-04-05T20:05:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":217438.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":555,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"LOT Polish","TransporterCode":"LO","TransporterLogo":"LOT Polish Airlines.gif","OutPort":"Мюнхен","InPort":"Варшава","OutTime":"2014-04-05T08:50:00","InTime":"2014-04-05T10:20:00","NextTime":"2014-04-05T16:00:00","Number":"352","WayTime":90,"TransferWaitTime":340,"OutCode":"MUC","InCode":"WAW","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"LOT Polish","TransporterCode":"LO","TransporterLogo":"LOT Polish Airlines.gif","OutPort":"Варшава","InPort":"Шереметьево","OutTime":"2014-04-05T16:00:00","InTime":"2014-04-05T20:05:00","Number":"677","WayTime":125,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":0,"OutCode":"WAW","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710243,"VariantId2":773710491,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4rAxVgQkU2PRBBl%2fWuV7rERg12GXQHMaaLHAdU7EAGtg%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:50:00","BackArrivalDate":"2014-04-05T16:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":218032.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":305,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Гамбург","OutTime":"2014-04-05T09:50:00","InTime":"2014-04-05T11:10:00","NextTime":"2014-04-05T12:20:00","Number":"6300","WayTime":80,"VehicleName":"Boeing 737-86J","TransferWaitTime":70,"OutCode":"MUC","InCode":"HAM","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Гамбург","InPort":"Шереметьево","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T16:55:00","Number":"2347","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"HAM","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710358,"VariantId2":773710377,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs485uqxdIk92OGZRdaK9uPZbMglrlWGa2ZeAYWixB9Irc%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T09:50:00","BackArrivalDate":"2014-04-05T16:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":218032.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":305,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Гамбург","OutTime":"2014-04-05T09:50:00","InTime":"2014-04-05T11:10:00","NextTime":"2014-04-05T12:20:00","Number":"6300","WayTime":80,"VehicleName":"Boeing 737-86J","TransferWaitTime":70,"OutCode":"MUC","InCode":"HAM","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Гамбург","InPort":"Шереметьево","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T16:55:00","Number":"2347","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"HAM","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710256,"VariantId2":773710360,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4B1BLMpZGb4%2f4ztId1d%2fwXXx%2fF3n%2brgxlSKxhZsLqqPU%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T06:50:00","BackArrivalDate":"2014-04-05T15:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":218858.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":425,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T06:50:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T10:45:00","Number":"6024","WayTime":75,"VehicleName":"Boeing 737-86J","TransferWaitTime":160,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Дюссельдорф","InPort":"Шереметьево","OutTime":"2014-04-05T10:45:00","InTime":"2014-04-05T15:55:00","Number":"2537","WayTime":190,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710266,"VariantId2":773710395,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4yGSPLlHO4Oj9cz6ZjSFY5ZE%2bSkofdriFCZDtQIq2K3c%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T06:50:00","BackArrivalDate":"2014-04-05T15:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":218858.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":425,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Дюссельдорф","OutTime":"2014-04-05T06:50:00","InTime":"2014-04-05T08:05:00","NextTime":"2014-04-05T10:45:00","Number":"6024","WayTime":75,"VehicleName":"Boeing 737-86J","TransferWaitTime":160,"OutCode":"MUC","InCode":"DUS","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Дюссельдорф","InPort":"Шереметьево","OutTime":"2014-04-05T10:45:00","InTime":"2014-04-05T15:55:00","Number":"2537","WayTime":190,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"DUS","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710314,"VariantId2":773710408,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4mWsko4SDVVRudiiepDc0iScrgWrzEFhaOMVIHdBuMVM%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:20:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:30:00","BackArrivalDate":"2014-04-05T16:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Домодедово","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":220052.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":560,"TimeBack":445,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Домодедово","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:20:00","InTime":"2014-04-01T00:55:00","NextTime":"2014-04-01T05:50:00","Number":"6186","WayTime":95,"TransferWaitTime":295,"OutCode":"DME","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Гамбург","OutTime":"2014-04-05T07:30:00","InTime":"2014-04-05T08:50:00","NextTime":"2014-04-05T12:20:00","Number":"6298","WayTime":80,"VehicleName":"Airbus A320-214","TransferWaitTime":210,"OutCode":"MUC","InCode":"HAM","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Гамбург","InPort":"Шереметьево","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T16:55:00","Number":"2347","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"HAM","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710326,"VariantId2":773710436,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4w7qUSgO3l39VNcVBm0vst7vlo08aKe1K55ZjvTuTAKA%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"DME"},{"DepartureDate":"2014-03-31T23:45:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T07:30:00","BackArrivalDate":"2014-04-05T16:55:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Шереметьево","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":220052.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":535,"TimeBack":445,"EtapsTo":[{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Шереметьево","InPort":"Санкт-Петербург","OutTime":"2014-03-31T23:45:00","InTime":"2014-04-01T01:05:00","NextTime":"2014-04-01T05:50:00","Number":"34","WayTime":80,"VehicleName":"Airbus A321-211","TransferWaitTime":285,"OutCode":"SVO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Berlin","TransporterCode":"AB","TransporterLogo":"Air Berlin.gif","OutPort":"Мюнхен","InPort":"Гамбург","OutTime":"2014-04-05T07:30:00","InTime":"2014-04-05T08:50:00","NextTime":"2014-04-05T12:20:00","Number":"6298","WayTime":80,"VehicleName":"Airbus A320-214","TransferWaitTime":210,"OutCode":"MUC","InCode":"HAM","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Aeroflot","TransporterCode":"SU","TransporterLogo":"aeroflot.gif","OutPort":"Гамбург","InPort":"Шереметьево","OutTime":"2014-04-05T12:20:00","InTime":"2014-04-05T16:55:00","Number":"2347","WayTime":155,"VehicleName":"Airbus A320-214","TransferWaitTime":0,"OutCode":"HAM","InCode":"SVO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710237,"VariantId2":773710392,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs46FTh%2fDEWEH9IdHgI66MP8hCI%2b9S7la9OW57jQR4%2fUgg%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"SVO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T10:00:00","BackArrivalDate":"2014-04-05T19:40:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":242828.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":460,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Мюнхен","InPort":"Франкфурт-на-Майне","OutTime":"2014-04-05T10:00:00","InTime":"2014-04-05T11:05:00","NextTime":"2014-04-05T14:25:00","Number":"101","WayTime":65,"VehicleName":"Airbus A321-231","TransferWaitTime":200,"OutCode":"MUC","InCode":"FRA","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Франкфурт-на-Майне","InPort":"Внуково","OutTime":"2014-04-05T14:25:00","InTime":"2014-04-05T19:40:00","Number":"308","WayTime":195,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"FRA","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710217,"VariantId2":773710405,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4d5Gisi6swGDf4AWEVBDrHBPCkc4wsvDmChftoreH6Ic%3d","IsNightFlight":true,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T22:55:00","ArrivalDate":"2014-04-01T06:40:00","BackDepartureDate":"2014-04-05T13:45:00","BackArrivalDate":"2014-04-05T22:00:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":259080.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":585,"TimeBack":375,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Санкт-Петербург","OutTime":"2014-03-31T22:55:00","InTime":"2014-04-01T00:25:00","NextTime":"2014-04-01T05:50:00","Number":"26","WayTime":90,"VehicleName":"Boeing 737-524","TransferWaitTime":325,"OutCode":"VKO","InCode":"LED","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Санкт-Петербург","InPort":"Мюнхен","OutTime":"2014-04-01T05:50:00","InTime":"2014-04-01T06:40:00","Number":"2567","WayTime":170,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"LED","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Ukraine Airline","TransporterCode":"PS","TransporterLogo":"Ukraine Airline.gif","OutPort":"Мюнхен","InPort":"Борисполь","OutTime":"2014-04-05T13:45:00","InTime":"2014-04-05T17:10:00","NextTime":"2014-04-05T19:25:00","Number":"416","WayTime":145,"VehicleName":"Boeing 737-528","TransferWaitTime":135,"OutCode":"MUC","InCode":"KBP","OutCity":"","OutCityCode":"","InCityCode":"IEV","InCity":"Киев"},{"TransporterName":"Ukraine Airline","TransporterCode":"PS","TransporterLogo":"Ukraine Airline.gif","OutPort":"Борисполь","InPort":"Домодедово","OutTime":"2014-04-05T19:25:00","InTime":"2014-04-05T22:00:00","Number":"575","WayTime":95,"VehicleName":"Boeing 737-85R","TransferWaitTime":0,"OutCode":"KBP","InCode":"DME","OutCity":"Киев","OutCityCode":"IEV","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710270,"VariantId2":773710363,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs47ySB5BwKZWFRJ%2b5qEdg5DvrLXwPRyY%2bNHqyPXN0zbq4%3d","IsNightFlight":true,"IsDiferentPort":true,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"},{"DepartureDate":"2014-03-31T23:10:00","ArrivalDate":"2014-04-01T08:05:00","BackDepartureDate":"2014-04-05T14:25:00","BackArrivalDate":"2014-04-05T22:35:00","ToTransferCount":1,"BackTransferCount":1,"CityFrom":"Москва","AirportFrom":"Внуково","CityTo":"Мюнхен","AirportTo":"Мюнхен","CabineClass":"Бизнес","Price":265870.0,"IsRecomendation":false,"IsPartialPay":false,"FirstPartialPay":0.0,"TimeTo":655,"TimeBack":370,"EtapsTo":[{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Внуково","InPort":"Стамбул","OutTime":"2014-03-31T23:10:00","InTime":"2014-04-01T01:10:00","NextTime":"2014-04-01T06:20:00","Number":"801","WayTime":180,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":310,"OutCode":"VKO","InCode":"IST","OutCity":"Москва","OutCityCode":"MOW","InCityCode":"","InCity":""},{"TransporterName":"Lufthansa","TransporterCode":"LH","TransporterLogo":"Lufthansa.gif","OutPort":"Стамбул","InPort":"Мюнхен","OutTime":"2014-04-01T06:20:00","InTime":"2014-04-01T08:05:00","Number":"1775","WayTime":165,"VehicleName":"Airbus A320-211","TransferWaitTime":0,"OutCode":"IST","InCode":"MUC","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""}],"EtapsBack":[{"TransporterName":"Air Dolomiti","TransporterCode":"EN","TransporterLogo":"","OutPort":"Мюнхен","InPort":"Венеция","OutTime":"2014-04-05T14:25:00","InTime":"2014-04-05T15:25:00","NextTime":"2014-04-05T17:10:00","Number":"8204","WayTime":60,"VehicleName":"Embraer Emb-195-200LR","TransferWaitTime":105,"OutCode":"MUC","InCode":"VCE","OutCity":"","OutCityCode":"","InCityCode":"","InCity":""},{"TransporterName":"Transaero","TransporterCode":"UN","TransporterLogo":"Transaero.gif","OutPort":"Венеция","InPort":"Внуково","OutTime":"2014-04-05T17:10:00","InTime":"2014-04-05T22:35:00","Number":"394","WayTime":205,"VehicleName":"Boeing 737-7Q8","TransferWaitTime":0,"OutCode":"VCE","InCode":"VKO","OutCity":"","OutCityCode":"","InCityCode":"MOW","InCity":"Москва"}],"VariantId1":773710231,"VariantId2":773710463,"Url":"https://test.inna.ru/Buy?data=C6eUqfEj8U6Epz2tJ3MSjXfalB4LZNs4GbGPdtEAh0Yq9LGJIYtKicocMp8nLwddid5h5tmy%2fbM%3d","IsNightFlight":false,"IsDiferentPort":false,"IsLongTransfer":false,"InCode":"MUC","OutCode":"VKO"}]}';
﻿
cacheKeys = {
    getDirectoryByUrl: function (term) {
        return 'getDirectoryByUrl:' + term;
    },
    getGeneric: function (namespace, val) {
        return namespace + ':' + val;
    }
};
_.generateRange = function (start, end) {
    var list = [start];
    if (start < end) {
        while (start < end) {
            start++;
            list.push(start);
        }
    }
    return list;
}

_.dropEmptyKeys = function(obj, supposeEmpty) {
    for(var p in obj) if(obj.hasOwnProperty(p)) {
        if(!obj[p]) delete obj[p];
    }

    return obj;
}

_.flattenObject = function(obj, _prefix, _result) {
    _result = _result || {}
    _prefix = _prefix || '';

    for(var p in obj) if(obj.hasOwnProperty(p)) {
        var key = _prefix && [_prefix, p].join('.') || p;

        if(_.isObject(obj[p]) && !_.isArray(obj[p])) {
            _.flattenObject(obj[p], key, _result);
        } else {
            _result[key] = obj[p];
        }
    }

    return _result;
};

_.dropByJPath = function(object, jPath){
    var dropper = new Function('obj', 'delete obj.' + jPath);

    dropper(object);

    return object;
}

_.provide = function(jPath){
    var bits = jPath.split('.');
    var bit, o = window;

    while(bit = bits.shift()) {
        o = o[bit] || (o[bit] = {});
    }

    return o;
}
﻿var dateHelper = {
    apiDateToJsDate: function (dParam) {
        //"2014-01-31T20:45:00"
        if (dParam != null) {
            //разделяем дату и время
            var parts = dParam.split('T');
            if (parts.length == 2) {
                var sDate = parts[0];
                var sTime = parts[1];

                //дата
                var dParts = sDate.split('-');
                if (dParts.length == 3) {
                    //день
                    var d = parseInt(dParts[2], 10);
                    //месяц (в js месяцы начинаются с 0)
                    var m = parseInt(dParts[1], 10) - 1;
                    //год
                    var y = parseInt(dParts[0], 10);

                    //время
                    var tParts = sTime.split(':');
                    if (tParts.length == 3) {
                        var h = parseInt(tParts[0], 10);
                        var mm = parseInt(tParts[1], 10);
                        var ss = parseInt(tParts[2], 10);

                        var res = new Date(y, m, d, h, mm, ss);
                        return res;
                    }
                }
            }
        }

        return null;
    },

    dateToApiDate: function (date) {
        if (date != null) {
            var parts = date.split('.');
            var apiDate = parts[2] + '-' + parts[1] + '-' + parts[0];
            return apiDate;
        }
        else
            return null;
    },

    dateToSletatDate: function (date) {
        if (date != null) {
            var parts = date.split('.');
            var apiDate = parts[0] + '/' + parts[1] + '/' + parts[2];
            return apiDate;
        }
        else
            return null;
    },

    sletatDateToDate: function (date) {
        if (date != null) {
            var parts = date.split('/');
            var apiDate = parts[0] + '.' + parts[1] + '.' + parts[2];
            return apiDate;
        }
        else
            return null;
    },

    jsDateToDate: function (date) {
        function addZero(val) {
            if (val < 10)
                return '0' + val;
            return '' + val;
        };
        var curr_date = date.getDate();
        var curr_month = date.getMonth() + 1; //Months are zero based
        var curr_year = date.getFullYear();
        return (addZero(curr_date) + "." + addZero(curr_month) + "." + curr_year);
    },

    dateToJsDate: function (sDate) {
        var dParts = sDate.split('.');
        if (dParts.length == 3) {
            //день
            var d = parseInt(dParts[0], 10);
            //месяц (в js месяцы начинаются с 0)
            var m = parseInt(dParts[1], 10) - 1;
            //год
            var y = parseInt(dParts[2], 10);

            var res = new Date(y, m, d);
            return res;
        }
    },

    getTimeSpanFromMilliseconds: function (ms) {
        var x = ms / 1000;
        var seconds = Math.floor(x % 60);
        x /= 60;
        var minutes = Math.floor(x % 60);
        x /= 60;
        var hours = Math.floor(x % 24);
        x /= 24;
        var days = Math.floor(x);
        x /= 365;
        var years = Math.floor(x);
        return { seconds: seconds, minutes: minutes, hours: hours, days: days, years: years };
    },

    getTimeSpanMaxDays: function (ts){
        var days = ts.days;
        if (ts.hours > 0 || ts.minutes > 0 || ts.seconds > 0)
            days++;
        return days;
    },

    getTodayDate: function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        return new Date(yyyy, mm, dd);
    },

    calculateAge: function (birthday, now) {
        if (now == null) {
            now = new Date();
        }
        var years = now.getFullYear() - birthday.getFullYear();

        var now_m = now.getMonth();
        var now_d = now.getDate();
        var b_m = birthday.getMonth();
        var b_d = birthday.getDate();

        if (b_m < now_m){
            years++;
        }
        else if (b_m == now_m && b_d < now_d) {
            years++;
        }

        return years;
    },

    ddmmyyyy2yyyymmdd: function(ddmmyy){
        function trailingZero(n) {
            return n > 10 ? n : ('0' + n);
        }

        var date = Date.fromDDMMYY(ddmmyy);

        //console.log(date);
        //console.log(date.getFullYear());
        //console.log(date.getMonth() + 1, trailingZero(date.getMonth() + 1));
        //console.log(date.getDate(), trailingZero(date.getDate()));

        return [date.getFullYear(), trailingZero(date.getMonth() + 1), trailingZero(date.getDate())].join('-');
    },

    isHoursBetween: function(date) {
        var start, end;

        if(!(date instanceof Date)) {
            date = dateHelper.apiDateToJsDate(date);
        }

        if(arguments[1] instanceof Array) {
            start = arguments[1][0];
            end = arguments[1][1];
        } else {
            start = arguments[1];
            end = arguments[0];
        }

        var h = date.getHours();

        return start < end ? (h >= start && h < end) : (h >= start || h < end);
    },

    translateMonth: function(n) {
        return [
            'января', 'февраля', 'марта',
            'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября',
            'октября', 'ноября', 'декабря'
        ][n]
    },

    translateMonthShort: function(n) {
        return [
            'янв', 'фев', 'мар',
            'апр', 'мая', 'июн',
            'июл', 'авг', 'сен',
            'окт', 'ноя', 'дек'
        ][n]
    },

    translateDay: function(n){
        return ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][n]
    },

    getTime: function(date) {
        return [date.getHours(), date.getMinutes()].map(function(val){
            if(val % 10 == val) return '' + '0' + val;

            return val;
        }).join(':');
    },

    getDateShort: function(date) {
        return [date.getDate(), dateHelper.translateMonth(date.getMonth())].join(' ');
    },

    getDay: function(date){
        return dateHelper.translateDay(date.getDay());
    },

    eof: null
};

Date.fromDDMMYY = function(ddmmyy, asTS){
    var bits = ddmmyy.split('.');
    var mmddyy = [+bits[1], +bits[0], +bits[2]].join('.');
    //var date = new Date(mmddyy);//в IE invalid date
    var date = new Date(+bits[2], (+bits[1]-1), +bits[0]);

    if(asTS) return +date;

    return date;
};
if(!_.isFunction(String.prototype.trim)) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

if(!_.isFunction(String.prototype.startsWith)) {
    String.prototype.startsWith = function(s){
        return (this.indexOf(s) == 0);
    }
}
﻿
QueryString = {
    getByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    getFromUrlByName: function (url, name) {
        function cutBeforeQestion(url) {
            var ind = url.indexOf('?');
            if (ind > -1) {
                url = url.substring(ind + 1, url.length);
            }
            return url;
        }
        //отрезаем все, что слева от ?, берем только параметры
        url = cutBeforeQestion(url);
        var query = url;
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == name) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    }
};

//console.log(UrlHelper.UrlToHotelDetail(1, 1));
//console.log(UrlHelper.UrlToSearch({
//	FromCity: 1, ToCountry: 1, ToRegion: 1, StartMinString: 1, StartDateVariance: 1,
//	AdultNumber: 1, ChildAgesString: 1, DurationMin: 1, HotelStarsMin: 2, HotelStarsMax: 3
//}));
var utils = {
    loader: function () {
        var self = this;
        self = {
            callback: null,
            fnList: null,
            init: function (fnList, fnCallback) {
                var self = this;
                self.callback = fnCallback;

                self.fnList = [];
                _.each(fnList, function (fn) {
                    self.fnList.push({ isLoaded: false, fn: fn });
                });
                return self;
            },
            complete: function (fn) {
                var self = this;
                var fnItem = _.find(self.fnList, function (item) {
                    return item === fn;
                });
                if (fnItem != null) {
                    fnItem.isLoaded = true;
                    var allLoaded = _.all(self.fnList, function (item) { return item.isLoaded == true; });
                    if (allLoaded && self.callback != null) {
                        self.callback();
                    }
                }
            },
            run: function () {
                _.each(this.fnList, function (item) {
                    item.fn();
                });
            }
        };
        return self;
    },

    normalize: function(data){
        var normData = {};
        _.each(_.keys(data), function (key) {
            normData[key] = '' + data[key];
        });
        data = normData;
        return data;
    },

    getScrollTop: function(){
        return document.body.scrollTop || document.documentElement.scrollTop;
    },

    eof: null
};
﻿
//параметры для серверной фильтрации
function aviaCriteria(data) {
    var self = this;
    data = data || {};

    self.From = data.From;
    self.FromId = data.FromId;
    self.FromUrl = data.FromUrl;
    self.To = data.To;
    self.ToId = data.ToId;
    self.ToUrl = data.ToUrl;
    self.BeginDate = data.BeginDate;
    self.EndDate = data.EndDate;
    self.AdultCount = data.AdultCount;
    self.ChildCount = data.ChildCount;
    self.InfantsCount = data.InfantsCount;
    self.CabinClass = data.CabinClass;
    self.IsToFlexible = data.IsToFlexible;
    self.IsBackFlexible = data.IsBackFlexible;
    self.PathType = data.PathType;

    //для покупки
    self.QueryId = data.QueryId;
    self.VariantId1 = data.VariantId1;
    self.VariantId2 = data.VariantId2;
    self.OrderNum = data.OrderNum;

    self.toJson = function () { return angular.toJson(self); };
};

//параметры для клиентской фильтрации
function aviaFilter(data) {
    var self = {};

    //поля по-умолчанию
    self.minPrice = null;
    self.maxPrice = null;
    //количество пересадок
    self.ToTransferCount = null;
    self.BackTransferCount = null;
    //а/к
    //
    //время отправления ТУДА
    //self.DepartureDate = null;
    ////время прибытия ТУДА
    //self.ArrivalDate = null;
    ////время отправления ОБРАТНО
    //self.BackDepartureDate = null;
    ////время прибытия ОБРАТНО
    //self.BackArrivalDate = null;
    self.minDepartureDate = null;
    self.maxDepartureDate = null;
    self.minArrivalDate = null;
    self.maxArrivalDate = null;
    self.minBackDepartureDate = null;
    self.maxBackDepartureDate = null;
    self.minBackArrivalDate = null;
    self.maxBackArrivalDate = null;

    //дата отправления
    //дата прибытия
    //аэропорты

    //для фильтра {value:0, checked: true}
    self.ToTransferCountList = null;
    self.BackTransferCountList = null;
    //список: [без пересадок, 1 пересадка, 2 и более]
    self.ToTransferCountListAgg = null;
    self.BackTransferCountListAgg = null;
    //список авиакомпаний
    self.TransporterList = null;

    //присваиваем переданные значения
    angular.extend(self, data);

    //для фильтра
    self.minPriceInitial = self.minPrice;
    self.maxPriceInitial = self.maxPrice;
    //время отправления туда / обратно
    self.minDepartureDateInitial = self.minDepartureDate;
    self.maxDepartureDateInitial = self.maxDepartureDate;
    self.minArrivalDateInitial = self.minArrivalDate;
    self.maxArrivalDateInitial = self.maxArrivalDate;
    self.minBackDepartureDateInitial = self.minBackDepartureDate;
    self.maxBackDepartureDateInitial = self.maxBackDepartureDate;
    self.minBackArrivalDateInitial = self.minBackArrivalDate;
    self.maxBackArrivalDateInitial = self.maxBackArrivalDate;

    return self;
};

//ававкомпания для фильтра
function transporter(name, code, logo) {
    var self = this;
    self.TransporterName = name;
    self.TransporterCode = code;
    self.TransporterLogo = logo;
    self.checked = false;//выбрано по-умлочанию
};

//namespace
var avia = {
    useAviaServiceStub: false,
    dateFormat: 'dd MMMM yyyy, EEE',
    timeFormat: 'HH:mm',
    sortType: {
        byRecommend: ['-IsRecomendation', 'RecommendedFactor', 'sort.DepartureDate', 'sort.ArrivalDate'],
        byPrice: ['Price', 'sort.DepartureDate', 'sort.ArrivalDate'],
        byTripTime: ['TimeTo', 'Price', 'sort.DepartureDate', 'sort.ArrivalDate'],
        byDepartureTime: 'sort.DepartureDate',
        byBackDepartureTime: 'sort.BackDepartureDate',
        byArrivalTime: 'sort.ArrivalDate',
        byBackArrivalTime: 'sort.BackArrivalDate'
    },

    endOfClass: null
};


/*
* Other way
* */
_.provide('inna.Models.Avia');

inna.Models.Avia.TicketCollection = inna.Models._CollectionFactory();

inna.Models.Avia.TicketCollection.prototype.search = function(id1, id2){
    return this.advancedSearch(function(ticket){
        return ((ticket.data.VariantId1 == id1) && (ticket.data.VariantId2 == id2));
    });
};

inna.Models.Avia.TicketCollection.prototype.advancedSearch = function(criteria){
    var DEFAULT = null;
    var ticket = DEFAULT;

    for(var i = 0; ticket = this.list[i++];) {
        if(criteria(ticket)) break;
    }

    return ticket || DEFAULT;
}

inna.Models.Avia.TicketCollection.prototype.getMinPrice = function(){
    var min = Number.MAX_VALUE;

    for(var i = 0, ticket = null; ticket = this.list[i++];) {
        if(ticket.data.Price < min) min = ticket.data.Price;
    }

    return min;
};

inna.Models.Avia.TicketCollection.prototype.getMaxPrice = function(){
    var max = 0;

    for(var i = 0, ticket = null; ticket = this.list[i++];) {
        if(ticket.data.Price > max) max = ticket.data.Price;
    }

    return max;
};

inna.Models.Avia.TicketCollection.prototype.getVisibilityInfo = function(){
    var o = {}
    o.total = this.list.length
    o.visible = o.total;

    this.each(function(ticket){
        if(ticket.hidden) o.visible--;
    });

    return o;
};

inna.Models.Avia.TicketCollection.prototype.sort = function(sortingFn){
    console.log(this);
    this.list.sort(sortingFn);
}

inna.Models.Avia.Ticket = function (){
    this.data = null;
    this.hidden = false;
};

inna.Models.Avia.Ticket.prototype.setData = function(data) {
    this.data = angular.copy(data);

    if(this.data) {
        for(var i = 0, dir = ''; dir = ['To', 'Back'][i++];) {
            var etaps = this.data['Etaps' + dir];

            for(var j = 0, len = etaps.length; j < len; j++) {
                etaps[j] = new inna.Models.Avia.Ticket.Etap(etaps[j]);
            }
        }
        this.data.ArrivalDate = dateHelper.apiDateToJsDate(this.data.ArrivalDate);
        this.data.BackArrivalDate = dateHelper.apiDateToJsDate(this.data.BackArrivalDate);
        this.data.DepartureDate = dateHelper.apiDateToJsDate(this.data.DepartureDate);
        this.data.BackDepartureDate = dateHelper.apiDateToJsDate(this.data.BackDepartureDate);
    }
};

inna.Models.Avia.Ticket.__getDuration = function(raw, hoursIndicator, minutesIndicator){
    var hours = Math.floor(raw / 60);
    var mins = raw % 60;

    return hours + ' ' + hoursIndicator + (
        mins ? (' ' + mins + ' ' + minutesIndicator) : ''
        );
};

inna.Models.Avia.Ticket.prototype.getDuration = function(dir){
    return inna.Models.Avia.Ticket.__getDuration(this.data['Time' + dir], 'ч.', 'мин.');
};

inna.Models.Avia.Ticket.prototype.getDate = function(dir, type){
    dir = {'To': '', 'Back': 'Back'}[dir]
    type = [dir, type, 'Date'].join('');

    return this.data[type];
}

inna.Models.Avia.Ticket.prototype.getEtaps = function(dir) {
    return this.data['Etaps' + dir];
};

inna.Models.Avia.Ticket.prototype.everyEtap = function(cb){
    for(var i = 0, dir = '', etaps = null; (dir = ['To', 'Back'][i++]) && (etaps = this.getEtaps(dir));) {
        for(var j = 0, etap = null; etap = etaps[j++];) {
            cb.call(this, etap);
        }
    }
}

inna.Models.Avia.Ticket.prototype.getNextEtap = function(dir, current){
    var etaps = this.getEtaps(dir);
    var i = etaps.indexOf(current);

    return etaps[++i];
};

inna.Models.Avia.Ticket.prototype.collectAirlines = function(){
    var airlines = [];

    for(var i = 0, dir = null; dir = ['To', 'Back'][i++];) {
        for(var j = 0, etap = null; etap = this.data['Etaps' + dir][j++];) {
            airlines.push([etap.data.TransporterCode, etap.data.TransporterName]);
        }
    }

    return _.object(airlines);
};

inna.Models.Avia.Ticket.Etap = function(data){
    this.data = data;
};

inna.Models.Avia.Ticket.Etap.prototype.getDateTime = function(dir) {
    return dateHelper.apiDateToJsDate(this.data[dir + 'Time']);
};

inna.Models.Avia.Ticket.Etap.prototype.getDuration = function(){
    return inna.Models.Avia.Ticket.__getDuration(this.data.WayTime, 'ч.', 'м');
};

inna.Models.Avia.Ticket.Etap.prototype.getLegDuration = function(){
    var a = dateHelper.apiDateToJsDate(this.data.InTime);
    var b = dateHelper.apiDateToJsDate(this.data.NextTime);
    var diffMSec = b - a;
    var diffMin = Math.floor(diffMSec / 60000);

    return inna.Models.Avia.Ticket.__getDuration(diffMin, 'ч.', 'мин.');
};

_.provide('inna.Models.Avia.Filters');

inna.Models.Avia.Filters.FilterSet = function(){
    this.filters = [];
};

inna.Models.Avia.Filters.FilterSet.prototype.add = function(filter){
    this.filters.push(filter);

    return filter;
};

inna.Models.Avia.Filters.FilterSet.prototype.each = function(fn) {
    for(var i = 0, filter = null; filter = this.filters[i++];) {
        fn(filter);
    }
}

inna.Models.Avia.Filters.Filter = function(name){
    this.name = name;
    this.defaultValue = null;
    this.options = null;
    this.filterFn = angular.noop;
};

inna.Models.Avia.Filters.Filter.prototype.reset = function(){
    this.options.each(function(option){
        option.selected = false;
    });
};

inna.Models.Avia.Filters._OptionFactory = function(init){
    var Option = function(title){
        this.title = title;
        this.shown = false;
        this.selected = false;

        if(init) init.apply(this, arguments);
    };

    return Option;
};

inna.Models.Avia.Filters._OptionsFactory = function(){
    var Options = function(options){
        this.options = options || [];
    };

    Options.prototype.push = function(option){
        this.options.push(option);
    }

    Options.prototype.each = function(fn){
        for(var i = 0, option = null; option = this.options[i++];) {
            fn(option);
        }
    };

    Options.prototype.getSelected = function(){
        var newSet = new Options();

        this.each(function(option){
            if(option.selected) newSet.push(option);
        });

        return newSet;
    }

    Options.prototype.hasSelected = function(){
        var hasSelected = false;

        this.each(function(option){
            hasSelected = hasSelected || option.selected;
        });

        return hasSelected;
    }

    Options.prototype.reset = function(){
        this.each(function(option, undefined){
            if(option.reset) {
                option.reset();
            } else {
                option.selected = false;
            }
        });
    }

    Options.prototype.hasManyShownOptions = function(){
        var has = 0;

        this.each(function(option){
            option.shown && has++;
        });

        return has > 1;
    }

    return Options;
}
_.provide('inna.Models.Hotels');

inna.Models.Hotels.HotelsCollection = inna.Models._CollectionFactory();

inna.Models.Hotels.HotelsCollection.prototype.getMinPrice = function(){
    var min = Number.MAX_VALUE;

    this.each(function(hotel){
        var price = hotel.data.PackagePrice;

        if(price < min) min = price;
    });

    return min;
};

inna.Models.Hotels.HotelsCollection.prototype.getMaxPrice = function(){
    var max = 0;

    this.each(function(hotel){
        var price = hotel.data.PackagePrice;

        if(price > max) max= price;
    });

    return max;
};

inna.Models.Hotels.HotelsCollection.prototype.getVisibilityInfo = function(){
    var o = {}
    o.total = this.list.length
    o.visible = o.total;

    this.each(function(hotel){
        if(hotel.hidden) o.visible--;
    });

    return o;
};

inna.Models.Hotels.HotelsCollection.prototype.sort = function(sortingFn){
    this.list.sort(sortingFn);
}

inna.Models.Hotels.HotelsCollection.prototype.hasNext = function(hotel){
    return !!this.getNext(hotel);
}

inna.Models.Hotels.HotelsCollection.prototype.getNext = function(hotel){
    var index = this.list.indexOf(hotel);

    while(++index) {
        var next = this.list[index];

        if(!next) return null;

        if(!next.hidden) return next;
    }

    return null;
}

inna.Models.Hotels.HotelsCollection.prototype.search = function(id){
    for(var i = 0, hotel = null; hotel = this.list[i++];) {
        if(hotel.data.HotelId == id) return hotel;
    }

    return null;
}

inna.Models.Hotels.Hotel = function(raw) {
    this.data = raw;

    this.data.CheckIn = dateHelper.apiDateToJsDate(this.data.CheckIn);
    this.data.CheckOut = dateHelper.apiDateToJsDate(this.data.CheckOut);
};

inna.Models.Hotels.Hotel.prototype.toJSON = function(){
    return this.data;
}

_.provide('inna.Models.Dynamic');

inna.Models.Dynamic.Combination = function(){
    this.ticket = null;
    this.hotel = null;
}

inna.Models.Dynamic.Combination.prototype.setTicket = function(ticket){
    this.ticket = ticket;
}

inna.Models.Dynamic.Combination.prototype.setHotel = function(hotel) {
    this.hotel = hotel;
}

inna.Models.Dynamic.Combination.prototype.parse = function(data){
    
}

inna.Models.Dynamic.Combination.prototype.getFullPackagePrice = function(){
    return +this.ticket.data.PackagePrice + +this.hotel.data.PackagePrice;
}

inna.Models.Dynamic.Combination.prototype.getFullPrice = function(){
    return +this.ticket.data.Price + +this.hotel.data.Price;
}
﻿//параметры для серверной фильтрации
function criteria(data) {
    var self = this;
    data = data || {};

    self.FromCity = data.FromCity;
    self.FromCityId = data.FromCityId;
    self.FromCityUrl = data.FromCityUrl;
    self.ToCountry = data.ToCountry;
    self.ToCountryId = data.ToCountryId;
    self.ToCountryUrl = data.ToCountryUrl;
    self.ToRegion = data.ToRegion;
    self.ToRegionId = data.ToRegionId;
    self.ToRegionUrl = data.ToRegionUrl;

    self.StartMinString = data.StartMinString;
    self.StartDateVariance = data.StartDateVariance;
    self.AdultNumber = data.AdultNumber;
    self.ChildAgesString = data.ChildAgesString;
    self.DurationMin = data.DurationMin;

    //это уйдет в фильтры
    //self.HotelStarsMin = data.HotelStarsMin;
    //self.HotelStarsMax = data.HotelStarsMax;


    //self.errorMessage = ko.observable();

    self.toJson = function () {
        return angular.toJson(self);
    };
};

//параметры для клиентской фильтрации
function filter(data) {
    var self = this;

    //поля по-умолчанию
    self.hotelName = null;
    self.minPrice = null;
    self.maxPrice = null;
    self.mealsList = null;
    self.tourOperatorsList = null;
    self.starsList = null;
    self.hotelStarsMin = 1;
    self.hotelStarsMax = 5;
    self.services = { Internet: false, Pool: false, Aquapark: false, Fitness: false, ForChild: false };

    //присваиваем переданные значения
    angular.extend(self, data);
};

function hotel(data) {
    var self = this;
    data = data || {};

    self.HotelId = data.HotelId;
    self.HotelName = data.HotelName;
    self.MainPhoto = data.Hotel.MainPhoto;
    self.OriginalPhoto = data.Hotel.OriginalPhoto;
    self.Description = data.Hotel.description;
    self.Stars = data.Hotel.stars;
    self.Meals = data.Hotel.Meals;
    self.Properties = data.Hotel.Properties;

    self.Country = data.Hotel.Country;
    self.Region = data.Hotel.Region;
    self.City = data.Hotel.City;
    self.Services = data.Hotel.Services;

    self.Tours = data.Tours;

    self.TourCount = data.Tours.length;

    // min price by tours
    self.Price = 0;
    //все цены туров
    self.Prices = [];

    self.FilteredMinPrice = 0;

    //находим мин цену
    angular.forEach(data.Tours, function (item, key) {
        var value = parseFloat(item.Price != null ? item.Price.Value : null);

        if (!isNaN(value) && (value < self.Price || self.Price == 0)) {
            self.Price = value;
        }

        //ну и просто все цены
        if (!isNaN(value))
            self.Prices.push(value);
    });

    self.FilteredMinPrice = self.Price;
    //self.errorMessage = ko.observable();

    self.toJson = function () {
        return angular.toJSON(self);
    };
};
function hotelDetail(data) {
    var self = this;
    data = data || {};

    self.HotelId = data.HotelId;
    self.HotelName = data.HotelName;
    self.MainPhoto = data.Hotel.MainPhoto;
    self.OriginalPhoto = data.Hotel.OriginalPhoto;
    self.Description = data.Hotel.description;
    self.Stars = data.Hotel.stars;
    self.ServiceDescription = data.Hotel.service_description;
    self.RoomsDescription = data.Hotel.rooms_description;
    self.RoomService = data.Hotel.rooms_service;
    self.Meals = data.Hotel.Meals;
    self.Properties = data.Hotel.Properties;
    self.Tours = data.Tours;

    self.toJson = function () {
        return angular.toJSON(self);
    };
};


function tour(data) {
    var self = this;
    data = data || {};

    self.Id = data.Id,
        self.TourName = data.TourName,
        self.Price = data.Price != null ? data.Price.Value : null,
        self.Currency = data.Price != null ? data.Price.Currency : null,
        self.ProviderId = data.ProviderId,
        self.RoomName = data.RoomName,
        self.StartDate = data.StartDate,
        self.HotelName = data.HotelName,
        self.HotelStarsName = data.HotelStarsName,
        self.MomentConfirm = data.MomentConfirm,
        self.MealKey = data.MealKey,
        self.SearchId = data.SearchId,

        self.toJson = function () {
            return angular.toJSON(self);
        };
};

function tourDetail(data) {
    var self = this;
    data = data || {};


    self.SearchId = data.SearchId;
    self.HotelId = data.HotelId;
    self.TourId = data.TourId;
    self.Passengers = data.Passengers;

    self.I = data.I;
    self.F = data.F;
    self.Email = data.Email;
    self.Phone = data.Phone;


    var tour = data.TourDetailResult;
    self.Id = tour.Id,
        self.TourName = tour.TourName,
        self.Price = tour.Price != null ? tour.Price.Value : null,
        self.Currency = tour.Price != null ? tour.Price.Currency : null,
        self.ProviderId = tour.ProviderId,
        self.StartDate = tour.StartDate,
        self.MomentConfirm = tour.MomentConfirm,
        self.MealKey = tour.MealKey,

        self.Hotel = tour.Hotel,
        self.TourDetail = tour.TourDetail,

        self.HotelDetail = tour.HotelDetail,
        self.HotelDetail.MainPhoto = tour.HotelDetail.MainPhoto != null ? tour.HotelDetail.MainPhoto : null,
        self.HotelDetail.Country = tour.HotelDetail.Country,
        self.HotelDetail.Region = tour.HotelDetail.Region,
        self.HotelDetail.City = tour.HotelDetail.City,

        self.DirectFlight = tour.DirectFlight;
    self.DirectFlightVariants = tour.DirectFlightVariants;
    self.ReturnFlight = tour.ReturnFlight;
    self.ReturnFlightVariants = tour.ReturnFlightVariants;

    self.ExtraCharges = tour.ExtraCharges;
    self.TourInsurance = tour.TourInsurance;
    self.TourInsuranceVariants = tour.TourInsuranceVariants;
    self.Services = tour.Services;
    self.ToAirportTransfer = tour.ToAirportTransfer;
    self.ToAirportTransferVariants = tour.ToAirportTransferVariants;
    self.FromAirportTransfer = tour.FromAirportTransfer;
    self.FromAirportTransferVariants = tour.FromAirportTransferVariants;

    self.toJson = function () {
        return angular.toJSON(self);
    };
};


function paymentPage(data) {
    var self = this;
    data = data || {};


    self.OrderId = data.OrderId;

    self.SearchId = data.SearchId;
    self.HotelId = data.HotelId;
    self.TourId = data.TourId;


    self.toJson = function () {
        return angular.toJSON(self);
    };
};

function TripKlass(val, display) {
    this.value = val;
    this.display = display;
}

TripKlass.ECONOM = 0;

TripKlass.BUSINESS = 1;

TripKlass.options = [new TripKlass(TripKlass.ECONOM, 'Эконом'), new TripKlass(TripKlass.BUSINESS, 'Бизнес')];

TripKlass.prototype.getOptions = function () {
    return TripKlass.options;
}

_.provide('inna.Models');

inna.Models._CollectionFactory = function () {
    function Collection() {
        this.list = [];
    };

    Collection.prototype.size = function () {
        return this.list.length;
    };

    Collection.prototype.push = function (smth) {
        this.list.push(smth);
    };

    Collection.prototype.flush = function () {
        this.list = [];
    };

    Collection.prototype.setList = function (list) {
        this.list = list;
    };

    Collection.prototype.getList = function () {
        return this.list;
    };

    Collection.prototype.toJSON = function () {
        var rawData = [];

        this.list.forEach(function (list) {
            if (list.toJSON) {
                rawData.push(list.toJSON());
            } else {
                rawData.push(list.data);
            }
        })
        return rawData;
    };

    Collection.prototype.each = function (fn) {
        for (var i = 0, item = null; item = this.list[i++];) {
            fn.call(this, item);
        }
    };

    Collection.prototype.filter = function (filters) {
        this._doFilter(filters);

        return this.list;
    };

    Collection.prototype._doFilter = _.throttle(function (filters) {
        this.each(function (item) {
            item.hidden = false;
        });

        this.each(function (item) {
            if (item.hidden) return; //already hidden;

            filters.each(function (filter) {
                if (!filter.options.hasSelected()) return; //nothing selected, filter isn't interesting

                filter.filterFn(item);
            });
        });
    }, 100);

    return Collection;
}

_.provide('inna.Models.Aux');

inna.Models.Aux.AttachedPopup = function (onOpen, elems, scope) {
    this.isOpen = false;
    this.onOpen = onOpen || angular.noop;

    if(elems && scope) this.__registerEvents(elems, scope);

}

inna.Models.Aux.AttachedPopup.prototype.toggle = function () {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
        this.onOpen();
    }
};

inna.Models.Aux.AttachedPopup.prototype.__registerEvents = function(elems, scope){
    var popup = this;
    var doc = $(document);
    var onDocClick = function(event){
        var isInsideComponent = false;

        elems.each(function(){
            isInsideComponent = isInsideComponent || $.contains(this, event.target) || this === event.target;

            if(isInsideComponent) return false;
        });

        if(!isInsideComponent) {
            popup.isOpen = false;
        }
    };

    doc.on('click', onDocClick);

    scope.$on('$destroy', function(){
        doc.off('click', onDocClick);
    });
}
﻿//маппинг моделей на модели для api
function aviaCriteriaToApiCriteria(data) {
    var self = this;
    data = data || {};

    self.FromCityName = data.From;
    self.FromId = data.FromId;
    self.FromCityUrl = data.FromUrl;
    self.ToCityName = data.To;
    self.ToId = data.ToId;
    self.ToCityUrl = data.ToUrl;
    self.BeginDate = data.BeginDate;
    self.ReturnDate = data.EndDate;
    self.AdultsNumber = data.AdultCount;
    self.ChildCount = data.ChildCount;
    self.BabyCount = data.InfantsCount;
    self.CabinClass = data.CabinClass;
    //self.IsFlexible = data.IsFlexible == 1 ? true : false;
    self.IsToFlexible = data.IsToFlexible == 1 ? true : false;
    self.IsBackFlexible = data.IsBackFlexible == 1 ? true : false;

    self.BeginDate = dateHelper.dateToApiDate(data.BeginDate);
    self.ReturnDate = dateHelper.dateToApiDate(data.EndDate);

};
﻿
var tours = {
    grid: {
        //htype: {
        //    main: 'main',
        //    big: 'big',//grid8
        //    med: 'med',//grid6
        //    small: 'small',//grid4
        //},
        //vtype: {
        //    main: 'main',
        //    full: 'full',
        //    advice: 'advice',
        //    small: 'small',
        //},
        blockType: {
            bR:"R",
            bXL:"XL",
            b2SL:"2SL",
            bL2S:"L2S",
            b2M:"2M",
            bLSS:"LSS",
            bSSL:"SSL",
            bL3L3L3:"L3L3L3",
            bP1P2P1:"P1P2P1",
            bP1P1P2:"P1P1P2",
            bP2P1P1:"P2P1P1"
        }
    },

    end: null
};

function gridItem(tourDesc, name, price, imgUrl) {
    var self = this;
    self.tourDesc = tourDesc;
    self.name = name;
    self.price = price;
    self.imgUrl = imgUrl;
}

function gridBlock(type, item1, item2, item3) {
    var self = this;
    self.type = type;
    self.item1 = item1;
    self.item2 = item2;
    self.item3 = item3;
}

function nvItem(value, name) {
    var self = this;
    self.value = value;
    self.name = name;
}

function idNameItem(id, name) {
    var self = this;
    self.id = id;
    self.name = name;
}

function fromItem(id, name, altName) {
    var self = this;
    self.id = id;
    self.name = name;
    self.altName = altName;
}

function toItem(id, name, type, countryId, countryName, resortId, resortName, codeIcao) {
    var self = this;
    self.id = id;
    self.name = name;
    self.type = type;
    self.countryId = countryId;
    self.countryName = countryName;
    self.resortId = resortId;
    self.resortName = resortName;
    self.codeIcao = codeIcao;
}

function toItemData(data) {
    var self = this;
    data = data || {};
    self.id = data.id;
    self.name = data.name;
    self.type = data.type;
    self.countryId = data.countryId;
    self.countryName = data.countryName;
    self.resortId = data.resortId;
    self.resortName = data.resortName;
    self.codeIcao = data.codeIcao;
}

toItemData.prototype.description = function() {
	var toItemType = { country: 'country', resort: 'resort', hotel: 'hotel' };
    var country = "";
    var resort = "";
    
    if (this.countryName != null) {
    	country = this.countryName;
    }
    
    if (this.resortName != null) {
    	resort = this.resortName;
    }
    
    

    if (this.type == toItemType.country)  {
    	return ", по всей стране";
    } else if (this.type == toItemType.resort) {
        return ", " + country;
    } else if (this.type == toItemType.hotel) {
        return ", " + country + ", " + resort;
    }
}

function nightItem(name, min, max) {
    var self = this;
    self.name = name;
    self.min = min;
    self.max = max;
}

function itCategoryRightItem(name, description, imgRight, textRight) {
    var self = this;
    self.name = name;
    self.description = description;
    self.imgRight = imgRight;
    self.textRight = textRight;
}

function sendRequestData(data) {
    var self = this;
    data = data || {};
    self.Email = data.email;
    self.Phone = data.phone;
    self.F = null;
    self.I = data.name;
    self.O = null;
    self.Description = data.comments;
    if (data.offer != null)
        self.LinkProduct = data.offer.Id;
    self.OffersCategoriesId = data.offersCategoriesId;
    self.IsSubscribe = data.isSubscribe;
}

//function gridItem(htype, vtype, tourDesc, name, price, imgUrl) {
//    var self = this;
//    self.htype = htype;
//    self.vtype = vtype;
//    self.tourDesc = tourDesc;
//    self.name = name;
//    self.price = price;
//    self.imgUrl = imgUrl;
//}
_.provide('inna.Models.Auth');

inna.Models.Auth.User = function(data){
    this.raw = {
        Email: data.Email,
        LastName: data.LastName,
        FirstName: data.FirstName,
        Phone: data.Phone,
        MessagesCount: data.MessagesCount,
        AgencyName: data.AgencyName,
        Type: data.Type,
        AgencyActive: data.AgencyActive,
        SupportPhone: data.SupportPhone
    };
};

inna.Models.Auth.User.prototype.displayName = function(){
    var bits = [], name = '';

    if(this.raw.FirstName) bits.push(this.raw.FirstName);
    if(this.raw.LastName) bits.push(this.raw.LastName);

    name = bits.join(' ');

    if(name) return name;

    return this.raw.Email;
}

inna.Models.Auth.User.prototype.isAgency = function () {
    return this.raw.AgencyName.length > 0 && this.raw.AgencyActive;
};
(function ($) {

    var methods = {
        init: function (options) {

        },
        destroy: function () {

        },
        reposition: function () {

        },
        show: function () {

        },
        hide: function () {

        },
        update: function (content) {

        }
    };


    $.fn.innaCarousel = function (options) {


        /** Settings */
        var settings = $.extend({
            'photoList': [],
            'style': {}
        }, options);


        var imageSize = settings.size || 'Large';
        var _holder = this.find('.b-carousel__holder');
        var _slider = this.find('.b-carousel__slider');
        var _sliderItemTotal = settings.photoList.length;
        var _sliderItemWidth = settings.style.width;
        var _sliderIndex = 0;
        var _itemTemplate = function (image_path, opt_class) {
            var templ = '<div class="b-carousel_item '+ opt_class +'">' +
                '<div class="b-carousel_item_image '+ opt_class +'_image" style="background-image: url(' + image_path + ');"></div>' +
                '</div>';

            return templ;
        };
        var fragment = document.createDocumentFragment();

        settings.photoList.forEach(function (photo) {
            if (photo) {
                var addClass = '';
                if(settings.map){
                    addClass = 'b-carousel_map_item';
                }
                var templ = _itemTemplate(photo[imageSize], addClass);
                var elem = $(templ)[0];
                elem.style.width = settings.style.width + 'px';
                elem.style.height = settings.style.height + 'px';
                fragment.appendChild(elem);
            }
        });

        _slider[0].appendChild(fragment);

        _holder.css({
            width: settings.style.width + 'px',
            height: settings.style.height + 'px'
        });
        _slider.css({
            width: (settings.photoList.length * settings.style.width + 10) + 'px',
            height: settings.style.height + 'px'
        });

        // количество фотографий
        this.find('.hotel-gallery-photo-button').html(settings.photoList.length);


        this.on('click', '.b-carousel__next', slideNext);
        this.on('click', '.b-carousel__prev', slidePrev);


        /**
         * Animate
         * @param index
         */
        var carouselSlide = function (index) {
            _slider.css({
                "-webkit-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                "-moz-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                "-ms-transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)",
                "transform": "translate3d(-" + (_sliderIndex * _sliderItemWidth) + "px, 0px, 0px)"
            });
        }


        /**
         * Slide next
         * @param evt
         */
        function slideNext(evt) {
            evt.preventDefault();

            _sliderIndex += 1;
            _sliderIndex = ( _sliderIndex > _sliderItemTotal - 1) ? 0 : _sliderIndex
            carouselSlide(_sliderIndex);
        }


        /**
         * Slide prev
         * @param evt
         */
        function slidePrev(evt) {
            evt.preventDefault();

            _sliderIndex -= 1;
            _sliderIndex = ( _sliderIndex < 0) ? _sliderItemTotal - 1 : _sliderIndex
            carouselSlide(_sliderIndex);
        }

    };
})(jQuery);

(function ($) {


    $.fn.iframe = function (options) {


        /** Settings */
        var settings = $.extend({
            'style': {}
        }, options);


        this.load(function() {

        });
    };
})(jQuery);

angular.module('innaApp.services')
    .factory('AuthDataProvider', [
        'innaApp.API.const', 'AjaxHelper',
        function(urls, AjaxHelper){
            return {
                signUp: function(data, callbackSuccess, callbackError){
                    AjaxHelper.postDebaunced(urls.AUTH_SIGN_UP, data, callbackSuccess, callbackError);
                },
                signIn: function(data, callbackSuccess, callbackError){
                    AjaxHelper.postDebaunced(urls.AUTH_SIGN_IN, data, callbackSuccess, callbackError);
                },
                sendToken: function(data, callbackSuccess, callbackError){
                    AjaxHelper.postDebaunced(urls.AUTH_RESTORE_A, data, callbackSuccess, callbackError);
                },
                setNewPassword: function(token, data, success, error){
                    AjaxHelper.postDebaunced(urls.AUTH_RESTORE_B + '?token=' + token, data, success, error);
                },
                socialBrockerURL: function(method){
                    return urls.AUTH_SOCIAL_BROKER +
                        '?provider=' + method +
                        '&returnUrl=' + encodeURIComponent(document.location.protocol + '//' + document.location.host + '/spa/closer.html');
                },
                confirmRegistration: function(token, callbackSuccess, callbackError) {
                    AjaxHelper.postDebaunced(urls.AUTH_SIGN_UP_STEP_2, {value: token}, callbackSuccess, callbackError);
                },
                logout: function(){
                    AjaxHelper.postDebaunced(urls.AUTH_LOGOUT);
                },
                changeInfo: function(data){
                    return AjaxHelper.postDebaunced(urls.AUTH_CHANGE_INFO, data);
                },
                recognize: function(success){
                    AjaxHelper.postDebaunced(urls.AUTH_RECOGNIZE, {}, success);
                },
                changePassword: function(data){
                    return AjaxHelper.postDebaunced(urls.AUTH_CHANGE_PASSWORD, data);
                }
            }
        }
    ])
﻿innaAppServices.
    factory('aviaService', ['$log', '$timeout', 'innaApp.API.const', 'AjaxHelper',
        function ($log, $timeout, urls, AjaxHelper) {
            function log(msg) {
                $log.log(msg);
            }

            return {
                getDirectoryByUrl: function (term, callbackSuccess, callbackError) {
                    AjaxHelper.get(urls.AVIA_FROM_SUGGEST, { term: term }, callbackSuccess, callbackError);
                },
                getObjectById: function (id, callbackSuccess, callbackError) {
                    AjaxHelper.get(urls.DYNAMIC_GET_OBJECT_BY_ID, { id: id }, callbackSuccess, callbackError);
                },
                eof: null
            };
        }]);
﻿innaAppServices.
    factory('dataService', ['$rootScope', '$http', '$q', '$log', 'cache', 'storageService', 'innaApp.API.const', 'urlHelper', 'AjaxHelper',
        function ($rootScope, $http, $q, $log, cache, storageService, apiUrls, urlHelper, AjaxHelper) {
            function log(msg) {
                $log.log(msg);
            }

            return {
                getAllCountries: function (successCallback, errCallback) {
                    $http.get(apiUrls.DICTIONARY_ALL_COUNTRIES, { cache: true }).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },
                getDirectoryByUrl: function (term, successCallback, errCallback) {
                    AjaxHelper.get(apiUrls.AVIA_FROM_SUGGEST, { term: term }, function (data) {
                        if (data != null && data.length > 0) {
                            //ищем запись с кодом IATA
                            var resItem = _.find(data, function (item) {
                                return item.CodeIata == term;
                            });
                            //если не нашли - берем первый
                            if (resItem == null)
                                resItem = data[0];

                            var urlKey = urlHelper.getUrlFromData(resItem);
                            //добавляем поле url
                            resItem.id = resItem.Id;
                            resItem.name = resItem.Name;
                            resItem.url = urlKey;

                            //присваиваем значение через функцию коллбэк
                            successCallback(resItem);
                        }
                        else {
                            errCallback(data, status);
                        }
                    }, errCallback);
                },

                getSletatDirectoryByTerm: function (term, successCallback, errCallback) {
                    //log('getSletatDirectoryByTerm: ' + term);
                    //принудительно энкодим
                    term = encodeURIComponent(term);
                    //запрос по критериям поиска
                    $http.get(getSletatUrl + '?term=' + term, { cache: true }).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                getSletatCity: function (successCallback, errCallback) {
                    //log('getSletatCity: ' + term);
                    //запрос по критериям поиска
                    $http.get(getSletatCityUrl, { cache: true }).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                getSletatById: function (id, successCallback, errCallback) {
                    //log('getSletatById: ' + term);
                    //запрос по критериям поиска
                    $http.get(getSletatByIdUrl + '?id=' + id, { cache: true }).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                startAviaSearch: function (criteria, successCallback, errCallback) {
                    //запрос по критериям поиска
                    var apiCriteria = new aviaCriteriaToApiCriteria(criteria);
                    //log('startAviaSearch, apiCriteria: ' + angular.toJson(apiCriteria));

                    //сначала проверяем в html5 storage
                    //var res = storageService.getAviaSearchResults(apiCriteria);
                    var res = null;
                    //проверяем что данные не старше минуты
                    if (res != null) {
                        successCallback(res);
                    }
                    else {
                        AjaxHelper.getCancelable(apiUrls.AVIA_BEGIN_SEARCH, apiCriteria, function (data, status) {
                            //сохраняем в хранилище (сохраняем только последний результат)
                            //storageService.setAviaSearchResults({ date: new Date().getTime(), criteria: apiCriteria, data: data });
                            //присваиваем значение через функцию коллбэк
                            successCallback(data);
                        }, function (data, status) {
                            //вызываем err callback
                            errCallback(data, status);
                        });
                    }
                },
                cancelAviaSearch: function() {
                    AjaxHelper.cancelRequest(apiUrls.AVIA_BEGIN_SEARCH);
                },
                startSearchTours: function (criteria, successCallback, errCallback) {
                    //запрос по критериям поиска
                    $http.post(beginSearchUrl, angular.toJson(criteria)).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                checkSearchTours: function (searchIdObj, successCallback, errCallback) {
                    $http.post(checkSearchUrl, angular.toJson(searchIdObj)).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },
                getLocationsByUrls: function (queryData, successCallback, errCallback) {
                    $http.post(getLocationByUrls, angular.toJson(queryData)).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },
                getHotelDetail: function (queryData, successCallback, errCallback) {
                    $http.post(hotelDetailUrl, angular.toJson(queryData)).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },
                getTourDetail: function (queryData, successCallback, errCallback) {
                    $http.post(tourDetailUrl, angular.toJson(queryData)).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },
                getOrder: function (queryData, successCallback, errCallback) {
                    //запрос по критериям поиска
                    $http.post(getOrderUrl, angular.toJson(queryData)).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                getPaymentPage: function (queryData, successCallback, errCallback) {
                    //запрос по критериям поиска
                    $http.post(paymentPageUrl, angular.toJson(queryData)).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                pay: function (queryData, successCallback, errCallback) {
                    $http.post(payUrl, angular.toJson(queryData)).success(function (data) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },
                getSectionTours: function (params, successCallback, errCallback) {
                    $http({ method: 'GET', url: apiUrls.GET_SECTION_TOURS, params: params, cache: true }).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                getSectionIndividualTours: function (params, successCallback, errCallback) {
                    $http({ method: 'GET', url: apiUrls.GET_SECTION_INDIVIDUAL_TOURS, params: params, cache: true }).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                getIndividualToursCategory: function (id, successCallback, errCallback) {
                    $http({ method: 'GET', url: apiUrls.GET_INDIVIDUAL_TOURS_CATEGORY + '/' + id, cache: true }).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                sendITCategoryRequest: function (queryData, successCallback, errCallback) {
                    var apiData = new sendRequestData(queryData);
                    $http.post(apiUrls.SEND_IT_CATEGORY_REQUEST, apiData).success(function (data) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                }
            };
        }]);

// TODO : передалть работу с куками на $cookieStore
// TODO : удалить $.cookie из проекта

innaAppServices.factory('DynamicPackagesCacheWizard', [
    function() {
        var PREFIX = 'DynamicPackagesCacheWizard__';

        var validators = {};

        validators.dateBegin = function(value){
            try{
                var date = Date.fromDDMMYY(value, true);

                return (date >= +(new Date()))
            } catch(e) {
                return false;
            }
        };

        validators.dateEnd = validators.dateBegin;

        var o = {
            require: function(key, ifNullCallback){
                var value = $.cookie(PREFIX + key) || null;

                value = o.validate(key, value);

                return o.notNull(value, ifNullCallback);
            },
            put: function(key, value){
                if(value !== null) {
                    $.cookie(PREFIX + key, value);
                } else {
                    o.drop(key);
                }

            },
            drop: function(key) {
                $.removeCookie(PREFIX + key);
            },
            validate: function(key, value){
                var validator = validators[key];

                if(!validator) return value;

                if(validator(value)) {
                    return value;
                } else {
                    o.drop(key);

                    return null;
                }
            },
            notNull: function(value, callback){
                if(value !== null || !callback) return value;
                else return callback();
            }
        }

        return o;
    }
]);
innaAppServices.factory('DynamicPackagesDataProvider', [
    'innaApp.API.const', '$timeout', 'AjaxHelper',
    function(api, $timeout, AjaxHelper){
        return {
            getFromListByTerm: function(term, callback) {
                AjaxHelper.getDebounced(api.DYNAMIC_FROM_SUGGEST, {term: term}, callback);
            },
            getToListByTerm: function(term, callback) {
                AjaxHelper.getDebounced(api.DYNAMIC_TO_SUGGEST, {term: term}, callback);
            },
            getObjectById: function(id, callback){
                AjaxHelper.get(api.DYNAMIC_GET_OBJECT_BY_ID, {id: id}, callback);
            },
            getUserLocation: function(callback){
                //TODO

                $timeout(function(){ callback(25); }, 500); // 25 is the fish! it's not a "magic" number

                return null;
            },
            search: function(o, callback, error){
                AjaxHelper.getDebounced(api.DYNAMIC_SEARCH, o, callback, error);
            },
            getHotelsByCombination: function(ticketId, params, callback){
                AjaxHelper.getDebounced(api.DYNAMIC_SEARCH_HOTELS, _.extend({Id: ticketId}, params), callback);
            },
            getTicketsByCombination: function(hotelId, params, callback){
                AjaxHelper.getDebounced(api.DYNAMIC_SEARCH_TICKETS, _.extend({Id: hotelId}, params), callback);
            },
            hotelDetails: function(hotelId, providerId, ticketToId, ticketBackId, searchParams, callback, error){
                AjaxHelper.get(api.DYNAMIC_HOTEL_DETAILS, {
                    HotelId: hotelId,
                    HotelProviderId: providerId,
                    TicketToId: ticketToId,
                    TicketBackId: ticketBackId,
                    Filter: searchParams
                }, callback, error);
            }
        }
    }
]);
angular.module('innaApp.services')
    .factory('DynamicFormSubmitListener', [
        '$rootScope', '$location', 'innaApp.Urls',
        function($rootScope, $location, appURLs){
            return {
                listen: function(){
                    $rootScope.$on('inna.DynamicPackages.Search', function(event, data){
                        $location.path(
                            appURLs.URL_DYNAMIC_PACKAGES_SEARCH +
                            [
                                data.DepartureId,
                                data.ArrivalId,
                                data.StartVoyageDate,
                                data.EndVoyageDate,
                                data.TicketClass,
                                data.Adult,
                                data.children.join('_')
                            ].join('-')
                        );
                    });
                }
            }
        }
    ]);
innaAppServices.
    factory('eventsHelper', ['$rootScope', '$http', '$log', function ($rootScope, $http, $log) {
        function log(msg) {
            $log.log(msg);
        }

        return {
            preventBubbling: function ($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            },
            preventDefault: function ($event) {
                if ($event.preventDefault) $event.preventDefault();
            }
        }
    }]);
angular.module('innaApp.services')
    .service('innaApp.services.PageContentLoader', [
        'innaApp.API.const', '$timeout',
        function(urls, $timeout){
            var cache = {};

            return {
                getSectionById: function(id, callback){
                    var url = urls["*_PAGE_CONTENT"] + id;

                    if(cache[url]) {
                        console.log('have page in cache');
                        //to make it async as recommended @ http://errors.angularjs.org/1.2.16/$rootScope/inprog?p0=%24digest
                        $timeout(function(){
                            callback(cache[url]);
                        });
                    } else {
                        console.log('do not have page in cache');
                        $.ajax({
                            url: url,
                            dataType: 'json',
                            method: 'get',
                            success: function(data){
                                cache[url] = data;

                                console.log('cache', cache);

                                callback(data);
                            }
                        });
                    }
                }
            }
        }
    ]);
﻿innaAppServices.
    factory('paymentService', ['$rootScope', '$timeout', '$http', '$q', '$log', 'cache', 'storageService', 'innaApp.API.const', 'AjaxHelper',
        function ($rootScope, $timeout, $http, $q, $log, cache, storageService, apiUrls, AjaxHelper) {
            function log(msg) {
                $log.log(msg);
            }

            return {
                checkAvailability: function (queryData, successCallback, errCallback) {
                    //проверяем что данные не старше минуты
                    var res = storageService.getAviaVariantCheck(queryData);
                    if (res != null) {
                        successCallback(res);
                    }
                    else {
                        AjaxHelper.getNoCache(apiUrls.AVIA_CHECK_AVAILABILITY, queryData, function (data) {
                            storageService.setAviaVariantCheck({ date: new Date().getTime(), params: queryData, data: data });
                            successCallback(data);
                        }, function (data, status) {
                            errCallback(data, status);
                        });
                    }
                },

                packageCheckAvailability: function (queryData, successCallback, errCallback){
                    AjaxHelper.getNoCache(apiUrls.PACKAGE_CHECK_AVAILABILITY, queryData, function (data) {
                        successCallback(data);
                    }, function (data, status) {
                            errCallback(data, status);
                    });
                },

                getTransportersInAlliances: function (queryData, successCallback, errCallback) {
                    $http.get(apiUrls.PURCHASE_TRANSPORTER_GET_ALLIANCE, { cache: false, params: { names: queryData } }).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },

                reserve: function (queryData, successCallback, errCallback) {
                    var qData = angular.toParam(queryData);
                    AjaxHelper.post(apiUrls.AVIA_RESERVATION, qData, function (data) {
                        successCallback(data);
                    }, function (data, status) {
                        errCallback(data, status);
                    });
                },

                packageReserve: function (queryData, successCallback, errCallback) {
                    var qData = angular.toParam(queryData);
                    AjaxHelper.post(apiUrls.PACKAGE_RESERVATION, qData, function (data) {
                        successCallback(data);
                    }, function (data, status) {
                        errCallback(data, status);
                    });
                },

                getSelectedVariant: function (queryData, successCallback, errCallback) {
                    AjaxHelper.getNoCache(apiUrls.AVIA_RESERVATION_GET_VARIANT, queryData, function (data, status) {
                        successCallback(data);
                    }, function (data, status) {
                        errCallback(data, status);
                    });
                },

                getPaymentData: function(queryData, successCallback, errCallback){
                    $http.get(apiUrls.AVIA_RESERVATION_GET_PAY_DATA, { cache: false, params: queryData }).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },

                pay: function (queryData, successCallback, errCallback) {
                    $http.post(apiUrls.AVIA_PAY, queryData).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },

                payCheck: function (orderNum, successCallback, errCallback) {
                    $http.post(apiUrls.AVIA_PAY_CHECK, { value: orderNum }).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },

                getTarifs: function (queryData, successCallback, errCallback) {
                    $http.get(apiUrls.AVIA_TARIFS, { cache: true, params: queryData }).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },

                eof: null
            };
        }]);
﻿angular.module('innaApp.services')
    .factory('Validators', [function(){
        return {
            email: function(s, error){
                if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,63})+$/i.test(s)) throw error;
            },
            defined: function(s, error){
                if(!s) throw error;
            },
            phone: function(s, error){
                if(!/^[+]\d{11,}$/.test(s)) throw error;//+79101234567
            },
            equals: function(s1, s2, error){
                if(s1 != s2) throw error;
            },
            notEqual: function(s1, s2, error){
                if(s1 == s2) throw error;
            },
            minLength: function(s, len, error){
                if(!s.length || s.length < len) throw error;
            },
            date: function (s, error) {
                if (!/^(\d{2})+\.(\d{2})+\.(\d{4})+$/.test(s)) throw error;//18.07.1976
            },
            gtZero: function (s, error) {
                var val = parseInt(s);
                if (isNaN(val) || val <= 0) throw error;
            },
            birthdate: function (s, error) {
                if (!/^(\d{2})+\.(\d{2})+\.(\d{4})+$/.test(s)) throw error;//18.07.1976

                //от 01.01.1900 до текущей даты
                var dParts = s.split('.');
                if (dParts.length == 3) {
                    var y = parseInt(dParts[2], 10);

                    var today = new Date();
                    var yyyy = today.getFullYear();
                    if (!(y >= 1900 && y <= yyyy))
                        throw error;
                }
            },
            expire: function (s, error) {
                if (!/^(\d{2})+\.(\d{2})+\.(\d{4})+$/.test(s)) throw error;//18.07.1976

                //Дата должна быть в диапазоне от текущей даты + 100 лет
                var dParts = s.split('.');
                if (dParts.length == 3) {
                    var y = parseInt(dParts[2], 10);

                    var today = new Date();
                    var yyyy = today.getFullYear();
                    if (!(y >= yyyy && y <= (yyyy + 100)))
                        throw error;
                }
            },
            ruPassport: function (s, error) {
                //10 цифр - российский паспорт
                if (!/^(\d{10})+$/.test(s)) throw error;
            },
            enPassport: function (s, error) {
                //9 цифр - загранпаспорт
                if (!/^(\d{9})+$/.test(s)) throw error;
            },
            birthPassport: function (s, error) {
                //буквы (хотя бы одна) + 6 последних цифр - св-во о рождении (II-ЛО 599785)
                if (!/^.*([а-яА-ЯёЁa-zA-Z]).*(\d{6})+$/.test(s)) throw error;
            },
        }
    }])
﻿
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
innaAppServices.
    value('version', '0.1');


innaAppServices.
    factory('storageService', ['$rootScope', '$http', '$log', function ($rootScope, $http, $log) {
        function log(msg) {
            $log.log(msg);
        }

        function isOlderTenSeconds(ms) {
            return !((ms + 1000 * 10) > (new Date()).getTime());
        }

        function isOlderMinute(ms) {
            return !((ms + 1000 * 60) > (new Date()).getTime());
        }

        function isOlderTenMinutes(ms) {
            return !((ms + 1000 * 60 * 10) > (new Date()).getTime());//ToDo: bedug 10min
        }

        return {
            setAviaBuyItem: function (model) {
                sessionStorage.AviaBuyItem = angular.toJson(model);
            },
            getAviaBuyItem: function () {
                return angular.fromJson(sessionStorage.AviaBuyItem);
            },

            //setAviaOrderNum: function (model) {
            //    sessionStorage.OrderNum = angular.toJson(model);
            //},
            //getAviaOrderNum: function () {
            //    return angular.fromJson(sessionStorage.OrderNum);
            //},

            setReservationModel: function (model) {
                sessionStorage.ReservationModel = angular.toJson(model);
            },
            getReservationModel: function () {
                return angular.fromJson(sessionStorage.ReservationModel);
            },

            setPayModel: function (model) {
                sessionStorage.PayModel = angular.toJson(model);
            },
            getPayModel: function () {
                return angular.fromJson(sessionStorage.PayModel);
            },

            setAviaSearchResults: function (model) {
                sessionStorage.AviaSearchResults = angular.toJson(model);
            },
            getAviaSearchResults: function (criteria) {
                var res = angular.fromJson(sessionStorage.AviaSearchResults);
                //проверяем, что достаем данные для нужных критериев поиска
                if (res != null && angular.toJson(criteria) == angular.toJson(res.criteria) && !isOlderMinute(res.date))
                {
                    return res.data;
                }
                return null;
            },
            clearAviaSearchResults: function () {
                sessionStorage.AviaSearchResults = null;
            },

            setAviaVariantCheck: function (model) {
                if (model != null) {
                    model.params = utils.normalize(model.params);
                }
                sessionStorage.AviaVariantCheck = angular.toJson(model);
            },
            getAviaVariantCheck: function (params) {
                params = utils.normalize(params);
                var res = angular.fromJson(sessionStorage.AviaVariantCheck);
                //проверяем, что достаем данные для нужных критериев поиска
                if (res != null && angular.toJson(params) == angular.toJson(res.params) && !isOlderTenSeconds(res.date)) {
                    return res.data;
                }
                return null;
            }
        }
    }]);

innaAppServices.
    factory('sharedProperties', ['$rootScope', '$http', '$q', 'cache', function ($rootScope, $http, $q, cache) {
        var slider = [];
        var updateCallBack = null;

        return {
            getSlider: function () {
                return slider;
            },
            setSlider: function (value) {
                //console.log('setSlider, len:' + value.length);
                slider = value;
                if (updateCallBack != null)
                    updateCallBack(slider);
            }
            ,
            sliderUpdateCallback: function (value) {
                updateCallBack = value;
            }
        };
    }]);
angular.module('innaApp.directives')
    .directive('innaDynamicBundle', ['$templateCache', function($templateCache){        
        return {
            template: $templateCache.get('components/bundle/templ/bundle.html'),
            scope: {
                bundle: '=innaDynamicBundleBundle',
                state: '=innaDynamicBundleState',
                getTicketDetails: '=innaDynamicBundleTicketDetails',
                getHotelDetails: '=innaDynamicBundleHotelDetails',
                withReservationButton: '@innaDynamicBundleWithReservationButton'
            },
            controller: [
                '$scope',
                'aviaHelper',
                '$element',
                function($scope, aviaHelper, $element){
                    var infoPopupElems = $('.icon-price-info, .tooltip-price', $element);
                    $scope.infoPopup = new inna.Models.Aux.AttachedPopup(angular.noop, infoPopupElems, $scope);

                    var linkPopupsElems = $('.share-button, .tooltip-share-link', $element);
                    $scope.linkPopup = new inna.Models.Aux.AttachedPopup(angular.noop, linkPopupsElems, $scope);


                    $scope.$watch('linkPopup.isOpen', function(){
                        $scope.location = document.location;
                    });

                    $scope.location = document.location;

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;

                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                }
            ]
        }
    }]);
angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterIndicators', [
        '$templateCache',
        '$location',
        function ($templateCache, $location) {
            return {
                template: function (element, attr) {
                    var templatePath = 'components/indicator-map/templ/';
                    var templateName = attr.templateName || 'indicators.html';

                    return $templateCache.get(templatePath + templateName);
                },
                replace: true,
                scope: {
                    isMap: '=isMap',
                    filters: '=innaDynamicSerpFilterIndicatorsFilters',
                    items: '=innaDynamicSerpFilterIndicatorsItems',
                    mod_wrapper: '=modWpapper',
                    name: '@innaDynamicSerpFilterIndicatorsItemsName'
                },
                controller: [
                    '$scope',
                    '$element',
                    function ($scope, $element) {


                        if ($scope.mod_wrapper) {
                            $element.addClass('b-switch-filters_mod-wrapper');
                            $element.find('.button-map-list').addClass('checked');
                        }

                        $scope.atLeastOne = function () {
                            var result = false;

                            $scope.filters.each(function (filter) {
                                result = result || (filter.options.getSelected().options.length !== 0);
                            });

                            return result;
                        }

                        $scope.reset = function () {
                            $scope.filters.each(function (filter) {
                                filter.options.reset();
                            });
                        }

                        $scope.action = function(){
                            $scope.$emit('toggle:view:hotels:map');
                        }

                        $scope.delete = function (option) {
                            if (option.reset) option.reset();
                            else option.selected = false;
                        }
                    }
                ]
            }
        }])
angular.module('innaApp.directives')
    .directive('innaHotel', [
        '$templateCache',
        '$timeout',
        function ($templateCache, $timeout) {
            return {
                template: $templateCache.get('components/hotel/templ/index.html'),
                //templateUrl: '/spa/js/angular/components/hotel/templ/index.html',
                scope: false,
                transclude: true,

                controller: [
                    '$scope',
                    '$element',
                    function ($scope, $element) {

                        $scope.goToMap = function(){
                            $scope.$emit('hotel:go-to-map', $scope.hotel);
                        }

                        $scope.setCurrent = function(){
                            $scope.$emit('choose:hotel', $scope.hotel);
                        }

                        $scope.virtualBundle = new inna.Models.Dynamic.Combination();
                        $scope.virtualBundle.hotel = $scope.hotel;
                        $scope.virtualBundle.ticket = $scope.combination.ticket;

                        //console.log($scope.virtualBundle);



                       $element.on('click', '.js-hotel-item-details', function(evt){
                         $scope.$emit('more:detail:hotel', $scope.hotel);
                       });

                       $element.on('click', '.js-hotel-info-place', function(evt){
                        $scope.$emit('hotel:go-to-map', $scope.hotel);
                       });

                    }],
                link : function($scope, $element){

                  $scope.$watch('hotel.currentlyInvisible', function(isInvis){
                        if(!isInvis && $element.find('.b-carousel').length) {
                            $timeout(function(){

                                $element.find('.b-carousel').innaCarousel({
                                    photoList: $scope.hotel.data.Photos,
                                    size: 'Small',
                                    style: {
                                        width: 200,
                                        height: 190
                                    }
                                });

                            }, 1);
                        }
                    });
                }
            }
    }]);
/**
 * На маркерах карты создаем  infoBox двух разных типов
 * Это preview infoBox и полноценный infoBox с информацией и фотографиями
 * При этом не создаются новые экземпляры классов InfoBox,
 * прячем и показываем снова один созданный тип  InfoBox
 *
 */

angular.module('innaApp.directives')
    .directive('dynamicSerpMap', [
        '$templateCache',
        function ($templateCache) {

            return {
                template: $templateCache.get('components/map/templ/index.html'),
                replace: true,
                scope: {
                    hotels: '=dynamicSerpMapHotels',
                    airports: '=dynamicSerpMapAirports'
                },
                controller: [
                    '$scope',
                    '$element',
                    function ($scope, $element) {
                        $scope.currentHotel = null;
                        $scope.currentHotelPreview = null;
                        $scope.airMarker = null;

                        // прячем footer
                        $scope.$emit('region-footer:hide');
                        $scope.$emit('bundle:hidden');
                        $element.addClass('big-map_short');


                        $scope.$root.$on('header:hidden', function () {
                            $element.addClass('big-map_short')
                        });

                        $scope.$root.$on('header:visible', function () {
                            $element.removeClass('big-map_short')
                        });

                        $scope.setHotel = function (currentHotel) {
                            $scope.$emit('choose:hotel', $scope.hotels.search(currentHotel.HotelId));
                        }

                        $scope.hotelDetails = function (currentHotel) {
                            $scope.$emit('more:detail:hotel', $scope.hotels.search(currentHotel.HotelId));
                        }
                    }
                ],
                link: function (scope, elem, attrs) {

                    var $thisEl = elem[0];
                    var mapContainer = $thisEl.querySelector('#big-map-canvas');
                    var boxPreview = $thisEl.querySelector('.big-map__balloon_preview');
                    var boxPhoto = $thisEl.querySelector('.big-map__balloon');
                    var boxAir = $thisEl.querySelector('.big-map__balloon_air');

                    var markers = [];
                    var _markerCluster = null;
                    var iconAirDefault = 'spa/img/map/marker-black-air.png?' + Math.random().toString(16);
                    var iconAirClick = 'spa/img/map/marker-green-air.png?' + Math.random().toString(16);
                    var iconDefault = 'spa/img/map/pin-grey.png?' + Math.random().toString(16);
                    var iconHover = 'spa/img/map/pin-black.png?' + Math.random().toString(16);
                    var iconClick = 'spa/img/map/pin-green.png?' + Math.random().toString(16);
                    var activeMarker = null;
                    var activeMarkerHover = null;
                    var GM = google.maps;
                    var _bounds = new GM.LatLngBounds();
                    var dataInfoBox = {
                        disableAutoPan: false,
                        closeBoxURL: "",
                        pixelOffset: new google.maps.Size(-10, 0),
                        zIndex: 2000,
                        infoBoxClearance: new google.maps.Size(1, 1),
                        isHidden: false,
                        pane: "floatPane",
                        enableEventPropagation: false
                    };
                    var boxInfo = null;
                    var boxInfoHover = null;
                    var boxInfoAir = null;
                    var styleArray = [
                        {
                            featureType: "all",
                            stylers: [
                                { saturation: -30 }
                            ]
                        },
                        {
                            featureType: "road.arterial",
                            elementType: "geometry",
                            stylers: [
                                { hue: "#00ffee" },
                                { saturation: 50 }
                            ]
                        },
                        {
                            featureType: "poi.business",
                            elementType: "labels",
                            stylers: [
                                { visibility: "off" }
                            ]
                        }
                    ];

                    var map = new GM.Map(mapContainer, {
                        center: new GM.LatLng(0, 0),
                        disableDefaultUI: true,
                        styles: styleArray,
                        zoom: 8
                    });

                    GM.event.addListener(map, 'click', function (evt) {
                        activeMarkerReset();
                    });

                    /*GM.event.addListener(map, 'zoom_changed', function() {
                     console.log(map.getZoom(), 'zoom');
                     });*/

                    function initCarousel() {
                        elem.find('.b-carousel').innaCarousel({
                            photoList: scope.currentHotel.Photos,
                            map: true,
                            style: {
                                width: 360,
                                height: 240
                            }
                        });
                    }

                    function setActiveMarker(data_marker) {
                        var data = data_marker.marker;

                        // создаем свойство в объекте маркера
                        // различаем маркеры на которых был click или hover
                        if (data.hover) {
                            activeMarkerHover = data.activeMarker;
                            if (data.infoBoxPreview) data.activeMarker.infoBoxPreview = true;
                        }
                        else {
                            activeMarker = data.activeMarker;
                            if (data.infoBoxVisible) data.activeMarker.infoBoxVisible = true;
                        }


                    }

                    function activeMarkerReset() {
                        if (activeMarker && activeMarker.infoBoxVisible) {
                            activeMarker.setIcon(iconDefault);
                            boxInfo.setVisible(false);
                            activeMarker.infoBoxVisible = false;
                        }
                    }


                    /**
                     * Анимация
                     * @param marker
                     */
                    var toggleBounce = function (marker) {
                        if (marker.getAnimation() != null) {
                            marker.setAnimation(null);
                        } else {
                            marker.setAnimation(GM.Animation.BOUNCE);
                        }
                    }

                    var reDraw = function (box) {
                        var oldDraw = box.draw;
                        box.draw = function () {
                            oldDraw.apply(this);
                            jQuery(box.div_).hide();
                            jQuery(box.div_).fadeIn(200);
                        }
                    }

                    /**
                     *
                     * @param data
                     */
                    var addInfoBox = function (data) {
                        var dataMarker = data.marker;
                        data.infoBoxData = dataInfoBox;

                        angular.extend(dataInfoBox, {
                            content: data.elem,
                            position: data.pos
                        });

                        // инфобокс - hover
                        if (dataMarker.hover) {
                            if (!boxInfoHover) {
                                boxInfoHover = new InfoBox(dataInfoBox);
                                boxInfoHover.open(map);

                            } else {
                                boxInfoHover.setPosition(data.pos);
                                boxInfoHover.setVisible(true);
                            }
                            GM.event.addListener(boxInfoHover, 'domready', function () {
                                $(boxPreview).css('left', 'auto');
                            });

                            // инфобокс для аэропорта
                        } else if (dataMarker.air) {
                            if (!boxInfoAir) {
                                boxInfoAir = new InfoBox(dataInfoBox);
                                boxInfoAir.open(map);

                            } else {
                                boxInfoAir.setPosition(data.pos);
                                boxInfoAir.setVisible(true);
                            }
                            GM.event.addListener(boxInfoAir, 'domready', function () {
                                $(boxAir).css('left', 'auto');
                            });

                            // инфобокс на клик маркера отеля
                        } else {
                            if (boxInfoHover) {
                                boxInfoHover.setVisible(false);
                            }
                            if (!boxInfo) {
                                boxInfo = new InfoBox(dataInfoBox);
                                boxInfo.open(map);
                                reDraw(boxInfo);
                            } else {
                                boxInfo.setVisible(true);
                                boxInfo.setPosition(data.pos);
                            }
                            GM.event.addListener(boxInfo, 'domready', function () {
                                $(boxPhoto).css('left', 'auto');
                            });
                        }
                        setActiveMarker(data);
                    }


                    /**
                     * Добавить маркер
                     * @param hotel
                     * @returns {{marker: GM.Marker, pos: GM.LatLng}}
                     */
                    var addMarker = function (data_for_marker) {
                        var data = data_for_marker;
                        var position = new GM.LatLng(data.Latitude, data.Longitude);

                        var image = new GM.MarkerImage(
                            (data.type == 'hotel') ? iconDefault : iconAirDefault,
                            new google.maps.Size(55, 46),
                            new google.maps.Point(0, 0)
                            //new google.maps.Point(0, 46)
                        );

                        var shape = {
                            coord: [1, 1, 1, 43, 32, 43, 32 , 1],
                            type: 'poly'
                        };

                        var marker = new GM.Marker({
                            position: position,
                            animation: GM.Animation.DROP,
                            icon: image,
                            shape: shape,
                            title: (data.HotelName) ? data.HotelName : ''
                        });
                        return  {
                            marker: marker,
                            pos: position
                        }
                    }


                    /**
                     * Удалить маркер
                     * removeMarkers
                     */
                    var removeMarkers = function () {
                        markers.forEach(function (marker) {
                            marker.setMap(null);
                        });
                        markers = [];

                        if (_markerCluster)
                            _markerCluster.clearMarkers();
                    }

                    /**
                     * Добавить маркер группировки
                     * addCluster
                     */
                    var addCluster = function () {
                        _markerCluster = new MarkerClusterer(map, markers, {
                            gridSize: 20,
                            //clusterClass : 'big-map__cluster',
                            styles: [
                                {
                                    url: 'spa/img/map/empty.png',
                                    height: 50,
                                    width: 50,
                                    anchor: [16, 0],
                                    textColor: '#ffffff',
                                    textSize: 12,
                                    fontWeight: 'normal'
                                }
                            ]
                        });
                    }

                    /**
                     * События маркера на карте
                     * @param data
                     */
                    var markerEvents = function (data) {
                        var marker = data.marker;
                        var pos = data.pos;

                        GM.event.addListener(marker, 'click', function () {
                            var marker = this;

                            var pos = this.getPosition();

                            scope.$apply(function ($scope) {
                                $scope.currentHotel = marker.$inna__hotel;
                            });

                            // ценрируем карту
                            map.panTo(pos);

                            // если уже есть активный маркер, то сбрасываем его
                            activeMarkerReset();
                            // меняем цвет маркера
                            marker.setIcon(iconClick);

                            // Показываем большой infoBox
                            addInfoBox({
                                elem: boxPhoto,
                                pos: pos,
                                marker: {
                                    activeMarker: marker,
                                    infoBoxVisible: true,
                                    hover: false
                                }
                            });

                            initCarousel();

                        });

                        GM.event.addListener(marker, 'mouseover', function () {
                            var marker = this;

                            if (!marker.infoBoxVisible) {
                                scope.$apply(function ($scope) {
                                    $scope.currentHotelPreview = marker.$inna__hotel;
                                });

                                marker.setIcon(iconHover);
                                addInfoBox({
                                    elem: boxPreview,
                                    pos: pos,
                                    marker: {
                                        activeMarker: marker,
                                        infoBoxPreview: true,
                                        hover: true
                                    }
                                });
                            } else {

                            }
                        });

                        GM.event.addListener(marker, 'mouseout', function () {
                            var marker = this;
                            if (!marker.infoBoxVisible) {
                                boxInfoHover.setVisible(false);
                                marker.setIcon(iconDefault);
                            }
                        });
                    }

                    /**
                     * События маркера для аэропортов
                     * @param data
                     */
                    var markerAirEvents = function (data) {
                        var marker = data.marker;
                        var pos = data.pos;

                        GM.event.addListener(marker, 'mouseover', function () {
                            var marker = this;

                            scope.$apply(function ($scope) {
                                $scope.airport = marker.$airport;
                            });

                            marker.setIcon(iconAirClick);

                            addInfoBox({
                                elem: boxAir,
                                pos: pos,
                                marker: {
                                    activeMarker: marker,
                                    air: true
                                }
                            });

                        });

                        GM.event.addListener(marker, 'mouseout', function () {
                            var marker = this;
                            boxInfoAir.setVisible(false);
                            marker.setIcon(iconAirDefault);
                        });
                    }


                    var showOneHotel = function (data_hotel) {
                        // проходм по всем маркерам
                        var mark = markers.filter(function (marker) {

                            // сравниваем и находим нужный
                            if ((marker.$inna__hotel && marker.$inna__hotel.Latitude) &&
                                (marker.$inna__hotel.Latitude == data_hotel.Latitude)) {


                                scope.$apply(function ($scope) {
                                    $scope.currentHotel = marker.$inna__hotel;
                                });

                                // инициализируем infoBox
                                addInfoBox({
                                    elem: boxPhoto,
                                    pos: marker.getPosition(),
                                    marker: {
                                        activeMarker: marker,
                                        infoBoxVisible: true,
                                        hover: false
                                    }
                                });

                                // меняем иконку
                                marker.setIcon(iconClick);

                                // показываем
                                boxInfo.setVisible(true);


                                var bounds = new GM.LatLngBounds();
                                var position = new GM.LatLng(data_hotel.Latitude, data_hotel.Longitude);

                                bounds.extend(position);

                                map.fitBounds(bounds);
                                map.setZoom(15);

                                map.panTo(marker.getPosition());
                                // инициализация карусели
                                initCarousel();
                                return marker;
                            }
                        });
                    }


                    /**
                     * Событие обновления фильтров
                     */
                    scope.$on('change:hotels:filters', function (evt, data) {
                        updateMap({
                            hotels: data,
                            airports: scope.airports
                        })
                    });

                    /**
                     * Переход с карточки отеля
                     */
                    scope.$on('map:show-one-hotel', function (evt, data) {
                        showOneHotel(data.toJSON());
                    });


                    function updateMap(data) {
                        var rawHotels = null;
                        var hotels = (data.hotels) ? data.hotels : [];
                        var airports = (data.airports) ? data.airports : [];

                        rawHotels = (hotels.toJSON) ? hotels.toJSON() : [];
                        removeMarkers();

                        rawHotels.forEach(function (hotel) {

                            //console.log(hotel.hidden, 'hotel.hidden');
                            if (hotel.hidden) return;

                            if (!hotel.Latitude || !hotel.Longitude) return;

                            var markerData = addMarker(angular.extend(hotel, { type: 'hotel' }));
                            var marker = markerData.marker;
                            marker.$inna__hotel = hotel;
                            marker._hotelId_ = hotel.HotelId;

                            markerEvents(markerData);
                            _bounds.extend(markerData.pos);
                            markers.push(marker);
                        });

                        airports.forEach(function (airport) {
                            airport.data = angular.copy(airport);
                            angular.extend(airport, { type: 'airport' });

                            if (!airport.Latitude || !airport.Longitude) return;

                            var markerData = addMarker(airport);
                            var marker = markerData.marker;
                            marker.$airport = airport;
                            markerAirEvents(markerData);
                            markers.push(marker);
                        });

                        addCluster();
                    }

                    scope.$watchCollection('[hotels, airports]', function (data) {
                        updateMap({
                            hotels: data[0],
                            airports: data[1]
                        })

                        map.fitBounds(_bounds);
                    });
                }
            }
        }]);

angular.module('innaApp.directives')
    .directive('innaTicket', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/ticket/templ/index.html'),
            scope: false,
            transclude: true,
            controller: [
                '$scope',
                'aviaHelper',
                function($scope, aviaHelper){

                    //console.log($scope);
                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                    $scope.dateHelper = dateHelper;

                    $scope.showWarning = function(){
                        var n = parseInt($scope.ticket.data.NumSeats);

                        if(!n) return false;

                        switch($scope.passengerCount) {
                            case 1: return (n < 4);
                            case 2: return (n < 7);
                            default: return (n < 10);
                        }

                        return false;
                    };

                    $scope.virtualBundle = new inna.Models.Dynamic.Combination();
                    $scope.virtualBundle.hotel = $scope.combination.hotel;
                    $scope.virtualBundle.ticket = $scope.ticket;
                }
            ]
        }
    }]);
﻿﻿﻿
/* Controllers */

innaAppControllers.
    controller('AviaBuyTicketsCtrl', ['$log', '$timeout', '$interval', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper', 'urlHelper', 'innaApp.Urls',
        function AviaBuyTicketsCtrl($log, $timeout, $interval, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Urls) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            //$rootScope.$broadcast("avia.page.loaded", $routeParams);

            //критерии из урла
            //$scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            //$scope.searchId = $scope.criteria.QueryId;

            $scope.orderNum = $routeParams.OrderNum;
            $scope.helper = aviaHelper;

            $scope.reservationModel = null;

            $scope.objectToReserveTemplate = 'pages/avia/variant_partial.html';
            function setPackageTemplate() {
                $scope.objectToReserveTemplate = 'pages/dynamic/inc/reserve.html';
            }

            /*
CardNumber = "4012 0010 3714 1112";
Month = "12";
Year = "17";
Cvc = "486";
            */
            $scope.payModel = {
                num1: '',
                num2: '',
                num3: '',
                num4: '',
                cardMonth: '',
                cardYear: '',
                cardHolder: '',
                cvc2: '',
                agree: false
            };

            $scope.visaOrMastercard = null;
            function trackVisaOrMC() {
                if ($scope.payModel.num1 != null && $scope.payModel.num1.length > 0) {
                    $scope.visaOrMastercard = $scope.payModel.num1.startsWith('4');
                }
            }

            $scope.fillTestData = function ($event) {
                eventsHelper.preventBubbling($event);

                $scope.payModel = {
                    num1: '5469',
                    num2: '4000',
                    num3: '1273',
                    num4: '3023',
                    cvc2: '',
                    //cvc2: '952',
                    cardHolder: 'ILYA GERASIMENKO',
                    cardMonth: '07',
                    cardYear: '15',
                    agree: true
                };
            }
            
            $scope.formPure = true;

            //модель, показывает невалидную подсветку
            $scope.indicator = {
                num1: false,
                num2: false,
                num3: false,
                num4: false,
                cardMonth: false,
                cardYear: false,
                cardHolder: false,
                cvc2: false,
                agree: false
            };

            //признаки, что поле валидно
            $scope.isValid = {
                num1: true,
                num2: true,
                num3: true,
                num4: true,
                cardMonth: true,
                cardYear: true,
                cardHolder: true,
                cvc2: true,
                agree: true
            };

            $scope.indicatorValidate = function () {
                var keys = _.keys($scope.payModel);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    $scope.indicator[key] = isFieldInvalid(key);
                }
            }

            $scope.indicatorValidateKey = function (key) {
                $scope.indicator[key] = isFieldInvalid(key);
            }

            function isFieldInvalid (key) {
                var itemValue = $scope.payModel[key];
                var isValid = $scope.isValid[key];

                if (itemValue != null && (!_.isString(itemValue) || itemValue.length > 0)) {
                    if ($scope.formPure) {
                        //console.log('isFieldInvalid1, key: %s, isInvalid: %s', key, (!isValid && itemValue != null && itemValue.length > 0));
                        return !isValid && itemValue != null && itemValue.length > 0;//подсвечиваем только если что-то введено в полях
                    }
                    else {
                        //console.log('isFieldInvalid2, key: %s, isInvalid: %s', key, (!isValid));
                        return !isValid;
                    }
                }
                else {
                    //console.log('isFieldInvalid3, key: %s, isInvalid: %s', key, (!$scope.formPure));
                    return !$scope.formPure;
                }
            }

            $scope.validateField = function (key, value) {
                //console.log('validateField, key: %s, value: %s', key, value);
                if (key == 'num1' || key == 'num2' || key == 'num3' || key == 'num4') {
                    $scope.validate['num1']();
                    $scope.validate['num2']();
                    $scope.validate['num3']();
                    $scope.validate['num4']();
                    $scope.indicatorValidateKey('num1');
                    $scope.indicatorValidateKey('num2');
                    $scope.indicatorValidateKey('num3');
                    $scope.indicatorValidateKey('num4');
                }
                else {
                    $scope.validate[key]();
                    $scope.indicatorValidateKey(key);
                }
            }

            function validateNum() {
                function setNums(isValid) {
                    $scope.isValid.num1 = isValid;
                    $scope.isValid.num2 = isValid;
                    $scope.isValid.num3 = isValid;
                    $scope.isValid.num4 = isValid;
                }
                var cardNum = $scope.payModel.num1 + $scope.payModel.num2 + $scope.payModel.num3 + $scope.payModel.num4;
                if (cardNum.length == 16) {
                    setNums(true);
                    return true;
                }
                setNums(false);
                return false;
            }

            function initValidateModel() {
                function validateNumPart(value) {
                    return (value != null && value.length == 4);
                }

                $scope.validate = {
                    num1: function () {
                        var v = validateNumPart($scope.payModel.num1);
                        $scope.isValid.num1 = v;
                        return v;
                    },
                    num2: function () {
                        var v = validateNumPart($scope.payModel.num2);
                        $scope.isValid.num2 = v;
                        return v;
                    },
                    num3: function () {
                        var v = validateNumPart($scope.payModel.num3);
                        $scope.isValid.num3 = v;
                        return v;
                    },
                    num4: function () {
                        var v = validateNumPart($scope.payModel.num4);
                        $scope.isValid.num4 = v;
                        return v;
                    },
                    cardMonth: function validateCardMonth() {
                        if ($scope.payModel.cardMonth.length > 0) {
                            var iMonth = parseInt($scope.payModel.cardMonth);
                            if (iMonth >= 1 && iMonth <= 12) {
                                $scope.isValid.cardMonth = true;
                                return true;
                            }
                        }
                        $scope.isValid.cardMonth = false;
                        return false;
                    },
                    cardYear: function validateCardYear() {
                        if ($scope.payModel.cardYear.length > 0) {
                            var iYear = parseInt($scope.payModel.cardYear);
                            if (iYear >= 14) {
                                $scope.isValid.cardYear = true;
                                return true;
                            }
                        }
                        $scope.isValid.cardYear = false;
                        return false;
                    },
                    cardHolder: function validateCardholder() {
                        if ($scope.payModel.cardHolder.length > 0) {
                            $scope.isValid.cardHolder = true;
                            return true;
                        }
                        $scope.isValid.cardHolder = false;
                        return false;
                    },
                    cvc2: function validateCvv() {
                        if ($scope.payModel.cvc2.length == 3) {
                            $scope.isValid.cvc2 = true;
                            return true;
                        }
                        $scope.isValid.cvc2 = false;
                        return false;
                    },
                    agree: function () {
                        $scope.isValid.agree = $scope.payModel.agree;
                        return $scope.isValid.agree;
                    }
                };
            }
            initValidateModel();

            function tarifs() {
                //log('tarifs');
                var self = this;

                self.isOpened = false;

                self.list = [];

                self.fillInfo = function () {
                    self.class = $scope.aviaInfo.CabineClass == 0 ? 'Эконом' : 'Бизнес';

                    _.each($scope.aviaInfo.EtapsTo, function (etap) {
                        self.list.push({
                            from: etap.OutPort, fromCode: etap.OutCode, to: etap.InPort, toCode: etap.InCode,
                            num: etap.TransporterCode + '-' + etap.Number
                        });
                    });

                    if ($scope.aviaInfo.EtapsBack != null) {
                        _.each($scope.aviaInfo.EtapsBack, function (etap) {
                            self.list.push({
                                from: etap.OutPort, fromCode: etap.OutCode, to: etap.InPort, toCode: etap.InCode,
                                num: etap.TransporterCode + '-' + etap.Number
                            });
                        });
                    }
                }

                self.selectedIndex = 0;
                self.setected = null;
                //self.class = $scope.criteria.CabinClass == 0 ? 'Эконом' : 'Бизнес';

                self.tarifsData = null;
                self.tarifItem = null;

                self.tarifClick = function ($event, item) {
                    eventsHelper.preventBubbling($event);
                    self.setected = item;
                    var index = self.list.indexOf(item);
                    self.tarifItem = self.tarifsData[index];
                }
                self.show = function ($event) {
                    eventsHelper.preventBubbling($event);
                    self.selectedIndex = 0;
                    self.setected = self.list[0];
                    self.tarifItem = self.tarifsData[0];
                    self.isOpened = true;
                }
                self.close = function ($event) {
                    eventsHelper.preventBubbling($event);
                    self.isOpened = false;
                }
            }
            $scope.tarifs = new tarifs();

            $scope.oferta = {
                url: function () {
                    var host = app_main.host.replace('api.', 's.');
                    return host + '/files/doc/offer.pdf';
                }
            }

            $scope.cancelReservation = {
                show: function ($event) {
                    //alert('Не реализовано');
                    //eventsHelper.preventBubbling($event);
                    $scope.tarifs.show($event);
                }
            }

            $scope.validateError = function () {
                this.field = '';
                this.isValid = false;
            }

            function showPopupErr(id) {
                var $to = $('#' + id);
                if ($to.attr('tt') != 'true') {
                    $to.attr('tt', 'true');
                    $to.tooltipX({ autoShow: false, autoHide: false, position: { my: 'center top+22', at: 'center bottom' } });
                }
                $to.tooltipX("open");
            }

            function closeErrPopups() {
                _.each(_.keys($scope.validate), function (key) {
                    var $to = $('#' + key);
                    if ($to.attr('tt') == 'true') {
                        //console.log('closeErrPopups, id: ' + key);
                        //$to.tooltipX("close");
                        try {
                            $to.tooltipX("close");
                            //$to.tooltipX("destroy");
                        }
                        catch (e) { };
                    }
                });
            }

            $scope.$watch('payModel', function () {
                trackVisaOrMC();
                closeErrPopups();
                //validateKeys();
            }, true);

            function validateKeys() {
                //console.log('validateKeys');
                var keys = _.keys($scope.validate);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var fn = $scope.validate[key];
                    if (fn != null)
                        fn();
                }
            }

            function validateAll() {
                //console.log('validate');
                validateKeys();
                validateNum();
                $scope.indicatorValidate();

                //var isValid = _.all(_.keys($scope.isValid), function (key) {
                //    return $scope.isValid[key] == true;
                //});
                //return isValid;
            }

            function validateAndShowPopup() {
                $scope.formPure = false;
                //console.log('validateAndShowPopup');
                validateAll();

                var keys = _.keys($scope.isValid);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if ($scope.isValid[key] == false) {
                        showPopupErr(key);
                        return false;
                    }
                }

                return true;
            }

            $scope.sexType = aviaHelper.sexType;

            //focus
            function focusControl() {
                var self = this;
                
                self.navList = [];
                self.navCurrent = null;

                self.cardNumCont = $('.js-cardnum-block');
                self.num1 = { item: $('input:eq(0)', self.cardNumCont), key: 'num1' };
                self.num2 = { item: $('input:eq(1)', self.cardNumCont), key: 'num2' };
                self.num3 = { item: $('input:eq(2)', self.cardNumCont), key: 'num3' };
                self.num4 = { item: $('input:eq(3)', self.cardNumCont), key: 'num4' };

                self.validCont = $('.js-card-valid');
                self.month = { item: $('input:eq(0)', self.validCont), key: 'cardMonth' };
                self.year = { item: $('input:eq(1)', self.validCont), key: 'cardYear' };
                
                self.holder = { item: $('input.js-card-holder:eq(0)'), key: 'cardHolder' };

                self.navList.push(self.num1);
                self.navList.push(self.num2);
                self.navList.push(self.num3);
                self.navList.push(self.num4);
                self.navList.push(self.month);
                self.navList.push(self.year);
                self.navList.push(self.holder);

                self.init = function () {
                    self.navCurrent = self.navList[0];
                    self.navCurrent.item.focus();
                }
                self.next = function (key) {
                    //console.log('goNext, key: %s', key);
                    self.navCurrent = _.find(self.navList, function (item) {
                        return item.key == key;
                    });
                    if (self.navCurrent != null) {
                        var index = self.navList.indexOf(self.navCurrent);
                        index++;
                        self.navCurrent = self.navList[index];
                        if (self.navCurrent != null) {
                            self.navCurrent.item.select();
                            self.navCurrent.item.focus();
                        }
                    }
                }
            }
            $scope.focusControl = new focusControl();
            
            //data loading ===========================================================================
            function initPayModel() {
                var self = this;
                var reservationModel = null;//storageService.getReservationModel();
                //log('\nReservationModel: ' + angular.toJson(reservationModel));

                if (reservationModel != null) {
                    $scope.reservationModel = reservationModel;
                    init();
                }
                else {
                    $scope.baloon.show('Проверка билетов', 'Подождите пожалуйста, это может занять несколько минут');
                    //запрос в api
                    paymentService.getPaymentData({
                        orderNum: $scope.orderNum
                    },
                    function (data) {
                        if (data != null) {
                            
                            //log('\ngetPaymentData data: ' + angular.toJson(data));
                            console.log('getPaymentData:');
                            console.log(data);

                            function cutZero(val) {
                                return val.replace(' 0:00:00', '');
                            }
                            function getPassenger(data) {
                                var m = {};
                                m.sex = data.Sex;
                                m.name = data.I;
                                m.secondName = data.F;
                                m.birthday = cutZero(data.Birthday);
                                m.doc_series_and_number = data.Number;
                                m.doc_expirationDate = cutZero(data.ExpirationDate);
                                m.citizenship = {};
                                m.citizenship.id = data.Citizen;
                                m.citizenship.name = data.CitizenName;
                                m.index = data.Index;

                                m.bonuscard = {};
                                m.bonuscard.airCompany = {};
                                m.bonuscard.haveBonusCard = false;
                                if (data.BonusCard != null && data.BonusCard.length > 0 &&
                                    data.TransporterName != null && data.TransporterName.length > 0) {
                                    m.bonuscard.haveBonusCard = true;
                                    m.bonuscard.number = data.BonusCard;
                                    m.bonuscard.airCompany.id = data.TransporterId;
                                    m.bonuscard.airCompany.name = data.TransporterName;
                                }

                                return m;
                            }

                            $scope.getExpTimeSecFormatted = function (time) {
                                if (time != null) {
                                    //вычисляем сколько полных часов
                                    var h = Math.floor(time / 3600);
                                    time %= 3600;
                                    var m = Math.floor(time / 60);
                                    var s = time % 60;

                                    var hPlural = aviaHelper.pluralForm(h, 'час', 'часа', 'часов');
                                    var mPlural = 'мин'; //aviaHelper.pluralForm(addMins, 'минута', 'минуты', 'минут');
                                    var sPlural = 'сек';

                                    var res = [];
                                    if (h > 0) {
                                        res.push(h + " " + hPlural);
                                    }
                                    if (m > 0) {
                                        res.push(m + " " + mPlural);
                                    }
                                    if (s > 0) {
                                        res.push(s + " " + sPlural);
                                    }
                                    return res.join(': ');
                                }
                                return "";
                            }

                            function bindApiModelToModel(data) {
                                var m = {};
                                var pasList = [];
                                _.each(data.Passengers, function (item) {
                                    pasList.push(getPassenger(item));
                                });
                                m.passengers = pasList;
                                m.price = data.Price;
                                m.expirationDate = dateHelper.apiDateToJsDate(data.ExperationDate);
                                m.expirationDateFormatted = aviaHelper.getDateFormat(m.expirationDate, 'dd MMM yyyy');
                                m.experationMinute = data.ExperationMinute;
                                m.experationSeconds = data.ExperationMinute * 60 + 59; // делаем в секундах
                                m.experationSecondsFormatted = $scope.getExpTimeSecFormatted(Math.abs(m.experationSeconds));
                                m.filter = data.Filter;
                                m.Name = data.Name;
                                m.LastName = data.LastName;
                                m.Email = data.Email;
                                m.Phone = data.Phone;
                                m.IsSubscribe = data.IsSubscribe;

                                m.IsService = data.IsService;
                                return m;
                            }

                            $scope.reservationModel = bindApiModelToModel(data);
                            if ($scope.reservationModel.IsService) {//сервисный сбор

                            }
                            else {
                                if (data.Hotel != null) {
                                    setPackageTemplate();
                                    aviaHelper.addAggInfoFields(data.Hotel);
                                    $scope.hotel = data.Hotel;
                                    $scope.isBuyPage = true;
                                }

                                aviaHelper.addCustomFields(data.AviaInfo);
                                $scope.aviaInfo = data.AviaInfo;
                                $scope.ticketsCount = aviaHelper.getTicketsCount(data.AviaInfo.AdultCount, data.AviaInfo.ChildCount, data.AviaInfo.InfantsCount);

                                $scope.price = $scope.reservationModel.price;
                            }

                            //log('\nreservationModel: ' + angular.toJson($scope.reservationModel));
                            console.log('reservationModel:');
                            console.log($scope.reservationModel);

                            $scope.baloon.hide();

                            //aviaHelper.addCustomFields(data);
                            //$scope.item = data;

                            init();
                        }
                        else {
                            log('paymentService.getPaymentData error, data is null');
                            $scope.baloon.showGlobalAviaErr();
                        }
                    },
                    function (data, status) {
                        log('paymentService.getPaymentData error');
                        $scope.baloon.showGlobalAviaErr();
                    });
                }
            };
            initPayModel();

            function loadTarifs() {
                var self = this;
                getTarifs();

                function getTarifs() {
                    paymentService.getTarifs({ variantTo: $scope.aviaInfo.VariantId1, varianBack: $scope.aviaInfo.VariantId2 },
                        function (data) {
                            log('\npaymentService.getTarifs, data: ' + angular.toJson(data));
                            $scope.tarifs.tarifsData = data;
                        },
                        function (data, status) {
                            log('paymentService.getTarifs error');
                        });
                }
            }

            function init() {
                if ($scope.reservationModel.IsService) {
                }
                else {
                    loadTarifs();
                    $scope.tarifs.fillInfo();
                }
                $scope.focusControl.init();
                $scope.paymentDeadline.setUpdate();
            };
            
            //data loading ===========================================================================
            
            $scope.processToBuy = function ($event) {
                eventsHelper.preventBubbling($event);

                if (!$scope.paymentDeadline.ifExpires() && validateAndShowPopup()) {

                    var cardNum = $scope.payModel.num1 + $scope.payModel.num2 + $scope.payModel.num3 + $scope.payModel.num4;

                    var apiPayModel = {
                        OrderNum: $scope.orderNum,
                        CardNumber: cardNum,
                        Cvc2: $scope.payModel.cvc2,
                        CardHolder: $scope.payModel.cardHolder,
                        CardMonth: $scope.payModel.cardMonth,
                        CardYear: $scope.payModel.cardYear
                    };

                    log('\napiPayModel: ' + angular.toJson(apiPayModel));

                    $scope.baloon.show('Подождите, идет оплата', 'Это может занять несколько минут');

                    paymentService.pay(apiPayModel,
                        function (data) {
                            log('\npaymentService.pay, data: ' + angular.toJson(data));
                            if (data != null && data.Status == 0) {
                                //успешно
                                if (data.PreauthStatus == 1) {
                                    //3dSecure
                                    processPay3d(data.Data);
                                }
                                else if (data.PreauthStatus == 2) {
                                    $scope.is3dscheck = false;
                                    //без 3dSecure
                                    checkPayment();
                                }
                                else {
                                    //ошибка
                                    log('paymentService.pay error, data.PreauthStatus: ' + data.PreauthStatus);
                                    $scope.baloon.showGlobalAviaErr();
                                }
                            }
                            else {
                                log('paymentService.pay error, data is null');
                                $scope.baloon.showGlobalAviaErr();
                            }
                        },
                        function (data, status) {
                        //ошибка
                        log('paymentService.pay error, data: ' + angular.toJson(data));
                        $scope.baloon.showGlobalAviaErr();
                    });
                }
            };

            function buyFrame() {
                var self = this;
                self.iframeUrl = null;
                self.isOpened = false;
                self.open = function () {
                    self.isOpened = true;
                }
                self.hide = function () {
                    self.isOpened = false;
                }

                self.listenCloseEvent = function () {
                    $('#buy-listener').on('inna.buy.close', function (event, data) {
                        console.log('triggered inna.buy.close');
                        $scope.safeApply(function () {
                            $scope.baloon.show('Подождите, идет оплата', 'Это может занять несколько минут');
                            self.hide();
                        })
                    });
                }
                self.listenCloseEvent();

                self.listenForFrameLoad = function () {
                    //слушаем событие с фрейма
                    $('#buy-listener').on('inna.buy.frame.init', function (event, data) {
                        $scope.safeApply(function () {
                            //console.log('controller received inna.buy.frame.init');
                            $('#buy_frame_main').on('load', function () {
                                //отписываемся
                                $('#buy_frame_main').off('load');
                                //console.log('buy_frame_main load');
                                //console.log($('#buy_frame_main'));

                                //закрываем попап ожидаем...
                                $scope.baloon.hide();
                                $scope.buyFrame.open();
                            });
                        })
                    });
                }

                return self;
            }
            $scope.buyFrame = new buyFrame();

            function processPay3d(data) {
                var jData = angular.fromJson(data);
                //console.log('jData: ' + angular.toJson(jData));
                jData.TermUrl = app_main.host + '/api/v1/Psb/PaymentRederect';
                //console.log('jData: ' + angular.toJson(jData));
                var params = '';
                var keys = _.keys(jData);
                _.each(keys, function (key) {
                    if (keys.indexOf(key) > 0) {
                        params += '&';
                    }
                    params += key + '=' + encodeURIComponent(jData[key]);
                });

                //дождемся пока фрейм с формой запостит и сработает load
                $scope.buyFrame.listenForFrameLoad();
                $scope.buyFrame.iframeUrl = ('/spa/templates/pages/avia/pay_form.html?' + params);

                $scope.is3dscheck = true;
                checkPayment();
            }

            function checkPayment() {
                $scope.isCkeckProcessing = false;
                check();

                var intCheck = $interval(function () {
                    check();
                }, 5000);

                function check() {
                    if (!$scope.isCkeckProcessing) {
                        $scope.isCkeckProcessing = true;
                        paymentService.payCheck($scope.orderNum, function (data) {
                            $scope.isCkeckProcessing = false;
                            log('paymentService.payCheck, data: ' + angular.toJson(data));
                            //data = true;
                            if (data != null) {
                                if (data == 1 || data == 2) {
                                    //прекращаем дергать
                                    $interval.cancel(intCheck);

                                    //скрываем попап с фреймом 3ds
                                    if ($scope.is3dscheck) {
                                        $scope.buyFrame.hide();
                                    }

                                    if (data == 1) {
                                        $scope.baloon.show('Билеты успешно выписаны', 'И отправены на электронную почту',
                                        aviaHelper.baloonType.success, function () {
                                            $location.path(Urls.URL_AVIA);
                                        }, {
                                            buttonCaption: 'Распечатать билеты', successFn: function () {
                                                //print
                                                log('print tickets');
                                                alert('Не реализовано');
                                            }
                                        });
                                    }
                                    else if (data == 2) {
                                        $scope.baloon.showGlobalAviaErr();
                                    }
                                }
                            }
                        }, function (data, status) {
                            $scope.isCkeckProcessing = false;
                            log('paymentService.payCheck error, data: ' + angular.toJson(data));
                        });
                    }
                }
                
            }

            //срок оплаты билета
            function paymentDeadline() {
                var self = this;
                self.id = null;
                self.setUpdate = function () {
                    if (self.ifExpires()) {
                        self.runExiresLogic();
                    }
                    else {//не заэкспайрилось
                        self.id = $interval(function () {
                            self.updateExiration();
                            if (self.ifExpires()) {
                                self.runExiresLogic();
                            }
                        }, 1000);
                    }
                }
                self.updateExiration = function () {
                    if ($scope.reservationModel != null) {
                        $scope.reservationModel.experationSeconds = +$scope.reservationModel.experationSeconds - 1;
                        $scope.reservationModel.experationSecondsFormatted = $scope.getExpTimeSecFormatted($scope.reservationModel.experationSeconds);
                    }
                }
                self.ifExpires = function () {
                    if ($scope.reservationModel != null) {
                        if ($scope.reservationModel.experationMinute != null && $scope.reservationModel.experationMinute > 0) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    return false;
                }
                self.runExiresLogic = function () {
                    //заэкспайрилось - показываем попап, отключаем апдейт
                    self.destroy();
                    $scope.baloon.show('', '', aviaHelper.baloonType.payExpires, function () {
                        $location.path(Urls.URL_AVIA);
                    }, {
                        successFn: function () {
                            $scope.baloon.hide();
                            var url = Urls.URL_AVIA;
                            if ($scope.reservationModel.filter != null && $scope.reservationModel.filter.length > 0) {
                                var criteria = angular.fromJson($scope.reservationModel.filter);
                                url = urlHelper.UrlToAviaSearch(criteria);
                            }
                            //log('redirect to url: ' + url);
                            $location.path(url);
                        }
                    });
                }
                self.destroy = function () {
                    if (self.id != null) {
                        $interval.cancel(self.id);
                    }
                }
            }
            $scope.paymentDeadline = new paymentDeadline();
            
            function destroyPopups() {
                _.each(_.keys($scope.validate), function (key) {
                    var $to = $('#' + key);
                    try {
                        $to.tooltipX("destroy");
                    }
                    catch (e) { };
                });
            }

            $scope.$on('$destroy', function () {
                $scope.paymentDeadline.destroy();
                destroyPopups();
                $('#buy-listener').off();
            });
        }]);

﻿'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaFormCtrl', [
        '$log',
        '$scope',
        '$rootScope',
        '$filter',
        '$routeParams',
        '$location',
        'dataService',
        'cache',
        'urlHelper',
        'aviaHelper',
        'aviaService', 'Validators',
        function AviaFormCtrl($log, $scope, $rootScope, $filter, $routeParams, $location, dataService, cache, urlHelper, aviaHelper,
            aviaService, Validators) {

            var self = this;
            function log(msg) {
                //$log.log.apply($log, arguments);
            }

            var AVIA_COOK_NAME = "form_avia_cook";

            //console.log('$routeParams');
            //console.log($routeParams);

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //значения по-умобчанию
            //$scope.criteria = getDefaultCriteria();
            //$scope
            loadParamsFromRouteOrDefault($routeParams);

            //$routeParams
            $scope.$on('avia.page.loaded', function (event, $routeParams, validateDate) {
                //console.log('avia.page.loaded $routeParams: ' + angular.toJson($routeParams) + ' validateDate: ' + validateDate);
                loadParamsFromRouteOrDefault($routeParams, validateDate);
            });

            $scope.$watch('datepickerButtons', function (newVal) {
                $scope.datepickerButtons.updateScopeValues();
            }, true);

            function loadParamsFromRouteOrDefault(routeParams, validateDate) {
                var routeCriteria = null;
                //если пусто
                if (routeParams.FromUrl == null || routeParams.BeginDate == null) {
                    //console.log('avia.form: $routeParams is empty');
                    routeCriteria = getDefaultCriteria();
                }
                else {
                    //критерии из урла
                    routeCriteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy(routeParams)));
                    //console.log('avia.form: routeCriteria: ' + angular.toJson(routeCriteria));
                }

                if (validateDate) {
                    validateDates(routeCriteria);
                }

                $scope.criteria = routeCriteria;
                //console.log('avia.page.loaded criteria');
                //console.log($scope.criteria);

                //если FromUrl пришли (из урла), а FromId - нет
                setFromAndToFieldsFromUrl(routeCriteria);

                $scope.datepickerButtons = new datepickerButtons();
                $scope.datepickerButtons.updateValues();
            }

            $rootScope.$broadcast("avia.form.loaded");

            function setFromAndToFieldsFromUrl(routeCriteria, afterCompleteCallback) {
                if (routeCriteria.FromUrl != null && routeCriteria.FromUrl.length > 0) {
                    $scope.criteria.From = 'загружается...';
                    dataService.getDirectoryByUrl(routeCriteria.FromUrl, function (data) {
                        $scope.$apply(function ($scope) {
                            //обновляем данные
                            if (data != null) {
                                $scope.fromInit = { Id: data.id, Name: data.name, Url: data.url };

                                $scope.criteria.From = data.name;
                                $scope.criteria.FromId = data.id;
                                $scope.criteria.FromUrl = data.url;
                                //logCriteriaData();
                                //console.log('avia.form: $scope.criteria.From: ' + angular.toJson($scope.criteria));
                            }
                        });
                    }, function (data, status) {
                        //ошибка получения данных
                        console.log('avia.form: getDirectoryByUrl error: ' + $scope.criteria.FromUrl + ' status:' + status);
                    });
                }

                if (routeCriteria.ToUrl != null && routeCriteria.ToUrl.length > 0) {
                    $scope.criteria.To = 'загружается...';
                    dataService.getDirectoryByUrl(routeCriteria.ToUrl, function (data) {
                        $scope.$apply(function ($scope) {
                            //обновляем данные
                            if (data != null) {
                                $scope.toInit = { Id: data.id, Name: data.name, Url: data.url };

                                $scope.criteria.To = data.name;
                                $scope.criteria.ToId = data.id;
                                $scope.criteria.ToUrl = data.url;

                                //console.log('$scope.criteria.ToUrl: %s', $scope.criteria.ToUrl);
                                //logCriteriaData();
                                //console.log('avia.form: $scope.criteria.To: ' + angular.toJson($scope.criteria));
                            }
                        });
                    }, function (data, status) {
                        //ошибка получения данных
                        console.log('avia.form: getDirectoryByUrl error: ' + $scope.criteria.ToUrl + ' status:' + status);
                    });
                }
            };

            function validateDates(crit) {
                //даты по-умолчанию: сегодня и +5 дней
                var now = dateHelper.getTodayDate();
                var nowAdd5days = dateHelper.getTodayDate();
                nowAdd5days = nowAdd5days.setDate(now.getDate() + 5);
                var f_now = $filter('date')(new Date(), 'dd.MM.yyyy');
                var f_nowAdd5days = $filter('date')(nowAdd5days, 'dd.MM.yyyy');

                //проверка актуальности дат
                if (crit.BeginDate != null && crit.BeginDate.length > 0) {
                    var critDateFrom = dateHelper.dateToJsDate(crit.BeginDate);
                    if (critDateFrom < now) {
                        log('cookie dates overriden by default dates: %s %s', f_now, f_nowAdd5days);
                        crit.BeginDate = f_now;
                        crit.EndDate = f_nowAdd5days;
                    }
                }
            }

            function datepickerButtons() {
                var self = this;
                self.isOneWaySelected = $scope.criteria.PathType == 1;
                self.isToRoamingSelected = $scope.criteria.IsToFlexible == 1;
                self.isBackRoamingSelected = $scope.criteria.IsBackFlexible == 1;
                self.updateScopeValues = function () {
                    $scope.criteria.PathType = self.isOneWaySelected ? 1 : 0;
                    $scope.criteria.IsToFlexible = self.isToRoamingSelected ? 1 : 0;
                    $scope.criteria.IsBackFlexible = self.isBackRoamingSelected ? 1 : 0;
                };
                self.updateValues = function () {
                    self.isOneWaySelected = $scope.criteria.PathType == 1 ? true : false;
                    self.isToRoamingSelected = $scope.criteria.IsToFlexible == 1 ? true : false;
                    self.isBackRoamingSelected = $scope.criteria.IsBackFlexible == 1 ? true : false;
                }
            }

            function getDefaultCriteria() {
                //даты по-умолчанию: сегодня и +5 дней
                //var now = dateHelper.getTodayDate();
                //var nowAdd5days = dateHelper.getTodayDate();
                //nowAdd5days = nowAdd5days.setDate(now.getDate() + 5);
                //var f_now = $filter('date')(new Date(), 'dd.MM.yyyy');
                //var f_nowAdd5days = $filter('date')(nowAdd5days, 'dd.MM.yyyy');

                var f_now = null;
                var f_nowAdd5days = null;

                var defaultCriteria = getParamsFromCookie();

                if (defaultCriteria == null) {
                    defaultCriteria = new aviaCriteria({
                        "BeginDate": f_now, "EndDate": f_nowAdd5days,
                        "AdultCount": 1, "ChildCount": 0, "InfantsCount": 0, "CabinClass": 0, "IsToFlexible": 0, "IsBackFlexible": 0,
                        "PathType": 0
                    });
                    //console.log('avia.form: getting default');
                }
                else {
                    //console.log('avia.form: getting from cookie');
                }

                //проверка актуальности дат
                //проверка актуальности дат
                validateDates(defaultCriteria);

                //установка дефолтных дат
                //if (defaultCriteria.BeginDate == null || defaultCriteria.BeginDate.length == 0)
                //{
                //    log('BeginDate, set default date');
                //    defaultCriteria.BeginDate = f_now;
                //}
                //if (defaultCriteria.EndDate == null || defaultCriteria.EndDate.length == 0) {
                //    log('EndDate, set default date');
                //    defaultCriteria.EndDate = f_nowAdd5days;
                //}

                return defaultCriteria;
            };
            
            function getParamsFromCookie() {
                var cookVal = $.cookie(AVIA_COOK_NAME);
                var resCriteria = null;
                log('getParamsFromCookie, cookVal: ' + cookVal);
                if (cookVal != null) {
                    var formVal = angular.fromJson(cookVal);

                    resCriteria = {};
                    resCriteria.FromId = formVal.FromId;
                    resCriteria.FromUrl = formVal.FromUrl;
                    resCriteria.ToId = formVal.ToId;
                    resCriteria.ToUrl = formVal.ToUrl;
                    resCriteria.BeginDate = formVal.BeginDate;
                    resCriteria.EndDate = formVal.EndDate;
                    resCriteria.AdultCount = formVal.AdultCount;
                    resCriteria.ChildCount = formVal.ChildCount;
                    resCriteria.InfantsCount = formVal.InfantsCount;
                    resCriteria.CabinClass = formVal.CabinClass;
                    resCriteria.IsToFlexible = formVal.IsToFlexible;
                    resCriteria.IsBackFlexible = formVal.IsBackFlexible;
                    resCriteria.PathType = formVal.PathType;
                }
                return resCriteria;
            };

            function saveParamsToCookie() {
                var saveObj = {};
                saveObj.FromId = $scope.criteria.FromId;
                saveObj.FromUrl = $scope.criteria.FromUrl;
                saveObj.ToId = $scope.criteria.ToId;
                saveObj.ToUrl = $scope.criteria.ToUrl;
                saveObj.BeginDate = $scope.criteria.BeginDate;
                saveObj.EndDate = $scope.criteria.EndDate;
                saveObj.AdultCount = $scope.criteria.AdultCount;
                saveObj.ChildCount = $scope.criteria.ChildCount;
                saveObj.InfantsCount = $scope.criteria.InfantsCount;
                saveObj.CabinClass = $scope.criteria.CabinClass;
                saveObj.IsToFlexible = $scope.criteria.IsToFlexible;
                saveObj.IsBackFlexible = $scope.criteria.IsBackFlexible;
                saveObj.PathType = $scope.criteria.PathType;

                var cookVal = angular.toJson(saveObj);
                log('saveParamsToCookie, cookVal: ' + cookVal);
                //сохраняем сессионную куку
                $.cookie(AVIA_COOK_NAME, cookVal);

                var testVal = $.cookie(AVIA_COOK_NAME);
                log('saveParamsToCookie, testVal: ' + testVal);
            };

            //добавляем в кэш откуда, куда
            //addDefaultFromToDirectionsToCache(defaultCriteria);
            //списки по-умолчанию

            $scope.pathTypeList = [{ name: 'Туда обратно', value: 0 }, { name: 'Туда', value: 1 }];
            
            //logCriteriaData();
            log('AviaFormCtrl defaultCriteria: ' + angular.toJson($scope.criteria));

            //тут меняем урл для поиска
            $scope.searchStart = function () {
                try {
                    validate();
                    //if ok

                    if ($scope.criteria.FromId > 0 && $scope.criteria.ToId > 0 &&
                        $scope.criteria.FromUrl.length > 0 && $scope.criteria.ToUrl.length > 0) {

                        saveParamsToCookie();
                        //log('$scope.searchStart: ' + angular.toJson($scope.criteria));
                        var oldUrl = $location.path();
                        var url = urlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
                        $location.path(url);

                        if (oldUrl == url) {
                            $rootScope.$broadcast("avia.search.start");
                        }
                    }
                    else {
                        console.warn('Не заполнены поля Откуда, Куда');
                    }

                    //$rootScope.$emit('inna.DynamicPackages.Search', o);
                } catch (e) {
                    console.warn(e);
                    if ($scope.criteria.hasOwnProperty(e.message)) {
                        $scope.criteria[e.message] = e;
                    }
                }   
            };

            $scope.preventBubbling = function ($event) {
                preventBubbling($event);
            }

            //отключаем бабблинг событий
            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            $scope.pathTypeClick = function (val) {
                $scope.criteria.PathType = val;
            }

            function validate() {
                Validators.defined($scope.criteria.FromId, Error('FromId'));
                Validators.defined($scope.criteria.ToId, Error('ToId'));
                Validators.notEqual($scope.criteria.FromId, $scope.criteria.ToId, Error('ToId'));

                Validators.defined($scope.criteria.BeginDate, Error('BeginDate'));
                if ($scope.criteria.PathType == 0) {//туда обратно
                    Validators.defined($scope.criteria.EndDate, Error('EndDate'));
                }
            }

            /* From field */
            $scope.fromList = [];

            $scope.provideSuggestToFromList = function (preparedText, rawText) {
                aviaService.getDirectoryByUrl(preparedText, function (data) {
                    $scope.$apply(function ($scope) {
                        $scope.fromList = data;
                    });
                })
            }

            $scope.loadObjectById = function (id, callback) {
                //console.log('loadObjectById: %d', id);
                aviaService.getObjectById(id, callback, null);
            }

            /* To field */
            $scope.toList = [];

            $scope.provideSuggestToToField = function (preparedText, rawText) {
                aviaService.getDirectoryByUrl(preparedText, function (data) {
                    $scope.$apply(function ($scope) {
                        $scope.toList = data;
                    });
                })
            }

            $scope.setResultCallbackFrom = function (item) {
                if (item != null) {
                    //console.log('$scope.setResultCallbackFrom: %s', item.CodeIata);
                    $scope.criteria.FromUrl = item.CodeIata;
                    $scope.criteria.From = item.Name;
                }
            }

            $scope.setResultCallbackTo = function (item) {
                if (item != null) {
                    $scope.criteria.ToUrl = item.CodeIata;
                    $scope.criteria.To = item.Name;
                }
            }

            /*Klass*/
            $scope.klass = _.find(TripKlass.options, function (klass) {
                return (klass.value == $scope.criteria.CabinClass);
            });
            $scope.$watch('klass', function (newVal, oldVal) {
                $scope.criteria.CabinClass = newVal.value;
            });
        }]);

﻿﻿﻿
/* Controllers */

innaAppControllers.
    controller('AviaReserveTicketsCtrl', ['$log', '$controller', '$timeout', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper', 'urlHelper', 'Validators', 'innaApp.Urls',
        function AviaReserveTicketsCtrl($log, $controller, $timeout, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Validators, Urls) {
            $controller('ReserveTicketsCtrl', { $scope: $scope });

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams);

            //критерии из урла
            $scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.ticketsCount = aviaHelper.getTicketsCount($scope.criteria.AdultCount, $scope.criteria.ChildCount, $scope.criteria.InfantsCount);

            //====================================================
            //нужны в родителе
            $scope.fromDate = $scope.criteria.BeginDate;
            $scope.AdultCount = parseInt($scope.criteria.AdultCount);
            $scope.ChildCount = parseInt($scope.criteria.ChildCount);
            $scope.InfantsCount = parseInt($scope.criteria.InfantsCount);
            $scope.peopleCount = $scope.AdultCount + $scope.ChildCount + $scope.InfantsCount;
            //нужны в родителе
            //====================================================

            $scope.goBackUrl = function () {
                return '#' +  urlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
            };

            $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $scope.criteria.CabinClass);

            $scope.goToPaymentClick = function ($event) {
                eventsHelper.preventBubbling($event);
                //просто закрываем
                $scope.popupItemInfo.isShow = false;
            }

            $scope.searchId = $scope.criteria.QueryId;

            $scope.objectToReserveTemplate = 'pages/avia/variant_partial.html';

            //для начала нужно проверить доступность билетов
            //var availableChecktimeout = $timeout(function () {
            //    $scope.baloon.show('Проверка доступности билетов', 'Подождите пожалуйста, это может занять несколько минут');
            //}, 300);

            $scope.baloon.show('Проверка доступности билетов', 'Подождите пожалуйста, это может занять несколько минут');
            
            //проверяем, что остались билеты для покупки
            paymentService.checkAvailability({ variantTo: $routeParams.VariantId1, varianBack: $routeParams.VariantId2 },
                function (data) {
                    $scope.safeApply(function () {
                        //data = false;
                        if (data == true) {
                            //если проверка из кэша - то отменяем попап
                            //$timeout.cancel(availableChecktimeout);

                            //загружаем все
                            loadDataAndInit();

                            //ToDo: debug
                            //$timeout(function () {
                            //    loadDataAndInit();
                            //}, 1000);
                        }
                        else {
                            //log('checkAvailability, false');
                            //$timeout.cancel(availableChecktimeout);

                            function goToSearch() {
                                var url = urlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
                                //log('redirect to url: ' + url);
                                $location.path(url);
                            }

                            $scope.baloon.showWithClose("Вариант больше недоступен", "Вы будете направлены на результаты поиска билетов",
                                function () {
                                    goToSearch();
                                });

                            $timeout(function () {
                                //очищаем хранилище для нового поиска
                                storageService.clearAviaSearchResults();
                                //билеты не доступны - отправляем на поиск
                                goToSearch();
                            }, 3000);
                        
                        }
                    });
                },
                function (data, status) {
                    //error
                    //$timeout.cancel(availableChecktimeout);
                });

            //$scope.$watch('validationModel', function (newVal, oldVal) {
            //    if (newVal === oldVal)
            //        return;

            //}, true);

            //$timeout(function () {
            //    loadToCountryAndInit(routeCriteria);
            //}, 2000);

            function loadDataAndInit() {
                var loader = new utils.loader();

                //data loading ===========================================================================
                function loadToCountry() {
                    var self = this;
                    //log('loadToCountryAndInit');
                    if ($scope.criteria.ToUrl != null && $scope.criteria.ToUrl.length > 0) {

                        dataService.getDirectoryByUrl($scope.criteria.ToUrl, function (data) {
                            $scope.$apply(function ($scope) {
                                if (data != null) {
                                    $scope.criteria.To = data.name;
                                    $scope.criteria.ToId = data.id;
                                    $scope.criteria.ToCountryName = data.CountryName;
                                    //оповещаем лоадер, что метод отработал
                                    loader.complete(self);
                                }
                            });
                        }, function (data, status) {
                            log('loadToCountry error: ' + $scope.criteria.ToUrl + ' status:' + status);
                        });
                    }
                };

                function getStoreItem() {
                    var self = this;
                    //var storeItem = null;//storageService.getAviaBuyItem();
                    ////log('storeItem: ' + angular.toJson(storeItem));
                    //if (storeItem != null) {
                    //    if (storeItem.item.VariantId2 == null)
                    //        storeItem.item.VariantId2 = 0;
                    //    //проверяем, что там наш итем
                    //    if ($scope.criteria.QueryId == storeItem.searchId &&
                    //        $scope.criteria.VariantId1 == storeItem.item.VariantId1 && $scope.criteria.VariantId2 == storeItem.item.VariantId2) {
                    //        $scope.searchId = storeItem.searchId;
                    //        $scope.item = storeItem.item;
                    //        //$scope.price = storeItem.item.price;

                    //        //оповещаем лоадер, что метод отработал
                    //        loader.complete(self);
                    //    }
                    //}
                    //else {
                    //запрос в api
                    paymentService.getSelectedVariant({
                        variantId1: $scope.criteria.VariantId1,
                        variantId2: $scope.criteria.VariantId2,
                        idQuery: $scope.criteria.QueryId
                    },
                    function (data) {
                        if (data != null && data != 'null') {
                            //дополняем полями 
                            aviaHelper.addCustomFields(data);
                            //log('getSelectedVariant dataItem: ' + angular.toJson(data));
                            $scope.item = data;
                            $scope.price = data.Price;
                            //console.log($scope.item);
                            //плюс нужна обработка, чтобы в item были доп. поля с форматами дат и прочее

                            //оповещаем лоадер, что метод отработал
                            loader.complete(self);
                        }
                        else
                            $log.error('paymentService.getSelectedVariant error, data is null');
                    },
                    function (data, status) {
                        $log.error('paymentService.getSelectedVariant error');
                    });
                    //}
                };

                loader.init([loadToCountry, getStoreItem], init).run();
            };

            function init() {
                $scope.initPayModel();
                //console.log($scope.item);
            }

            $scope.afterPayModelInit = function () {
                //log('$scope.afterPayModelInit');
                $scope.baloon.hide();
                //$scope.fillDefaultModelDelay();
            };

            $scope.afterCompleteCallback = function () {
                //переходим на страницу оплаты
                var url = urlHelper.UrlToAviaTicketsBuy($scope.criteria.OrderNum);
                //log('processToPayment, url: ' + url);
                $location.path(url);
            }

            $scope.getApiModel = function (data) {
                var m = {};
                m.I = '';//data.name;
                m.F = '';//data.secondName;
                m.Email = data.email;
                m.Phone = data.phone;
                m.IsSubscribe = data.wannaNewsletter;

                var pasList = [];
                _.each(data.passengers, function (item) {
                    pasList.push($scope.getPassenger(item));
                });
                m.Passengers = pasList;

                m.SearchParams = {
                    SearchId: $scope.searchId,
                    VariantId1: $scope.item.VariantId1,
                    VariantId2: $scope.item.VariantId2
                };
                m.Filter = angular.toJson($scope.criteria);
                return m;
            }

            //бронируем
            $scope.reserve = function () {
                //console.log('$scope.reserve');
                var m = $scope.getApiModelForReserve();
                var model = m.model;
                var apiModel = m.apiModel;

                paymentService.reserve(apiModel,
                    function (data) {
                        $scope.$apply(function ($scope) {
                            log('order: ' + angular.toJson(data));
                            if (data != null && data.OrderNum != null && data.Status != null && data.Status == 1 && data.OrderNum.length > 0) {
                                //сохраняем orderId
                                //storageService.setAviaOrderNum(data.OrderNum);
                                $scope.criteria.OrderNum = data.OrderNum;

                                if ($scope.isAgency()) {
                                    $scope.goToB2bCabinet();
                                }
                                else {
                                    //сохраняем модель
                                    //storageService.setReservationModel(model);

                                    //успешно
                                    $scope.afterCompleteCallback();
                                }
                            }
                            else {
                                $scope.showReserveError();
                            }
                        });
                    },
                    function (data, status) {
                        $scope.$apply(function ($scope) {
                            //ошибка
                            log('paymentService.reserve error');
                            $scope.showReserveError();
                        });
                    });
            };

            $scope.showReserveError = function () {
                $scope.baloon.showErr("Что-то пошло не так", "Ожидайте, служба поддержки свяжется с вами, \nили свяжитесь с оператором по телефону <b>+7 495 742-1212</b>",
                    function () {
                        $location.path(Urls.URL_AVIA);
                    });
            }

            $scope.$on('$destroy', function () {
            });
        }]);

﻿﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaSearchMainCtrl', [
        '$scope', '$rootScope', '$routeParams', 'innaApp.services.PageContentLoader', 'innaApp.API.pageContent.AVIA',
        function ($scope, $rootScope, $routeParams, PageContentLoader, sectionID) {
            /*Data fetching*/
            PageContentLoader.getSectionById(sectionID, function (data) {
                //обновляем данные
                if (data != null) {
                    $scope.$apply(function($scope) {
                        $scope.sections = data.SectionLayouts;
                    });
                }
            });

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            //$rootScope.$broadcast("avia.page.loaded", $routeParams, true);
            $scope.$on('avia.form.loaded', function (event) {
                //console.log('avia.form.loaded');
                $rootScope.$broadcast("avia.page.loaded", $routeParams, true);
            });
            $rootScope.$broadcast("avia.page.loaded", $routeParams, true);
        }
    ]);

﻿﻿
/* Controllers */

innaAppControllers.
    controller('AviaSearchResultsCtrl', ['$log', '$scope', '$rootScope', '$timeout', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'eventsHelper', 'aviaHelper', 'urlHelper', 'innaApp.Urls', 'innaApp.API.events',
        function AviaSearchResultsCtrl($log, $scope, $rootScope, $timeout, $routeParams, $filter, $location,
            dataService, paymentService, storageService, eventsHelper, aviaHelper, urlHelper, Urls, Events) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $scope.$on('avia.form.loaded', function (event) {
                //console.log('avia.form.loaded');
                $rootScope.$broadcast("avia.page.loaded", $routeParams);
            });
            $rootScope.$broadcast("avia.page.loaded", $routeParams);

            $scope.$on('avia.search.start', function (event) {
                //console.log('trigger avia.search.start');
                startLoadAndInit();
            });

            $rootScope.$on(Events.AUTH_SIGN_IN, function (event, data) {
                //console.log('Events.AUTH_SIGN_IN, type: %d', data.Type);
                if ($location.path().startsWith(Urls.URL_AVIA_SEARCH) && data != null && data.Type == 2) {
                    $scope.safeApply(function () {
                        //если залогинен и b2b (Type = 2)
                        //запускаем поиск
                        startLoadAndInit();
                    });
                }
            });

            $rootScope.$on(Events.AUTH_SIGN_OUT, function (event, data) {
                //console.log('Events.AUTH_SIGN_OUT, type: %d', data.raw.Type);
                if ($location.path().startsWith(Urls.URL_AVIA_SEARCH) && data != null && data.Type == 2) {
                    $scope.safeApply(function () {
                        //если залогинен и b2b (Type = 2)
                        //запускаем поиск
                        startLoadAndInit();
                    });
                }
            });

            $scope.getSliderTimeFormat = aviaHelper.getSliderTimeFormat;
            $scope.getTransferCountText = aviaHelper.getTransferCountText;

            $scope.helper = aviaHelper;

            $scope.getLength = function () {
                var len = $scope.ticketsList != null ? $scope.ticketsList.length : 0;
                if ($scope.recomendedItem != null)
                    len++;
                return len;
            }
            $scope.getFilteredLength = function () {
                var len = $scope.filteredTicketsList != null ? $scope.filteredTicketsList.length : 0;
                if ($scope.recomendedItem != null)
                    len++;
                return len;
            }

            //начинаем поиск, после того, как подтянули все данные
            function ifDataLoadedStartSearch() {
                $scope.startSearch();
            }

            //все обновления модели - будут раз в 100 мс, чтобы все бегало шустро
            var applyFilterThrottled = _.debounce(function ($scope) {
                //log('applyFilterThrottled');
                applyFilterDelayed($scope);
            }, 100);
            var applyFilterDelayed = function ($scope) {
                //log('applyFilterDelayed: scope' + scope);
                $scope.$apply(function () { applyFilter($scope); });
            };

            //обрабатываем параметры из url'а
            var routeCriteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.criteria = routeCriteria;

            $scope.ticketsCount = aviaHelper.getTicketsCount($scope.criteria.AdultCount, $scope.criteria.ChildCount, $scope.criteria.InfantsCount);

            //инициализация
            initValues();
            initFuctions();
            
            //log('routeCriteria: ' + angular.toJson($scope.criteria));

            var loader = new utils.loader();
            //запрашиваем парамерты по их Url'ам
            function startLoadAndInit() {
                //console.log('startLoadAndInit');
                $scope.baloon.showWithClose('Поиск рейсов', 'Подождите пожалуйста, это может занять несколько минут', function () {
                    dataService.cancelAviaSearch();
                    $location.path(Urls.URL_AVIA);
                });
                loader.init([setFromFieldsFromUrl, setToFieldsFromUrl], ifDataLoadedStartSearch).run();
            }
            startLoadAndInit();

            function initValues() {
                //флаг индикатор загрузки
                $scope.isDataLoading = true;

                //фильтр
                $scope.filter = new aviaFilter();

                $scope.scrollControl = new scrollControl();

                //списки
                $scope.ticketsList = null;
                $scope.filteredTicketsList = null;
                $scope.visibleFilteredTicketsList = null;
                $scope.searchId = 0;

                $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $scope.criteria.CabinClass);

                //сортировка - по-молчанию - по рекомендациям
                //$scope.sort = avia.sortType.ByRecommend;

                function sortFilter() {
                    var self = this;
                    
                    self.list = [
                    { name: "По рейтингу", sort: avia.sortType.byRecommend },
                    { name: "По цене", sort: avia.sortType.byPrice },
                    { name: "По времени в пути", sort: avia.sortType.byTripTime },
                    { name: "По времени отправления ТУДА", sort: avia.sortType.byDepartureTime },
                    { name: "По времени отправления ОБРАТНО", sort: avia.sortType.byBackDepartureTime },
                    { name: "По времени прибытия ТУДА", sort: avia.sortType.byArrivalTime },
                    { name: "По времени прибытия ОБРАТНО", sort: avia.sortType.byBackArrivalTime }
                    ];

                    self.sortType = avia.sortType.byRecommend;
                    self.reverse = false;
                }
                $scope.SortFilter = new sortFilter();

                $scope.dateFormat = avia.dateFormat;
                $scope.timeFormat = avia.timeFormat;

                //флаг, когда нужно придержать обновление фильтра
                $scope.isSuspendFilterWatch = false;
            };

            //изменение модели фильтра
            $scope.$watch('filter', function (newValue, oldValue) {
                if ($scope.isDataLoading)
                    return;

                //if (newValue === oldValue) {
                //    return;
                //}
                //log('$scope.$watch filter, scope:' + $scope);
                applyFilterThrottled($scope);
            }, true);

            function initFuctions() {
                $scope.startSearch = function () {
                    //log('$scope.startSearch');

                    $scope.ticketsList = null;
                    $scope.filteredTicketsList = null;

                    var searchCriteria = angular.copy($scope.criteria);
                    if (searchCriteria.PathType == 1)//только туда
                    {
                        //нужно передать только дату туда
                        searchCriteria.EndDate = null;
                    }
                    dataService.startAviaSearch(searchCriteria, function (data) {
                        $scope.safeApply(function () {
                            //обновляем данные
                            if (data != null) {
                                //log('data: ' + angular.toJson(data));
                                    updateModel(data);
                            }
                            else {
                                $scope.baloon.showErr('Ничего не найдено', 'Попробуйте поискать на другие даты, направления', function () {
                                    $location.path(Urls.URL_AVIA);
                                });
                            }
                        });
                    }, function (data, status) {
                        $scope.safeApply(function () {
                            //ошибка получения данных
                            log('startSearchTours error; status:' + status);
                            $scope.baloon.showGlobalAviaErr();
                        });
                    });
                };

                $scope.getCurrentSortName = function () {
                    return _.find($scope.sortList, function (item) { return item.sort == $scope.sort }).name;
                };

                $scope.isSortVisible = function (sort) {
                    return sort != $scope.sort;
                };

                $scope.getCityFrom = function () {
                    if ($scope.ticketsList != null && $scope.ticketsList.length > 0) {
                        return $scope.ticketsList[0].CityFrom;
                    }
                    return "";
                };

                $scope.getCityTo = function () {
                    if ($scope.ticketsList != null && $scope.ticketsList.length > 0) {
                        return $scope.ticketsList[0].CityTo;
                    }
                    return "";
                };

                $scope.resetAll = function ($event) {
                    $scope.resetPrice($event);
                    $scope.resetTransfers($event);
                    //$scope.resetArrivalTime($event);
                    //$scope.resetDepartureTime($event);
                    $scope.resetTime($event);
                    $scope.resetCompanies($event);
                    $scope.resetPorts($event);
                };

                $scope.resetPrice = function ($event) {
                    eventsHelper.preventBubbling($event);
                    $scope.filter.minPrice = $scope.filter.minPriceInitial;
                    $scope.filter.maxPrice = $scope.filter.maxPriceInitial;
                };

                $scope.resetTransfers = function ($event) {
                    eventsHelper.preventBubbling($event);
                    _.each($scope.filter.TransferCountListAgg, function (item) { item.checked = false });
                };

                $scope.resetTime = function ($event) {
                    eventsHelper.preventBubbling($event);
                    _.each($scope.filter.time.list, function (item) { item.checked = false });
                }
                //$scope.resetDepartureTime = function ($event) {
                //    eventsHelper.preventBubbling($event);
                //    $scope.filter.minDepartureDate = $scope.filter.minDepartureDateInitial;
                //    $scope.filter.maxDepartureDate = $scope.filter.maxDepartureDateInitial;
                //    $scope.filter.minBackDepartureDate = $scope.filter.minBackDepartureDateInitial;
                //    $scope.filter.maxBackDepartureDate = $scope.filter.maxBackDepartureDateInitial;
                //};
                //$scope.resetArrivalTime = function ($event) {
                //    eventsHelper.preventBubbling($event);
                //    $scope.filter.minArrivalDate = $scope.filter.minArrivalDateInitial;
                //    $scope.filter.maxArrivalDate = $scope.filter.maxArrivalDateInitial;
                //    $scope.filter.minBackArrivalDate = $scope.filter.minBackArrivalDateInitial;
                //    $scope.filter.maxBackArrivalDate = $scope.filter.maxBackArrivalDateInitial;
                //};
                $scope.resetCompanies = function ($event) {
                    eventsHelper.preventBubbling($event);
                    _.each($scope.filter.TransporterList, function (item) { item.checked = false });
                };

                $scope.resetPorts = function ($event) {
                    eventsHelper.preventBubbling($event);
                    _.each($scope.filter.AirportFilter.fromPorts, function (item) { item.checked = false });
                    _.each($scope.filter.AirportFilter.toPorts, function (item) { item.checked = false });
                }

                $scope.anyChecked = function (list) {
                    return _.any(list, function (item) { return item.checked; });
                }

                $scope.goToPaymentClick = function ($event, item) {
                    eventsHelper.preventBubbling($event);

                    $scope.baloon.show('Проверка доступности билетов', 'Подождите пожалуйста, это может занять несколько минут');
                    //проверяем, что остались билеты для покупки
                    paymentService.checkAvailability({ variantTo: item.VariantId1, varianBack: item.VariantId2 },
                        function (data) {
                            $scope.safeApply(function () {
                                //log('paymentService.checkAvailability, data: ' + angular.toJson(data));
                                if (data == true)
                                {
                                    //сохраняем в хранилище
                                    storageService.setAviaBuyItem({ searchId: $scope.searchId, item: item });
                                    var buyCriteria = angular.copy($scope.criteria);
                                    buyCriteria.QueryId = $scope.searchId;
                                    buyCriteria.VariantId1 = item.VariantId1;
                                    buyCriteria.VariantId2 = item.VariantId2 != null ? item.VariantId2 : 0;

                                    //log('buyCriteria: ' + angular.toJson(buyCriteria));
                                    //все норм - отправляем на страницу покупки
                                    var url = urlHelper.UrlToAviaTicketsReservation(buyCriteria);
                                    //log('Url: ' + url);
                                    $location.path(url);
                                }
                                else {
                                    function noVariant() {
                                        $scope.baloon.hide();
                                        //выкидываем билет из выдачи
                                        $scope.ticketsList = _.without($scope.ticketsList, item);
                                        $scope.filteredTicketsList = _.without($scope.filteredTicketsList, item);
                                    }

                                    $scope.baloon.showErr('К сожалению, билеты не доступны', 'Попробуйте выбрать другие', function () {
                                        noVariant();
                                        $timeout.cancel(popupTimeout);
                                    });
                                    var popupTimeout = $timeout(function () {
                                        noVariant();
                                    }, 3000);
                                }
                            });
                        },
                        function (data, status) {
                            $scope.safeApply(function () {
                                //error
                                $scope.baloon.showGlobalAviaErr();
                            });
                        });
                };
            };

            function setFromFieldsFromUrl() {
                var self = this;
                if (routeCriteria.FromUrl != null && routeCriteria.FromUrl.length > 0) {
                    $scope.criteria.From = 'загружается...';
                    dataService.getDirectoryByUrl(routeCriteria.FromUrl, function (data) {
                        $scope.$apply(function ($scope) { 
                            //обновляем данные
                            if (data != null) {
                                $scope.criteria.From = data.name;
                                $scope.criteria.FromId = data.id;
                                $scope.criteria.FromUrl = data.url;
                                //log('$scope.criteria.From: ' + angular.toJson($scope.criteria));
                                loader.complete(self);
                            }
                        });
                    }, function (data, status) {
                        //ошибка получения данных
                        log('getDirectoryByUrl error: ' + $scope.criteria.FromUrl + ' status:' + status);
                    });
                }
            };

            function setToFieldsFromUrl() {
                var self = this;
                if (routeCriteria.ToUrl != null && routeCriteria.ToUrl.length > 0) {
                    $scope.criteria.To = 'загружается...';
                    dataService.getDirectoryByUrl(routeCriteria.ToUrl, function (data) {
                        $scope.$apply(function ($scope) {
                            //обновляем данные
                            if (data != null) {
                                $scope.criteria.To = data.name;
                                $scope.criteria.ToId = data.id;
                                $scope.criteria.ToUrl = data.url;
                                //log('$scope.criteria.To: ' + angular.toJson($scope.criteria));
                                loader.complete(self);
                            }
                        });
                    }, function (data, status) {
                        //ошибка получения данных
                        log('getDirectoryByUrl error: ' + $scope.criteria.ToUrl + ' status:' + status);
                    });
                }
            };

            function updateModel(data) {
                //log('updateModel');

                if (data != null && data.Items != null && data.Items.length > 0) {
                    var list = [];
                    var recommendedList = [];
                    var recomendedItem = null;
                    
                    //id поиска
                    $scope.searchId = data.QueryId;
                    
                    //в этих полях дата будет в миллисекундах
                    for (var i = 0; i < data.Items.length; i++) {
                        var item = data.Items[i];
                        
                        //нужно добавить служебные поля для сортировки по датам и т.д.
                        aviaHelper.addCustomFields(item);

                        if (item.IsRecomendation) {
                            //recomendedItem = item;
                            recommendedList.push(item);
                        }
                        else {
                            list.push(item);
                        }
                    }

                    function getRecommended() {
                        //находим рекомендованный - первый из сортировки по рейтингу INNA.RU - по рекомендованности (по умолчанию), затем по дате/времени отправления ТУДА, затем по дате/времени отправления ОБРАТНО
                        var min = { item: null, factor: Number.MAX_VALUE };

                        _.each(recommendedList, function (item) {
                            if (item.RecommendedFactor < min.factor) {
                                min.item = item;
                                min.factor = item.RecommendedFactor;
                            }
                        });

                        //нашли минимальный
                        return min.item;
                    }
                    
                    recomendedItem = getRecommended();
                    //console.log('');
                    //console.log(recomendedItem);

                    //добавляем к списку остальные рекомендованные
                    _.each(recommendedList, function (item) {
                        if (item != recomendedItem) {
                            list.push(item);
                        }
                    });

                    //добавляем список
                    $scope.ticketsList = list;
                    $scope.recomendedItem = recomendedItem;

                    updateFilter(data.Items);
                }
                else
                {
                    $scope.ticketsList = [];
                    log('updateModel - nothing to update, data is empty');
                    $scope.baloon.showErr('К сожалению, ничего не нашлось', 'Попробуйте выбрать другие даты', function () {
                        $location.path(Urls.URL_AVIA);
                    });
                    $scope.isDataLoading = false;
                }
            };

            function updateFilter(items) {
                var filter = {};

                //мин / макс цена
                filter.minPrice = _.min(items, function (item) { return item.Price; }).Price;
                filter.maxPrice = _.max(items, function (item) { return item.Price; }).Price;

                //пересадки =============================================================================================

                //заполняем список фильтров по пересадкам
                var transferCountListAgg = [];
                var InTransferCount0Added = false;
                var InTransferCount1Added = false;
                var InTransferCount2Added = false;
                _.each(items, function (item) {
                    //в каждом элементе сразу вычисляем принадлежность к фильтру (для ускорения фильтрации)
                    item.InTransferCount0 = false;
                    item.InTransferCount1 = false;
                    item.InTransferCount2 = false;

                    if (item.ToTransferCount == 0 && item.BackTransferCount == 0)
                    {
                        //есть без пересадок
                        item.InTransferCount0 = true;
                        if (!InTransferCount0Added) {
                            InTransferCount0Added = true;
                            transferCountListAgg.push({ name: "Без пересадок", value: 0, checked: false, price: 0 });
                        }
                    }
                    else if (item.ToTransferCount >= 2 || item.BackTransferCount >= 2) {
                        //2 и более пересадок
                        item.InTransferCount2 = true;
                        if (!InTransferCount2Added) {
                            InTransferCount2Added = true;
                            transferCountListAgg.push({ name: "2 и более пересадки", value: 2, checked: false, price: 0 });
                        }
                    }
                    else if (item.ToTransferCount <= 1 && item.BackTransferCount <= 1 && item.InTransferCount0 == false)
                    {
                        //1 пересадка, но не включает в себя без пересадок
                        item.InTransferCount1 = true;
                        if (!InTransferCount1Added) {
                            InTransferCount1Added = true;
                            transferCountListAgg.push({ name: "1 пересадка", value: 1, checked: false, price: 0 });
                        }
                    }
                    else
                    {
                        log('Warning! item miss filter: ' + item.ToTransferCount + ' ' + item.BackTransferCount);
                    }
                    
                });

                //фильтр сразу сортируем
                filter.TransferCountListAgg = _.sortBy(transferCountListAgg, function (item) { return item.value; });

                function calcPrices(tcAgg, fnInTransferCount) {
                    //находим элементы с нужным кол-вом пересадок
                    var list = _.filter(items, function (item) {
                        return fnInTransferCount(item) == true;
                    });
                    tcAgg.price = _.min(list, function (item) { return item.Price; }).Price;
                }
                //вычисляем мин цену (рядом со значением фильтра)
                _.each(filter.TransferCountListAgg, function (tcAgg) {
                    switch(tcAgg.value)
                    {
                        case 0:
                            {
                                //находим элементы с нужным кол-вом пересадок
                                calcPrices(tcAgg, function (item) { return item.InTransferCount0; });
                                break;
                            }
                        case 1:
                            {
                                calcPrices(tcAgg, function (item) { return item.InTransferCount1; });
                                break;
                            }
                        case 2:
                            {
                                calcPrices(tcAgg, function (item) { return item.InTransferCount2; });
                                break;
                            }
                    }
                });

                //пересадки =============================================================================================

                //список авиа компаний
                filter.TransporterList = [];
                function addTransporterCodes(items) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];

                        item.transportersCodes = [];

                        for (var e = 0; e < item.EtapsTo.length; e++) {
                            var etap = item.EtapsTo[e];
                            filter.TransporterList.push(new transporter(etap.TransporterName, etap.TransporterCode, etap.TransporterLogo));
                            item.transportersCodes.push(etap.TransporterCode);
                        }

                        for (var e = 0; e < item.EtapsBack.length; e++) {
                            var etap = item.EtapsBack[e];
                            filter.TransporterList.push(new transporter(etap.TransporterName, etap.TransporterCode, etap.TransporterLogo));
                            item.transportersCodes.push(etap.TransporterCode);
                        }

                        item.transportersCodes = _.uniq(item.transportersCodes);
                    }
                }
                addTransporterCodes(items);

                //находим уникальные
                filter.TransporterList = _.uniq(filter.TransporterList, false, function (item) {
                    return item.TransporterCode;
                });

                //цены для компаний
                for (var i = 0; i < filter.TransporterList.length; i++) {
                    var tr = filter.TransporterList[i];
                    var fList = _.filter(items, function (item) { return (_.indexOf(item.transportersCodes, tr.TransporterCode) > -1) });
                    tr.price = _.min(fList, function (item) { return item.Price; }).Price;
                }

                //мин / макс время отправления туда обратно
                filter.minDepartureDate = _.min(items, function (item) { return item.sort.DepartureDate; }).sort.DepartureDate;
                filter.maxDepartureDate = _.max(items, function (item) { return item.sort.DepartureDate; }).sort.DepartureDate;
                filter.minArrivalDate = _.min(items, function (item) { return item.sort.ArrivalDate; }).sort.ArrivalDate;
                filter.maxArrivalDate = _.max(items, function (item) { return item.sort.ArrivalDate; }).sort.ArrivalDate;
                filter.minBackDepartureDate = _.min(items, function (item) { return item.sort.BackDepartureDate; }).sort.BackDepartureDate;
                filter.maxBackDepartureDate = _.max(items, function (item) { return item.sort.BackDepartureDate; }).sort.BackDepartureDate;
                filter.minBackArrivalDate = _.min(items, function (item) { return item.sort.BackArrivalDate; }).sort.BackArrivalDate;
                filter.maxBackArrivalDate = _.max(items, function (item) { return item.sort.BackArrivalDate; }).sort.BackArrivalDate;

                function timeFilter(direction, dayTime) {
                    var hoursMin = 0;
                    var hoursMax = 0;
                    var text = '';
                    switch (direction) {
                        case aviaHelper.directionType.departure: text = 'вылет туда '; break;
                        case aviaHelper.directionType.arrival: text = 'прилет туда '; break;
                        case aviaHelper.directionType.backDeparture: text = 'вылет обратно '; break;
                        case aviaHelper.directionType.backArrival: text = 'прилет обратно '; break;
                    }
                    switch (dayTime) {
                        case aviaHelper.dayTime.morning: hoursMin = 6; hoursMax = 12; text += 'утром'; break;
                        case aviaHelper.dayTime.day: hoursMin = 12; hoursMax = 18; text += 'днем'; break;
                        case aviaHelper.dayTime.evening: hoursMin = 18; hoursMax = 24; text += 'вечером'; break;
                        case aviaHelper.dayTime.night: hoursMin = 0; hoursMax = 6; text += 'ночью'; break;
                    }
                    return { direction: direction, dayTime: dayTime, hoursMin: hoursMin, hoursMax: hoursMax, name: text, checked: false };
                }

                //время
                function time() {
                    var self = this;
                    self.list = [];

                    self.list.push(new timeFilter(aviaHelper.directionType.departure, aviaHelper.dayTime.morning));
                    self.list.push(new timeFilter(aviaHelper.directionType.departure, aviaHelper.dayTime.day));
                    self.list.push(new timeFilter(aviaHelper.directionType.departure, aviaHelper.dayTime.evening));
                    self.list.push(new timeFilter(aviaHelper.directionType.departure, aviaHelper.dayTime.night));

                    self.list.push(new timeFilter(aviaHelper.directionType.arrival, aviaHelper.dayTime.morning));
                    self.list.push(new timeFilter(aviaHelper.directionType.arrival, aviaHelper.dayTime.day));
                    self.list.push(new timeFilter(aviaHelper.directionType.arrival, aviaHelper.dayTime.evening));
                    self.list.push(new timeFilter(aviaHelper.directionType.arrival, aviaHelper.dayTime.night));

                    self.list.push(new timeFilter(aviaHelper.directionType.backDeparture, aviaHelper.dayTime.morning));
                    self.list.push(new timeFilter(aviaHelper.directionType.backDeparture, aviaHelper.dayTime.day));
                    self.list.push(new timeFilter(aviaHelper.directionType.backDeparture, aviaHelper.dayTime.evening));
                    self.list.push(new timeFilter(aviaHelper.directionType.backDeparture, aviaHelper.dayTime.night));

                    self.list.push(new timeFilter(aviaHelper.directionType.backArrival, aviaHelper.dayTime.morning));
                    self.list.push(new timeFilter(aviaHelper.directionType.backArrival, aviaHelper.dayTime.day));
                    self.list.push(new timeFilter(aviaHelper.directionType.backArrival, aviaHelper.dayTime.evening));
                    self.list.push(new timeFilter(aviaHelper.directionType.backArrival, aviaHelper.dayTime.night));
                }

                filter.time = new time();

                //console.log($scope.criteria);
                //console.log(items[0]);

                //аэропорты
                function airportFilter(items) {
                    var self = this;

                    var fromPorts = [];
                    var toPorts = [];
                    _.each(items, function (item) {
                        fromPorts.push({ name: item.AirportFrom, code: item.OutCode, checked: false });
                        toPorts.push({ name: item.AirportTo, code: item.InCode, checked: false });
                    });
                    fromPorts = _.uniq(fromPorts, false, function (item) {
                        return item.code;
                    });
                    toPorts = _.uniq(toPorts, false, function (item) {
                        return item.code;
                    });
                    //цены
                    _.each(fromPorts, function (port) {
                        var fList = _.filter(items, function (item) { return item.OutCode == port.code; });
                        var price = _.min(fList, function (item) { return item.Price; }).Price;
                        port.price = price;
                    });
                    _.each(toPorts, function (port) {
                        var fList = _.filter(items, function (item) { return item.InCode == port.code; });
                        var price = _.min(fList, function (item) { return item.Price; }).Price;
                        port.price = price;
                    });

                    //заполняем фильтр
                    self.fromName = $scope.criteria.From;
                    self.toName = $scope.criteria.To;
                    self.fromPorts = fromPorts;
                    self.toPorts = toPorts;
                }

                filter.AirportFilter = new airportFilter(items);
                //console.log(filter.AirportFilter);

                //задаем фильтр
                $scope.filter = new aviaFilter(filter);
                //log('updateFilter ' + angular.toJson($scope.filter));
                //log('updateFilter');

                applyFilter($scope);
            };

            function applyFilter($scope) {
                var filteredList = [];
                //log('applyFilter ' + new Date());

                //список выбранных значений
                var transferCountCheckedList = _.filter($scope.filter.TransferCountListAgg, function (item) { return item.checked == true });
                //туда, флаг, что хоть что-то выбрано
                //var anyTransferCountChecked = (transferCountCheckedList != null && transferCountCheckedList.length > 0);
                var noTransfersCountChecked = _.all($scope.filter.TransferCountListAgg, function (item) { return item.checked == false });

                //выбрана хотя бы одна компания
                //var anyTransporterChecked = _.any($scope.filter.TransporterList, function (item) { return item.checked == true });
                var noTransporterChecked = _.all($scope.filter.TransporterList, function (item) { return item.checked == false });
                //список всех выбранных а/к
                var transporterListCheckedList = _.filter($scope.filter.TransporterList, function (item) { return item.checked == true });
                transporterListCheckedList = _.map(transporterListCheckedList, function (item) { return item.TransporterCode });

                var departureFilters = _.filter($scope.filter.time.list, function(item){ return item.checked && item.direction == aviaHelper.directionType.departure; });
                var arrivalFilters = _.filter($scope.filter.time.list, function (item) { return item.checked && item.direction == aviaHelper.directionType.arrival; });
                var backDepartureFilters = _.filter($scope.filter.time.list, function (item) { return item.checked && item.direction == aviaHelper.directionType.backDeparture; });
                var backArrivalFilters = _.filter($scope.filter.time.list, function (item) { return item.checked && item.direction == aviaHelper.directionType.backArrival; });

                function anyMatch(filtersList, hours) {
                    for (var i = 0; i < filtersList.length; i++) {
                        var filterItem = filtersList[i];
                        if (hours >= filterItem.hoursMin && hours < filterItem.hoursMax) {
                            return true;
                        }
                    }
                    return false;
                }

                function itemPassesFilterByTimeTo(item) {
                    if (anyMatch(departureFilters, item.sort.DepartureHours)) {
                        return true;
                    }
                    if (anyMatch(arrivalFilters, item.sort.ArrivalHours)) {
                        return true;
                    }
                    return false;
                }

                function itemPassesFilterByTimeBack(item) {
                    if (anyMatch(backDepartureFilters, item.sort.BackDepartureHours)) {
                        return true;
                    }
                    if (anyMatch(backArrivalFilters, item.sort.BackArrivalHours)) {
                        return true;
                    }
                    return false;
                }

                var noTimeFilterToSelected = !(_.any(departureFilters, function (item) { return item.checked; }) || _.any(arrivalFilters, function (item) { return item.checked; }));
                var noTimeFilterBackSelected = !(_.any(backDepartureFilters, function (item) { return item.checked; }) || _.any(backArrivalFilters, function (item) { return item.checked; }));

                var fromPortsFilters = _.filter($scope.filter.AirportFilter.fromPorts, function (item) { return item.checked; });
                var toPortsFilters = _.filter($scope.filter.AirportFilter.toPorts, function (item) { return item.checked; });
                var noFromPortsSelected = !(fromPortsFilters != null && fromPortsFilters.length > 0);
                var noToPortsSelected = !(toPortsFilters != null && toPortsFilters.length > 0);

                //заодно в цикле вычисляем признак самого дешевого билета
                var minPriceItem = { item: null, price: Number.MAX_VALUE };
                if ($scope.ticketsList != null) {
                    for (var i = 0; i < $scope.ticketsList.length; i++) {
                        var item = $scope.ticketsList[i];
                        //признак самого дешевого
                        item.isCheapest = false;

                        //итем в массиве выбранных значений туда  //не вычисляем, если ничего не выбрано
                        var itemInTransferCount = noTransfersCountChecked ? null : _.any(transferCountCheckedList, function (toCheck) {
                            switch (toCheck.value) {
                                case 0: return item.InTransferCount0 == true;
                                case 1: return item.InTransferCount1 == true;
                                case 2: return item.InTransferCount2 == true;
                            }
                        });

                        //а/к - авиакомпании item'а входят в разрешенный список
                        var itemInTransportTo = null;
                        var itemInTransportBack = null;
                        if (noTransporterChecked == false) {//н евыбисляем, если ничего не выбрано
                            itemInTransportTo = _.all(item.EtapsTo, function (etap) {
                                return (_.indexOf(transporterListCheckedList, etap.TransporterCode) > -1);
                            });
                            if (item.EtapsBack.length == 0) {
                                itemInTransportBack = false;
                            }
                            else {
                                itemInTransportBack = _.all(item.EtapsBack, function (etap) {
                                    return (_.indexOf(transporterListCheckedList, etap.TransporterCode) > -1);
                                });
                            }
                        }
                        
                        var itemInTransport = (itemInTransportTo || itemInTransportBack);

                        var itemInFromPort = noFromPortsSelected ? null : _.any(fromPortsFilters, function (port) { return port.code == item.OutCode; });
                        var itemInToPort = noToPortsSelected ? null : _.any(toPortsFilters, function (port) { return port.code == item.InCode; });

                        //проверяем цену
                        if (item.Price >= $scope.filter.minPrice && item.Price <= $scope.filter.maxPrice
                            //пересадки
                            //&& (noTransfersCountChecked || (anyTransferCountChecked && itemInTransferCount))
                            && (noTransfersCountChecked || itemInTransferCount)
                            //а/к
                            //&& (noTransporterChecked || (anyTransporterChecked && itemInTransport))
                            && (noTransporterChecked || itemInTransport)
                            ////дата отправления / прибытия  туда / обратно
                            //&& (item.sort.DepartureDate >= $scope.filter.minDepartureDate && item.sort.DepartureDate <= $scope.filter.maxDepartureDate)
                            //&& (item.sort.ArrivalDate >= $scope.filter.minArrivalDate && item.sort.ArrivalDate <= $scope.filter.maxArrivalDate)
                            //&& (item.sort.BackDepartureDate >= $scope.filter.minBackDepartureDate && item.sort.BackDepartureDate <= $scope.filter.maxBackDepartureDate)
                            //&& (item.sort.BackArrivalDate >= $scope.filter.minBackArrivalDate && item.sort.BackArrivalDate <= $scope.filter.maxBackArrivalDate)

                            && (noTimeFilterToSelected || itemPassesFilterByTimeTo(item))
                            && (noTimeFilterBackSelected || itemPassesFilterByTimeBack(item))

                            && (noFromPortsSelected || itemInFromPort)
                            && (noToPortsSelected || itemInToPort)

                            )
                        {
                            //вычисляем самый дешевый
                            if (item.Price < minPriceItem.price)
                            {
                                minPriceItem.item = item;
                                minPriceItem.price = item.Price;
                            }

                            filteredList.push(item);
                        }
                    }

                    //присваиваем признак самого дешевого билета
                    if (minPriceItem.item != null)
                    {
                        minPriceItem.item.isCheapest = true;
                    }
                    $scope.filteredTicketsList = filteredList;

                    applySort();
                }

                $scope.isDataLoading = false;
                $scope.baloon.hide();
            };

            function applySort() {
                $scope.filteredTicketsList = $filter('orderBy')($scope.filteredTicketsList, $scope.SortFilter.sortType, $scope.SortFilter.reverse);

                //var debugList = _.map($scope.filteredTicketsList, function (item) { return { IsRecomendation: item.IsRecomendation, RecommendedFactor: item.RecommendedFactor } });
                //console.log(debugList);

                $scope.scrollControl.init();
            }

            $scope.$watch('SortFilter', function () {
                applySort();
            }, true);

            function scrollControl() {
                var self = this;
                self.MAX_VISIBLE_ITEMS = 5;
                self.lastScrollOffset = 0;

                self.init = function () {
                    self.lastScrollOffset = 0;
                    if ($scope.filteredTicketsList != null && $scope.filteredTicketsList.length >= self.MAX_VISIBLE_ITEMS) {
                        $scope.visibleFilteredTicketsList = $scope.filteredTicketsList.slice(0, self.MAX_VISIBLE_ITEMS);
                    }
                    else {
                        $scope.visibleFilteredTicketsList = $scope.filteredTicketsList;
                    }

                    //console.log('visible: ' + ($scope.visibleFilteredTicketsList != null ? $scope.visibleFilteredTicketsList.length : 'null'));
                }

                self.loadMore = function () {
                    $scope.$apply(function ($scope) {
                        var fromIndex = $scope.visibleFilteredTicketsList.length;
                        var toIndex = fromIndex + self.MAX_VISIBLE_ITEMS;
                        if (toIndex > $scope.filteredTicketsList.length) {
                            toIndex = $scope.filteredTicketsList.length;
                        }
                        if (fromIndex < toIndex) {
                            for (var i = fromIndex; i < toIndex; i++) {
                                $scope.visibleFilteredTicketsList.push($scope.filteredTicketsList[i]);
                            }
                        }

                    });

                    //console.log('visible: ' + ($scope.visibleFilteredTicketsList != null ? $scope.visibleFilteredTicketsList.length : 'null'));
                }

                $(window).scroll(function () {
                    var scrollTop = $(window).scrollTop();
                    if (scrollTop + $(window).height() > $(document).height() - 300 &&
                        scrollTop > $scope.scrollControl.lastScrollOffset) {
                        $scope.scrollControl.lastScrollOffset = scrollTop;
                        $scope.scrollControl.loadMore();
                    }
                });
            }
        }]);
angular.module('innaApp.controllers')
    .controller('AuthCtrl', [
        '$scope', '$location', 'innaApp.API.events', 'AuthDataProvider', 'innaApp.Urls',
        function($scope, $location, Events, AuthDataProvider, app){
            /*Private*/
            function setUserInfo(data){
                $scope.safeApply(function(){
                    $scope.$root.user = new inna.Models.Auth.User(data);

                    if($scope.user.isAgency() && !$scope.user.raw.AgencyActive) {
                        $scope.logout();
                        $scope.baloon.error('Агентство отключено', 'Авторизация невозможна');
                    }
                });
            }

            /*Methods*/
            $scope.close = function(){
                $scope.isLoginPopupOpened = false;
                $scope.display = $scope.DISPLAY_SIGNIN;
            };

            $scope.logout = function () {
                var wasLoggedUser = $scope.$root.user;

                $scope.$root.user = null;

                AuthDataProvider.logout();

                $scope.$emit(Events.AUTH_SIGN_OUT, wasLoggedUser.raw);
            };

            $scope.open = function(){
                $scope.isLoginPopupOpened = true;
            };

            $scope.signInWith = function(method){
                var brokerWindow = window.open(AuthDataProvider.socialBrockerURL(method), "width=300;height=300", "SocialBrocker");

                brokerWindow.focus();

                $('#social-broker-listener').on('inna.Auth.SocialBroker.Result', function(event, data){
                    AuthDataProvider.recognize(function(data){
                        $scope.$apply(function($scope){
                            setUserInfo(data);
                            $scope.close();
                        });
                    });
                });
            };

            $scope.showProfile = function(){
            	if($scope.user.isAgency()) {
            		window.location = $scope.B2B_HOST;
            		return;
            	}
            	
                $scope.open();
                $scope.display = $scope.DISPLAY_PROFILE;
            };

            $scope.forgotten = function(){
                $scope.display = $scope.DISPLAY_FORGOTTEN;
            };

            /*Properties*/
            $scope.restoreToken = ($location.path() == app.URL_AUTH_RESTORE) && $location.search().token;
            $scope.signUpToken = ($location.path() == app.URL_AUTH_SIGNUP) && $location.search().token;

            $scope.DISPLAY_SIGNIN = 1;
            $scope.DISPLAY_FORGOTTEN = 2;
            $scope.DISPLAY_SIGNUP = 3;
            $scope.DISPLAY_PROFILE = 4;

            $scope.isLoginPopupOpened = false;

            $scope.display = $scope.DISPLAY_SIGNIN;

            if($scope.restoreToken) {
                $scope.display = $scope.DISPLAY_FORGOTTEN;
                $scope.open();
            } else if($scope.signUpToken) {
                $scope.display = $scope.DISPLAY_SIGNUP;
                $scope.open();
            }

            $scope.recognize = function(){
                console.log('RECOGNIZE');

                AuthDataProvider.recognize(setUserInfo);
            }

            $scope.B2B_HOST = window.DEV && window.DEV_B2B_HOST || app_main.b2bHost;

            /*EventListeners*/
            $scope.$on(Events.AUTH_SIGN_IN, function (event, data) {
                //console.log(data);
                $scope.safeApply(function(){
                    setUserInfo(data);
                    $scope.close();
                });
            });

            /*Initial*/
            $scope.recognize();
        }
    ]);
angular.module('innaApp.controllers')
    .controller('AuthProfileCtrl', [
        '$scope', 'AuthDataProvider', 'Validators',
        function($scope, AuthDataProvider, Validators){
            /*Private*/
            function validate(){
                var isFilled = function(field) {
                    try {
                        Validators.defined(field, false);

                        return true;
                    } catch(e) {
                        return false;
                    }
                }

                if(isFilled($scope.user.raw.Phone)) {
                    Validators.phone($scope.user.raw.Phone, 'phone');
                }

                if($scope.state.allowChangePassword) {
                    Validators.defined($scope.currentPassword, 'currentPassword');
                    Validators.defined($scope.newPassword, 'emptyPassword');
                    Validators.minLength($scope.newPassword, 6, 'passwordMinLength');
                    Validators.equals($scope.newPassword, $scope.newPassword2, 'passwordNotMatch')
                }
            }

            /*Properties*/
            $scope.state = {
                allowChangePassword: false
            };

            $scope.errors = {};

            $scope.currentPassword = '';
            $scope.newPassword = '';
            $scope.newPassword2 = '';

            $scope.$watch('currentPassword', function(){
                $scope.errors.currentPassword = false;
            });

            $scope.$watch('newPassword', function(){
                $scope.errors.emptyPassword = false;
                $scope.errors.passwordMinLength = false;
            });

            $scope.$watch('newPassword2', function(){
                $scope.errors.passwordNotMatch = false;
            });

            /*Methods*/
            $scope.save = function(){
                try {
                    validate();

                    //if ok
                    var requests = [];

                    requests.push(AuthDataProvider.changeInfo($scope.user.raw));

                    if($scope.state.allowChangePassword) {
                        requests.push(AuthDataProvider.changePassword({
                            OldPassword: $scope.currentPassword,
                            NewPassword: $scope.newPassword,
                            ConfirmPassword: $scope.newPassword2
                        }));
                    }


                    $.when.apply($, requests).then(function(){
                        $scope.$apply(function($scope){
                            $scope.close();
                        });
                    });
                } catch(e) {
                    $scope.errors[e] = true;
                }
            };

            $scope.allowChangePassword = function(){
                $scope.state.allowChangePassword = true;
            };
        }
    ]);
angular.module('innaApp.controllers')
    .controller('AuthPwdRerstoreCtrl_A', [
        '$scope', 'Validators', 'AuthDataProvider',
        function($scope, Validators, AuthDataProvider) {
            function validate() {
                Validators.email($scope.email, 'email');
            }

            function sendToken() {
                AuthDataProvider.sendToken({
                    Email: $scope.email
                }, function(){ //success
                    $scope.$apply(function($scope){
                        $scope.showLanding = true;
                    });
                }, function(){ //error
                    $scope.$apply(function($scope){
                        $scope.requestFailure = true;
                    });
                });
            }

            /*Properties*/
            $scope.email = 'user@example.com';

            $scope.$watch('email', function(){
                $scope.errors.email = false;
                $scope.requestFailure = false;
            });

            $scope.errors = {};

            $scope.requestFailure = false;

            $scope.showLanding = false;

            /*Methods*/
            $scope.sendToken = function(){
                try {
                    validate();

                    //if ok
                    sendToken();
                } catch(fieldName) {
                    $scope.errors[fieldName] = true;
                }
            }
        }
    ])
    .controller('AuthPwdRerstoreCtrl_B', [
        '$scope', 'Validators', 'AuthDataProvider', '$timeout', '$location',
        function($scope, Validators, AuthDataProvider, $timeout, $location){
            function validate() {
                Validators.defined($scope.password, 'password');
                Validators.minLength($scope.password, 6, 'passwordMinLength');
                Validators.equals($scope.password, $scope.password2, 'password2');
            }

            function setNewPassword(){
                console.log('setNewPassword');

                AuthDataProvider.setNewPassword($scope.restoreToken, {
                    newPassword: $scope.password,
                    confirmPassword: $scope.password2
                }, function(){
                    $scope.$apply(function($scope){
                        $scope.success = true;

                        $timeout(function(){
                            document.location = '/';
                        }, 1500);
                    });
                }, function(){
                    $scope.$apply(function($scope){
                        $scope.requestFailed = true;
                    });
                });
            }

            /*Properties*/
            $scope.password = '';

            $scope.$watch('password', function(){
                $scope.errors.password = false;
                $scope.errors.passwordMinLength = false;
            });

            $scope.password2 = '';

            $scope.$watch('password2', function(){
                $scope.errors.password2 = false;
            });

            $scope.errors = {}

            $scope.requestFailed = false;

            $scope.success = false;

            /*Methods*/
            $scope.setNewPassword = function(){
                try {
                    validate();
                } catch(fieldName) {
                    $scope.errors[fieldName] = true;

                    return;
                }

                //if ok
                setNewPassword();
            };

            $scope.hasError = function(fieldName) {
                if($scope.errors[fieldName]) return 'error';

                return '';
            }
        }
    ]);
angular.module('innaApp.controllers')
    .controller('AuthSignInCtrl', [
        '$scope', 'Validators', 'AuthDataProvider', '$rootScope', 'innaApp.API.events',
        function($scope, Validators, AuthDataProvider, $rootScope, Events){
            function validate() {
                Validators.defined($scope.username, 'username');
                Validators.defined($scope.password, 'password');
            }

            function signIn(){
                AuthDataProvider.signIn({
                    Email: $scope.username,
                    Password: $scope.password,
                    RememberMe: $scope.rememberMe.toString()
                }, function(data){ //success
                    $scope.$emit(Events.AUTH_SIGN_IN, data);
                }, function(){ //error
                    $scope.$apply(function($scope){
                        $scope.requestFailure = true;
                    });
                });
            }

            /*Properties*/
            $scope.username = '';

            $scope.$watch('username', function(){
                $scope.errors.username = false;
            });

            $scope.password = '';

            $scope.$watch('password', function(){
                $scope.errors.password = false;
            });

            $scope.rememberMe = true;

            $scope.errors = {};

            $scope.requestFailure = false;

            /*Methods*/
            $scope.signIn = function(){
                try {
                    validate();

                    //if ok
                    signIn();
                } catch(fieldName) {
                    $scope.errors[fieldName] = true;
                }
            };

            $scope.switchRememberMe = function(){
                $scope.rememberMe = !$scope.rememberMe;
            }
        }
    ]);
angular.module('innaApp.controllers')
    .controller('AuthRegistrationCtrl', [
        '$scope', 'AuthDataProvider', 'Validators',
        function($scope, AuthDataProvider, Validators){
            function validate(){
                Validators.email($scope.email, 'email');
                Validators.defined($scope.password, 'password');
                Validators.minLength($scope.password, 6, 'passwordMinLength')
                Validators.equals($scope.password, $scope.password2, 'password2');
            }

            function register(){
                AuthDataProvider.signUp({
                    Email: $scope.email,
                    Password: $scope.password,
                    ConfirmPassword: $scope.password2
                }, function (data){ //successfully signed up
                    $scope.safeApply(function(){
                        $scope.showLanding = true;
                    });
                }, function (error){ //error has occurred
                    $scope.safeApply(function(){
                        $scope.requestFailure = true;
                    });
                });
            }

            /*Properties*/
            $scope.email = '';

            $scope.$watch('email', function(){
                $scope.errors.email = false;
                $scope.requestFailure = false;
            });

            $scope.password = '';

            $scope.$watch('password', function(){
                $scope.errors.password = false;
                $scope.errors.passwordMinLength = false;
            });

            $scope.$watch('password2', function(){
                $scope.errors.password2 = false;
            });

            $scope.password2 = '';

            $scope.errors = {};

            $scope.showLanding = false;

            $scope.requestFailure = false;

            /*Methods*/
            $scope.register = function(){
                try {
                    validate();

                    //if ok
                    register();
                } catch(fieldName) {
                    $scope.errors[fieldName] = true;
                }
            };

            $scope.hasError = function(fieldName){
                var error = 'error';

                if($scope.errors[fieldName]) return error;

                if(fieldName == 'email' && $scope.requestFailure) return error;

                return '';
            }
        }
    ])
    .controller('AuthRegistrationCtrl_Step2', [
        '$scope', 'AuthDataProvider',
        function($scope, AuthDataProvider) {
            console.log('AuthRegistrationCtrl_Step2', $scope);

            $scope.baloon.show('Завершаю регистрацию', 'Это займет несколько секунд');

            AuthDataProvider.confirmRegistration($scope.signUpToken, function(resp){
                $scope.safeApply(function(){
                    $scope.baloon.hide();
                    $scope.close();

                    $scope.safeApply($scope.recognize);
                });
            });
        }
    ]);
innaAppControllers
    .controller('DynamicFormCtrl', [
        '$scope',
        'DynamicPackagesDataProvider',
        '$rootScope',
        'DynamicPackagesCacheWizard',
        'Validators',
        '$location',
        'innaApp.Urls',
        '$cookieStore',
        function($scope, DynamicPackagesDataProvider, $rootScope, DynamicPackagesCacheWizard, Validators, $location, URLs, $cookieStore){
            var AS_MAP_CACHE_KEY = 'serp-as-map';

            var routeParams = (function(path){
                if(path.indexOf(URLs.URL_DYNAMIC_PACKAGES_SEARCH) === -1) return {};

                path = path.split('/');
                path = path[path.length - 1] || path[path.length - 2];

                var bits = path.split('-');

                return {
                    DepartureId: bits[0],
                    ArrivalId: bits[1],
                    StartVoyageDate: bits[2],
                    EndVoyageDate: bits[3],
                    TicketClass: bits[4],
                    Adult: bits[5]
                }
            })($location.path());

            function validate(){
                Validators.defined($scope.fromCurrent, Error('fromCurrent'));
                Validators.defined($scope.toCurrent, Error('toCurrent'));
                Validators.notEqual($scope.fromCurrent, $scope.toCurrent, Error('toCurrent'));

                var children = _.partition($scope.childrensAge, function(ageSelector){ return ageSelector.value < 2;});
                var infants = children[0].length;
                children = children[1].length;
                var separatedInfants = infants - $scope.adultCount;
                if(separatedInfants < 0) separatedInfants = 0;

                if(+$scope.adultCount + children + separatedInfants > 6) throw Error('adultCount');

                Validators.defined($scope.dateBegin, Error('dateBegin'));
                Validators.defined($scope.dateEnd, Error('dateEnd'));
            }

            $scope.loadObjectById = function(id, callback){
                DynamicPackagesDataProvider.getObjectById(id, callback);
            }

    		/* From field */
            $scope.fromList = [];

            $scope.provideSuggestToFromList = function(preparedText, rawText){
                DynamicPackagesDataProvider.getFromListByTerm(preparedText, function(data){
                    $scope.$apply(function($scope) {
                        $scope.fromList = data;
                    });
                })
            }

            $scope.fromCurrent = routeParams.DepartureId || DynamicPackagesCacheWizard.require('fromCurrent', function(){
                DynamicPackagesDataProvider.getUserLocation(function(data){
                    $scope.fromCurrent = data;
                });
            });

            $scope.$watch('fromCurrent', function(newVal){
                DynamicPackagesCacheWizard.put('fromCurrent', newVal);
            });

	        /* To field */
	        $scope.toList = [];

	        $scope.provideSuggestToToField = function(preparedText, rawText) {
                DynamicPackagesDataProvider.getToListByTerm(preparedText, function(data){
                    $scope.$apply(function($scope) {
                        $scope.toList = data;
                    });
                })
	        }

            $scope.toCurrent = routeParams.ArrivalId || DynamicPackagesCacheWizard.require('toCurrent');

            $scope.$watch('toCurrent', function(newVal){
                DynamicPackagesCacheWizard.put('toCurrent', newVal);
            });

            /*Begin date*/
            $scope.dateBegin = routeParams.StartVoyageDate || DynamicPackagesCacheWizard.require('dateBegin');

            $scope.$watch('dateBegin', function(newVal) {
                DynamicPackagesCacheWizard.put('dateBegin', newVal);
            });

            /*End date*/
            $scope.dateEnd = routeParams.EndVoyageDate || DynamicPackagesCacheWizard.require('dateEnd');

            $scope.$watch('dateEnd', function(newVal) {
                DynamicPackagesCacheWizard.put('dateEnd', newVal);
            });

            /*Adult count*/
            $scope.adultCount = routeParams.Adult || 2;

            /*Children count*/
            $scope.childrenCount = 0;

            /*Children ages*/
            //TODO fix English
            $scope.childrensAge = [];

            /*Klass*/
            $scope.klass = _.find(TripKlass.options, function(klass){
                var cached = routeParams.TicketClass ||
                    DynamicPackagesCacheWizard.require('klass', function(){ return TripKlass.ECONOM; });

                return (klass.value == cached);
            });

            $scope.$watchCollection('klass', function(newVal){
                newVal = newVal || TripKlass.options[0];
                DynamicPackagesCacheWizard.put('klass', newVal.value);
            });


            /*Methods*/
            $scope.searchStart = function(){

              // удаляем куки состояния открытой карты
              DynamicPackagesCacheWizard.put(AS_MAP_CACHE_KEY, 0);

              // если есть get параметр map=show, удалаяем его
              if ($location.search().map) {
                delete $location.$$search.map;
                $location.$$compose();
              }


                try {
                    validate();
                    //if ok
                    var o = {
                        ArrivalId: $scope.toCurrent,
                        DepartureId: $scope.fromCurrent,
                        StartVoyageDate: $scope.dateBegin,
                        EndVoyageDate: $scope.dateEnd,
                        TicketClass: $scope.klass.value,
                        Adult: $scope.adultCount,
                        children: _.map($scope.childrensAge, function(selector, n){ return selector.value; }),
                    }
                    $rootScope.$emit('inna.DynamicPackages.Search', o);
                } catch(e) {
                    console.warn(e);
                    if($scope.hasOwnProperty(e.message)) {
                        $scope[e.message] = e;
                    }
                }
            }
        }
    ]);
innaAppControllers.
    controller('DynamicPackageMordaCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'innaApp.services.PageContentLoader', 'innaApp.API.pageContent.DYNAMIC',
        function ($scope, DynamicFormSubmitListener, PageContentLoader, sectionID) {
            /*EventListeners*/
            DynamicFormSubmitListener.listen();

            /*Data fetching*/
            PageContentLoader.getSectionById(sectionID, function (data) {
                //обновляем данные
                if (data != null) {
                    $scope.$apply(function($scope) {
                        $scope.sections = data.SectionLayouts;
                    });
                }
            });
        }
    ]);
﻿angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
        '$scope',
        '$controller',
        '$routeParams',
        '$location',
        'DynamicFormSubmitListener',
        'DynamicPackagesDataProvider',
        'aviaHelper',
        'paymentService',
        'innaApp.Urls',
        'storageService',
        'urlHelper',
        function ($scope, $controller, $routeParams, $location, DynamicFormSubmitListener, DynamicPackagesDataProvider, aviaHelper,
            paymentService, Urls, storageService, urlHelper) {

            $scope.baloon.show('Проверка доступности билетов', 'Подождите пожалуйста, это может занять несколько минут');
            //initial
            (function(){
                var children = $routeParams.Children ?
                    _.partition($routeParams.Children.split('_'), function(age){ return age > 2; }) :
                    [[], []];

                var searchParams = angular.copy($routeParams);
                var cacheKey = '';

                searchParams.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.StartVoyageDate);
                searchParams.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.EndVoyageDate);
                searchParams.Children && (searchParams.ChildrenAges = searchParams.Children.split('_'));

                if ($location.search().hotel) searchParams['HotelId'] = $location.search().hotel;
                if ($location.search().ticket) searchParams['TicketId'] = $location.search().ticket;
                if ($location.search().room) searchParams['RoomId'] = $location.search().room;

                $scope.searchParams = searchParams;

                $scope.combination = {};

                DynamicPackagesDataProvider.search(searchParams, function(data){
                    cacheKey = data.SearchId;

                    $scope.$apply(function($scope){
                        $controller('ReserveTicketsCtrl', { $scope: $scope });
                        $scope.fromDate = $routeParams.StartVoyageDate;
                        $scope.AdultCount = parseInt($routeParams.Adult);
                        $scope.ChildCount = children[0].length;
                        $scope.InfantsCount = children[1].length;
                        $scope.peopleCount = $scope.AdultCount + $scope.ChildCount + $scope.InfantsCount;

                        $scope.ticketsCount = aviaHelper.getTicketsCount($scope.AdultCount, $scope.ChildCount, $scope.InfantsCount);
                        $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $routeParams.TicketClass);

                        $scope.goBackUrl = function () {
                            var url = '/#' + Urls.URL_DYNAMIC_PACKAGES_SEARCH +
                                [
                                    $routeParams.DepartureId,
                                    $routeParams.ArrivalId,
                                    $routeParams.StartVoyageDate,
                                    $routeParams.EndVoyageDate,
                                    $routeParams.TicketClass,
                                    $routeParams.Adult,
                                    $routeParams.Children
                                ].join('-');
                            return url;
                        };

                        $scope.getHotelInfoLink = function (ticketId, hotelId) {
                            var url = $scope.goBackUrl();
                            url += "?ticket=" + ticketId + "&displayHotel=" + hotelId;
                            if ($location.search().room != null) {
                                url += "&room=" + $location.search().room;
                            }
                            return url;
                        }

                        function addition() {
                            var self = this;
                            this.customerWishlist = '';
                            this.isNeededVisa = false;
                            this.isNeededTransfer = false;
                            this.isNeededMedicalInsurance = false;
                        }
                        $scope.addition = new addition();

                        console.log('data:');
                        console.log(data);
                        //дополняем полями 
                        aviaHelper.addCustomFields(data.RecommendedPair.AviaInfo);
                        $scope.item = data.RecommendedPair.AviaInfo;
                                     
                        aviaHelper.addAggInfoFields(data.RecommendedPair.Hotel);
                        $scope.hotel = data.RecommendedPair.Hotel;
                        $scope.price = data.RecommendedPair.Price;

                        function getCheckParams() {
                            var qData = {
                                HotelId: $scope.hotel.HotelId,
                                HoteProviderId: $scope.hotel.ProviderId,
                                Rooms: $location.search().room,
                                TicketToId: $scope.item.VariantId1,
                                TicketBackId: $scope.item.VariantId2,
                                TicketClass: $routeParams.TicketClass,
                                'Filter[DepartureId]': $routeParams.DepartureId,
                                'Filter[ArrivalId]': $routeParams.ArrivalId,
                                'Filter[StartVoyageDate]': searchParams.StartVoyageDate,
                                'Filter[EndVoyageDate]': searchParams.EndVoyageDate,
                                'Filter[TicketClass]': $routeParams.TicketClass,
                                'Filter[Adult]': $routeParams.Adult
                            };
                            if ($routeParams.Children) {
                                var childs = $routeParams.Children.split('_');
                                qData['Filter[ChildrenAges]'] = [];
                                _.each(childs, function (age) {
                                    qData['Filter[ChildrenAges]'].push(age);
                                });
                            }
                            return qData;
                        }
                        //проверяем, что остались билеты для покупки
                        paymentService.packageCheckAvailability(getCheckParams(),
                            function (data) {
                                //data = false;
                                if (data != null && data.IsTicketAvailable == true && data.Rooms != null &&
                                    data.Rooms.length > 0 && data.Rooms[0].IsAvail == true && data.Rooms[0].RoomId.length > 0) {
                                    //если проверка из кэша - то отменяем попап
                                    //$timeout.cancel(availableChecktimeout);
                                    $scope.roomId = data.Rooms[0].RoomId;

                                    //загружаем все
                                    loadDataAndInit();

                                    //ToDo: debug
                                    //$timeout(function () {
                                    //    loadDataAndInit();
                                    //}, 1000);
                                }
                                else {
                                    //log('checkAvailability, false');
                                    //$timeout.cancel(availableChecktimeout);

                                    function goToSearch() {
                                        var url = $scope.goBackUrl();
                                        console.log('redirect to url: ' + url);
                                        $location.url(url);
                                    }

                                    $scope.safeApply(function () {
                                        $scope.baloon.showWithClose("Вариант больше недоступен", "Вы будете направлены на результаты поиска",
                                            function () {
                                                goToSearch();
                                            });
                                    });


                                    //$timeout(function () {
                                    //    //очищаем хранилище для нового поиска
                                    //    storageService.clearAviaSearchResults();
                                    //    //билеты не доступны - отправляем на поиск
                                    //    goToSearch();
                                    //}, 3000);
                                }
                            },
                            function (data, status) {
                                //error
                                //$timeout.cancel(availableChecktimeout);
                                $scope.safeApply(function () {
                                    $scope.showReserveError();
                                });
                            });
                        
                        function loadDataAndInit() {
                            $scope.initPayModel();
                        }

                        $scope.afterPayModelInit = function () {
                            //log('$scope.afterPayModelInit');
                            $scope.baloon.hide();
                            //$scope.fillDefaultModelDelay();
                        };

                        $scope.combination.Hotel = data.RecommendedPair.Hotel;
                        $scope.combination.Ticket = data.RecommendedPair.AviaInfo;

                        //$scope.initPayModel();

                        //console.log($scope.combination);
                    });
                });
            })();

            DynamicFormSubmitListener.listen();

            $scope.objectToReserveTemplate = 'pages/dynamic/inc/reserve.html';

            //console.log('hi from DynamicReserveTicketsCtrl', $routeParams, $scope);

            $scope.afterCompleteCallback = function () {
                //переходим на страницу оплаты
                var url = Urls.URL_DYNAMIC_PACKAGES_BUY + $scope.OrderNum;
                //console.log('processToPayment, url: ' + url);
                $location.url(url);
            }

            $scope.getApiModel = function (data) {
                var m = {};
                m.I = data.name;
                m.F = data.secondName;
                m.Email = data.email;
                m.Phone = data.phone;
                m.IsSubscribe = data.wannaNewsletter;

                var pasList = [];
                _.each(data.passengers, function (item) {
                    pasList.push($scope.getPassenger(item));
                });
                m.Passengers = pasList;

                m.SearchParams = {
                    HotelId: $scope.hotel.HotelId,
                    HotelProviderId: $scope.hotel.ProviderId,
                    TicketToId: $scope.item.VariantId1,
                    TicketBackId: $scope.item.VariantId2,
                    RoomId: $scope.roomId,
                    Filter: {
                        DepartureId: $routeParams.DepartureId,
                        ArrivalId: $routeParams.ArrivalId,
                        StartVoyageDate: $scope.searchParams.StartVoyageDate,
                        EndVoyageDate: $scope.searchParams.EndVoyageDate,
                        TicketClass: $routeParams.TicketClass,
                        Adult: $routeParams.Adult
                    },
                    IsNeededVisa: $scope.addition.isNeededVisa,
                    IsNeededTransfer: $scope.addition.isNeededTransfer,
                    IsNeededMedicalInsurance: $scope.addition.isNeededMedicalInsurance,
                    CustomerWishlist: $scope.addition.customerWishlist
                };
                return m;
            }

            //бронируем
            $scope.reserve = function () {
                //console.log('$scope.reserve');
                var m = $scope.getApiModelForReserve();
                var model = m.model;
                var apiModel = m.apiModel;

                paymentService.packageReserve(apiModel,
                    function (data) {
                        $scope.safeApply(function () {
                            console.log('order: ' + angular.toJson(data));
                            if (data != null && data.OrderNum != null && data.OrderNum.length > 0) {
                                //сохраняем orderId
                                //storageService.setAviaOrderNum(data.OrderNum);
                                $scope.OrderNum = data.OrderNum;

                                if ($scope.isAgency()) {
                                    $scope.goToB2bCabinet();
                                }
                                else {
                                    //сохраняем модель
                                    //storageService.setReservationModel(model);

                                    //успешно
                                    $scope.afterCompleteCallback();
                                }
                            }
                            else {
                                console.error('packageReserve: %s', angular.toJson(data));
                                $scope.showReserveError();
                            }
                        });
                    },
                    function (data, status) {
                        $scope.safeApply(function () {
                            //ошибка
                            console.error('paymentService.reserve error');
                            $scope.showReserveError();
                        });
                    });
            };

            $scope.showReserveError = function () {
                $scope.baloon.showErr("Что-то пошло не так", "Ожидайте, служба поддержки свяжется с вами, \nили свяжитесь с оператором по телефону <b>+7 495 742-1212</b>",
                    function () {
                        $location.url(Urls.URL_DYNAMIC_PACKAGES);
                    });
            }
        }
    ]);
innaAppControllers
    .controller('DynamicPackageSERPCtrl', [
        '$scope',
        'DynamicFormSubmitListener',
        'DynamicPackagesDataProvider',
        'DynamicPackagesCacheWizard',
        '$routeParams',
        'innaApp.API.events',
        '$location',
        'innaApp.Urls',
        'aviaHelper',
        function ($scope, DynamicFormSubmitListener, ServiceDynamicPackagesDataProvider, DynamicPackagesCacheWizard, $routeParams, Events, $location, Urls, aviaHelper) {
            /*Private*/
            var searchParams = angular.copy($routeParams);
            var cacheKey = '';
            var AS_MAP_CACHE_KEY = 'serp-as-map';
            var serpScope = $scope;


            // TODO : Hotel.prototype.setCurrent method is deprecated
            // Use event choose:hotel
            inna.Models.Hotels.Hotel.prototype.setCurrent = function () {
                $scope.combination.hotel = this;
                $location.search('hotel', this.data.HotelId);
            };

            $scope.$on('choose:hotel', function (evt, data) {
                $scope.combination.hotel = data;
                $location.search('hotel', data.data.HotelId);
            });

            /*Methods*/
            var getHotelDetails = function (hotel) {

                if (!hotel.detailed) {
                    ServiceDynamicPackagesDataProvider.hotelDetails(
                        hotel.data.HotelId,
                        hotel.data.ProviderId,
                        $scope.combination.ticket.data.VariantId1,
                        $scope.combination.ticket.data.VariantId2,
                        searchParams,
                        function (resp) {
                            hotel.detailed = resp;
                            serpScope.$broadcast(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED);
                            serpScope.$digest();
                        },
                        function () { //error
                            console.log('error');
                        }
                    );
                }

                serpScope.hotelToShowDetails = hotel;
                $location.search('displayHotel', hotel.data.HotelId);

                if ($location.search().map) {
                    delete $location.$$search.map;
                    $location.$$compose();
                }
            };

            $scope.getHotelDetails = getHotelDetails;


            /**
             * Событие more:detail:hotel вызывает метод getHotelDetails
             * Переход в раздел - подробно об отеле
             */
            $scope.$on('more:detail:hotel', function (evt, data) {
              // показать header - фотрма поиска перед переходом на страницу подробнее
              $scope.$emit('header:visible');
              if(data) getHotelDetails(data);
            });

            function loadTab() {
                var method, param, apply;
                var deferred = new $.Deferred();

                if ($scope.state.isActive($scope.state.HOTELS_TAB)) {
                    method = 'getHotelsByCombination';
                    param = $scope.combination.ticket.data.VariantId1;
                    apply = function ($scope, data) {
                        $scope.hotels.flush();

                        for (var i = 0, raw = null; raw = data.Hotels[i++];) {
                            var hotel = new inna.Models.Hotels.Hotel(raw);

                            $scope.hotels.push(hotel);
                        }
                    };
                } else if ($scope.state.isActive($scope.state.TICKETS_TAB)) {
                    method = 'getTicketsByCombination';
                    param = $scope.combination.hotel.data.HotelId;
                    apply = function ($scope, data) {
                        $scope.tickets.flush();

                        for (var i = 0, raw = null; raw = data.AviaInfos[i++];) {
                            var ticket = new inna.Models.Avia.Ticket();
                            ticket.setData(raw);
                            $scope.tickets.push(ticket);
                        }
                    };
                }

                if (!method || !param) return;

                ServiceDynamicPackagesDataProvider[method](param, searchParams, function (data) {
                    //console.log(data, 'data');
                    $scope.$apply(function ($scope) {
                        apply($scope, data);
                        deferred.resolve();
                    });
                });

                return deferred.promise();
            }

            function combination404() {
                $scope.baloon.showErr(
                    "Не удалось найти ни одной подходящей комбинации",
                    "Попробуйте изменить параметры поиска",
                    balloonCloser
                );
            }

            function combination500() {
                $scope.$apply(function ($scope) {
                    $scope.baloon.showErr(
                        "Что-то пошло не так",
                        "Попробуйте начать поиск заново",
                        balloonCloser
                    );
                });
            }

            function ticket404() {
                $scope.baloon.showErr(
                    "Запрашиваемая билетная пара не найдена",
                    "Вероятно, она уже продана. Однако у нас есть множество других вариантов перелетов! Смотрите сами!",
                    function () {
                        delete $location.$$search.displayTicket
                        $location.$$compose();
                    }
                );
            }

            function hotel404() {
                $scope.baloon.showErr(
                    "Запрашиваемый отель не найден",
                    "Вероятно, комнаты в нем уже распроданы.",
                    function () {
                        delete $location.$$search.displayHotel
                        $location.$$compose();
                    }
                );
            }

            function balloonCloser() {
                $location.search({});
                $location.path(Urls.URL_DYNAMIC_PACKAGES);
            }

            function combination200(data) {
                var onTabLoad = angular.noop;
                var onTabLoadParam;
                var defaultTab = $scope.state.HOTEL;

                if (!data || !data.RecommendedPair) return $scope.$apply(combination404);

                $scope.airports = data.Airports || [];
                cacheKey = data.SearchId;

                $scope.$apply(function ($scope) {
                    $scope.combination.ticket = new inna.Models.Avia.Ticket();
                    $scope.combination.ticket.setData(data.RecommendedPair.AviaInfo);

                    $scope.combination.hotel = new inna.Models.Hotels.Hotel(data.RecommendedPair.Hotel);

                    $scope.showLanding = false;
                });

                if ($location.search().displayTicket) {
                    onTabLoad = loadTicketDetails;
                    onTabLoadParam = $location.search().displayTicket;
                    defaultTab = $scope.state.TICKET;
                } else if ($location.search().displayHotel) {
                    onTabLoad = loadHotelDetails;
                    onTabLoadParam = $location.search().displayHotel;
                    defaultTab = $scope.state.HOTEL;
                }


                $.when($scope.state.switchTo(defaultTab))
                    .then(function () {
                        onTabLoad(onTabLoadParam);
                        $scope.baloon.hide();
                    });
            }

            function loadTicketDetails(ids) {
                try {
                    var ticketIds = ids.split('_');
                    var ticket = $scope.tickets.search(ticketIds[0], ticketIds[1]);
                    if (ticket) {
                        $scope.getTicketDetails(ticket);
                    } else throw false;
                } catch (e) {
                    ticket404();
                }
            }

            function loadHotelDetails(id) {
                try {
                    var hotel = $scope.hotels.search(id);

                    if (hotel) {
                        $scope.getHotelDetails(hotel);
                    } else throw false;
                } catch (e) {
                    hotel404();
                }
            }

            /*Properties*/
            $scope.hotels = new inna.Models.Hotels.HotelsCollection();
            $scope.airports = null;
            $scope.hotelFilters = new inna.Models.Avia.Filters.FilterSet();
            $scope.hotelToShowDetails = null;
            $scope.tickets = new inna.Models.Avia.TicketCollection();
            $scope.ticketFilters = new inna.Models.Avia.Filters.FilterSet();
            $scope.combination = new inna.Models.Dynamic.Combination();

            $scope.state = new function () {
                this.HOTELS_TAB = null;
                this.TICKETS_TAB = null;
                this.HOTEL = 'hotel';
                this.TICKET = 'ticket';

                this.HOTELS_TAB = true;

                if ($location.search().displayTicket) {
                    this.TICKETS_TAB = true;
                    this.HOTELS_TAB = false;
                }
                if ($location.search().displayHotel) {
                    this.HOTELS_TAB = true;
                    this.TICKETS_TAB = false;
                }

                this.switchTo = function (tabName) {
                    if (tabName == 'ticket') {
                        this.TICKETS_TAB = true;
                        this.HOTELS_TAB = false;
                    } else if (tabName == 'hotel') {
                        this.HOTELS_TAB = true;
                        this.TICKETS_TAB = false;
                    }

                    return loadTab();
                };

                this.isActive = function (tabName) {
                    return tabName;
                };
            };

            // JFYI !!+val does the following magic: convert val into integer (+val) and then convert to boolean (!!)
            $scope.asMap = !!+DynamicPackagesCacheWizard.require(AS_MAP_CACHE_KEY);

            $scope.showLanding = true;

            /**
             * Изменяем класс у results-container
             * Смотри DynamicPackageSERPRecommendedBundleCtrl
             * @type {{}}
             */
            $scope.padding = {
                scrollTop: 0
            };

            $scope.passengerCount = 0;

            /*Simple proxy*/
            $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
            $scope.dateHelper = dateHelper;


            $scope.closeHotelDetails = function () {
                $scope.hotelToShowDetails = null;
                delete $location.$$search.displayHotel
                $location.$$compose();
            };

            $scope.getTicketDetails = function (ticket) {
                $scope.$broadcast(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, ticket);
            };

            $scope.setHotel = function (hotel) {
                throw Error('NOT IMPLEMENTED! Use hote.setCurrent() instead');
            };

            $scope.setTicket = function (ticket) {
                $scope.combination.ticket = ticket;
                $location.search('ticket', ticket.data.VariantId1);
            };

            $scope.goReservation = function (room, hotel) {
                console.log('go-reservation');

                var url = Urls.URL_DYNAMIC_PACKAGES_RESERVATION + [
                    $routeParams.DepartureId,
                    $routeParams.ArrivalId,
                    $routeParams.StartVoyageDate,
                    $routeParams.EndVoyageDate,
                    $routeParams.TicketClass,
                    $routeParams.Adult,
                    $routeParams.Children
                ].join('-');


                $location.search({
                    room: room.RoomId,
                    hotel: hotel.data.HotelId,
                    ticket: $scope.combination.ticket.data.VariantId1
                });

                $location.path(url);
            };

            /*EventListener*/
            DynamicFormSubmitListener.listen();

            $scope.$watch('asMap', function (newVal) {
                DynamicPackagesCacheWizard.put(AS_MAP_CACHE_KEY, +newVal);
            });

            $scope.$watch('hotels', function (data) {
                $scope.$broadcast('change:hotels:filters', data);
            }, true);

            $scope.$watch('hotelFilters', function (data) {
                $scope.hotels.filter($scope.hotelFilters);
                $scope.$broadcast('change:filters', data);
            }, true);


            function locatioAsMap(){
              if (!$scope.asMap) {
                delete $location.$$search.map;
                $location.$$compose();
              } else {
                $location.search('map', 'show');
              }
            }

            // слушаем событие от компонента отеля
            //  открываем карту с точкой этого отеля
            $scope.$on('hotel:go-to-map', function (evt, data) {
                $scope.asMap = !$scope.asMap;

                // TODO - переделать
                // прокидываем данные глубже для дочерних компонентов
                // так как карта инитится с задержкой видимо, и поэтому не может подписаться на событие
                setTimeout(function () {
                    locatioAsMap();
                    $scope.$broadcast('map:show-one-hotel', data);
                }, 1000);
            });


            // прямая ссылка на карту
            if ($location.$$search.map) {
                $scope.asMap = 1;
            }

            // переход с карты на список по кнопке НАЗАД в браузере
            // работает тольео в одну сторону - назад
            $scope.$on('$locationChangeSuccess', function (data, url, datatest) {
                if (!$location.search().map) {
                    $scope.asMap = 0;
                }
            });

            // случаем событие переключения контрола с карты на список и обратно
            $scope.$on('toggle:view:hotels:map', function () {
                $scope.asMap = !$scope.asMap;
                locatioAsMap();
            });

            /*Initial Data fetching*/
            (function () {
                $scope.baloon.showWithClose('Подбор комбинаций', 'Подождите, пожалуйста', balloonCloser);

                searchParams.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.StartVoyageDate);
                searchParams.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.EndVoyageDate);
                searchParams.Children && (searchParams.ChildrenAges = searchParams.Children.split('_'));

                $scope.passengerCount = parseInt(searchParams.Adult) + (searchParams.ChildrenAges ? searchParams.ChildrenAges.length : 0);

                if ($location.search().hotel) searchParams['HotelId'] = $location.search().hotel;
                if ($location.search().ticket) searchParams['TicketId'] = $location.search().ticket;

                ServiceDynamicPackagesDataProvider.search(searchParams, combination200, combination500);
            }());

            /*Because fuck angular, that's why!*/
            $(function () {
                var doc = $(document);
                var onIconPriceClick = function (event) {
                    event.stopPropagation();

                    var parent = $(this).parents('.result')[0];
                    var tooltip = $('.JS-tooltip-price', parent);

                    tooltip.toggle();

                    doc.on('click', function bodyClick() {
                        tooltip.hide();
                        doc.off('click', bodyClick);
                    });
                };

                doc.on('click', '.JS-icon-price-info', {}, onIconPriceClick);

                $scope.$on('$destroy', function () {
                    doc.off('click', onIconPriceClick);
                });
            });

            $(function () {
                var doc = $(document);

                function onScroll(event) {
                    $scope.$apply(function ($scope) {
                        $scope.padding.scrollTop = utils.getScrollTop();
                    });
                }

                doc.on('scroll', onScroll);

                $scope.$on('$destroy', function () {
                    doc.off('scroll', onScroll);
                })
            });
        }
    ])
    .controller('DynamicPackageSERPTicketPopupCtrl', [
        '$scope',
        '$element',
        '$location',
        'innaApp.API.events',
        'aviaHelper',
        function ($scope, $element, $location, Events, aviaHelper) {
            $(function () {
                $(document.body).append($element);
            });

            /*Scope Properties*/
            $scope.ticket = null;
            $scope.link = '';

            /*Scope Methods*/
            $scope.closePopup = function () {
                //drop ?displayTicket = ...
                delete $location.$$search.displayTicket;
                $location.$$compose();

                $scope.ticket = null;
            };

            $scope.setCurrent = function () {
                //from parentScope
                $scope.setTicket($scope.ticket);

                $scope.closePopup();
            };

            $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
            $scope.dateHelper = dateHelper;

            $scope.sharePopup = new inna.Models.Aux.AttachedPopup(function () {
                $scope.link = document.location;
            });

            /*Listeners*/
            $scope.$on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, function (event, ticket) {

                $scope.ticket = ticket;

                $scope.etapsZipped = (function () {
                    var zipped = [];

                    var to = ticket.getEtaps('To');
                    var back = ticket.getEtaps('Back');

                    var maxLength = Math.max(to.length, back.length);

                    for (var i = 0; i < maxLength; i++) {
                        var eTo = to[i];
                        var eBack = back[i];

                        zipped.push([eTo, eBack]);
                    }

                    console.log('EtapsZipped = ', zipped);

                    return zipped;
                })();

                $location.search('displayTicket', [$scope.ticket.data.VariantId1, $scope.ticket.data.VariantId2].join('_'));
            });
        }
    ])
    .controller('DynamicPackageSERPRecommendedBundleCtrl', [
        '$scope',
        function ($scope) {
            /*DOM*/
            var doc = $(document);

            var onScroll = function () {
                var body = document.body || document.documentElement;

                if (body.scrollTop > 230) {
                    $scope.$apply(function () {
                        $scope.display.setCurrent($scope.display.SHORT)
                        $scope.$emit('header:hidden');
                    });

                } else {
                    $scope.$apply(function () {
                        $scope.display.setCurrent($scope.display.FULL)
                        $scope.$emit('header:visible');
                    });

                }
            };

            var unwatchScroll = function () {
                doc.off('scroll', onScroll);
            };

            doc.on('scroll', onScroll);


            /*Properties*/
            $scope.display = new function () {
                var that = this;
                this.FULL = 1;
                this.SHORT = 2;

                this.current = this.FULL;

                this.isCurrent = function (display) {
                    return this.current == display;
                }

                this.setCurrent = function (display) {
                    this.current = display;
                }

                function changeParentScopePadding(param) {
                    (param == 2) ?
                        $scope.padding.value = true :
                        $scope.padding.value = false

                }

                this.shortDisplay = function () {
                    unwatchScroll();
                    this.current = this.SHORT;
                    $scope.$emit('header:hidden');
                    changeParentScopePadding(this.current);
                }

                this.fullDisplay = function () {
                    doc.on('scroll', onScroll);
                    this.current = this.FULL;
                    $scope.$emit('header:visible');
                    changeParentScopePadding(this.current);
                }

                this.toggle = function () {
                    if (this.isCurrent(this.FULL)) this.shortDisplay();
                    else this.fullDisplay();
                }
            };

            // подписываемся на событие toggle:visible:bundle
            // скрываем бандл вместе с шапкой
            $scope.$root.$on('bundle:hidden', function () {
                $scope.display.shortDisplay();
            });

            /*Events*/
            $scope.$on('$destroy', unwatchScroll);
        }
    ]);
﻿﻿
/* Controllers */

innaAppControllers.
    controller('ReserveTicketsCtrl', ['$log', '$timeout', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper', 'urlHelper', 'Validators',
        function ReserveTicketsCtrl($log, $timeout, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Validators) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            $scope.peopleCount = 0;
            $scope.AdultCount = 0;
            $scope.ChildCount = 0;
            $scope.InfantsCount = 0;
            $scope.fromDate = null;

            $scope.item = null;
            $scope.citizenshipList = null;
            $scope.bonusCardTransportersList = null;
            $scope.model = null;

            $scope.visaNeeded = false;
            $scope.visaNeeded_rules = false;

            $scope.sexType = aviaHelper.sexType;
            $scope.helper = aviaHelper;

            $scope.login = {
                isOpened: false,
                isLogged: false,
                closeClick: function ($event) {
                    eventsHelper.preventBubbling($event);
                    $scope.login.isOpened = false;
                }
            };

            var validateType = {
                required: 'required',
                cit_required: 'cit_required',
                email: 'email',
                phone: 'phone',
                date: 'date',
                birthdate: 'birthdate',
                expire: 'expire',
                document: 'document'
            };
            $scope.validateType = validateType;

            function visaNeededCheck() {
                var isCitRussia = false;
                var visaEtapNeeded = false;
                var visaEtapRulesNeeded = false;

                if ($scope.validationModel != null && $scope.validationModel.passengers != null &&
                    $scope.item != null) {
                    for (var i = 0; i < $scope.validationModel.passengers.length; i++) {
                        var pas = $scope.validationModel.passengers[i];
                        if (pas.citizenship.value.id == 189)//Россия
                        {
                            isCitRussia = true;
                            return;
                        }
                    }

                    var outVisaGroup = null;
                    //берем визовую группу
                    if ($scope.item.EtapsTo != null && $scope.item.EtapsTo.length > 0)
                    {
                        outVisaGroup = $scope.item.EtapsTo[0].OutVisaGroup;

                        if (outVisaGroup != null && outVisaGroup != 0) {
                            visaEtapNeeded = true;
                        }
                    }
                    

                    if ($scope.item.EtapsTo != null)
                    {
                        for (var i = 0; i < $scope.item.EtapsTo.length; i++) {
                            var etap = $scope.item.EtapsTo[i];
                            if (etap.InVisaGroup != outVisaGroup || etap.OutVisaGroup != outVisaGroup) {
                                visaEtapRulesNeeded = true;
                                break;
                            }
                        }
                    }
                    if (visaEtapNeeded == false && $scope.item.EtapsBack != null) {
                        for (var i = 0; i < $scope.item.EtapsBack.length; i++) {
                            var etap = $scope.item.EtapsBack[i];
                            if (etap.InVisaGroup != outVisaGroup || etap.OutVisaGroup != outVisaGroup) {
                                visaEtapRulesNeeded = true;
                                break;
                            }
                        }
                    }
                }

                if (isCitRussia && visaEtapNeeded) {
                    $scope.visaNeeded = true;
                }
                else
                {
                    $scope.visaNeeded = false;
                }

                if (isCitRussia && visaEtapRulesNeeded) {
                    $scope.visaNeeded_rules = true;
                }
                else {
                    $scope.visaNeeded_rules = false;
                }
            };

            $scope.validatePeopleCount = function () {
                if ($scope.validationModel != null && $scope.validationModel.passengers != null && $scope.validationModel.passengers.length > 0) {
                    var availableAdultCount = $scope.AdultCount;
                    var availableChildCount = $scope.ChildCount;
                    var availableInfantsCount = $scope.InfantsCount;

                    var adultsFound = false;
                    var childsFound = false;
                    var infantsFound = false;

                    var peopleType = {
                        adult: 'adult',
                        child: 'child',
                        infant: 'infant'
                    };


                    function getPeopleType(birthdate) {
                        var fromDate = dateHelper.dateToJsDate($scope.fromDate);
                        var bdate = dateHelper.dateToJsDate(birthdate);
                        var age = dateHelper.calculateAge(bdate, fromDate);
                        //console.log('age: %d', age);
                        if (age < 2)
                            return peopleType.infant;
                        else if (age >= 2 && age <= 11)
                            return peopleType.child;
                        else
                            return peopleType.adult;
                    };

                    function setNotValid(item) {
                        item.isValid = false;
                        item.isInvalid = !item.isValid;
                    }

                    for (var i = 0; i < $scope.validationModel.passengers.length; i++) {
                        var pas = $scope.validationModel.passengers[i];

                        if (pas.birthday.value != null && pas.birthday.value.length > 0) {
                            //определяем тип человек (взрослый, ребенок, младенец)
                            var type = getPeopleType(pas.birthday.value);
                            switch (type) {
                                case peopleType.adult:
                                    {
                                        if (adultsFound) {
                                            setNotValid(pas.birthday);
                                        }
                                        else {
                                            availableAdultCount--;
                                            if (availableAdultCount == 0) {
                                                adultsFound = true;
                                            }
                                        }
                                        break;
                                    }
                                case peopleType.child:
                                    {
                                        if (childsFound) {
                                            setNotValid(pas.birthday);
                                        }
                                        else {
                                            availableChildCount--;
                                            if (availableChildCount == 0) {
                                                childsFound = true;
                                            }
                                        }
                                        break;
                                    }
                                case peopleType.infant:
                                    {
                                        if (infantsFound) {
                                            setNotValid(pas.birthday);
                                        }
                                        else {
                                            availableInfantsCount--;
                                            if (availableInfantsCount == 0) {
                                                infantsFound = true;
                                            }
                                        }
                                        break;
                                    }
                            }
                        }
                    }

                    //console.log('a: %d, c: %d, i: %d', availableAdultCount, availableChildCount, availableInfantsCount);
                    if (availableAdultCount < 0 || availableChildCount < 0 || availableInfantsCount < 0) {
                        return false;
                    }
                }
                return true;
            };

            function updateValidationModel()
            {
                //log('updateValidationModel');

                function getValidationItem(key, value, type) {
                    return {
                        id: null,
                        key: key,
                        value: value,
                        dependsOnField: null,//валидация зависит от поля
                        isValid: true,
                        isInvalid: false,
                        validationType: null
                    }
                };

                function tryValidate(model, fn) {
                    try {
                        fn();
                        $scope.setValid(model, true);
                    }
                    catch (err) {
                        $scope.setValid(model, false);
                    }
                    //log('tryValidate, ' + model.key + ' = \'' + model.value + '\', isValid: ' + model.isValid);
                };

                $scope.setValid = function (model, isValid) {
                    if (model == null) return;
                    if (isValid)
                    {
                        model.isValid = true;
                        model.isInvalid = false;
                    }
                    else
                    {
                        model.isValid = false;
                        model.isInvalid = true;
                    }
                }

                $scope.validate = function (item, type) {
                    if (item != null) {
                        //console.log('validate, key: %s, element: %s', model.key, model.$element.get(0));
                        //console.log('validate, item: %s; validationType: %s, type:%s', item.value, item.validationType, type);
                        switch (item.validationType) {
                            case validateType.required:
                                {
                                    tryValidate(item, function () {
                                        Validators.defined(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.cit_required://для гражданства - проверяем, что id > 0 и name заполнен
                                {
                                    tryValidate(item, function () {
                                        Validators.gtZero(item.value.id, 'err');
                                        Validators.defined(item.value.name, 'err');
                                    });
                                    break;
                                }
                            case validateType.email:
                                {
                                    tryValidate(item, function () {
                                        Validators.email(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.phone:
                                {
                                    tryValidate(item, function () {
                                        Validators.phone(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.date:
                                {
                                    tryValidate(item, function () {
                                        Validators.date(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.birthdate:
                                {
                                    tryValidate(item, function () {
                                        Validators.birthdate(item.value, 'err');
                                        //if (!$scope.validatePeopleCount())
                                        //    throw 'err';
                                    });
                                    break;
                                }
                            case validateType.expire:
                                {
                                    tryValidate(item, function () {
                                        Validators.expire(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.document:
                                {
                                    var doc_num = item.value.replace(/\s+/g, '');

                                    //гражданство
                                    var citizenship = item.dependsOnField;

                                    //логика описана тут https://innatec.atlassian.net/browse/IN-746
                                    tryValidate(item, function () {
                                        Validators.defined(doc_num, 'err');

                                        //
                                        if (citizenship == null || citizenship.value == null || !(citizenship.value.id > 0))
                                            throw 'err';

                                        if (citizenship.value.id == 189)//Россия
                                        {
                                            //нужно определить
                                            //для граждан РФ, летящих внутри стран РФ, Абхазия, Белоруссия, Казахстан, Нагорный Карабах, 
                                            //Приднестровье, Таджикистан, Украина, Южная Осетия
                                            function isTripInsideRF(item) {
                                                                                        //Нагорный Карабах, Приднестровье
                                                //var insideRFcase = [189, 69829, 35, 124, 0, 0, 215, 226, 0];
                                                                                                        //Южная Осетия
                                                var insideRFcase = [189, 69829, 35, 124, 215, 226];

                                                var etapCountries = [];
                                                if (item.EtapsTo != null) {
                                                    for (var i = 0; i < item.EtapsTo.length; i++) {
                                                        var etap = item.EtapsTo[i];
                                                        etapCountries.push(etap.InCountryId);
                                                        etapCountries.push(etap.OutCountryId);
                                                    }
                                                    //_.each(item.EtapsTo, function (etap) {
                                                    //    etapCountries.push(etap.InCountryId);
                                                    //    etapCountries.push(etap.OutCountryId);
                                                    //});
                                                }
                                                if (item.EtapsBack != null) {
                                                    for (var i = 0; i < item.EtapsBack.length; i++) {
                                                        var etap = item.EtapsBack[i];
                                                        etapCountries.push(etap.InCountryId);
                                                        etapCountries.push(etap.OutCountryId);
                                                    }
                                                    //_.each(item.EtapsBack, function (etap) {
                                                    //    etapCountries.push(etap.InCountryId);
                                                    //    etapCountries.push(etap.OutCountryId);
                                                    //});
                                                }
                                                etapCountries = _.uniq(etapCountries);
                                                //проверяем все страны в этапах
                                                for (var i = 0; i < etapCountries.length; i++) {
                                                    var etapCountry = etapCountries[i];
                                                    if (_.indexOf(insideRFcase, etapCountry) < 0) //на каком-то этапе мы не попали в этот кейс
                                                    {
                                                        return false;
                                                    }
                                                }

                                                //прошлись по всем этапам, везде мы в нужном списке стран
                                                return true;
                                            }

                                            function isCaseValid(fn) {
                                                try
                                                {
                                                    fn();
                                                    return true;
                                                }
                                                catch(err)
                                                {
                                                    return false;
                                                }
                                            }

                                            var tripInsideRF = isTripInsideRF($scope.item);
                                            if (tripInsideRF)
                                            {
                                                //проверяем паспорт, загран, св. о рождении
                                                if (isCaseValid(function () {
                                                    Validators.ruPassport(doc_num, 'err');
                                                }) ||
                                                    isCaseValid(function () {
                                                    Validators.enPassport(doc_num, 'err');
                                                }) ||
                                                    isCaseValid(function () {
                                                    Validators.birthPassport(doc_num, 'err');
                                                }))
                                                {
                                                    //все норм - не выкидываем исключение
                                                }
                                                else
                                                {
                                                    //одна или больше проверок сфейлиломсь - выкидываем исключение
                                                    throw 'err';
                                                }
                                            }
                                            else
                                            {
                                                //загран
                                                Validators.enPassport(doc_num, 'err');
                                            }
                                        }
                                        else
                                        {
                                            //для граждан других стран
                                            //непустая строка
                                            //уже проверили в самом начале
                                        }
                                    });
                                    break;
                                }
                        }

                        //прячем тултип, если показывали
                        //if (item.haveTooltip == true)
                        //{
                        //    var $to = $('#' + item.id);
                        //    $scope.tooltipControl.close($to);
                        //}
                        var $to = $('#' + item.id);
                        $scope.tooltipControl.close($to);
                    }

                    //if ($scope.validationModel != null && type != null)
                    //{
                    //    $scope.validationModel.formPure = false;
                    //}
                };

                //сохраняем некоторые поля из старой модели
                function updateFields(validationModel) {
                    var ignoreKeys = ['dir'];

                    //создаем поля из модели данных
                    var keys = _.keys($scope.model);
                    _.each(keys, function (key) {
                        var oldItem = null;
                        if ($scope.validationModel != null) {
                            oldItem = validationModel[key];
                        }

                        var newItem = null;
                        //поля типа passengers - копируем в модель, и для них - на каждое поле создаем validation model
                        if (_.isArray($scope.model[key]))
                        {
                            newItem = [];
                            _.each($scope.model[key], function (item, index) {
                                var itemKeys = _.keys(item);
                                var newIntItem = {};
                                _.each(itemKeys, function (inKey) {
                                    if (_.isFunction(item[inKey]) || _.any(ignoreKeys, function (item) { return item == inKey; }))
                                    {
                                        newIntItem[inKey] = angular.copy(item[inKey]);
                                    }
                                    else
                                    {
                                        newIntItem[inKey] = getValidationItem(inKey, angular.copy(item[inKey]));
                                    }
                                });
                                
                                newItem.push(newIntItem);
                            });
                        }
                        else
                        {
                            newItem = getValidationItem(key, angular.copy($scope.model[key]));
                        }
                        
                        //сохраняем id и тип валидации
                        if (oldItem != null) {
                            newItem.id = oldItem.id;
                            newItem.validationType = oldItem.validationType;
                        }
                        validationModel[key] = newItem;
                    });
                };

                function getValidationModel()
                {
                    //основная модель для валидации
                    var validationModel = {
                        formPure: true,
                        getFields: function (model) {
                            var self = this;
                            var keys = _.keys(model);
                            var validList = _.map(keys, function (key) {
                                return model[key];
                            });
                            //отбрасываем лишние поля
                            validList = _.filter(validList, function (item) { return item.isValid != undefined });
                            return validList;
                        },
                        getArrayFileds: function() {
                            var self = this;
                            var keys = _.keys(this);
                            keys = _.filter(keys, function(k){
                                return _.isArray(self[k]);
                            });
                            var validList = _.map(keys, function (key) {
                                return self[key];
                            });
                            return validList;
                        },
                        isModelValid: function () {
                            var invalidItem = validationModel.getFirstInvalidItem();
                            return invalidItem == null;
                        },
                        getFirstInvalidItem: function (conditionFn) {
                            var self = this;
                            function findInModel(model) {
                                var list = self.getFields(model);
                                var firstItem = _.find(list, function (item) {
                                    if (conditionFn == null) {
                                        return item.isValid == false;
                                    }
                                    else {
                                        return (item.isValid == false) && conditionFn(item);
                                    }
                                });
                                return firstItem;
                            };
                            var firstItem = findInModel(this);

                            //если не нашли в полях, смотрим во вложенных
                            if (firstItem == null) {
                                var arFields = this.getArrayFileds();
                                for (var i = 0; i < arFields.length; i++) {
                                    var passList = arFields[i];
                                    for (var j = 0; j < passList.length; j++) {
                                        var pass = passList[j];
                                        firstItem = findInModel(pass);
                                        if (firstItem != null)
                                            return firstItem;
                                    }
                                }
                            }
                            return firstItem;
                        },
                        enumAllKeys: function (fn) {
                            var list = this.getFields(this);
                            for (var vi = 0; vi < list.length; vi++) {
                                var item = list[vi];
                                fn(item);
                            }

                            //вложенные свойства
                            var arFields = this.getArrayFileds();
                            for (var i = 0; i < arFields.length; i++) {
                                var passList = arFields[i];
                                for (var j = 0; j < passList.length; j++) {
                                    var pass = passList[j];
                                    var passKeysList = this.getFields(pass);
                                    for (var zi = 0; zi < passKeysList.length; zi++) {
                                        var item = passKeysList[zi];
                                        fn(item);
                                    }
                                }
                            }
                        },
                        validateAll: function () {
                            validationModel.enumAllKeys($scope.validate);

                            this.formPure = false;
                        }
                    };
                    return validationModel;
                }
                
                if ($scope.validationModel == null)
                {
                    var validationModel = getValidationModel();
                    $scope.validationModel = validationModel;
                }
                updateFields($scope.validationModel);

                visaNeededCheck();

                //console.log($scope.validationModel);

                $scope.isFieldInvalid = function (item) {
                    //if (item != null && item.key == 'citizenship') {
                    //    console.log(item);
                    //}
                    if (item != null && item.value != null && (!_.isString(item.value) || item.value.length > 0)) {
                        if ($scope.validationModel.formPure) {
                            return item.isInvalid && item.value != null && item.value.length > 0;//подсвечиваем только если что-то введено в полях
                        }
                        else {
                            return item.isInvalid;
                        }
                    }
                    else {
                        return !$scope.validationModel.formPure;
                    }
                }
            }

            $scope.$watch('model', function (newVal, oldVal) {
//                if (newVal === oldVal)
//                    return;

                updateValidationModel();
            }, true);

            function loadHelpersDataAndInitModel() {
                var loader = new utils.loader();

                function loadAllCountries(onCompleteFnRun) {
                    var self = this;
                    dataService.getAllCountries(function (data) {
                        if (data != null) {
                            $scope.citizenshipList = data;
                            loader.complete(self);
                        }
                    }, function (data, status) {
                        log('getAllCountries error: status:' + status);
                    });
                };

                function loadTransporters(onCompleteFnRun) {
                    var self = this;
                    var transportersNames = [];

                    if ($scope.item.EtapsTo.length > 0) {
                        _.each($scope.item.EtapsTo, function (item) {
                            transportersNames.push(item.TransporterCode);
                        });
                    }
                    if ($scope.item.EtapsBack != null && $scope.item.EtapsBack.length > 0) {
                        _.each($scope.item.EtapsBack, function (item) {
                            transportersNames.push(item.TransporterCode);
                        });
                    }
                    //берем уникальные
                    transportersNames = _.uniq(transportersNames);

                    paymentService.getTransportersInAlliances(transportersNames, function (data) {
                        if (data != null) {
                            $scope.bonusCardTransportersList = data;
                            if (data.length == 0)
                                log('bonusCardTransportersList empty');

                            loader.complete(self);
                        }
                    }, function (data, status) {
                        log('getTransportersInAlliances error: ' + transportersNames + ' status:' + status);
                    });
                };

                loader.init([loadAllCountries, loadTransporters], initPayModel).run();
            }

            $scope.initPayModel = function () {
                //log('$scope.initPayModel');
                loadHelpersDataAndInitModel();
            }

            function initPayModel() {
                //log('initPayModel');

                function passengerModel(index) {
                    var model = {
                        index: index,
                        sex: null,
                        name: '',
                        secondName: '',
                        birthday: '',
                        citizenship: {//Гражданство
                            id: 189,
                            name: 'Россия'
                        },
                        doc_series_and_number: '',//серия номер
                        doc_expirationDate: '',//дествителен до
                        document: {//документ
                            series: '',//серия
                            number: ''//номер
                        },
                        bonuscard: {
                            haveBonusCard: false,//Есть бонусная карта
                            airCompany: {
                                id: 0,
                                name: ''
                            },
                            number: ''
                        },
                        dir: {
                            cit:{
                                isOpen: false
                            },
                            card: {
                                isOpen: false
                            }
                        },
                        showCitListClick: function ($event) {
                            eventsHelper.preventBubbling($event);
                            //открываем список в директиве
                            this.dir.cit.isOpen = !this.dir.cit.isOpen;
                        },
                        showCardListClick: function ($event) {
                            eventsHelper.preventBubbling($event);
                            //открываем список в директиве
                            this.dir.card.isOpen = !this.dir.card.isOpen;
                        },
                    };
                    //log('passengerModel showCitListClick: ' + passengerModel.showCitListClick)
                    return model;
                }

                var passengers = [];
                for (var i = 0; i < $scope.peopleCount; i++) {
                    var item = new passengerModel(i);
                    passengers.push(item);
                }

                $scope.model = {
                    price: $scope.item.Price,
                    name: '',
                    secondName: '',
                    email: '',
                    phone: '+7',
                    wannaNewsletter: false,//Я хочу получать рассылку спецпредложений
                    passengers: passengers

                };

                if ($scope.afterPayModelInit != null)
                    $scope.afterPayModelInit();
            };

            $scope.getTransferCountText = aviaHelper.getTransferCountText;

            $scope.moreClick = function ($event) {
                eventsHelper.preventBubbling($event);
            };

            $scope.tooltipControl = {
                init: function ($to){
                    //$to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
                    $to.tooltipX({ autoShow: false, autoHide: false, position: { my: 'center top+22', at: 'center bottom' } });
                },
                open: function ($to) {
                    //$to.tooltip("enable");
                    //$to.tooltip("open");
                    setTimeout(function () {
                        $to.tooltipX("open");
                    }, 300);
                },
                close: function ($to) {
                    //$to.tooltip("disable");
                    //$to.tooltipX("destroy");
                    try
                    {
                        $to.tooltipX("destroy");
                    }
                    catch(e){};
                }
            };

            //оплата
            $scope.processToPayment = function ($event) {
                eventsHelper.preventBubbling($event);

                $scope.validationModel.validateAll();
                $scope.validatePeopleCount();

                //console.log($scope.validationModel);

                //ищем первый невалидный элемент, берем только непустые
                var invalidItem = $scope.validationModel.getFirstInvalidItem(function (item) {
                    return (item.value != null && (!_.isString(item.value) || item.value.length > 0));
                });
                if (invalidItem != null) {
                    //показываем тултип
                    var $to = $("#" + invalidItem.id);
                    ////не навешивали тултип
                    //if (!(invalidItem.haveTooltip == true)) {
                    //    $scope.tooltipControl.init($to);
                    //    invalidItem.haveTooltip = true;
                    //}
                    $scope.tooltipControl.init($to);
                    $scope.tooltipControl.open($to);
                    //прерываемся
                    return;
                }

                //если модель валидна - бронируем
                if ($scope.validationModel.isModelValid()) {

                    $scope.baloon.show("Бронирование авиабилетов", "Подождите пожалуйста, это может занять несколько минут");
                    //бронируем
                    $scope.reserve();
                }
            };

            $scope.goToB2bCabinet = function () {
                location.href = app_main.b2bHost;
            }

            $scope.isAgency = function () {
                return ($scope.$root.user != null && $scope.$root.user.isAgency());
            }

            $scope.isCaseValid = function (fn) {
                try {
                    fn();
                    return true;
                }
                catch (err) {
                    return false;
                }
            }

            $scope.getDocType = function (doc_num) {
                //var doc_num = number.replace(/\s+/g, '');

                if ($scope.isCaseValid(function () {
                    Validators.ruPassport(doc_num, 'err');
                })) {
                    return 0;//паспорт
                }

                if ($scope.isCaseValid(function () {
                    Validators.enPassport(doc_num, 'err');
                })) {
                    return 1;//загран
                }

                if ($scope.isCaseValid(function () {
                    Validators.birthPassport(doc_num, 'err');
                })) {
                    return 2;//свидетельство о рождении
                }

                if ($scope.isCaseValid(function () {
                   Validators.defined(doc_num, 'err');
                })) {
                    return 3;//Иностранный документ
                }

                return null;
            }

            $scope.getPassenger = function (data) {
                var doc_num = data.doc_series_and_number.replace(/\s+/g, '');

                var m = {};
                m.Sex = data.sex;
                m.I = data.name;
                m.F = data.secondName;
                m.Birthday = data.birthday;
                m.DocumentId = $scope.getDocType(doc_num);
                m.Number = doc_num;
                m.ExpirationDate = data.doc_expirationDate;
                m.Citizen = data.citizenship.id;
                m.Index = data.index;
                if (data.bonuscard.haveBonusCard) {
                    m.BonusCard = data.bonuscard.number;
                    m.TransporterId = data.bonuscard.airCompany.id;
                    m.TransporterName = data.bonuscard.airCompany.name;
                }
                return m;
            }

            $scope.getModelFromValidationModel = function (validationModel) {
                var keys = _.keys(validationModel);
                var model = {};
                _.each(keys, function (key) {
                    if (_.isArray(validationModel[key])) {
                        model[key] = [];
                        _.each(validationModel[key], function (item) {
                            var iKeys = _.keys(item);
                            var iItem = {};
                            _.each(iKeys, function (iKey) {
                                if (_.isArray(item[iKey])) {
                                    //пропускаем
                                }
                                else if (_.isFunction(item[iKey])) {
                                    //пропускаем
                                }
                                else {
                                    iItem[iKey] = angular.copy(item[iKey].value);
                                }
                            });
                            model[key].push(iItem);
                        });
                    }
                    else if (_.isFunction(validationModel[key])) {
                        //пропускаем
                    }
                    else {
                        model[key] = angular.copy(validationModel[key].value);
                    }
                });
                return model;
            }

            $scope.getApiModelForReserve = function () {
                //function call() { if (afterCompleteCallback) afterCompleteCallback(); };

                var model = $scope.getModelFromValidationModel($scope.validationModel);
                model.price = $scope.item.Price;

                var apiModel = $scope.getApiModel(model);
                log('');
                log('reservationModel: ' + angular.toJson(model));
                log('');
                log('apiModel: ' + angular.toJson(apiModel));
                return { apiModel: apiModel, model: model };
            }

            var debugPassengersList = [
    { name: 'IVAN', secondName: 'IVANOV', sex: $scope.sexType.man, birthday: '18.07.1976', series_and_number: '4507 04820' },
    { name: 'TATIANA', secondName: 'IVANOVA', sex: $scope.sexType.woman, birthday: '25.09.1978', series_and_number: '4507 04823' },
    { name: 'SERGEY', secondName: 'IVANOV', sex: $scope.sexType.man, birthday: '12.07.2006', series_and_number: '4507 02853' },
    { name: 'ELENA', secondName: 'IVANOVA', sex: $scope.sexType.woman, birthday: '12.11.2013', series_and_number: '4507 01853' },
            ];

            $scope.fillDefaultModel = function ($event) {
                eventsHelper.preventBubbling($event);

                $scope.model.name = 'Иван';
                $scope.model.secondName = 'Иванов';
                $scope.model.email = 'ivan.ivanov@gmail.com';
                $scope.model.phone = '+79101234567';
                var index = 0;
                _.each($scope.model.passengers, function (pas) {

                    if (index < debugPassengersList.length) {
                        var debugItem = debugPassengersList[index];
                        index++;

                        pas.name = debugItem.name;
                        pas.secondName = debugItem.secondName;
                        pas.sex = debugItem.sex;
                        pas.birthday = debugItem.birthday;
                        pas.citizenship.id = 189;
                        pas.citizenship.name = 'Россия';
                        pas.doc_series_and_number = debugItem.series_and_number;
                        pas.doc_expirationDate = '18.07.2015';
                        pas.bonuscard.haveBonusCard = (index % 2 == 0 ? true : false);
                        pas.bonuscard.airCompany.id = 2;
                        pas.bonuscard.airCompany.name = 'Aeroflot';
                        pas.bonuscard.number = '1213473454';
                    }
                    else {
                        pas.name = 'IVAN';
                        pas.secondName = 'IVANOV';
                        pas.sex = $scope.sexType.man;
                        pas.birthday = '18.07.1976';
                        pas.citizenship.id = 189;
                        pas.citizenship.name = 'Россия';
                        pas.doc_series_and_number = '4507 048200';
                        pas.doc_expirationDate = '18.07.2015';
                        pas.bonuscard.haveBonusCard = true;
                        pas.bonuscard.airCompany.id = 2;
                        pas.bonuscard.airCompany.name = 'Aeroflot';
                        pas.bonuscard.number = '1213463454';
                    }
                });
            };

            $scope.$on('$destroy', function () {
                if ($scope.validationModel != null) {
                    $scope.validationModel.enumAllKeys(function (item) {
                        var $to = $("#" + item.id);
                        $scope.tooltipControl.close($to);
                    });
                }
            });
        }]);

﻿
'use strict';

/* Controllers */

//такой синтаксис['$log', '$scope', '$http', '$filter', 'dataService',
//нужен чтобы работали внедрения зависимостей после минификации
innaAppControllers.
    controller('HotelsDetailsCtrl', ['$log', '$scope', '$routeParams', '$filter', '$location', 'dataService', 'urlHelper',
        function HotelsDetailsCtrl($log, $scope, $routeParams, $filter, $location, dataService, urlHelper) {
            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //тут какая-нить фигня-крутилка пока грузятся данные

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //данные отеля
            $scope.hotelDetail = null;

            log('$routeParams: ' + angular.toJson($routeParams));
            if (angular.toJson($routeParams) != '{}') {
                $scope.isDataLoading = true;
                //запрос данных для отеля
                dataService.getHotelDetail({ hotelId: $routeParams.hotelId, searchId: $routeParams.searchId }, function (data) {
                    //обновляем данные
                    $scope.updateHotelDetail(data);
                }, function (data, status) {
                    //ошибка получения данных
                    log('getHotelDetail error: ' + status);
                    $scope.isDataLoading = false;
                });
            }

            //обновляем модель
            $scope.updateHotelDetail = function (data) {
                if (data != null) {
                    log('updateHotelDetail');
                    //log('updateHotelDetail, data: ' + angular.toJson(data));

                    $.each(data.Tours, function (index, item) {
                        item.Price = item.Price != null ? item.Price.Value : null;
                        item.Currency = item.Price != null && item.Price.Currency != null ? item.Price.Currency : null;
                        item.SearchId = data.SearchId;
                    });

                    $scope.hotelDetail = new hotelDetail(data);
                } else {
                    $scope.hotelDetail = null;
                }
                $scope.isDataLoading = false;
            };

            $scope.goToTourDetail = function (tour) {
                //log('tour: ' + angular.toJson(tour));
                //alert('Еще не реализовано');
                var url = urlHelper.UrlToTourDetails($routeParams.hotelId, $routeParams.searchId, tour.UID);
                $location.path(url);
            };
        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('HotelPlusTicketCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService',
        function HotelPlusTicketCtrl($log, $scope, $routeParams, $filter, dataService) {
            $scope.hellomsg = "Привет из HotelPlusTicketCtrl";
        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('HotelsCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService',
        function HotelsCtrl($log, $scope, $routeParams, $filter, dataService) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.hellomsg = "Привет из HotelsCtrl";

            
        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('SearchMainCtrl', [
        '$log',
        '$scope',
        '$routeParams',
        '$filter',
        '$location',
        'dataService',
        'urlHelper',
        function SearchMainCtrl($log, $scope, $routeParams, $filter, $location, dataService, urlHelper) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //обнуляем список
            var emptyArray = [];
            $scope.hotels = emptyArray;
            $scope.searchId = 0;

            //кол-во туров
            $scope.toursCount = 0;

            //начальные условия поиска
            //$scope.criteria = new criteria({ DurationMin: 7, HotelStarsMin: 3, HotelStarsMax: 5 });
            $scope.criteria = new criteria({ DurationMin: 7 });

            //тут меняем урл для поиска
            $scope.searchTours = function () {
                log('$scope.criteria: ' + angular.toJson($scope.criteria));
                var url = urlHelper.UrlToSearch(angular.copy($scope.criteria));
                $location.path(url);
            };
        }]);

﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('SearchResultCtrl', ['$log', '$scope', '$routeParams', '$filter', '$location', 'dataService', 'urlHelper',
        function SearchResultCtrl($log, $scope, $routeParams, $filter, $location, dataService, urlHelper) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //инициализация
            initValues();
            initFuctions();
            initWatch();

            //обрабатываем параметры из queryString'а
            var params = $routeParams;
            $scope.criteria = urlHelper.restoreAnyToNulls(params);
            //log('$routeParams: ' + angular.toJson($routeParams));
            //log('$scope.criteria: ' + angular.toJson($scope.criteria));
            //$scope.startSearchTours();

            var locationParams = { cityUrl: params.FromCityUrl, countryUrl: params.ToCountryUrl, regionUrl: params.ToRegionUrl }

            //запрашиваем парамерты по их Url'ам
            $scope.isDataLoading = true;
            dataService.getLocationsByUrls(locationParams, function (data) {
                //обновляем данные
                if (data.city != null) {
                    $scope.criteria.FromCity = data.city.name;
                    $scope.criteria.FromCityId = data.city.id;
                    $scope.criteria.FromCityUrl = data.city.url;
                }
                if (data.country != null) {
                    $scope.criteria.ToCountry = data.country.name;
                    $scope.criteria.ToCountryId = data.country.id;
                    $scope.criteria.ToCountryUrl = data.country.url;
                }
                if (data.region != null) {
                    $scope.criteria.ToRegion = data.region.name;
                    $scope.criteria.ToRegionId = data.region.id;
                    $scope.criteria.ToRegionUrl = data.region.url;
                }
                //ищем
                $scope.startSearchTours();
            }, function (data, status) {
                //ошибка получения данных
                $scope.isDataLoading = false;
                log('getLocationsByUrls error: ' + status);
            });

            function initValues() {
                //флаг индикатор загрузки
                $scope.isDataLoading = false;

                //фильтр
                $scope.filter = new filter();
                //$scope.filter = new filter({ hotelStarsMin: 3, hotelStarsMax: 5 });
                //log('$scope.filter: ' + angular.toJson($scope.filter));

                //обнуляем список
                //var emptyArray = [];
                $scope.hotels = null;
                $scope.filteredHotels = null;
                $scope.searchId = 0;

                //кол-во туров
                $scope.toursCount = 0;
                
                //флаг, когда нужно придержать обновление фильтра
                $scope.isSuspendFilterWatch = false;
            };

            function initWatch() {
                //при изменении hotels = пересчитываем кол-во туров
                $scope.$watchCollection('hotels', function (newValue, oldValue) {

                    //лишний раз не пересчитываем, только если изменилось
                    if (newValue === oldValue) {
                        return;
                    }

                    //log('$scope.$watch hotels triggers, len: ' + $scope.hotels.length);

                    //мин макс цена
                    var minPrice = 10000000000;
                    var maxPrice = 0;
                    var mealsList = [];
                    var mealsIdsList = [];
                    var starsList = [];
                    var services = {};
                    var tourOperatorsList = [];

                    //считаем кол-во туров
                    var count = 0;
                    angular.forEach(newValue, function (hotel, key) {
                        //кол-во туров
                        count += parseInt(hotel.TourCount);

                        //мин макс цена для фильтра
                        var price = parseFloat(hotel.Price);
                        if (price < minPrice)
                            minPrice = price;
                        if (price > maxPrice)
                            maxPrice = price;

                        //питание
                        if (hotel.Meals != null) {
                            angular.forEach(hotel.Meals, function (meal, mealKey) {
                                //если нет в массиве
                                if ($.inArray(meal.id, mealsIdsList) < 0) {
                                    mealsIdsList.push(meal.id);
                                    mealsList.push(meal);
                                }
                            });
                        }
                        
                        //звезды
                        var iStar = parseInt(hotel.Stars,10);
                        if (!isNaN(iStar) && $.inArray(iStar, starsList) < 0) {
                            starsList.push(iStar);
                        }

                        //услуги
                        if (hotel.Services != null) {
                            if (hotel.Services.Internet == true && services.Internet != true)
                                services.Internet = true;
                            if (hotel.Services.Pool == true && services.Pool != true)
                                services.Pool = true;
                            if (hotel.Services.Aquapark == true && services.Aquapark != true)
                                services.Aquapark = true;
                            if (hotel.Services.Fitness == true && services.Fitness != true)
                                services.Fitness = true;
                            if (hotel.Services.ForChild == true && services.ForChild != true)
                                services.ForChild = true;
                        }

                        //туроператоры
                        if (hotel.Tours != null) {
                            angular.forEach(hotel.Tours, function (tour, tourKey) {
                                //если нет в массиве
                                if ($.inArray(tour.Provider.name, tourOperatorsList) < 0) {
                                    tourOperatorsList.push(tour.Provider.name);
                                }
                            });
                        }
                    });

                    $scope.toursCount = count;

                    if (minPrice != 10000000000 && maxPrice != 0) {
                        //log('setting min max prices');
                        $scope.filter.minPrice = minPrice;
                        $scope.filter.maxPrice = maxPrice;
                    }

                    $scope.filter.mealsList = mealsList;
                    $scope.filter.starsList = starsList;
                    $scope.filter.services = services;
                    $scope.filter.tourOperatorsList = tourOperatorsList;

                    //замораживаем обновление с фильтра
                    $scope.suspendFilterWatch(true);
                    //применяем фильтрацию
                    $scope.applyFilterToHotels();
                    $scope.suspendFilterWatch(false);
                });

                //изменение модели фильтра
                $scope.$watch('filter', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    //применяем фильтрацию
                    $scope.applyFilterToHotels();
                }, true);
            };

            function initFuctions() {
                //тут меняем урл для поиска
                $scope.searchTours = function () {
                    var url = urlHelper.UrlToSearch(angular.copy($scope.criteria));

                    //делаем переход и соответственно новый поиск только если url изменился
                    if ($location.path() != url) {
                        $location.path(url);
                    }
                };

                //начинаем поиск
                $scope.startSearchTours = function () {
                    log('startSearchTours in started');
                    //начинаем загрузку данных
                    $scope.isDataLoading = true;
                    //обнуляем модель
                    //$scope.hotels = emptyArray;
                    $scope.hotels = [];

                    log('search: ' + angular.toJson($scope.criteria));
                    //передаем критерии поиска, и класс hotel, чтобы привести результат к нему
                    dataService.startSearchTours($scope.criteria, function (data) {
                        //обновляем данные
                        updateHotels(data);
                    }, function (data, status) {
                        //ошибка получения данных
                        $scope.isDataLoading = false;
                        log('startSearchTours error: ' + status);
                    });
                };

                //поиск - проверка результатов
                var checkSearchTours = function () {
                    log('checkSearchTours in progress...');
                    $scope.isDataLoading = true;

                    dataService.checkSearchTours({ SearchId: $scope.searchId }, function (data) {
                        //обновляем данные
                        updateHotels(data);
                    }, function (data, status) {
                        //ошибка получения данных
                        $scope.isDataLoading = false;
                        log('checkSearchTours error: ' + status);
                    });
                };

                //обновляем модель
                var updateHotels = function (data) {
                    if (data != null) {

                        var newHotels = angular.copy($scope.hotels);
                        //id для запроса поиска
                        $scope.searchId = data.Token.SearchId;

                        if (data.Hotels != null && data.Hotels.length > 0) {
                            $.each(data.Hotels, function (index, itemHotel) {
                                //ищем в уже показанных отелях
                                var match = $filter('arrayFirst')(newHotels, function (item) {
                                    return itemHotel.HotelId === item.HotelId;
                                });

                                var hotelObj;
                                if (match) {
                                    hotelObj = match;
                                } else {
                                    hotelObj = new hotel(itemHotel);
                                }

                                if (!match) {
                                    newHotels.push(hotelObj);
                                }
                            });

                            $scope.hotels = newHotels;
                        }

                        if (!data.EndOfData) {
                            setTimeout(checkSearchTours, 1000);
                        } else {
                            $scope.isDataLoading = false;
                            log('startSearchTours finished');
                        }
                    } else {
                        $scope.isDataLoading = false;
                        log('startSearchTours finished');
                    }
                };

                $scope.applyFilterToHotels = function () {

                    var input = $scope.hotels;
                    var filter = $scope.filter;

                    var minPrice = filter.minPrice;
                    var maxPrice = filter.maxPrice;
                    var hotelName = filter.hotelName;

                    function setFilteredPrice(hotel, min) {
                        var prices = hotel.Prices;
                        var fPrice = parseFloat(hotel.Price);
                        
                        //находим фильтрованную мин цену, но не меньше min
                        var defaultMinPrice = 10000000000;
                        var filteredMinPrice = defaultMinPrice;
                        angular.forEach(hotel.Prices, function (value, key) {
                            //проходит нижний порог
                            if (value >= min && (value < filteredMinPrice || value == 0)) {
                                filteredMinPrice = value;
                            }
                        });

                        if (filteredMinPrice != defaultMinPrice)
                            hotel.FilteredMinPrice = filteredMinPrice;
                    };

                    //пропускаем пустые
                    if ($scope.isSuspendFilterWatch == true/* || minPrice == null || maxPrice == null*/) {
                        //console.log('applyFilterToHotels skip: ' + angular.toJson(filter));
                        return input;
                    }

                    console.log('applyFilterToHotels: ' + angular.toJson(filter));

                    var out = [];
                    //если не изменился - возвращаем тот же объект
                    var isChanged = false;
                    if (input != null) {
                        for (var i = 0; i < input.length; i++) {
                            var hotel = input[i];

                            var passFilterByName = true;
                            //если задан фильтр по имени
                            if (hotelName != null && hotelName.length > 0) {
                                //не чувств. к регистру
                                if (hotel.HotelName.toLowerCase().indexOf(hotelName.toLowerCase()) > -1)
                                    passFilterByName = true;
                                else
                                    passFilterByName = false;
                            }

                            //фильтруем и устанавливаем фильтрованую цену
                            setFilteredPrice(hotel, minPrice);
                            var fPrice = hotel.FilteredMinPrice;

                            if (passFilterByName &&
                                fPrice >= minPrice && fPrice <= maxPrice && //мин макс цена
                                (!(hotel.Stars > 0) || (hotel.Stars >= filter.hotelStarsMin && hotel.Stars <= filter.hotelStarsMax)) //если есть звезды, фильтр мин макс
                                ) {
                                out.push(hotel);
                            }
                            else
                                isChanged = true;
                        }
                    }

                    if (isChanged)
                        $scope.filteredHotels = out;
                    else
                        $scope.filteredHotels = input;
                };
                
                //приостановить обновлене модели фильтра
                $scope.suspendFilterWatch = function (isSuspend) {
                    //log('suspendFilterWatch: ' + isSuspend);
                    $scope.isSuspendFilterWatch = isSuspend;
                };

                //переход на страницу отеля
                $scope.goToHotelDetails = function (hotel) {
                    window.open(urlHelper.UrlToHotelDetails(hotel.HotelId, $scope.searchId));
                };
            };
        }]);

﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('TourDetailsCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService', 'urlHelper',
        function TourDetailsCtrl($log, $scope, $routeParams, $filter, dataService, urlHelper) {
            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //тут какая-нить фигня-крутилка пока грузятся данные

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //данные отеля
            $scope.tour = null;

            //log('$routeParams: ' + angular.toJson($routeParams));
            if (angular.toJson($routeParams) != '{}') {
                $scope.isDataLoading = true;
                //запрос данных для отеля
                dataService.getTourDetail($routeParams, function (data) {
                    //обновляем данные
                    $scope.updateTourDetail(data);
                }, function (data, status) {
                    //ошибка получения данных
                    log('getHotelDetail error: ' + status);
                    $scope.isDataLoading = false;
                });
            }

            //обновляем модель
            $scope.updateTourDetail = function (data) {
                //log('updateTourDetail data: ' + angular.toJson(data));
                if (data != null && data.TourDetailResult!=null) {
                    log('updateTourDetail');
                    //log('updateTourDetail, data: ' + angular.toJson(data));

                    $scope.tour = new tourDetail(data);
                    //log('$scope.tour: ' + angular.toJson($scope.tour));
                } else {
                    $scope.tour = null;
                }
                $scope.isDataLoading = false;
            };

            //перейти к оплате
            $scope.goToPayDetails = function (payData) {
                log('pay: ' + angular.toJson(payData));

                // тестовые данные
                payData.DirectFlightId = payData.DirectFlight.Id;
                payData.ReturnFlightId = payData.ReturnFlight.Id;
                payData.ExtraCharges = payData.ExtraCharges;
                payData.ToAirportTransferId = payData.ToAirportTransfer.Id;
                payData.FromAirportTransferId = payData.FromAirportTransfer.Id;
                payData.Insurances = [payData.TourInsurance.Id];
                payData.Services = payData.Services;
                

                //alert('Еще не реализовано');
                dataService.getOrder(payData, function (orderId) {

                    var url = urlHelper.UrlToPaymentPage(orderId);
                    $location.path(url);

                }, function (data, status) {
                    //ошибка получения данных
                    log('getHotelDetail error: ' + status);
                    $scope.isDataLoading = false;
                });
                
            };
        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('ToursFormCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$location', 'dataService', 'urlHelper',
        function ToursFormCtrl($log, $scope, $rootScope, $routeParams, $filter, $location, dataService, urlHelper) {
            function log(msg) {
                $log.log(msg);
            }

            //+- 5 дней
            var DATE_INTERVAL_DAYS = 5;
            var toItemType = { country: 'country', resort: 'resort', hotel: 'hotel' };
            $scope.toItemType = toItemType;
            var skipCloseType = { from: 'from', to: 'to', date: 'date', nights: 'nights', people: 'people', childAge1: 'childAge1', childAge2: 'childAge2', childAge3: 'childAge3' };

            //форма===============================================================
            $scope.form = {};

            //список откуда
            var fromList = [
                new fromItem(832, "Москва", "Москвы"),
                new fromItem(1264, "Санкт-Петербург", "Санкт-Петербурга"),
                new fromItem(886, "Новосибирск", "Новосибирска"),
                new fromItem(425, "Екатеринбург", "Екатеринбурга"),
                new fromItem(872, "Нижний Новгород", "Нижнего Новгорода")
            ];

            //запрашиваем список слетать
            dataService.getSletatCity(function (data) {
                    var list = [];
                    _.each(data, function (item) {
                        list.push(new fromItem(item.id, item.name, item.name));
                    });
                    $scope.form.fromList = list;
                    //восстанавливаем значения формы из урла
                    restoreFormParamsFromQueryString();
                },
                function (data, status) {
                });
            
            //откуда
            $scope.form.from = fromList[0];
            $scope.form.fromIsOpen = false;
            $scope.form.fromList = fromList;
            $scope.form.fromIsItemSelected = function (item) {
                if ($scope.form.from != null && $scope.form.from.id == item.id)
                    return true;
                else
                    return false;
            };

            //куда
            var defaultToText = "Куда? Укажите страну, курорт или отель";
            $scope.form.to = null;//new toItem(40, "Египет", "country");
            $scope.form.toList = null;
            $scope.form.toText = defaultToText;
            $scope.form.toTextGetText = function (item) {
                return item.name + $scope.getToItemDescription(item);
            };
            $scope.form.toListSelectedIndex = -1;
            $scope.form.toListIsNotEmpty = function () {
                if ($scope.form.toList != null && $scope.form.toList.length > 0)
                    return true;
                else
                    return false;
            };

            var startDate = new Date();
            startDate.setDate(startDate.getDate() + 14);
            //дата
            $scope.form.beginDate = dateHelper.jsDateToDate(startDate);
            //выбрано +-5 дней
            $scope.form.beginDateIntervalChecked = true;
            //$scope.$watch('form.beginDateIntervalChecked', function (newValue, oldValue) {
            //    if (newValue === oldValue) {
            //        return;
            //    }
            //    //применяем фильтрацию
            //    log('form.beginDateIntervalChecked: ' + $scope.form.beginDateIntervalChecked);
            //}, true);

            //дата клик
            $scope.dateClick = function ($event) {
                closeAllPopups(skipCloseType.date);
                //log('dateClick');

                if ($(".Calendar-input").datepicker("widget").is(":visible")) {
                    $(".Calendar-input").datepicker("hide");
                    $(".Calendar-input").blur();
                }
                else
                {
                    $(".Calendar-input").datepicker("show");
                    $(".Calendar-input").focus();
                }

                preventBubbling($event);
            };
            
            var nightsList = [
                new nightItem("до 5 ночей", 1, 5),
                new nightItem("5-7 ночей", "5", "7"),
                new nightItem("7-10 ночей", 7, 10),
                new nightItem("10-14 ночей", 10, 14), //(по умолчанию)
                new nightItem("14+ ночей", 14, 29),
                new nightItem("Все равно", 0, 0),
                new nightItem("14 ночей", 14, 14),
                new nightItem("13 ночей", 13, 13),
                new nightItem("12 ночей", 12, 12),
                new nightItem("11 ночей", 11, 11),
                new nightItem("10 ночей", 10, 10),
                new nightItem("9 ночей", 9, 9),
                new nightItem("8 ночей", 8, 8),
                new nightItem("7 ночей", 7, 7),
                new nightItem("6 ночей", 6, 6),
                new nightItem("5 ночей", 5, 5),
                new nightItem("4 ночи", 4, 4),
                new nightItem("3 ночи", 3, 3),
                new nightItem("2 ночи", 2, 2),
                new nightItem("1 ночь", 1, 1)
            ];
            //кол-во ночей
            $scope.form.nightsList = nightsList;
            //по-умолчанию - все равно
            $scope.form.nights = nightsList[3];//10-14 ночей (по умолчанию)
            $scope.form.nightsIsOpen = false;
            $scope.form.nightsIsItemSelected = function (item) {
                if ($scope.form.nights != null && item.name == $scope.form.nights.name)
                    return true;
                else
                    return false;
            };

            //взрослые / дети
            $scope.form.people = {
                isOpen: false,
                adultsCountList: [1, 2, 3, 4],
                adultsCount: 2,
                childsCountList: [0, 1, 2, 3],
                childsCount: 0,
                childsAgesList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                childAge1: 0,
                childAge2: 0,
                childAge3: 0,
                childAge1IsOpen: false,
                childAge2IsOpen: false,
                childAge3IsOpen: false
            };

            //подгружаем из куки
            getParamsFromCookie();

            //добавляем в список обработчиков наш контроллер (мы хотим ловить клик по body)
            $rootScope.addBodyClickListner('tours.form', bodyClick);

            //обработчик клика на body
            function bodyClick(){
                //log('tours.form bodyClick');
                closeAllPopups();
            }

            //закрывает все открытые попапы
            function closeAllPopups(skipClose) {
                if (skipClose != skipCloseType.from)
                    $scope.form.fromIsOpen = false;

                if (skipClose != skipCloseType.to)
                    $scope.form.toList = null;

                if (skipClose != skipCloseType.date)
                {
                    $(".Calendar-input").datepicker("hide");
                    $(".Calendar-input").blur();
                }

                if (skipClose != skipCloseType.nights)
                    $scope.form.nightsIsOpen = false;

                if (skipClose != skipCloseType.people
                    && skipClose != skipCloseType.childAge1
                    && skipClose != skipCloseType.childAge2
                    && skipClose != skipCloseType.childAge3)
                    $scope.form.people.isOpen = false;

                if (skipClose != skipCloseType.childAge1)
                    $scope.form.people.childAge1IsOpen = false;

                if (skipClose != skipCloseType.childAge2)
                    $scope.form.people.childAge2IsOpen = false;

                if (skipClose != skipCloseType.childAge3)
                    $scope.form.people.childAge3IsOpen = false;
            }

            //var cookieName = ".form_cook";
            //куки
            function getParamsFromCookie() {
                var sta = QueryString.getByName('sta');
                //проверяем, что нужно восстанавливать состояние
                //из куки восстанавливаем только на главной
                if ($location.path() == "/" && (sta == null || sta == '')) {
                    //log('getParamsFromCookie');
                    var cookVal = $.cookie("form_cook");
                    //log('getParamsFromCookie, cookVal: ' + cookVal);
                    if (cookVal != null) {
                        var formVal = angular.fromJson(cookVal);

                        $scope.form.from = formVal.from;
                        $scope.form.to = formVal.to;
                        $scope.form.toText = formVal.toText;
                        $scope.form.beginDate = formVal.beginDate;
                        $scope.form.beginDateIntervalChecked = formVal.beginDateIntervalChecked;
                        $scope.form.nights = formVal.nights;
                        $scope.form.people.adultsCount = formVal.people.adultsCount;
                        $scope.form.people.childsCount = formVal.people.childsCount;
                        $scope.form.people.childAge1 = formVal.people.childAge1;
                        $scope.form.people.childAge2 = formVal.people.childAge2;
                        $scope.form.people.childAge3 = formVal.people.childAge3;
                    }
                }
            };

            function saveParamsToCookie() {
                var saveObj = {};
                saveObj.from = {};
                saveObj.to = {};
                saveObj.toText = {};
                saveObj.beginDate = {};
                saveObj.nights = {};
                saveObj.people = {};
                saveObj.people.adultsCount = {};
                saveObj.people.childsCount = {};
                saveObj.people.childAge1 = {};
                saveObj.people.childAge2 = {};
                saveObj.people.childAge3 = {};

                saveObj.from = $scope.form.from;
                saveObj.to = $scope.form.to;
                saveObj.toText = $scope.form.toText;
                saveObj.beginDate = $scope.form.beginDate;
                saveObj.beginDateIntervalChecked = $scope.form.beginDateIntervalChecked;
                saveObj.nights = $scope.form.nights;
                saveObj.people.adultsCount = $scope.form.people.adultsCount;
                saveObj.people.childsCount = $scope.form.people.childsCount;
                saveObj.people.childAge1 = $scope.form.people.childAge1;
                saveObj.people.childAge2 = $scope.form.people.childAge2;
                saveObj.people.childAge3 = $scope.form.people.childAge3;

                var cookVal = angular.toJson(saveObj);
                //log('saveParamsToCookie, cookVal: ' + cookVal);
                //сохраняем сессионную куку
                $.cookie("form_cook", cookVal);

                //var testVal = $.cookie("form_cook");
                //log('saveParamsToCookie, testVal: ' + testVal);
            };

            function restoreFormParamsFromQueryString() {
                var sta = QueryString.getByName('sta');
                //проверяем, что нужно восстанавливать состояние
                if (sta == null || sta == '')
                    return;

                //log('restoreFormParamsFromQueryString');

                function getInt(val) {
                    if (val != null && val.length > 0)
                        return parseInt(val);
                    else
                        return 0;
                }

                //откуда
                var fromId = QueryString.getByName('city');
                if (fromId.length > 0) {
                    $scope.form.from.id = fromId;
                    //название
                    $scope.form.from = _.find($scope.form.fromList, function (item) {
                        return item.id == fromId;
                    });
                }

                //куда
                var toId = 0;
                var toType = 'hotel';
                toId = getInt(QueryString.getByName('hotels'));
                if (toId == 0) {
                    toType = 'resort';
                    toId = getInt(QueryString.getByName('resorts'));
                }
                if (toId == 0) {
                    toType = 'country';
                    toId = getInt(QueryString.getByName('country'));
                }

                if (toId > 0) {
                    //запрос по Id
                    dataService.getSletatById(toId,
                        function (data) {
                            //пришел ответ
                            var toList = [];
                            //маппим объекты
                            _.each(data, function (item) { toList.push(new toItemData(item)) });
                            //ищем объект нужного типа
                            var toItem = _.find(toList, function (item) {
                                return item.type == toType;
                            });
                            $scope.form.to = toItem;
                            //$scope.form.toText = toItem.name;
                            $scope.form.toText = $scope.form.toTextGetText(toItem);
                        },
                        function (data, status) {
                        });
                }

                //дата
                var date = QueryString.getByName('date');
                if (date.length > 0) {
                    date = dateHelper.sletatDateToDate(date);
                    $scope.form.beginDate = date;
                    $scope.form.beginDateIntervalChecked = false;
                }
                else
                {//диапазон дат
                    var dateFrom = dateHelper.sletatDateToDate(QueryString.getByName('date1'));
                    var dateTo = dateHelper.sletatDateToDate(QueryString.getByName('date2'));

                    var jsDateFrom = dateHelper.dateToJsDate(dateFrom);
                    var jsDateTo = dateHelper.dateToJsDate(dateTo);
                    var jsDateFromMillis = dateHelper.dateToJsDate(dateFrom).getTime();
                    var jsDateToMillis = dateHelper.dateToJsDate(dateTo).getTime();
                    var diff = jsDateToMillis - jsDateFromMillis;

                    var jsDateMidMillis = jsDateFromMillis + (diff / 2);
                    var jsDateMid = new Date(jsDateMidMillis);

                    var date = jsDateMid;
                    if (diff == 0)
                        $scope.form.beginDateIntervalChecked = false;//снимаем +-5 дней
                    else
                        $scope.form.beginDateIntervalChecked = true;//ставим +-5 дней
                    //приводим к нашему формату
                    $scope.form.beginDate = dateHelper.jsDateToDate(date);
                }

                //ночи
                var nightsMin = QueryString.getByName('nightsMin');
                var nightsMax = QueryString.getByName('nightsMax');
                $scope.form.nights = _.find($scope.form.nightsList, function (item) {
                    return (item.min == nightsMin && item.max == nightsMax);
                });

                //взрослые / дети
                var adults = getInt(QueryString.getByName('adults'));
                $scope.form.people.adultsCount = adults;
                var kids = getInt(QueryString.getByName('kids'));
                $scope.form.people.childsCount = kids;
                var kids_ages = QueryString.getByName('kids_ages');
                var kidsAgesParts = kids_ages.split(',');
                $scope.form.people.childAge1 = getInt(kidsAgesParts[0]);
                $scope.form.people.childAge2 = getInt(kidsAgesParts[1]);
                $scope.form.people.childAge3 = getInt(kidsAgesParts[2]);
            };

            //логика====================================================================
            //отключаем бабблинг событий
            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            //дата - вывод выбора
            $scope.getBeginDateShort = function () {
                //log('date:' + $scope.form.beginDate);
                var date = $scope.form.beginDate;
                if (date != null) {
                    var parts = date.split('.');
                    var shortDate = parts[0] + '.' + parts[1];
                    return shortDate;
                }
                else
                    return "Когда";
            }

            function prepareToTerm(text) {
                var ind = text.indexOf(',');
                if (ind > -1) {
                    text = text.substring(0, ind);
                }
                return text;
            };

            //куда - запрос на сервер
            function getCountry() {
                if ($scope.form.toText != null && $scope.form.toText.length > 0) {
                    var term = prepareToTerm($scope.form.toText);
                    //console.log('getCountry:' + term);
                    dataService.getSletatDirectoryByTerm(term,
                        function (data) {
                            if (data != null && data.length > 0) {
                                var toList = [];
                                //маппим объекты
                                _.each(data, function (item) { toList.push(new toItemData(item)) });
                                $scope.form.toList = toList;

                                //устанавливаем первый - выбранным
                                if ($scope.form.toList.length > 0) {
                                    $scope.form.toListSelectedIndex = 0;
                                    $scope.form.to = $scope.form.toList[0];
                                }
                                else
                                    $scope.form.toListSelectedIndex = -1;

                                //прячем все формы, и дату
                                closeAllPopups(skipCloseType.to);
                                $("#ui-datepicker-div").hide();

                                //скроллим на первый элемент
                                scrollToFirstItem();
                            }
                            else
                                $scope.form.toList = null;
                        },
                        function (data, status) {
                            //ошибка
                        });
                }
            };

            $scope.getToItemDescription = function (item) {
                var country = "";
                if (item.countryName != null)
                    country = item.countryName;

                var resort = "";
                if (item.resortName != null)
                    resort = item.resortName;

                if (item.type == toItemType.country)
                    return ", по всей стране";
                else if (item.type == toItemType.resort)
                    return ", " + country;
                else if (item.type == toItemType.hotel)
                    return ", " + country + ", " + resort;
            };

            //чтобы ввод текста сразатывал раз в 300мс
            var getCountryThrottled = _.debounce(function ($scope) {
                getCountryDelayed($scope);
            }, 300);
            var getCountryDelayed = function ($scope) {
                $scope.$apply(function () { getCountry($scope); });
            };

            //откуда
            $scope.fromFormClick = function ($event) {
                closeAllPopups(skipCloseType.from);
                $scope.form.fromIsOpen = !$scope.form.fromIsOpen;
                preventBubbling($event);
            };
            $scope.fromClick = function (item, $event) {
                $scope.form.from = item;
                $scope.form.fromIsOpen = false;
                preventBubbling($event);
            };

            //куда
            //поведение разделителя в списке куда
            $scope.isToHotelDelimiterSet = false;
            $scope.isNeedInsertDelimiter = function (item, $index) {
                //на первом элементе сбрасываем флаг
                if ($index == 0) {
                    $scope.isToHotelDelimiterSet = false;
                    return false;
                }

                //если уже вставили разделитель - то 
                if ($scope.isToHotelDelimiterSet)
                    return false;

                //нулевой - пропускаем
                var prevItem = $scope.form.toList[$index - 1];
                var prevIsHotel = prevItem.type == toItemType.hotel;
                var curIsHotel = item.type == toItemType.hotel;
                if (!prevIsHotel && curIsHotel) {
                    $scope.isToHotelDelimiterSet = true;
                    return true;
                }
            };
            $scope.isNeedToShowFlag = function (item) {
                return (item.codeIcao != null && item.codeIcao.length > 0 && item.type == toItemType.country);
            };

            //init tooltip
            var $to = $('.SearchTo');
            $to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
            $to.tooltip("disable");

            $scope.form.toTooltip = {
                show: function () {
                    var $to = $('.SearchTo');
                    $to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
                    $to.tooltip("enable");
                    $to.tooltip("open");
                },
                hide: function () {
                    var $to = $('.SearchTo');
                    $to.tooltip("disable");
                }
            };

            $scope.toIsEmpty = function () {
                return ($scope.form.toText == defaultToText);
            };
            $scope.toFocus = function ($event) {
                //выключаем тултип
                $scope.form.toTooltip.hide();
                preventBubbling($event);
            };

            $scope.toBlur = function ($event) {
                //log('toBlur');
                //logState();

                //если ничего не ввели - по ставим дефолтный текст
                //если не выбрали из выпадушки - то закрываем
                if ($scope.form.toText == "" || $scope.form.toText == defaultToText) {
                    //скрываем список
                    $scope.form.toList = null;
                    //ставим по-умолчанию
                    $scope.form.toText = defaultToText;
                }

                preventBubbling($event);
            };

            function scrollToItem(ind) {
                //скролим где-то в середину (во всю высоту влезает где-то 10 итемов)
                ind = ind - 5;
                if (ind >= 0) {
                    var container = $(".search-form-list-to");
                    var scrollTo = $(".search-form-list-item-country:eq(" + ind + ")");
                    if (scrollTo.length > 0) {
                        var scrollToVal = scrollTo.offset().top - container.offset().top + container.scrollTop();

                        container.animate({
                            scrollTop: scrollToVal
                        }, 50);
                    }
                    //log('scrollToItem: ' + ind);
                }
            };

            function scrollToFirstItem() {
                var container = $(".search-form-list-to");
                container.animate({
                    scrollTop: 0
                }, 50);
            };

            $scope.toKeyDown = function ($event) {
                //log('toKeyDown: ' + $event.keyCode);
                if ($event.keyCode == 27) {//esc
                    $scope.form.toList = null;
                }
                else if ($event.keyCode == 13) {//enter
                    var ind = $scope.form.toListSelectedIndex;
                    if ($scope.form.toList == null)
                    {
                        //сразу ищем
                        if ($scope.form.toText != "" && $scope.form.toText.length > 0) {
                            $scope.goFindTours();
                        }
                    }
                    else if ($scope.form.toListIsNotEmpty() &&
                        ind >= 0 &&
                        ind < $scope.form.toList.length) {
                        var toItem = $scope.form.toList[ind];
                        $scope.form.to = toItem;
                        //$scope.form.toText = toItem.name;
                        $scope.form.toText = $scope.form.toTextGetText(toItem);
                        //очищаем список (и закрываем)
                        $scope.form.toList = null;
                    }
                    preventBubbling($event);
                }
                else if ($event.keyCode == 40) {//arrow down
                    var ind = $scope.form.toListSelectedIndex;
                    var lastInd = ind;
                    ind++;
                    if ($scope.form.toListIsNotEmpty() &&
                        ind > $scope.form.toList.length - 1)
                        ind = $scope.form.toList.length - 1;
                    $scope.form.toListSelectedIndex = ind;
                    //log('toListSelectedIndex: ' + ind);

                    if (lastInd != ind)
                        scrollToItem(ind);

                    preventBubbling($event);
                }
                else if ($event.keyCode == 38) {//arrow up
                    var ind = $scope.form.toListSelectedIndex;
                    var lastInd = ind;
                    ind--;
                    if (ind < 0)
                        ind = 0;
                    $scope.form.toListSelectedIndex = ind;
                    //log('toListSelectedIndex: ' + ind);

                    if (lastInd != ind)
                        scrollToItem(ind);

                    preventBubbling($event);
                }
                
            };

            $scope.toChange = function () {
                //console.log('toChange:' + $scope.form.toText);
                getCountryThrottled($scope);
            };
            $scope.toClick = function ($event) {
                //log('toClick');
                closeAllPopups(skipCloseType.to);

                //если был дефолтный текст
                if ($scope.toIsEmpty())
                    $scope.form.toText = "";//все стираем

                if ($scope.form.toText != "" && $scope.form.toText.length > 0) {
                    getCountry();
                }

                //select all
                $($event.target).select();

                preventBubbling($event);
            };

            $scope.toItemClick = function (item, $event) {
                //log('toItemClick');
                //очищаем список (и закрываем)
                $scope.form.toList = null;
                //$scope.form.toText = item.name;
                $scope.form.toText = $scope.form.toTextGetText(item);
                $scope.form.to = item;
                //logState();

                preventBubbling($event);
            };

            //ночи
            $scope.nightFormClick = function ($event) {
                closeAllPopups(skipCloseType.nights);
                $scope.form.nightsIsOpen = !$scope.form.nightsIsOpen;
                preventBubbling($event);
            };
            $scope.nightItemClick = function (item, $event) {
                $scope.form.nights = item;
                $scope.form.nightsIsOpen = false;
                preventBubbling($event);
            };

            //взрослые / дети
            $scope.peopleContClick = function ($event) {
                closeAllPopups(skipCloseType.people);
                preventBubbling($event);
            };
            $scope.peopleFormClick = function ($event) {
                closeAllPopups(skipCloseType.people);
                $scope.form.people.isOpen = !$scope.form.people.isOpen;
                preventBubbling($event);
            };
            $scope.adultsClick = function (count, $event) {
                $scope.form.people.adultsCount = count;
                preventBubbling($event);
            };
            $scope.childsClick = function (count, $event) {
                $scope.form.people.childsCount = count;
                preventBubbling($event);
            };
            //$scope.childsFormClick = function ($event) {
            //    preventBubbling($event);
            //};

            $scope.childsAge1Click = function ($event) {
                closeAllPopups(skipCloseType.childAge1);
                $scope.form.people.childAge1IsOpen = !$scope.form.people.childAge1IsOpen;
                preventBubbling($event);
            };
            $scope.childsAge1ItemClick = function (age, $event) {
                $scope.form.people.childAge1 = age;
                closeAllPopups(skipCloseType.people);
                preventBubbling($event);
            };

            $scope.childsAge2Click = function ($event) {
                closeAllPopups(skipCloseType.childAge2);
                $scope.form.people.childAge2IsOpen = !$scope.form.people.childAge2IsOpen;
                preventBubbling($event);
            };
            $scope.childsAge2ItemClick = function (age, $event) {
                $scope.form.people.childAge2 = age;
                closeAllPopups(skipCloseType.people);
                preventBubbling($event);
            };

            $scope.childsAge3Click = function ($event) {
                closeAllPopups(skipCloseType.childAge3);
                $scope.form.people.childAge3IsOpen = !$scope.form.people.childAge3IsOpen;
                preventBubbling($event);
            };
            $scope.childsAge3ItemClick = function (age, $event) {
                $scope.form.people.childAge3 = age;
                closeAllPopups(skipCloseType.people);
                preventBubbling($event);
            };

            //кнопка найти
            $scope.goFindTours = function () {
                //return false;

                if ($scope.form.to == null ||
                    $scope.form.nights == null) {
                    //показываем тултип
                    $scope.form.toTooltip.show();
                    return;
                }

                //устанавливаем выбранный текст (если не выбрали с выпадушки, а сразу нажали на найти)
                $scope.form.toText = $scope.form.toTextGetText($scope.form.to);

                saveParamsToCookie();
                

                ///tours/?STA=1&country=119&city=1271&resorts=&hotels=&stars=&meals=&adults=2&kids=0&kids_ages=&currency=RUB&price_min=&price_max=&date=24/02/2014&nights_min=7&nights_max=7&three_day=1

                var city = $scope.form.from.id;
                var country = '';
                var resort = '';
                var hotel = '';
                if ($scope.form.to.type == toItemType.hotel) {
                    hotel = $scope.form.to.id;
                    resort = $scope.form.to.resortId;
                    country = $scope.form.to.countryId;
                }
                else if ($scope.form.to.type == toItemType.resort) {
                    resort = $scope.form.to.id;
                    country = $scope.form.to.countryId;
                }
                else
                    country = $scope.form.to.id;

                //даты
                var date = $scope.form.beginDate;
                date = dateHelper.dateToSletatDate(date);//24.02.2014 => 24/02/2014

                var isDateIntervalChecked = $scope.form.beginDateIntervalChecked;
                var dateFrom = null;
                var dateTo = null;
                if (isDateIntervalChecked)
                {
                    var jsDateFrom = dateHelper.dateToJsDate(angular.copy($scope.form.beginDate));
                    var jsDateTo = dateHelper.dateToJsDate(angular.copy($scope.form.beginDate));
                    jsDateFrom.setDate(jsDateFrom.getDate() - DATE_INTERVAL_DAYS);
                    jsDateTo.setDate(jsDateTo.getDate() + DATE_INTERVAL_DAYS);
                    //ставим +- 5 дней
                    dateFrom = dateHelper.jsDateToDate(jsDateFrom);
                    dateTo = dateHelper.jsDateToDate(jsDateTo);
                    //приводим к формату dd.mm.yyyy
                    dateFrom = dateHelper.dateToSletatDate(dateFrom);
                    dateTo = dateHelper.dateToSletatDate(dateTo);
                }

                var nightsMin = $scope.form.nights.min;
                var nightsMax = $scope.form.nights.max;
                if (nightsMin == 0)
                    nightsMin = "";
                if (nightsMax == 0)
                    nightsMax = "";

                var adults = $scope.form.people.adultsCount;
                var kids = $scope.form.people.childsCount;
                var kids_ages = ""; //2,2,2
                kids_ages = "" + $scope.form.people.childAge1 + "," + $scope.form.people.childAge2 + "," + $scope.form.people.childAge3;

                var url = '';
                if (!isDateIntervalChecked)
                    url = urlHelper.UrlToSletatTours(city, country, resort, hotel, encodeURIComponent(date), nightsMin, nightsMax, adults, kids, kids_ages);
                else
                    url = urlHelper.UrlToSletatToursDatesInterval(city, country, resort, hotel, encodeURIComponent(dateFrom), encodeURIComponent(dateTo), nightsMin, nightsMax, adults, kids, kids_ages);

                //search_depth - как далеко вперед дата поиска в днях (дата отправления минус текущая дата)
                var departure_date = dateHelper.dateToJsDate($scope.form.beginDate);
                var search_depth = Math.abs(departure_date - dateHelper.getTodayDate());
                search_depth = dateHelper.getTimeSpanFromMilliseconds(search_depth);
                search_depth = dateHelper.getTimeSpanMaxDays(search_depth);

                //source - откуда вызван поиск (main/search_result)
                var source = "main";
                if ($location.absUrl().indexOf('/tours/?') > -1) {
                    source = "search_result";
                }

                //пишем статистику
                track.formSearch($scope.form.from.name, $scope.form.toText, $scope.form.beginDate, $scope.form.beginDateIntervalChecked,
                    search_depth, $scope.form.nights.name, $scope.form.people.adultsCount, $scope.form.people.childsCount, source,
                    function () {
                        //переходим на поиск туров
                        window.location.href = url;
                    });
            };

            function logState() {
                var len = 0;
                if ($scope.form.toList != null)
                    len = $scope.form.toList.length;
                log('toList: ' + len + ', toText: ' + $scope.form.toText);
            };
        }]);
﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('ToursCtrl', ['$log', '$scope', '$rootScope', '$routeParams', 'dataService', 'sharedProperties',
        function ToursCtrl($log, $scope, $rootScope, $routeParams, dataService, sharedProperties) {
            function log(msg) {
                $log.log(msg);
            }

            //карусель
            $scope.myInterval = 5000;

            $scope.hellomsg = "Привет из ToursCtrl";

            
            //log('$scope.getSectionTours');
            var params = {
                sectionLayoutId: QueryString.getFromUrlByName(location.href, 'sectionLayoutId'),
                sliderId: QueryString.getFromUrlByName(location.href, 'sliderId'),
                layoutOffersId: QueryString.getFromUrlByName(location.href, 'layoutOffersId')
            };
            dataService.getSectionTours(params, function (data) {
                //обновляем данные
                if (data != null) {
                    //log('data: ' + angular.toJson(data));
                    //log('$scope.getSectionTours success');
                    updateModel(data);
                    //$scope.blocks = angular.fromJson(data);
                }
            }, function (data, status) {
                //ошибка получения данных
                log('getSectionTours error; status:' + status);
            });


            function updateModel(data) {
                $scope.sections = data.SectionLayouts;

                //var desc = "23 февраля на 10 ночей Отель 5*";
                //desc = "";
                //var sections = angular.fromJson(data.SectionLayouts);
                //_.each(sections, function (sec) {
                //    _.each(sec.OfferLayouts, function (offer) {
                //        if (offer.Offer1 != null)
                //            offer.Offer1.Description = desc;
                //        if (offer.Offer2 != null)
                //            offer.Offer2.Description = desc;
                //        if (offer.Offer3 != null)
                //            offer.Offer3.Description = desc;
                //    });
                //});
                //$scope.sections = sections;

                //вместо картинок - заглушки (часто ломают картинки)
                //$scope.sections = stubber.fillStubImages(angular.fromJson(data.SectionLayouts));
                $scope.slides = data.Slider;

                //данные для слайдера - нужны другому контроллеру
                //log('sharedProperties.setProperty');
                sharedProperties.setSlider($scope.slides);

                //var test = sharedProperties.getProperty();
                //log('test: ' + angular.toJson(test));
            }
        }]);
﻿

innaAppDirectives.
    directive('filterAircompany', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_aircompany.html'),
            scope: {
                list: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);

                    _.each($scope.list, function (item) { item.checked = false });
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }

                $scope.anyChecked = function () {
                    if ($scope.list != null) {
                        return _.any($scope.list, function (item) { return item.checked; });
                    }
                    return false;
                }
            }],
            link: function ($scope, element, attrs) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.$apply(function ($scope) {
                        if (isInsideComponent && $scope.headClicked) {
                            //ничего не делаем, уже кликнули по шапке
                        } else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });
            }
        };
    }]);

﻿

innaAppDirectives.
    directive('filterAirport', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_airport.html'),
            scope: {
                filter: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.minLen = 1;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);

                    _.each($scope.filter.fromPorts, function (item) { item.checked = false });
                    _.each($scope.filter.toPorts, function (item) { item.checked = false });
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }

                $scope.anyChecked = function () {
                    if ($scope.filter != null) {
                        return _.any($scope.filter.fromPorts, function (item) { return item.checked; }) || _.any($scope.filter.toPorts, function (item) { return item.checked; });
                    }
                    return false;
                }

                //$scope.$watch('filter', function (newValue) {
                //    console.log(newValue);
                //}, true);
            }],
            link: function ($scope, element, attrs) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.$apply(function ($scope) {
                        if (isInsideComponent && $scope.headClicked) {
                            //ничего не делаем, уже кликнули по шапке
                        } else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });
            }
        };
    }]);

﻿

innaAppDirectives.
    directive('filterPrice', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
        return {
            require: 'ngModel',
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_price.html'),
            scope: {
                initMinValue: '=',
                initMaxValue: '=',
                minValue: '=',
                maxValue: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);
                    $scope.minValue = $scope.initMinValue;
                    $scope.maxValue = $scope.initMaxValue;
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }
            }],
            link: function ($scope, element, attrs, ngModel) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.filter = ngModel.$modelValue;

                    $scope.$apply(function ($scope) {
                        if (isInsideComponent && $scope.headClicked) {
                            //ничего не делаем, уже кликнули по шапке
                        } else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });
            }
        };
    }]);



innaAppDirectives.
    directive('filterSort', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_sort.html'),
            scope: {
                sort: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);

                    //_.each($scope.list, function (item) { item.checked = false });
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }

                $scope.anyChecked = function () {
                    if ($scope.sort.list != null) {
                        return _.any($scope.list, function (item) { return item.checked; });
                    }
                    return false;
                }

                $scope.applySort = function ($event, type) {
                    $scope.isOpen = false;
                    //eventsHelper.preventBubbling($event);
                    //log('applySort: ' + type + ', $scope.sort:' + $scope.sort + ', $scope.reverse:' + $scope.reverse);

                    var reverse = false;
                    if ($scope.sort.sortType == type)
                        reverse = !$scope.sort.reverse;
                    else
                        reverse = false;

                    $scope.sort.sortType = type;
                    $scope.sort.reverse = reverse;
                };

                $scope.getCurrentSortName = function () {
                    return _.find($scope.sort.list, function (item) { return item.sort == $scope.sort.sortType }).name;
                };
            }],
            link: function ($scope, element, attrs) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.$apply(function ($scope) {
                        if (isInsideComponent && $scope.headClicked) {
                            //ничего не делаем, уже кликнули по шапке
                        } else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });
            }
        };
    }]);

﻿

innaAppDirectives.
    directive('filterTime', ['$templateCache', 'eventsHelper', 'aviaHelper', function ($templateCache, eventsHelper, aviaHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_time.html'),
            scope: {
                list: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }

                $scope.anyChecked = function () {
                    if ($scope.list != null) {
                        return _.any($scope.list, function (item) { return item.checked == true; });
                    }
                    return false;
                }

                $scope.isToDepartureChecked = true;
                $scope.isBackDepartureChecked = true;

                $scope.resetTo = function ($event) {
                    eventsHelper.preventBubbling($event);
                    for (var i = 0; i <= 7; i++) {
                        $scope.list[i].checked = false;
                    }
                }

                $scope.resetBack = function ($event) {
                    eventsHelper.preventBubbling($event);
                    for (var i = 8; i <= 15; i++) {
                        $scope.list[i].checked = false;
                    }
                }

                $scope.resetItems = function (isToOrBack) {
                    if (isToOrBack) {
                        if ($scope.isToDepartureChecked) {
                            var list = _.filter($scope.list, function (item) { return item.direction == aviaHelper.directionType.arrival });
                            _.each(list, function (item) { item.checked = false; });
                        }
                        else
                        {
                            var list = _.filter($scope.list, function (item) { return item.direction == aviaHelper.directionType.departure });
                            _.each(list, function (item) { item.checked = false; });
                        }
                    }
                    else {
                        if ($scope.isBackDepartureChecked) {
                            var list = _.filter($scope.list, function (item) { return item.direction == aviaHelper.directionType.backArrival });
                            _.each(list, function (item) { item.checked = false; });
                        }
                        else {
                            var list = _.filter($scope.list, function (item) { return item.direction == aviaHelper.directionType.backDeparture });
                            _.each(list, function (item) { item.checked = false; });
                        }
                    }
                }
            }],
            link: function ($scope, element, attrs) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.$apply(function ($scope) {
                        if (isInsideComponent && $scope.headClicked) {
                            //ничего не делаем, уже кликнули по шапке
                        } else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });
            }
        };
    }]);


innaAppDirectives.
    directive('filterTransfer', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_transfer.html'),
            scope: {
                list: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);

                    _.each($scope.list, function (item) { item.checked = false });
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }

                $scope.anyChecked = function () {
                    if ($scope.list != null) {
                        return _.any($scope.list, function (item) { return item.checked; });
                    }
                    return false;
                }
            }],
            link: function ($scope, element, attrs) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.$apply(function ($scope) {
                        if (isInsideComponent && $scope.headClicked) {
                            //ничего не делаем, уже кликнули по шапке
                        } else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });
            }
        };
    }]);

angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaAirlines', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/dynamic-serp-filter/avia.airlines.html'),
            scope: {
                tickets: '=innaDynamicSerpFilterAviaAirlinesTickets',
                filters: '=innaDynamicSerpFilterAviaAirlinesFilters'
            },
            controller: [
                '$scope', '$element', '$controller', 'innaApp.API.events',
                function($scope, $element, $controller, Events){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    var Option = inna.Models.Avia.Filters._OptionFactory(function(name, minPrice){
                        this.minPrice = minPrice
                    });

                    Option.prototype.describe = function(){
                        return this.title;
                    };

                    var Options = inna.Models.Avia.Filters._OptionsFactory();

                    /*Properties*/
                    $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Airlines'));
                    $scope.filter.options = $scope.options = new Options();
                    $scope.filter.filterFn = function(ticket){
                        var selected = this.options.getSelected();

                        if(!selected.options.length) return;

                        var show = false;
                        var airlines = ticket.collectAirlines();

                        selected.each(function(option){
                            for(var code in airlines) if(airlines.hasOwnProperty(code)) {
                                show = show || (airlines[code] == option.title);
                            }
                        });

                        if(!show) {
                            ticket.hidden = true;
                        }
                    };

                    /*Watchers*/
                    var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(tickets){
                        if(!tickets || !tickets.list.length) return;

                        var collections = {};

                        tickets.each(function(ticket){
                            ticket.everyEtap(function(etap){
                                var tName = etap.data.TransporterName;

                                if(!collections[tName]) {
                                    collections[tName] = new inna.Models.Avia.TicketCollection();
                                }

                                collections[tName].push(ticket);
                            });
                        });

                        for(var tName in collections) if(collections.hasOwnProperty(tName)) {
                            $scope.options.push(new Option(tName, collections[tName].getMinPrice()));
                        }

                        unwatchCollectionTickets();
                    })
                }
            ]
        }
    }]);
angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaAirports', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/dynamic-serp-filter/avia.airports.html'),
            scope: {
                tickets: '=innaDynamicSerpFilterAviaAirportsTickets',
                filters: '=innaDynamicSerpFilterAviaAirportsFilters'
            },
            controller: [
                '$scope', '$element', '$controller', 'innaApp.API.events',
                function($scope, $element, $controller, Events){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    var Option = inna.Models.Avia.Filters._OptionFactory(function(title, code){
                        this.code = code;
                    });

                    Option.prototype.describe = function(){
                        return '# (%)'.split('#').join(this.title).split('%').join(this.code)
                    }

                    var Options = inna.Models.Avia.Filters._OptionsFactory();

                    Options.prototype.pushUnique = function(option){
                        var existing = this._searchByCode(option.code);

                        if(!existing) {
                            this.push(option);
                        }
                    };

                    Options.prototype._searchByCode = function(code){
                        for(var i = 0, option = null; option = this.options[i++];) {
                            if(option.code == code) return option;
                        }

                        return null;
                    };

                    /*Properties*/
                    $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Airport'));
                    $scope.options = $scope.filter.options = new Options();
                    $scope.filter.filterFn = function(ticket){
                        var show = false;
                        var selected = this.options.getSelected();

                        if(!selected.options.length) return;

                        selected.each(function(option){
                            ticket.everyEtap(function(etap){
                                show = show || etap.data.InCode == option.code || etap.data.OutCode == option.code;
                            });
                        });

                        if(!show) {
                            ticket.hidden = true;
                        }
                    }

                    /*Watchers*/
                    var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(tickets){
                        if(!tickets || !tickets.list.length) return;

                        tickets.each(function(ticket){
                            for(var i = 0, dir = '', etaps = null; (dir = ['To', 'Back'][i++]) && (etaps = ticket.getEtaps(dir));){
                                for(var j = 0, etap = null; etap = etaps[j++];) {
                                    $scope.options.pushUnique(new Option(etap.data.InPort, etap.data.InCode));
                                    $scope.options.pushUnique(new Option(etap.data.OutPort, etap.data.OutCode));
                                }
                            }
                        });

                        unwatchCollectionTickets();
                    })
                }
            ]
        }
    }]);
angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaLegs', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/avia.legs.html'),
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaLegsTickets',
                    filters: '=innaDynamicSerpFilterAviaLegsFilters'
                },
                controller: [
                    '$scope', 'innaApp.API.events', '$element', '$controller',
                    function($scope, Events, $element, $controller){
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title, comparator){
                            this.comparator = comparator;
                            this.minPrice = NaN;
                        });

                        Option.prototype.describe = function(){
                            return this.title;
                        }

                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Legs'));

                        $scope.filter.options = new Options();
                        $scope.filter.options.push(new Option('Прямой', function(l){ return l == 1; }));
                        $scope.filter.options.push(new Option('1 пересадка', function(l){ return l == 2; }));
                        $scope.filter.options.push(new Option('2+ пересадки', function(l) { return l > 2; }));

                        $scope.filter.filterFn = function(ticket){
                            var options = $scope.filter.options.getSelected();

                            if(!options.options.length) return;

                            var show = false;
                            var legsTo = ticket.getEtaps('To').length;
                            var legsBack = ticket.getEtaps('Back').length;

                            options.each(function(option){
                                show = show || (option.comparator(legsTo) && option.comparator(legsBack));
                            });

                            if(!show) ticket.hidden = true;
                        };

                        /*Watchers*/
                        var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(newVal){
                            if(!newVal || !newVal.list.length) return;

                            $scope.filter.options.each(function(option){
                                var tickets = new inna.Models.Avia.TicketCollection();

                                newVal.each(function(ticket){
                                    var fits = option.comparator(ticket.getEtaps('To').length) ||
                                        option.comparator(ticket.getEtaps('Back').length);

                                    if(fits) {
                                        tickets.push(ticket);
                                    }
                                });

                                if(tickets.size()) {
                                    option.shown = true;
                                    option.minPrice = tickets.getMinPrice();
                                }
                            });

                            unwatchCollectionTickets();
                        });
                    }
                ]
            }
        }
    ]);
angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaPrice', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/avia.price.html'),
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaPriceTickets',
                    filters: '=innaDynamicSerpFilterAviaPriceFilters',
                    bundle: '=innaDynamicSerpFilterAviaPriceBundle'
                },
                controller: [
                    '$scope', 'innaApp.API.events', '$element', '$controller', '$filter',
                    function($scope, Events, $element, $controller, $filter){
                        var hotelPrice = parseInt($scope.bundle.hotel.data.PackagePrice);

                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*DOM*/
                        var slider = $('.js-range', $element);
                        var input = $('.js-range-val', $element);

                        /*Models*/
                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        Options.prototype.hasSelected = function(){
                            var onlyOption = this.options[0];

                            return onlyOption.value !== onlyOption.defaultValue;
                        }

                        var Option = inna.Models.Avia.Filters._OptionFactory(function(){
                            this.value = 0;
                            this.max = 0;
                            this.min = Number.MAX_VALUE;
                            this.defaultValue = 0;
                        });

                        Option.prototype.reset = function(){
                            this.value = this.defaultValue;
                        };

                        Option.prototype.describe = function(){
                            return 'Не дороже ~ рублей'.split('~').join($filter('price')(this.value));
                        };

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Price'));
                        $scope.option = new Option('Цена');
                        $scope.options = $scope.filter.options = new Options();
                        $scope.filter.options.push($scope.option);
                        $scope.filter.filterFn = function(ticket){
                            if(ticket.data.Price + hotelPrice > $scope.option.value) ticket.hidden = true;
                        }

                        /*Methods*/
                        $scope.displayOnSlider = function(){
                            slider.slider('value', $scope.option.value);
                        };

                        $scope.reset = function(option) {
                            option.reset();
                            $scope.displayOnSlider();
                        }

                        /*Watchers*/
                        var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(newVal) {
                            if(!newVal || !newVal.list.length) return;

                            $scope.option.min = newVal.getMinPrice() + hotelPrice;
                            $scope.option.max = newVal.getMaxPrice() + hotelPrice;
                            $scope.option.defaultValue = $scope.option.max;

                            slider.slider({
                                range: "min",
                                min: $scope.option.min,
                                max: $scope.option.max,
                                value: $scope.option.max,
                                slide: function(event, ui) {
                                    $scope.$apply(function($scope){
                                        $scope.option.value = ui.value;
                                    });
                                }
                            });

                            $scope.filter.options.reset();

                            unwatchCollectionTickets();
                        });

                        $scope.$watch('option.value', function(){
                            $scope.option.selected = ($scope.option.value !== $scope.option.defaultValue);
                        });
                    }
                ]
            }
        }
    ]);
angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaTime', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/avia.time.html'),
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaTimeTickets',
                    filters: '=innaDynamicSerpFilterAviaTimeFilters'
                },
                controller: [
                    '$scope', 'innaApp.API.events', '$element', '$controller',
                    function($scope, Events, $element, $controller) {
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        function BaseOption(caption, start, end){
                            this.start = start;
                            this.end = end;
                            this.caption = caption;
                        }

                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title, direction, state, baseOption){
                            this.direction = direction;
                            this.state = state;
                            this.caption = baseOption.caption;
                            this.start = baseOption.start;
                            this.end = baseOption.end;
                        });

                        Option.prototype.describe = function(){
                            return [
                                this.state.caption,
                                this.direction.desc + ':',
                                this.caption
                            ].join(' ');
                        };

                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        Options.prototype.resetDir = function(dir) {
                            this.each(function(option){
                                if(option.direction == dir) option.selected = false;
                            });
                        };

                        function State(property, caption) {
                            this.caption = caption;
                            this.property = property;

                            this.isCurrent = false;
                        }

                        function States(list) {
                            this.states = list;

                            this.setCurrent(this.states[0]);
                        }

                        States.prototype.setCurrent = function(state){
                            for(var i = 0, st = null; st = this.states[i++];) {
                                if(st == state) st.isCurrent = true;
                                else st.isCurrent = false;
                            }
                        };

                        States.prototype.getCurrent = function(){
                            for(var i = 0, st = null; st = this.states[i++];) {
                                if(st.isCurrent) return st;
                            }

                            return null;
                        };

                        function Direction(name, prefix, caption, desc) {
                            this.name = name;
                            this.caption = caption;
                            this.prefix = prefix;
                            this.desc = desc;

                            this.states = new States([
                                new State('ArrivalDate', 'Вылет'),
                                new State('DepartureDate','Прилет')
                            ]);
                        }

                        function Directions(list) {
                            this.directions = list;
                        }

                        /*Properties*/
                        $scope.directions = new Directions([
                            new Direction('To', '', 'Перелет туда', 'туда'),
                            new Direction('Back', 'Back', 'Перелет обратно', 'обратно')
                        ]);

                        $scope.options = (function(){
                            var options = new Options();
                            var baseOptions = [
                                new BaseOption('Утро', 6, 12),
                                new BaseOption('День', 12, 18),
                                new BaseOption('Вечер', 18, 0),
                                new BaseOption('Ночь', 24, 6)
                            ];

                            for(var i = 0, dir = null; dir = $scope.directions.directions[i++];) {
                                for(var j = 0, state = null; state = dir.states.states[j++];) {
                                    for(var k = 0, baseOption = null; baseOption = baseOptions[k++];) {
                                        options.push(new Option(baseOption.caption, dir, state, baseOption));
                                    }
                                }
                            }

                            return options;
                        })();

                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Time'));
                        $scope.filter.options = $scope.options;
                        $scope.filter.filterFn = function(ticket){
                            function checkOptionsInsideCategory(ticket, options) {
                                if(!options.options.length) return true;

                                var fits = false;

                                options.each(function(option){
                                    var propertyName = [option.direction.prefix, option.state.property].join('');
                                    var date = ticket.data[propertyName];
                                    fits = fits || dateHelper.isHoursBetween(date, option.start, option.end);
                                });

                                return fits;
                            }

                            var optionsOfInterest = {};

                            this.options.getSelected().each(function(option){
                                if(option.direction.states.getCurrent() != option.state) return;

                                (
                                    optionsOfInterest[option.direction.name] ||
                                    (optionsOfInterest[option.direction.name] = new Options())
                                ).push(option);
                            });

                            var fits = true;

                            for(var p in optionsOfInterest) if(optionsOfInterest.hasOwnProperty(p)) {
                                fits = fits && checkOptionsInsideCategory(ticket, optionsOfInterest[p]);
                            }

                            if(!fits) {
                                ticket.hidden = true;
                            }
                        };

                        /*Methods*/
                        $scope.changeState = function(dir, state){
                            dir.states.setCurrent(state);

                            $scope.options.getSelected().each(function(option){
                                if(option.direction != dir) return;

                                if(option.state != state) option.selected = false;
                            });
                        }

                        $scope.reset = function(dir) {
                            $scope.options.resetDir(dir);
                        }

                        /*Watchers*/
                        var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(tickets){
                            if(!tickets || !tickets.list.length) return;

                            for(var i = 0, option = null; option = $scope.options.options[i++];) {
                                var atLeastOne = tickets.advancedSearch(function(ticket){
                                    var propertyName = [option.direction.prefix, option.state.property].join('');
                                    var date = ticket.data[propertyName];

                                    return dateHelper.isHoursBetween(date, option.start, option.end);
                                });

                                if(atLeastOne) {
                                    option.shown = true;
                                }
                            }

                            unwatchCollectionTickets();
                        });
                    }
                ]
            };
        }
    ]);
angular.module('innaApp.directives')
    .directive('dynamicSerpFilterCategory', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/category.html'),
                scope: {
                    hotels: '=dynamicSerpFilterCategoryHotels',
                    filters: '=dynamicSerpFilterCategoryFilters'
                },
                controller: [
                    '$scope', '$controller', '$element',
                    function($scope, $controller, $element){
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        var Options = inna.Models.Avia.Filters._OptionsFactory();
                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title, value){
                            this.value = value;
                            this.minPrice = NaN;
                        });

                        Option.prototype.describe = function(){
                            return _.generateRange(0, this.value - 1).map(function(){
                                return '<span class="icon icon-star ng-scope"></span>';
                            }).join('');
                        }

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter());
                        $scope.filter.filterFn = function(hotel){
                            var fits = false;

                            this.options.getSelected().each(function(option){
                                fits = fits || (hotel.data.Stars == option.value);
                            });

                            if(!fits) hotel.hidden = true;
                        };
                        $scope.options = $scope.filter.options = new Options();
                        $scope.options.push(new Option('1 звезда', 1));
                        $scope.options.push(new Option('2 звезда', 2));
                        $scope.options.push(new Option('3 звезда', 3));
                        $scope.options.push(new Option('4 звезда', 4));
                        $scope.options.push(new Option('5 звезда', 5));

                        /*Watchers*/
                        var unwatchHotelsCollection = $scope.$watchCollection('hotels', function(hotels){
                            if(!hotels || !hotels.list.length) return;

                            $scope.options.each(function(option){
                                var fitting = new inna.Models.Hotels.HotelsCollection();

                                hotels.each(function(hotel){
                                    if(hotel.data.Stars == option.value) fitting.push(hotel);
                                });

                                if(fitting.size()) {
                                    option.shown = true;
                                    option.minPrice = fitting.getMinPrice();
                                }
                            });

                            unwatchHotelsCollection();
                        });
                    }
                ]
            }
        }
    ]);
angular.module('innaApp.directives')
    .directive('dynamicSerpFilterExtra', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/dynamic-serp-filter/extra.html'),
            scope: {
                'hotels': '=dynamicSerpFilterExtraHotels',
                'filters': '=dynamicSerpFilterExtraFilters'
            },
            controller: [
                '$scope', '$controller', '$element',
                function($scope, $controller, $element){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    var Options = inna.Models.Avia.Filters._OptionsFactory();
                    var Option = inna.Models.Avia.Filters._OptionFactory(function(title, value, minPrice){
                        this.minPrice = minPrice;
                        this.value = value;

                        this.shown = true;
                    });

                    Option.prototype.describe = function(){
                        return this.title;
                    }

                    /*Properties*/
                    $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter());
                    $scope.filter.filterFn = function(hotel){
                        var fits = true;

                        this.options.getSelected().each(function(option){
                            fits = fits && (option.value in hotel.data.Extra);
                        });

                        if(!fits) hotel.hidden = true;
                    };
                    $scope.options = $scope.filter.options = new Options();

                    /*Watchers*/
                    var unwatchCollectionHotels = $scope.$watchCollection('hotels', function(hotels){
                        if(!hotels || !hotels.list.length) return;

                        var collections = {};

                        hotels.each(function(hotel){
                            if(!hotel.data.Extra) return;

                            for(var extra in hotel.data.Extra) if(hotel.data.Extra.hasOwnProperty(extra)) {
                                var name = hotel.data.Extra[extra];
                                (
                                    collections[extra] || (
                                        collections[extra] = {name: name, collection: new inna.Models.Hotels.HotelsCollection()}
                                    )
                                ).collection.push(hotel);
                            }
                        });

                        for(var name in collections) if(collections.hasOwnProperty(name)) {
                            $scope.options.push(new Option(collections[name].name, name, collections[name].collection.getMinPrice()));
                        };

                        unwatchCollectionHotels();
                    });
                }
            ]
        }
    }]);
angular.module('innaApp.directives')
    .directive('dynamicSerpFilterName', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/name.html'),
                scope: {
                    hotels: '=dynamicSerpFilterNameHotels',
                    filters: '=dynamicSerpFilterNameFilters'
                },
                controller: [
                    '$scope', '$controller', '$element',
                    function($scope, $controller, $element){
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title){
                            this.value = '';

                            this.shown = true;
                        });

                        Option.prototype.reset = function(){
                            this.value = '';
                        };

                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        Options.prototype.hasSelected = function(){
                            return this.single.value != '';
                        };

                        Option.prototype.describe = function(){
                            return ['...', this.value.toLowerCase(), '...'].join('');
                        }

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Name'));
                        $scope.filter.filterFn = function(hotel){
                            if(!hotel.data.HotelName) return;

                            var val = this.options.single.value.toLowerCase();
                            var name = hotel.data.HotelName.toLowerCase();
                            var contains = (name.indexOf(val) !== -1);

                            if(!contains) hotel.hidden = true;
                        }
                        $scope.options = $scope.filter.options = new Options();
                        $scope.option = new Option('name');
                        $scope.options.push($scope.option);
                        $scope.options.single = $scope.option;

                        /*Methods*/
                        $scope.reset = function(){
                            $scope.option.reset();
                        }

                        /*Watchers*/
                        $scope.$watch('option.value', function(){
                            $scope.option.selected = ($scope.option.value !== '');
                        });
                    }
                ]
            }
        }
    ]);
angular.module('innaApp.directives')
    .directive('dynamicSerpFilterPrice', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/price.html'),
                scope: {
                    hotels: '=dynamicSerpFilterPriceHotels',
                    filters: '=dynamicSerpFilterPriceFilters',
                    bundle: '=dynamicSerpFilterPriceBundle'
                },
                controller: [
                    '$scope', '$controller', '$element', '$filter',
                    function($scope, $controller, $element, $filter){
                        var ticketPrice = parseInt($scope.bundle.ticket.data.PackagePrice);

                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*DOM*/
                        var slider = $('.js-range', $element);
                        var input = $('.js-range-val', $element);

                        /*Models*/
                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        Options.prototype.hasSelected = function(){
                            var onlyOption = this.options[0];

                            return onlyOption.value !== onlyOption.defaultValue;
                        }

                        var Option = inna.Models.Avia.Filters._OptionFactory(function(){
                            this.value = 0;
                            this.max = 0;
                            this.min = Number.MAX_VALUE;
                            this.defaultValue = 0;
                        });

                        Option.prototype.reset = function(){
                            this.value = this.defaultValue;
                        };

                        Option.prototype.describe = function(){
                            return 'Не дороже ~ рублей'.split('~').join($filter('price')(this.value));
                        };

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('Price'));
                        $scope.option = new Option('Цена');
                        $scope.options = $scope.filter.options = new Options();
                        $scope.filter.options.push($scope.option);
                        $scope.filter.filterFn = function(hotel){
                            if(hotel.data.PackagePrice + ticketPrice > $scope.option.value) {
                                hotel.hidden = true;
                            }
                        };

                        /*Methods*/
                        $scope.displayOnSlider = function(){
                            slider.slider('value', $scope.option.value);
                        };

                        $scope.reset = function(option) {
                            option.reset();
                            $scope.displayOnSlider();
                        }

                        /*Watchers*/
                        var unwatchCollectionHotels = $scope.$watchCollection('hotels', function(newVal) {
                            if(!newVal || !newVal.list.length) return;

                            $scope.option.min = newVal.getMinPrice() + ticketPrice;
                            $scope.option.max = newVal.getMaxPrice() + ticketPrice;
                            $scope.option.defaultValue = $scope.option.max;

                            slider.slider({
                                range: "min",
                                min: $scope.option.min,
                                max: $scope.option.max,
                                value: $scope.option.max,
                                slide: function(event, ui) {
                                    $scope.$apply(function($scope){
                                        $scope.option.value = ui.value;
                                    });
                                }
                            });

                            $scope.filter.options.reset();

                            unwatchCollectionHotels();
                        });

                        $scope.$watch('option.value', function(){
                            $scope.option.selected = ($scope.option.value !== $scope.option.defaultValue);
                        });
                    }
                ]
            }
        }
    ]);
angular.module('innaApp.directives')
    .directive('dynamicSerpFilterTafactor', [
        '$templateCache',  function($templateCache){

        return {
            template: $templateCache.get('components/dynamic-serp-filter/tafactor.html'),
            scope: {
                hotels: '=dynamicSerpFilterTafactorHotels',
                filters: '=dynamicSerpFilterTafactorFilters'
            },
            controller: [
                '$scope',
                '$controller',
                '$element',
                function($scope, $controller, $element){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    var Option = inna.Models.Avia.Filters._OptionFactory(function(title, value, minPrice){
                        this.value = value;
                        this.minPrice = minPrice;

                        this.shown = true;
                    });

                    Option.prototype.describe = function(){
                        return _.generateRange(0, this.value - 1).map(function(){
                            return '<span class="icon-sprite-tripadvisor-like"></span>';
                        }).join('');
                    }

                    var Options = inna.Models.Avia.Filters._OptionsFactory();

                    /*Properties*/
                    $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('TaFactor'));
                    $scope.filter.filterFn = function(hotel){
                        var fits = false;

                        this.options.getSelected().each(function(option){
                            fits = fits || (option.value == hotel.data.TaFactor);
                        });

                        if(!fits) hotel.hidden = true;
                    }
                    $scope.options = $scope.filter.options = new Options();

                    /*Watchers*/
                    var unwatchHotelsCollection = $scope.$watchCollection('hotels', function(hotels){
                        var collections = {}

                        hotels.each(function(hotel){
                            (
                                collections[hotel.data.TaFactor] || (
                                    collections[hotel.data.TaFactor] = new inna.Models.Hotels.HotelsCollection()
                                )
                            ).push(hotel);
                        });

                        for(var factor in collections) if(collections.hasOwnProperty(factor)) {
                            $scope.options.push(new Option(factor, factor, collections[factor].getMinPrice()));
                        }
                    });
                }
            ]
        }
    }]);
angular.module('innaApp.directives')
    .directive('dynamicSerpFilterType', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/type.html'),
                scope: {
                    hotels: '=dynamicSerpFilterTypeHotels',
                    filters: '=dynamicSerpFilterTypeFilters'
                },
                controller: [
                    '$scope', '$controller', '$element',
                    function($scope, $controller, $element){
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title, value, minPrice){
                            this.value = value;
                            this.minPrice = minPrice;

                            this.shown = true;
                        });

                        Option.prototype.describe = function(){
                            return this.value;
                        };

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter());
                        $scope.filter.filterFn = function(hotel){
                            var fits = false;

                            this.options.getSelected().each(function(option){
                                fits = fits || (option.value == hotel.data.HotelType);
                            });

                            if(!fits) hotel.hidden = true;
                        };
                        $scope.options = $scope.filter.options = new Options();

                        /*Watchers*/
                        var unwatchHotelsCollection = $scope.$watchCollection('hotels', function(hotels){
                            if(!hotels || !hotels.list.length) return;

                            var collections = {};

                            hotels.each(function(hotel){
                                var type = hotel.data.HotelType;

                                (
                                    collections[type] || (collections[type] = new inna.Models.Hotels.HotelsCollection())
                                ).push(hotel);
                            });

                            for(var type in collections) if(collections.hasOwnProperty(type)) {
                                $scope.options.push(new Option(type, type, collections[type].getMinPrice()));
                            }

                            console.log($scope.options);

                            unwatchHotelsCollection();
                        });
                    }
                ]
            }
        }
    ]);
﻿﻿'use strict';

angular.module('innaApp.directives')
    .directive('regionFooter', ['$templateCache', function ($templateCache) {
        return {
            replace: true,
            restrict: 'A',
            template: $templateCache.get('regions/footer/templ/footer.html'),
            scope: {},
            controller: function ($scope) {

            },
            link: function ($scope, $element, attrs) {

                $scope.$on('$routeChangeStart', function (next, current) {
                    $element.show();
                });


                $scope.$root.$on('region-footer:hide', function () {
                    $element.hide();
                });

                $scope.$root.$on('region-footer:show', function () {
                    $element.show();
                });
            }
        };
    }]);
﻿'use strict';

angular.module('innaApp.directives')
    .directive('regionHeader', ['$templateCache', function ($templateCache) {
        return {
            replace: true,
            template: $templateCache.get('regions/header/templ/header.html'),
            controller: [
                '$scope',
                '$location',
                'eventsHelper',
                'urlHelper',
                'innaApp.Urls',
                'aviaHelper',
                function ($scope, $location, eventsHelper, urlHelper, appUrls, aviaHelper) {


                    $scope.$on('$routeChangeStart', function (next, current) {
                        $scope.$emit('header:visible');
                    });

                    $scope.isHeaderVisible = true;


                    $scope.$on('header:hidden', function () {
                        $scope.isHeaderVisible = false;
                    });

                    $scope.$on('header:visible', function () {
                        $scope.isHeaderVisible = true;
                    });


                    $scope.isActive = function (route) {
                        var loc = $location.path();
                        var abs = $location.absUrl();
                        //console.log('loc: ' + loc + ' route: ' + route);
                        if (route == '/') {
                            return ((abs.indexOf('/tours/?') > -1) || loc == route);
                        }
                        else {
                            if (loc.indexOf(route) > -1)
                                return true;
                            else
                                return false;
                        }
                    }


                    $scope.getHeadForm = function () {
                        var loc = $location.path();
                        //log('$scope.getHeadForm, loc:' + loc);
                        var abs = $location.absUrl();
                        if (loc == '/' || abs.indexOf('/tours/?') > -1) {
                            return 'nav_forms/tours_search_form.html';
                        }
                        else if (loc.startsWith(appUrls.URL_DYNAMIC_PACKAGES) &&
                            !loc.startsWith(appUrls.URL_DYNAMIC_PACKAGES_RESERVATION) &&
                            !loc.startsWith(appUrls.URL_DYNAMIC_PACKAGES_BUY)) {
                            return 'nav_forms/dynamic_search_form.html';
                        }
                        else if (loc.startsWith(appUrls.URL_AVIA) &&
                            !loc.startsWith(appUrls.URL_AVIA_RESERVATION) &&
                            !loc.startsWith(appUrls.URL_AVIA_BUY)) {

                            //на бронировании и покупке формы нет
                            return 'nav_forms/avia_search_form.html';
                        }
                        else {
                            return '';
                        }
                    };

                    $scope.getTitle = function () {

                        var loc = $location.path();
                        var abs = $location.absUrl();

                        if (loc == '/') {
                            return "Главная";
                        } else if (loc.indexOf(appUrls.URL_DYNAMIC_PACKAGES) > -1) {
                            return "Динамические пакеты";
                        }
                        else if (loc.indexOf(appUrls.URL_AVIA) > -1) {
                            return "Авиабилеты";
                        }
                        else if (loc.indexOf(appUrls.URL_PROGRAMMS) > -1) {
                            return "Программы";
                        }
                        else if (loc.indexOf(appUrls.URL_ABOUT) > -1) {
                            return "О компании";
                        }
                        else if (loc.indexOf(appUrls.URL_CONTACTS) > -1) {
                            return "Контакты";
                        }
                        else {
                            return "Главная";
                        }
                    };

                    setTitle();
                    function setTitle() {
                        $scope.title = "Инна-Тур - " + $scope.getTitle();
                    };

                    $scope.$on('$routeChangeSuccess', function () {
                        setTitle();
                    });

                    $scope.$root.isLoginPopupOpened = false;
                    $scope.headLoginBtnclick = function ($event) {
                        eventsHelper.preventBubbling($event);
                        $scope.$root.isLoginPopupOpened = true;
                    };

                }],
            link: function ($scope, $element, attrs) {

            }
        };
    }]);