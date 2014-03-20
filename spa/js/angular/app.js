
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
}]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.
        //Главная
        when('/', {
            templateUrl: '/spa/templates/pages/tours_grid_page.html?v=' + UrlHelper.ver,
            controller: 'ToursCtrl'
        }).
        when('/individualtours/category/:id', {
            templateUrl: '/spa/templates/pages/it_category_page.html?v=' + UrlHelper.ver,
            controller: 'IndividualToursCategoryCtrl'
        }).
        when('/individualtours/', {
            templateUrl: '/spa/templates/pages/it_grid_page.html?v=' + UrlHelper.ver,
            controller: 'IndividualToursCtrl'
        }).
        when('/about/', {
            templateUrl: '/spa/templates/pages/AboutPage.html?v=' + UrlHelper.ver,
            controller: 'AboutCtrl'
        }).
        when('/contacts/', {
            templateUrl: '/spa/templates/pages/ContactsPage.html?v=' + UrlHelper.ver,
            controller: 'ContactsCtrl'
        }).
        when('/hotelticket/', {
            templateUrl: '/spa/templates/pages/MainPage.html',
            controller: 'HotelPlusTicketCtrl'
        }).
        when('/hotels/', {
            templateUrl: '/spa/templates/pages/MainPage.html',
            controller: 'HotelsCtrl'
        }).
        //поиск по отелям
        //when('/hotels/', {
        //    templateUrl: '/AngularTemplates',
        //    controller: 'SearchMainCtrl'
        //}).
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
        when('/avia/:FromUrl-:ToUrl-:BeginDate-:EndDate-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsFlexible', {
            templateUrl: + '/spa/templates/pages/avia/SearchForm.html',
            controller: 'AviaSearchMainCtrl'
        }).
        when('/avia/', {
            templateUrl: + '/spa/templates/pages/avia/SearchForm.html',
            controller: 'AviaSearchMainCtrl'
        }).
        when('/avia/search/:FromUrl-:ToUrl-:BeginDate-:EndDate-:AdultCount-:ChildCount-:InfantsCount-:CabinClass-:IsFlexible', {
            templateUrl: + '/spa/templates/pages/avia/SearchResults.html',
            controller: 'AviaSearchResultsCtrl'
        }).
        when('/avia/search/', {
            templateUrl: '/TemplatesAvia/Search',
            controller: 'AviaSearchResultsCtrl'
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