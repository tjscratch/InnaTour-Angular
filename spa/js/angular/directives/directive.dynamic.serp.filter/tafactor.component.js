angular.module('innaApp.directives')
    .directive('dynamicSerpFilterTafactor', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/dynamic-serp-filter/tafactor.html'),
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

                        this.shown = true;
                    });

                    Option.prototype.describe = function(){
                        return _.generateRange(0, this.value - 1).map(function(){
                            return '<span class="icon icon-tripadvisor-like"></span>';
                        }).join('');
                    }

                    var Options = inna.Models.Avia.Filters._OptionsFactory();

                    /*Properties*/
                    $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('TaFactor'));
                    $scope.filter.filterFn = function(hotel){
                        var fits = false;

                        this.options.getSelected().each(function(option){
                            fits = fits || (option.value == hotel.data.TaFactor);
                        });

                        if(!fits) hotel.hidden = true;
                    }
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
    }]);