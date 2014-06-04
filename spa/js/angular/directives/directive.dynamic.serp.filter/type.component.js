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

                        var Option = inna.Models.Avia.Filters._OptionFactory(function(title, value){
                            this.value = value;
                            this.minPrice = NaN;

                            this.shown = true;
                        });

                        Option.prototype.describe = function(){
                            return this.value;
                        };

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter());
                        $scope.filter.filterFn = function(hotel){
                            //TODO
                        };
                        $scope.options = $scope.filter.options = new Options();

                        /*Watchers*/
                        var unwatchHotelsCollection = $scope.$watchCollection('hotels', function(hotels){
                            if(!hotels || !hotels.list.length) return;

                            var collections = {};

                            hotels.each(function(hotel){
                                var type = hotel.data.HotelType;

                                (
                                    collections[type] || (collections[type] = new inna.Models.Dynamic.HotelsCollection())
                                ).push(hotel);
                            });

                            console.log(collections);

                            unwatchHotelsCollection();
                        });
                    }
                ]
            }
        }
    ]);