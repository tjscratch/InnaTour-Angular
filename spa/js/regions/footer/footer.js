'use strict';

innaAppControllers
    .controller('RegionFooter', [
        'EventManager',
        '$scope',
        '$element',
        '$templateCache',
        'innaApp.API.events',
        function (EventManager, $scope, $element, $templateCache, Events) {
            $scope.isFooterVisible = true;

            EventManager.on(Events.FOOTER_VISIBLE, function () {
                $scope.$root.safeApply(function () {
                    $scope.isFooterVisible = true;
                });
            });


            EventManager.on(Events.FOOTER_HIDDEN, function () {
                $scope.$root.safeApply(function () {
                    $scope.isFooterVisible = false;
                });
            });
        }])