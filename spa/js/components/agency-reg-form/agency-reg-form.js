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

    $scope.adressChecked = false;
    $scope.$watch('adressChecked', function (data) {
        if (data) {
            $scope.agencyReg.PostIndex = $scope.agencyReg.RegistredAddressIndex;
            $scope.agencyReg.Address = $scope.agencyReg.RegistredAddress;
        }
        else {
            $scope.agencyReg.PostIndex = '';
            $scope.agencyReg.Address = '';
        }
    });

    $scope.agencySubmit = function (form) {
        if (form.$valid) {
            dataService.agencyCreate($scope.agencyReg)
                .success(function (data) {
                    switch (data.Status) {
                        case 1:
                            track.newAgency();
                            $scope.baloon.showAgencyRegSuccess('Вы успешно зарегистрировались', 'Мы отправили письмо с доступом к личному кабинету на электронную почту');
                        case 3:
                            $scope.emailDouble = data.Message;
                    }
                })
                .error(function (data) {
                    console.log(data)
                })
        }
    };


})