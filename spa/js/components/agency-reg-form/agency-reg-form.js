innaAppConponents.controller("AgencyRegFormCtrl", function ($scope, dataService) {

    $scope.agencyReg = {};


    $scope.agencySubmit = function (form) {

        console.log(form.$valid)

        if (form.$valid) {
            dataService.agencyCreate($scope.agencyReg)
                .success(function (data) {
                    console.log(data)
                })
                .error(function (data) {
                    console.log(data)
                })
        }
    }


})