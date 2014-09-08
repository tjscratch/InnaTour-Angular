
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