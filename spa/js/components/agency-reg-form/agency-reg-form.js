innaAppConponents.controller("AgencyRegFormCtrl", function ($rootScope, $scope, dataService) {

    $rootScope.BodyStyleGlobal = {
        'background-color': '#fff'
    }

    $scope.agencyReg = {};
    //$scope.agencyReg = {
    //    Name: "Name",
    //    INN: "INN",
    //    KPP: "KPP",
    //    BossName: "BossName",
    //    Boss: "Boss",
    //    RegistredAddress: "RegistredAddress",
    //    RegistredAddressIndex: "RegistredAddressIndex",
    //    Address: "Address",
    //    PostIndex: "PostIndex",
    //    Phones: "89099596787",
    //    Site: "Site.ru",
    //    Email: "email@google.com"
    //};

    $scope.adressChecked = true;
    $scope.$watch('adressChecked', function (data) {
        if (data) {
            $scope.agencyReg.PostIndex = $scope.agencyReg.RegistredAddressIndex;
            $scope.agencyReg.Address = $scope.agencyReg.RegistredAddress;
        } else {
            $scope.agencyReg.PostIndex = '';
            $scope.agencyReg.Address = '';
        }
    })

    $scope.agencySubmit = function (form) {
        if (form.$valid) {
            dataService.agencyCreate($scope.agencyReg)
                .success(function (data) {
                    console.log('dataService-' + data)
                })
                .error(function (data) {
                    console.log('dataService-' + data)
                })
        }
    }


})