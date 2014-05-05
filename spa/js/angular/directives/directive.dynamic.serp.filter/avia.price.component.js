angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaPrice', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.price.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaPriceTickets'
                },
                controller: [
                    '$scope', 'innaApp.API.events', '$element', '$controller',
                    function($scope, Events, $element, $controller){
                        /*Private*/
                        var NAME = 'Price';

                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*DOM*/
                        var slider = $('.js-range', $element);
                        var input = $('.js-range-val', $element);

                        /*Private*/
                        var min = Number.MAX_VALUE;
                        var max = 0;
                        var normalizedPrice = function(){
                            if($scope.price < min) return min;
                            if($scope.price > max) return max;

                            return $scope.price;
                        }

                        /*Properties*/
                        $scope.price = 0;
                        $scope.isOpen = false;

                        /*Methods*/
                        $scope.onChange = function(){
                            slider.slider('value', $scope.price);
                            $scope.$emit(Events.DYNAMIC_SERP_FILTER_TICKET, {filter: NAME, value: normalizedPrice()});
                        };

                        $scope.reset = function(){
                            $scope.price = max;
                            $scope.onChange();
                        };

                        /*Watchers*/
                        var unwatchCollectionTickets = $scope.$watchCollection('tickets', function(newVal) {
                            if(!newVal || !newVal.list.length) return;

                            min = newVal.getMinPrice();
                            max = newVal.getMaxPrice();

                            slider.slider({
                                range: "min",
                                min: min,
                                max: max,
                                value: max,
                                slide: function(event, ui) {
                                    $scope.$apply(function($scope){
                                        $scope.price = ui.value;
                                        $scope.onChange();
                                    });
                                }
                            });

                            $scope.reset();

                            unwatchCollectionTickets();
                        });

                        $scope.$on(Events.build(Events.DYNAMIC_SERP_FILTER_ANY_DROP, NAME), function(){
                            $scope.reset();
                        });
                    }
                ]
            }
        }
    ]);