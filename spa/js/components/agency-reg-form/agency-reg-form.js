innaAppConponents.controller("AgencyRegFormCtrl", function ($rootScope, $scope, dataService) {

    $rootScope.BodyStyleGlobal = {
        'background-color': '#fff'
    }

    $scope.agencyReg = {};

    $scope.getCountryListByTerm = function (text) {
        return dataService.getCountryListByTerm(text)
            .then(function (data) {
                return data;
            });
    };

    $scope.country = {
        id: null,
        name: null
    };

    $scope.agencyReg.City = null;

    $scope.setCurrentCityLocation = function () {
        dataService.getCityByIp(successCallback, errorCallback);

        function successCallback(data) {
            $scope.agencyReg.City = data.Name;
        }
        function errorCallback(data) {

        }
    };

    $scope.agencyReg.CountryId = null;

    $scope.$watchCollection('country', function (data) {
        $scope.agencyReg.CountryId = data.id;
    });

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

    $scope.bookModuleNeeded = false;
    $scope.$watch('bookModuleNeeded', function (data) {
        if (data) {
            $scope.agencyReg.BookModuleNeeded = true;
        }
        else {
            $scope.agencyReg.BookModuleNeeded = false;
        }
    });

    $scope.SimplifiedTaxationSystem = false;
    $scope.$watch('SimplifiedTaxationSystem', function (data) {
        if (data) {
            $scope.agencyReg.SimplifiedTaxationSystem = true;
        }
        else {
            $scope.agencyReg.SimplifiedTaxationSystem = false;
        }
    });

    $scope.agencySubmit = function (form) {
        if (form.$valid && $scope.agencyReg.CountryId != null) {
            console.log('$scope.agencyReg', $scope.agencyReg);
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