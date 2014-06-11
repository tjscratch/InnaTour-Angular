angular.module('innaApp.directives')
    .directive('dynamicSerpFilterType', [
        '$templateCache',
        function($templateCache){
            return {
                template: $templateCache.get('components/dynamic-serp-filter/type.html'),
                scope: {
                    hotels: '=dynamicSerpFilterTypeHotels',
                    filters: '=dynamicSerpFilterTypeFilters'
                },
                controller: [
                    '$scope', '$controller', '$element',
                    function($scope, $controller, $element){
                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title, value, minPrice){
                            this.value = value;
                            this.minPrice = minPrice;

                            this.shown = true;
                        });

                        Option.prototype.describe = function(){
                            return this.value;
                        };

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter());
                        $scope.filter.filterFn = function(hotel){
                            var fits = false;

                            this.options.getSelected().each(function(option){
                                fits = fits || (option.value == hotel.data.HotelType);
                            });

                            if(!fits) hotel.hidden = true;
                        };
                        $scope.options = $scope.filter.options = new Options();

                        /*Watchers*/
                        var unwatchHotelsCollection = $scope.$watchCollection('hotels', function(hotels){
                            if(!hotels || !hotels.list.length) return;

                            var collections = {};

                            hotels.each(function(hotel){
                                var type = hotel.data.HotelType;

                                (
                                    collections[type] || (collections[type] = new inna.Models.Hotels.HotelsCollection())
                                ).push(hotel);
                            });

                            for(var type in collections) if(collections.hasOwnProperty(type)) {
                                $scope.options.push(new Option(type, type, collections[type].getMinPrice()));
                            }

                            unwatchHotelsCollection();
                        });
                    }
                ]
            }
        }
    ]);