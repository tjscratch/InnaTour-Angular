
'use strict';

/* Controllers */

innaAppControllers.
    controller('HotelPlusTicketCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService',
        function HotelPlusTicketCtrl($log, $scope, $routeParams, $filter, dataService) {
            $scope.hellomsg = "Привет из HotelPlusTicketCtrl";
        }]);