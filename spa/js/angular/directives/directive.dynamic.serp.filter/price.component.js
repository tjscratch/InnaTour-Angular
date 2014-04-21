angular.module('innaApp.directives')
    .directive('dynamicSerpFilterPrice', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/price.html',
                scope: {
                    hotels: '='
                },
                controller: [
                    '$scope', 'innaApp.API.events',
                    function($scope, Events){
                        var DEFAULT = 0;

                        $scope.min = Number.MAX_VALUE;
                        $scope.max = 0;

                        $scope.price = DEFAULT;

                        $scope.$watch('price', function(newVal){
                            $scope.$emit(Events.DYNAMIC_SERP_FILTER_HOTEL, {filter: 'Price', value: newVal});
                        });

                        $scope.$watchCollection('hotels', function(newVal) {
                            _.each(newVal, function(hotel) {
                                var price = hotel.MinimalPackagePrice;

                                if(price < $scope.min) $scope.min = price;

                                if(price > $scope.max) $scope.max = price;
                            });
                        });

                        $scope.$on(Events.build(Events.DYNAMIC_SERP_FILTER_ANY_DROP, 'Price'), function(){
                            $scope.price = DEFAULT;
                        })
                    }
                ]
            }
        }
    ]);