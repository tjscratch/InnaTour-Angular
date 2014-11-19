'use strict';

//innaDynamicBundleMini
angular.module('innaApp.directives')
    .directive('recommendedPairComponentMini', [
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
                                stars: $scope.recommendedPair.hotel.data.Stars
                            }
                        })

                        $scope.$on('$destroy', function () {
                            _stars.teardown();
                            _stars = null;
                        })
                    }
                ]
            }
        }]);