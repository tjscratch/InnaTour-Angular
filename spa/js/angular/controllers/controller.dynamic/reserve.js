angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
        '$scope', '$controller', '$routeParams',
        function($scope, $controller, $routeParams){
            $controller('ReserveTicketsCtrl', { $scope: $scope });

            $scope.objectToReserveTemplate = '/spa/templates/pages/dynamic/inc/reserve.html';

            console.log('hi from DynamicReserveTicketsCtrl', $routeParams);
        }
    ]);