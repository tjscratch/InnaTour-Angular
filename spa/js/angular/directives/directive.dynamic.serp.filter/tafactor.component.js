angular.module('innaApp.directives')
    .directive('dynamicSerpFilterTafactor', function(){
        return {
            templateUrl: '/spa/templates/components/dynamic-serp-filter/tafactor.html',
            scope: {
                hotels: '=dynamicSerpFilterTafactorHotels',
                filters: '=dynamicSerpFilterTafactorFilters'
            },
            controller: [
                '$scope', '$controller', '$element',
                function($scope, $controller, $element){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Models*/
                    var Option = inna.Models.Avia.Filters._OptionFactory(function(title, value, minPrice){
                        this.value = value;
                        this.minPrice = minPrice;
                    });

                    var Options = inna.Models.Avia.Filters._OptionsFactory();

                    /*Properties*/
                    $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('TaFactor'));
                    $scope.options = $scope.filter.options = new Options();

                    /*Watchers*/
                    var unwatchHotelsCollection = $scope.$watchCollection('hotels', function(hotels){
                        var collections = {}

                        hotels.each(function(hotel){
                            (
                                collections[hotel.data.TaFactor] || (
                                    collections[hotel.data.TaFactor] = new inna.Models.Hotels.HotelsCollection()
                                )
                            ).push(hotel);
                        });

                        for(var factor in collections) if(collections.hasOwnProperty(factor)) {
                            $scope.options.push(new Option(factor, factor, collections[factor].getMinPrice()));
                        }
                    });
                }
            ]
        }
    });