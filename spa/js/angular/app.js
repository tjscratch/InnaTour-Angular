
'use strict';

var app = angular.module('innaApp', [
  'ngRoute',
  'innaApp.filters',
  'innaApp.services',
  'innaApp.directives',
  'innaApp.controllers',
  'ngSanitize'
]).run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
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
        if ($window._gaq != null)
            $window._gaq.push(['_trackPageview', $location.path()]);

        //console.log('$routeChangeSuccess');
        //скролим наверх
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
}]).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider.
        //Главная
        when('/', {
            templateUrl: '/spa/templates/pages/tours_grid_page.html',
            controller: 'ToursCtrl'
        }).
        when('/individualtours/category/:id', {
            templateUrl: '/spa/templates/pages/it_category_page.html',
            controller: 'IndividualToursCategoryCtrl'
        }).
        when('/individualtours/', {
            templateUrl: '/spa/templates/pages/it_grid_page.html',
            controller: 'IndividualToursCtrl'
        }).
        when('/about/', {
            templateUrl: '/spa/templates/pages/about_page.html',
            controller: 'AboutCtrl'
        }).
        when('/contacts/', {
            templateUrl: '/spa/templates/pages/contacts_page.html',
            controller: 'ContactsCtrl'
        }).
        when('/avia/:FromUrl-:ToUrl-:BeginDate-:EndDate-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible', {
            templateUrl: '/spa/templates/pages/avia/search_form.html',
            controller: 'AviaSearchMainCtrl'
        }).
        when('/avia/', {
            templateUrl: '/spa/templates/pages/avia/search_form.html',
            controller: 'AviaSearchMainCtrl'
        }).
        when('/avia/search/:FromUrl-:ToUrl-:BeginDate-:EndDate-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible', {
            templateUrl: '/spa/templates/pages/avia/search_results.html',
            controller: 'AviaSearchResultsCtrl'
        }).
        when('/avia/search_old/:FromUrl-:ToUrl-:BeginDate-:EndDate-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible', {
            templateUrl: '/spa/templates/pages/avia/search_results_old.html',
            controller: 'AviaSearchResultsCtrl'
        }).
        //when('/avia/search/', {
        //    templateUrl: '/TemplatesAvia/Search',
        //    controller: 'AviaSearchResultsCtrl'
        //}).
        when('/hotelticket/', {
            templateUrl: '/spa/templates/pages/hotelticket_page.html',
            controller: 'HotelPlusTicketCtrl'
        }).
        when('/hotels/', {
            templateUrl: '/spa/templates/pages/hotels_page.html',
            controller: 'HotelsCtrl'
        }).
        //результаты поиска по отелям
        when('/hotels/search/:FromCityUrl-:ToCountryUrl-:ToRegionUrl-:StartMinString-:StartDateVariance-:AdultNumber-:ChildAgesString-:DurationMin', {
            templateUrl: '/AngularTemplates/Search',
            controller: 'SearchResultCtrl'
        }).
        when('/hotel/:hotelId/:searchId', {
            templateUrl: '/AngularTemplates/HotelDetail',
            controller: 'HotelsDetailsCtrl'
        }).
        when('/hotel/:hotelId/:searchId/tour/:tourId', {
            templateUrl: '/AngularTemplates/TourDetail',
            controller: 'TourDetailsCtrl'
        }).
        when('/payment/:orderId', {
            templateUrl: '/AngularTemplates/PaymentPage',
            controller: 'PaymentPageCtrl'
        })
        //.
        //otherwise({
        //    redirectTo: '/'
        //});

    //$locationProvider.html5Mode(false);
}]);


var innaAppControllers = angular.module('innaApp.controllers', []);

var innaAppDirectives = angular.module('innaApp.directives', []);

var innaAppServices = angular.module('innaApp.services', []);

var innaAppFilters = angular.module('innaApp.filters', []);

app.factory('cache',['$cacheFactory', function ($cacheFactory) {
    var cache = $cacheFactory('myCache');
    return cache;
}]);