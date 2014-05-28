'use strict';

/* Controllers */

innaAppControllers.
    controller('RootCtrl', ['$log', '$scope', '$location', 'dataService', 'eventsHelper', 'urlHelper', 'innaApp.Urls', 'aviaHelper',
        function NavigationCtrl($log, $scope, $location, dataService, eventsHelper, urlHelper, appUrls, aviaHelper) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.baloon = aviaHelper.baloon;

        }]);