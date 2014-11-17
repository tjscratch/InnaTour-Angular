'use strict';

//innaDynamicBundleMini
angular.module('innaApp.directives')
    .directive('recommendedPairMini', [
        '$templateCache',
        function ($templateCache) {
            return {
                template: $templateCache.get('components/recommended-pair/templ/recommended-mini.html'),
                controller: [
                    'EventManager',
                    '$scope',
                    'aviaHelper',
                    '$location',
                    '$element',
                    'innaApp.API.events',
                    '$routeParams',

                    // components
                    'ShareLink',
                    'Tripadvisor',
                    'Stars',
                    'PriceGeneric',
                    function (EventManager, $scope, aviaHelper, $location, $element, Events, $routeParams, ShareLink, Tripadvisor, Stars, PriceGeneric) {

                        var _stars = new Stars({
                            el: $element.find('.js-stars-container'),
                            data: {
                                stars: $scope.combination.hotel.data.Stars
                            }
                        })

                        var _priceGeneric = new PriceGeneric({
                            el: $element.find('.js-price-generic-container'),
                            data: {
                                template: "index.hbs.html",
                                virtualBundle: $scope.combination,
                                tooltipKlass: 'bundle',
                                iconWhite: true,
                                type: $scope.tabActive
                            }
                        })


                        $scope.$on('$destroy', function () {
                            _stars.teardown();
                            _priceGeneric.teardown();
                            _priceGeneric = null;
                            _stars = null;
                        })
                    }
                ]
            }
        }]);