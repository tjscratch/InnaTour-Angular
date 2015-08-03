'use strict';

innaAppControllers
    .controller('RegionFooter', [
        'EventManager',
        '$rootScope',
        '$scope',
        'innaAppApiEvents',
        function (EventManager, $rootScope, $scope, Events) {

            var footerPadding = '300px';
            var partner = window.partners ? window.partners.getPartner() : null;
            if (partner != null && partner.name == 'sputnik') {
                $scope.footerTemplateSrc = 'regions/footer/templ/footer_sputnik.html';
                footerPadding = '360px';
            }
            else{
                $scope.footerTemplateSrc = 'regions/footer/templ/footer.html';
            }

            $scope.isFooterVisible = true;
            $rootScope.isFooterHiddenWrprStyle = {'padding-bottom': footerPadding};

            EventManager.on(Events.FOOTER_VISIBLE, function () {
                $scope.safeApply(function () {
                    $scope.isFooterVisible = true;
                    $rootScope.isFooterHiddenWrprStyle = {'padding-bottom': footerPadding};
                });
            });

            EventManager.on(Events.FOOTER_HIDDEN, function () {
                $scope.safeApply(function () {
                    $scope.isFooterVisible = false;
                    $rootScope.isFooterHiddenWrprStyle = {'padding-bottom': '10px'};
                });
            });

        }]);