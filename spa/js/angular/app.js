
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
        if ($window.ga != null)
            $window.ga('send', 'pageview', $location.path());

        //console.log('$routeChangeSuccess');
        //скролим наверх
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
}]).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
	
    app.URL_AVIA = '/avia/';
    app.URL_DYNAMIC_PACKAGES = '/packages/';
    app.URL_PROGRAMMS = '/individualtours/';
    app.URL_ABOUT = '/about/';
    app.URL_CONTACTS = '/contacts/';

    $routeProvider.
        //Главная
        when('/', {
            templateUrl: '/spa/templates/pages/tours_grid_page.html',
            controller: 'ToursCtrl'
        }).
        when(app.URL_PROGRAMMS + 'category/:id', {
            templateUrl: '/spa/templates/pages/it_category_page.html',
            controller: 'IndividualToursCategoryCtrl'
        }).
        when(app.URL_PROGRAMMS, {
            templateUrl: '/spa/templates/pages/it_grid_page.html',
            controller: 'IndividualToursCtrl'
        }).
        when(app.URL_ABOUT, {
            templateUrl: '/spa/templates/pages/about_page.html',
            controller: 'AboutCtrl'
        }).
        when(app.URL_CONTACTS, {
            templateUrl: '/spa/templates/pages/contacts_page.html',
            controller: 'ContactsCtrl'
        }).
        when(app.URL_AVIA + ':FromUrl-:ToUrl-:BeginDate-:EndDate-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible', {
            templateUrl: '/spa/templates/pages/avia/search_form.html',
            controller: 'AviaSearchMainCtrl'
        }).
        when(app.URL_AVIA, {
            templateUrl: '/spa/templates/pages/avia/search_form.html',
            controller: 'AviaSearchMainCtrl'
        }).
        when(app.URL_AVIA + 'search/:FromUrl-:ToUrl-:BeginDate-:EndDate-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible', {
            templateUrl: '/spa/templates/pages/avia/search_results.html',
            controller: 'AviaSearchResultsCtrl'
        }).
        when(app.URL_AVIA + 'search_old/:FromUrl-:ToUrl-:BeginDate-:EndDate-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsToFlexible-:IsBackFlexible', {
            templateUrl: '/spa/templates/pages/avia/search_results_old.html',
            controller: 'AviaSearchResultsCtrl'
        }).
        //when('/avia/search/', {
        //    templateUrl: '/TemplatesAvia/Search',
        //    controller: 'AviaSearchResultsCtrl'
        //}).
        when('/hotelticket/', {
            templateUrl: '/spa/templates/pages/hotelticket_page.html',
            controller: 'HotelPlusTicketCtrl',
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
        }).
        when(app.URL_DYNAMIC_PACKAGES, {
            templateUrl: '/spa/templates/pages/dynamic_package_page.html',
            controller: 'DynamicPackageCtrl'
        });
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
