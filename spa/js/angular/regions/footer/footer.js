﻿'use strict';

angular.module('innaApp.directives')
    .directive('regionFooter', ['$templateCache', function ($templateCache) {
        return {
            replace: true,
            restrict: 'A',
            template: $templateCache.get('regions/footer/templ/footer.html'),
            scope: {},
            controller: function ($scope) {

            },
            link: function ($scope, $element, attrs) {

                $scope.$on('$routeChangeStart', function (next, current) {
                    $element.show();
                });


                $scope.$root.$on('region-footer:hide', function () {
                    $element.hide();
                });

                $scope.$root.$on('region-footer:show', function () {
                    $element.show();
                });
            }
        };
    }]);