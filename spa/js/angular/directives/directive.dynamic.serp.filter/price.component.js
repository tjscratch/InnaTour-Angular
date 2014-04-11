angular.module('innaApp.directives')
    .directive('dynamicSerpFilterPrice', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/price.html',
                scope: {
                    hotels: '='
                },
                controller: [
                    '$scope',
                    function($scope){
                        $scope.min = Number.MAX_VALUE;
                        $scope.max = 0;

                        $scope.price = 0;

                        $scope.$watch('price', function(newVal){
                            $scope.$emit('inna.Dynamic.SERP.Hotel.Filter', {filter: 'Price', value: newVal});
                        });

                        $scope.$watchCollection('hotels', function(newVal) {
                            _.each(newVal, function(hotel) {
                                var price = hotel.MinimalPackagePrice;

                                if(price < $scope.min) $scope.min = price;

                                if(price > $scope.max) $scope.max = price;
                            });

                            $scope.price = $scope.max;
                        });
                    }
                ]
            }
        }
    ]);