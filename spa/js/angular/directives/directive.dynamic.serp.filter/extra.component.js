angular.module('innaApp.directives')
    .directive('dynamicSerpFilterExtra', [function(){
        return {
            templateUrl: '/spa/templates/components/dynamic-serp-filter/extra.html',
            scope: {
                'hotels': '='
            },
            controller: [
                '$scope', 'innaApp.API.events',
                function($scope, Events){
                    var NAME = 'Extra.*';
                    var DEFAULT = false;

                    $scope.models = {
                        IsHasInternet: DEFAULT,
                        IsHasKitchen: DEFAULT,
                        IsHasParking: DEFAULT,
                        IsHasSwimmingPool: DEFAULT
                    }

                    $scope.atLeastOne = function(option){
                        return !!_.find($scope.hotels, function(hotel){
                            return hotel[option];
                        });
                    }

                    $scope.onChange = function() {
                        $scope.$emit(Events.DYNAMIC_SERP_FILTER_HOTEL, {filter: 'Extra', value: angular.copy($scope.models)});
                    }

                    $scope.$on(Events.build(Events.DYNAMIC_SERP_FILTER_ANY_DROP, NAME), function(event, data){
                        var propertyName = data.split('.')[1];
                        $scope.models[propertyName] = DEFAULT;
                        $scope.onChange();
                    })
                }
            ]
        }
    }]);