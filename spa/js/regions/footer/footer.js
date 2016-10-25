'use strict';

innaAppControllers
    .controller('RegionFooter', [
        'EventManager',
        '$rootScope',
        '$scope',
        '$location',
        'innaApp.Urls',
        'AppRouteUrls',
        'innaAppApiEvents',
        function (EventManager, $rootScope, $scope, $location, appUrls, AppRouteUrls, Events) {

            var footerPadding = '300px';
            var partner = window.partners ? window.partners.getPartner() : null;
            if (partner != null && partner.name == 'sputnik') {
                $scope.footerTemplateSrc = 'regions/footer/templ/footer_sputnik.html';
                footerPadding = '360px';
            }
            else{
                $scope.footerTemplateSrc = 'regions/footer/templ/footer.html';
            }

            $scope.gtmFooterButton = function ($event) {
                // var category = category();

                var dataLayerObj = {
                    'event': 'UM.Event',
                    'Data': {
                        'Category': category(),
                        'Action': 'FooterButton',
                        'Label': $event.target.textContent,
                        'Content': '[no data]',
                        'Context': '[no data]',
                        'Text': '[no data]'
                    }
                };
                console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }   
            };

            $scope.gtmSocialButton = function (type) {
                // var category = category();

                var dataLayerObj = {
                    'event': 'UM.Event',
                    'Data': {
                        'Category': category(),
                        'Action': 'SocialButton',
                        'Label': type ? type : '[no data]',
                        'Content': '[no data]',
                        'Context': '[no data]',
                        'Text': '[no data]'
                    }
                };
                console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
            };

            function category() {
                var loc = $location.path();
                var abs = $location.absUrl();

                var category = '';

                var isDynamic = (
                        loc.startsWith(appUrls.URL_DYNAMIC_PACKAGES) && !loc.startsWith(appUrls.URL_DYNAMIC_PACKAGES_RESERVATION) && !loc.startsWith(appUrls.URL_DYNAMIC_PACKAGES_BUY)
                    ) || loc == appUrls.URL_ROOT;
                // if (loc == appUrls.URL_TOURS || abs.indexOf(appUrls.URL_TOURS + '?') > -1) {
                //     return 'components/search_form/templ/tours_search_form.html';
                // }
                if (isDynamic) {
                    category = 'Packages';
                }
                else if (loc.startsWith(appUrls.URL_AVIA) && !loc.startsWith(appUrls.URL_AVIA_RESERVATION) && !loc.startsWith(appUrls.URL_AVIA_BUY)) {
                    category = 'Avia';
                }
                else if (loc.startsWith(AppRouteUrls.URL_HOTELS)) {
                    category = 'Hotels'
                }
                else if (loc.startsWith(AppRouteUrls.URL_BUS)) {
                    category = 'Bus';
                }
                return category;
            };

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