angular.module('innaApp.directives')
    .directive('dynamicSerpFilterCategory', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/category.html',
                scope: {
                    hotels: '='
                },
                controller: [
                    '$scope', 'innaApp.API.events',
                    function($scope, Events){
                        var ALL = 'all';
                        var DEFAULT = ALL;

                        $scope.options = {};

                        $scope.$watchCollection('hotels', function(newVal){
                            _.each(newVal, function(hotel){
                                if (hotel.Stars in $scope.options) {
                                    $scope.options[hotel.Stars]++;
                                } else {
                                    $scope.options[hotel.Stars] = 1;
                                }
                            });

                            $scope.options[ALL] = newVal.length;
                        });

                        $scope.currentOption = DEFAULT;

                        $scope.$watch('currentOption', function(newVal){
                            $scope.$emit(Events.DYNAMIC_SERP_FILTER_HOTEL, {filter: 'Stars', value: newVal});
                        });

                        $scope.$on(Events.build(Events.DYNAMIC_SERP_FILTER_ANY_DROP, 'Stars'), function(event, data){
                            $scope.currentOption = DEFAULT;
                        });

                        $scope.setCurrent = function(option){
                            $scope.currentOption = option;
                        }
                    }
                ]
            }
        }
    ]);