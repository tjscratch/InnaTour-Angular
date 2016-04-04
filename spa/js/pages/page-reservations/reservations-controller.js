/**
 * для валидации используется библиотека
 * https://github.com/huei90/angular-validation
 */
innaAppControllers.controller('ReservationsController', function ($scope, $routeParams, $location, $injector, ReservationService) {


    var $validationProvider = $injector.get('$validation');
    // если в url есть параметр ?test=1
    // заполняем данные пассажира фейковыми данными
    if ($location.$$search && $location.$$search.test == 1) {
        $scope.ReservationModel = ReservationService.getReservationModel($routeParams.Adult, 1);
    } else {
        $scope.ReservationModel = ReservationService.getReservationModel($routeParams.Adult);
    }


    $scope.form = {
        checkValid: $validationProvider.checkValid,
        submit: function (form) {
            $validationProvider.validate(form);
            console.log(form)
            ReservationService.reservation($scope.ReservationModel)
                .success(function (data){
                    console.log(data);
                })
        }
    };


});
