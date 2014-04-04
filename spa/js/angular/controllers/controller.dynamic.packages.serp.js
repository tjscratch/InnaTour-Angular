innaAppControllers.
    controller('DynamicPackageSERPCtrl', ['$scope', 'DynamicPackagesDataProvider',
        function ($scope, DynamicPackagesDataProvider) {
            $scope.$on('inna.DynamicPackages.Search', function(event, data){
                console.log(data);
            });
        }
    ]);