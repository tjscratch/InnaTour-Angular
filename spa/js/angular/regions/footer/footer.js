'use strict';

angular.module('innaApp.directives')
    .directive('regionFooter', function () {
        return {
            replace: true,
            restrict: 'A',
            templateUrl: '/spa/js/angular/regions/footer/templ/footer.html',
            scope: {},
            controller: function ($scope) {

            },
            link: function ($scope, $element, attrs) {

                $scope.$on('$routeChangeStart', function(next, current) {
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
    });