angular.module('innaApp.directives')
    .directive('dynamicSerpFilterTafactor', [
        '$templateCache',
        'Tripadvisor',
        function ($templateCache, Tripadvisor) {

            return {
                template: $templateCache.get('components/dynamic-serp-filter/tafactor.html'),
                scope: {
                    hotels: '=dynamicSerpFilterTafactorHotels',
                    filters: '=dynamicSerpFilterTafactorFilters',
                    bundle: '=dynamicSerpFilterTafactorBundle'
                },
                controller: [
                    '$scope',
                    '$controller',
                    '$element',
                    function ($scope, $controller, $element) {



                        /*
                        var _tripadvisor = new Tripadvisor({
                            el: $element.find('.js-tripadvisor-container'),
                            data: {
                                TaFactor: $scope.hotels.data.TaFactor,
                                withOutTd : true
                            }
                        })*/


                        /*Mixins*/
                        $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                        /*Models*/
                        var Option = inna.Models.Avia.Filters._OptionFactory(function (title, value, minPrice) {
                            this.value = value;
                            this.minPrice = minPrice;

                            this.shown = true;
                        });

                        Option.prototype.describe = function () {
                            return _.generateRange(1, this.value).map(function () {
                                return '<span class="icon-sprite-tripadvisor-like"></span>';
                            }).join('');
                        }

                        var Options = inna.Models.Avia.Filters._OptionsFactory();

                        /*Properties*/
                        $scope.filter = $scope.filters.add(new inna.Models.Avia.Filters.Filter('TaFactor'));
                        $scope.filter.filterFn = function (hotel) {
                            var fits = false;

                            this.options.getSelected().each(function (option) {
                                fits = fits || (option.value == hotel.data.TaFactorCeiled);
                            });

                            if (!fits) {
                                hotel.hidden = true;
                                hotel.data.hidden = true;
                            }
                        }
                        $scope.options = $scope.filter.options = new Options();

                        /*Watchers*/
                        var unwatchHotelsCollection = $scope.$watchCollection('hotels', function (hotels) {
                            var collections = {};

                            hotels.each(function (hotel) {
                                (
                                    collections[hotel.data.TaFactorCeiled] || (
                                    collections[hotel.data.TaFactorCeiled] = new inna.Models.Hotels.HotelsCollection()
                                    )
                                    ).push(hotel);
                            });

                            var factors = Object.keys(collections).sort().reverse();

                            for (var i = 0, factor = 0; factor = factors[i++];) {
                                if (!parseInt(factor)) continue;
                                if (!collections.hasOwnProperty(factor)) continue;

                                $scope.options.push(new Option(factor, factor, collections[factor].getMinPrice($scope.bundle)));
                            }
                        });


                        //destroy
                        $scope.$on('$destroy', function () {

                        })
                    }
                ]
            }
        }]);