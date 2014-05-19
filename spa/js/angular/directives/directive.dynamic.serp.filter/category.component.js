angular.module('innaApp.directives')
    .directive('dynamicSerpFilterCategory', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/category.html',
                scope: {
                    hotels: '=dynamicSerpFilterCategoryHotels',
                    filters: '=dynamicSerpFilterCategoryFilters'
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
                        });

                        Option.prototype.describe = function(){
                            return _.generateRange(0, this.value - 1).map(function(){
                                return '<span class="icon icon-star ng-scope"></span>';
                            }).join('');
                        }

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter());
                        $scope.filter.filterFn = function(hotel){
                            var fits = false;

                            this.options.each(function(option){
                                fits = fits || (hotel.data.Stars == option.value);
                            });

                            if(!fits) hotel.hidden = true;
                        };
                        $scope.options = $scope.filter.options = new Options();
                        $scope.options.push(new Option('1 звезда', 1));
                        $scope.options.push(new Option('2 звезда', 2));
                        $scope.options.push(new Option('3 звезда', 3));
                        $scope.options.push(new Option('4 звезда', 4));
                        $scope.options.push(new Option('5 звезда', 5));

                        /*Watchers*/
                        var unwatchHotelsCollection = $scope.$watchCollection('hotels', function(hotels){
                            if(!hotels || !hotels.list.length) return;

                            $scope.options.each(function(option){
                                var fitting = new inna.Models.Hotels.HotelsCollection();

                                hotels.each(function(hotel){
                                    if(hotel.data.Stars == option.value) fitting.push(hotel);
                                });

                                if(fitting.size()) {
                                    option.shown = true;
                                    option.minPrice = fitting.getMinPrice();
                                }
                            });

                            console.log($scope);

                            unwatchHotelsCollection();
                        });
                    }
                ]
            }
        }
    ]);