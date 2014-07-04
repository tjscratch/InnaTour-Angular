﻿'use strict';

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
            $scope.baloon = aviaHelper.baloon;
        }]);