function selectBox($rootScope, $templateCache, DynamicPackagesDataProvider, DynamicPackagesCacheWizard) {
    return{
        replace   : true,
        template  : $templateCache.get("components/dropdown-input/templ/index.html"),
        scope     : {
            theme      : '@',
            placeholder: '@',
            selectedItem: '=result'
        },
        controller: function ($scope) {
            
            $scope.selectedItem = 23456789;

//            $scope.fromCur = routeParams.DepartureId || DynamicPackagesCacheWizard.require('fromCur', function () {
//                DynamicPackagesDataProvider.getUserLocation(function (data) {
//                    if (data != null) {
//                        $scope.safeApply(function () {
//                            $scope.fromCur = data.Id;
//                            $rootScope.$broadcast("dp_form_from_update", data.Id);
//                        });
//                    }
//                });
//            });
            
        },
        link      : function ($scope, elem) {

            
        }
    }
}

selectBox.$inject = ['$rootScope', '$templateCache', 'DynamicPackagesDataProvider', 'DynamicPackagesCacheWizard'];
angular
    .module('innaApp.directives')
    .directive('selectBox', selectBox);
