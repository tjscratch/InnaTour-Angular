innaAppDirectives.directive('locationSelector', [
    '$templateCache',
    '$location',
    'DynamicPackagesDataProvider',
    'DynamicPackagesCacheWizard',
    function ($templateCache) {
        return{
            replace   : true,
            template  : $templateCache.get("components/location-selector/templ/index.html"),
            scope     : {
                theme       : '@',
                placeholder : '@',
                selectedItem: '=result',
                event       : '@'
            },
            controller: function ($rootScope, $scope, $location, DynamicPackagesDataProvider, DynamicPackagesCacheWizard) {

                console.log("start controller")
                
                if ($scope.event) {
                    $scope.$on($scope.event, function (event, data) {
                        console.log('dropdownInput event, id:', data);
                        if (data != null && data != 'null') {
                            console.log(data);
                            if (data instanceof Error) {
                                $scope.error = data.message;
                            } else {
                                //console.log('askForDataByID', id);
                                $scope.currentValue = null;
                            }
                        }
                    });
                }

                $scope.$watch('selectedItem', function (newValue, oldValue) {
                    console.log(newValue)
//                    console.log(newValue.errors)
                    
                })
                

                console.log("end controller")

            },
            link      : function ($scope, elem) {

                console.log("start link")

//            $scope.currentValue = $scope.selectedItem.Name
//            console.log($scope.selectedItem)
            }
        }
    }])