innaAppConponents.controller("PartnerRegFormCtrl", function ($scope, dataService) {

    $scope.partnerReg = {};


    $scope.partnerSubmit = function () {
        dataService.partnerCreate($scope.partnerReg)
            .success(function (data) {
                console.log(data)
            })
            .error(function (data) {
                console.log(data)
            })
        console.log($scope.partnerReg)
    }


})