'use strict';

/* Controllers */

innaAppControllers.
    controller('RootCtrl', [
        '$log',
        '$scope',
        '$location',
        'dataService',
        'eventsHelper',
        'urlHelper',
        'innaApp.Urls',
        'aviaHelper',
        function ($log, $scope, $location, dataService, eventsHelper, urlHelper, appUrls, aviaHelper) {

            // TODO : HELL
            $scope.baloon = aviaHelper.baloon;
        }]);