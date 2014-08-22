'use strict';

angular.module('innaApp.directives')
    .directive('regionFooter', [
        'EventManager',
        '$templateCache',
        'innaApp.API.events',
        function (EventManager, $templateCache, Events) {
            return {
                replace: true,
                restrict: 'A',
                template: $templateCache.get('regions/footer/templ/footer.html'),
                scope: {},
                controller: function ($scope) {

                },
                link: function ($scope, $element, attrs) {

                    $scope.isFooterVisible = true;

                    EventManager.on(Events.FOOTER_VISIBLE, function () {
                        $scope.safeApply(function () {
                            $scope.isFooterVisible = true;
                        });
                    });


                    EventManager.on(Events.FOOTER_HIDDEN, function () {
                        $scope.safeApply(function () {
                            $scope.isFooterVisible = false;
                        });
                    });
                }
            };
        }]);