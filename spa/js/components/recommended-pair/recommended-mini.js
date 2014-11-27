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
                    function (EventManager, $scope, aviaHelper, $location, $element, Events, $routeParams) {

                        $scope.$on('$destroy', function () {

                        })
                    }
                ]
            }
        }]);