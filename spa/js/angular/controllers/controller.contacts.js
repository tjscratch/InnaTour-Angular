
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