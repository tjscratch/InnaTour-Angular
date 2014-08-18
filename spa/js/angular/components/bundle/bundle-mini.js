'use strict';

angular.module('innaApp.directives')
    .directive('innaDynamicBundleMini', ['$templateCache', function ($templateCache) {
        return {
            template: $templateCache.get('components/bundle/templ/bundle-mini.html'),
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
                function (EventManager, $scope, aviaHelper, $location, $element, Events, $routeParams, ShareLink, Tripadvisor, Stars) {

                    console.log($scope);

                    /* Stars */
                    setTimeout(function(){

                    }, 0)

                    var _stars = new Stars({
                        el: $element.find('.js-stars-container'),
                        data: {
                            stars: $scope.combination.hotel.data.Stars
                        }
                    })

                    console.log(_stars);

                    //destroy
                    $scope.$on('$destroy', function () {
                        _stars.teardown();
                        _stars = null;
                    })
                }
            ]
        }
    }]);