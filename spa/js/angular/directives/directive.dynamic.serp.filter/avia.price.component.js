angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaPrice', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.price.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaPriceTickets'
                },
                controller: [
                    '$scope', 'innaApp.API.events',
                    function($scope, Events){
                        $scope.min = Number.MAX_VALUE;
                        $scope.max = 0;

                        $scope.price = 0;

                        $scope.$watch('price', function(newVal){
                            $scope.$emit(Events.DYNAMIC_SERP_FILTER_TICKET, {filter: 'Price', value: newVal});
                        });

                        $scope.$watchCollection('hotels', function(newVal) {
                            _.each(newVal, function(hotel) {
                                var price = ticket.Price;

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