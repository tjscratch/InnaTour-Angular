'use strict';

innaAppControllers
    .controller('RegionHeader', [
        'EventManager',
        '$rootScope',
        '$scope',
        '$element',
        '$location',
        'eventsHelper',
        'urlHelper',
        'innaApp.Urls',
        'AppRouteUrls',
        'innaAppApiEvents',
        'aviaHelper',
        '$timeout',
        function (EventManager, $rootScope, $scope, $element, $location, eventsHelper, urlHelper, appUrls, AppRouteUrls, Events, aviaHelper, $timeout) {

            var partner = window.partners ? window.partners.getPartner() : null;
            if (partner != null && partner.name == 'sputnik') {
                $scope.headerTemplateSrc = 'regions/header/templ/header_sputnik.html';
            }
            else{
                $scope.headerTemplateSrc = 'regions/header/templ/header.html';
            }


            /**
             * Отели у нас работают только для b2b клиентов
             * поэтому если не b2b пользователь попал на страницу отелей
             * редиректим его на главную
             */
            $scope.isAgency = false;
            $scope.$on(Events.AUTH_USER_SET, function (e, data) {
                if (data) {
                    $scope.isAgency = data.isAgency();
                }
            });


            $scope.$on('$routeChangeStart', function (next, current) {
                $scope.safeApply(function () {
                    $scope.isHeaderVisible = true;
                });
            });

            $scope.isHeadVisible = true;
            $scope.isHeaderVisible = true;


            EventManager.on(Events.HEADER_VISIBLE, function () {
                $scope.safeApply(function () {
                    $scope.isHeaderVisible = true;
                });
            });


            EventManager.on(Events.HEAD_HIDDEN, function () {
                $scope.safeApply(function () {
                    $scope.isHeadVisible = false;
                });
            });

            EventManager.on(Events.HEADER_HIDDEN, function () {
                $scope.safeApply(function () {
                    $scope.isHeaderVisible = false;
                });
            });

            EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, function () {
                $scope.safeApply(function () {
                    $scope.isHeaderVisible = true;
                });
            });

            EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, function () {
                $scope.safeApply(function () {
                    $scope.isHeaderVisible = false;
                });
            });

            $scope.urls = appUrls;


            /**
             * Определяет какая форма поиска будет показана
             * @returns {string}
             */
            $scope.getHeadForm = function () {
                //для партнеров - своя форма для поиска
                if (window.partners && window.partners.isFullWL()) {
                    return "";
                }

                var loc = $location.path();
                var isDynamic = (
                    loc.startsWith(appUrls.URL_DYNAMIC_PACKAGES) && !loc.startsWith(appUrls.URL_DYNAMIC_PACKAGES_RESERVATION) && !loc.startsWith(appUrls.URL_DYNAMIC_PACKAGES_BUY)
                    ) || loc == appUrls.URL_ROOT;

                var abs = $location.absUrl();
                if (loc == appUrls.URL_TOURS || abs.indexOf(appUrls.URL_TOURS + '?') > -1) {
                    return 'components/search_form/templ/tours_search_form.html';
                }
                else if (isDynamic) {
                    return 'components/search_form/templ/dynamic_search_form.html';
                }
                else if (loc.startsWith(appUrls.URL_AVIA) && !loc.startsWith(appUrls.URL_AVIA_RESERVATION) && !loc.startsWith(appUrls.URL_AVIA_BUY)) {
                    return 'components/search_form/templ/avia_search_form.html';
                }
                else if (loc.startsWith(AppRouteUrls.URL_HOTELS)) {
                    return 'components/search-form-hotels/templ/index.html';
                }
                else if (loc.startsWith(AppRouteUrls.URL_BUS)) {
                    return 'components/search-form-bus/templ/index.html';
                }

                //на бронировании и покупке формы нет
                else {
                    return '';
                }
            };


            function setShadow (){
                if ($location.path().indexOf(appUrls.URL_DYNAMIC_HOTEL_DETAILS) > -1) {
                    $scope.shadow = true;
                } else {
                    $scope.shadow = false;
                }
            }

            $scope.$on('$routeChangeSuccess', function () {
                setShadow();
            });

            $scope.$root.isLoginPopupOpened = false;
            $scope.headLoginBtnclick = function ($event) {
                eventsHelper.preventBubbling($event);
                $scope.$root.isLoginPopupOpened = true;
            };

        }]);
