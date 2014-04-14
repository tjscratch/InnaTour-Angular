angular.module('innaApp.directives')
    .directive('dynamicSerpFilterExtra', [function(){
        return {
            templateUrl: '/spa/templates/components/dynamic-serp-filter/extra.html',
            scope: {
                'hotels': '='
            },
            controller: ['$scope', function($scope){
                $scope.models = {
                    IsHasInternet: false,
                    IsHasKitchen: false,
                    IsHasParking: false,
                    IsHasSwimmingPool: false
                }

                $scope.atLeastOne = function(option){
                    return !!_.find($scope.hotels, function(hotel){
                        return hotel[option];
                    });
                }

                $scope.onChange = function(option) {
                    $scope.$emit('inna.Dynamic.SERP.Hotel.Filter', {filter: 'Extra', value: angular.copy($scope.models)});
                }
            }]
        }
    }]);