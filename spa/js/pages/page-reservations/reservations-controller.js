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

    $scope.ReservationModel.SearchParams = $routeParams;


    $scope.form = {
        checkValid: $validationProvider.checkValid,
        submit: function (form) {
            $validationProvider.validate(form);
            console.log(form)
            console.log($scope.ReservationModel)
            ReservationService.reservation($scope.ReservationModel)
                .success(function (data) {
                    console.log(data);
                })
        }
    };


    /**
     * begin
     * ui-select
     * @type {undefined}
     */
    $scope.disabled = undefined;
    // $scope.uiSelectCountry = [];
    $scope.enable = function () {
        $scope.disabled = false;
    };
    $scope.disable = function () {
        $scope.disabled = true;
    };
    $scope.clear = function () {
        // $scope.uiSelectCountry.selected = undefined;
    };

    ReservationService.countries()
        .success(function (data) {
            $scope.countries = data;
        })

    // $scope.$watchCollection('uiSelectCountry', function (data) {
    //     if(data.selected){
    //         console.log(data.selected)
    //     }
    // })


});


innaAppFilters.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});
