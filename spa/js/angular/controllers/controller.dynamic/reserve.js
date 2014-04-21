angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
        '$scope', '$controller', '$routeParams', 'DynamicFormSubmitListener',
        function($scope, $controller, $routeParams, DynamicFormSubmitListener){
            DynamicFormSubmitListener.listen();

            $controller('ReserveTicketsCtrl', { $scope: $scope });

            $scope.objectToReserveTemplate = '/spa/templates/pages/dynamic/inc/reserve.html';

            console.log('hi from DynamicReserveTicketsCtrl', $routeParams);
        }
    ]);