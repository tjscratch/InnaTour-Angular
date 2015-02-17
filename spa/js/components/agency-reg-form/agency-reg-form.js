innaAppConponents.controller("AgencyRegFormCtrl", function ($scope, dataService) {

    $scope.partnerReg = {};


    $scope.partnerSubmit = function () {
        console.log($scope.partnerReg)
        dataService.agencyCreate($scope.partnerReg)
            .success(function (data) {
                console.log(data)
            })
            .error(function (data) {
                console.log(data)
            })
        console.log($scope.partnerReg)
    }


})