angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
        '$scope', '$controller',
        function($scope, $controller){
            $controller('AviaReserveTicketsCtrl', {$scope: $scope});

            $scope.objectToReserveTemplate = '/spa/templates/pages/dynamic/inc/reserve.html';

            console.log('hi from DynamicReserveTicketsCtrl');
        }
    ]);