innaAppConponents.controller("AgencyRegFormCtrl", function ($rootScope, $scope, dataService) {

	$rootScope.BodyStyleGlobal = {
		'background-color': '#fff'
	}
	
    $scope.agencyReg = {};

	$scope.adressChecked = false;
	$scope.$watch('adressChecked', function(data){
		if(data){
			$scope.agencyReg.PostIndex = $scope.agencyReg.RegistredAddressIndex;
			$scope.agencyReg.Address = $scope.agencyReg.RegistredAddress;
		}else{
			$scope.agencyReg.PostIndex = '';
			$scope.agencyReg.Address = '';
		}
	})
	

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