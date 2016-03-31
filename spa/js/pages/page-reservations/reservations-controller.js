innaAppControllers.controller('ReservationsController', function ($scope, $routeParams, $location, ReservationService) {

    if($location.$$search && $location.$$search.test == 1){
        $scope.ReservationModel = ReservationService.getReservationModel($routeParams.Adult, 1);
    }else{
        $scope.ReservationModel = ReservationService.getReservationModel($routeParams.Adult);
    }

});
