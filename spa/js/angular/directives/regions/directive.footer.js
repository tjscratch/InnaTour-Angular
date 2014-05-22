'use strict';

angular.module('innaApp.directives')
    .directive('regionFooter', function () {
        return {
            replace: true,
            restrict: 'A',
            templateUrl: '/spa/templates/regions/footer.html',
            scope: {},
            controller: function ($scope) {

            },
            link: function ($scope, $element, attrs) {


                $scope.$root.$on('region-footer:hide', function () {
                    $element.hide();
                });

                $scope.$root.$on('region-footer:show', function () {
                    $element.show();
                });
            }
        };
    });