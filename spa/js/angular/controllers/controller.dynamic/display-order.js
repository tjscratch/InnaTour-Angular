angular.module('innaApp.controllers')
    .controller('B2B_DisplayOrder', [
        '$scope',
        '$routeParams',
        'DynamicPackagesDataProvider',
        function($scope, $routeParams, DynamicPackagesDataProvider){
            $scope.bundle = null;
            $scope.hotel = null;

            /*Initial*/
            $scope.baloon.show('Собираем данные', 'Это может занять какое-то время');

            DynamicPackagesDataProvider.displayOrder($routeParams.OrderId, function(resp){ //success
                $scope.$apply(function($scope){
                    $scope.baloon.hide();

                    $scope.bundle = new inna.Models.Dynamic.Combination();
                    $scope.bundle.ticket = new inna.Models.Avia.Ticket();
                    $scope.bundle.ticket.setData(resp.AviaInfo);
                    $scope.hotel = $scope.bundle.hotel = new inna.Models.Hotels.Hotel(resp.Hotel);
                    $scope.bundle.hotel.detailed = {
                        Hotel: resp.Hotel,
                        Rooms: [resp.Hotel.Room]
                    }

                    console.log(resp);
                });
            }, function(){ //error
                $scope.baloon.showErr('Oops...', 'Указанного заказа не существует');
            });
        }
    ]);