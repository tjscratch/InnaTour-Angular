'use strict';

innaAppControllers
    .controller('PageAvia', [
        'EventManager',
        '$scope',
        'DynamicFormSubmitListener',
        'DynamicPackagesDataProvider',
        '$routeParams',
        'innaApp.API.events',
        '$location',
        'innaApp.Urls',
        'aviaHelper',

        // components

        '$templateCache',
        'Balloon',
        'ListPanel',
        'FilterPanel',
        function (EventManager, $scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams, Events, $location, Urls, aviaHelper, $templateCache, Balloon, ListPanel, FilterPanel) {


        }
    ]);
