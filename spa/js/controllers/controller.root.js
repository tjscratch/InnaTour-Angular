'use strict';

/* Controllers */

innaAppControllers.
    controller('RootCtrl', [
        'EventManager',
        '$log',
        '$scope',
        '$location',
        'dataService',
        'eventsHelper',
        'urlHelper',
        'innaApp.Urls',
        'innaAppApiEvents',
        'aviaHelper',
        function (EventManager, $log, $scope, $location, dataService, eventsHelper, urlHelper, appUrls, Events, aviaHelper) {

            //js загрузился - показываем все спрятанные элементы
            setTimeout(function () {
                $('.hide-while-loading').removeClass('hide-while-loading');
            }, 0);


            $scope.$on('$routeChangeStart', function (next, current) {
                EventManager.fire(Events.AJAX__RESET);
            });


            // TODO : HELL
            $scope.baloon = aviaHelper.baloon;


            $scope.isActive = function (route) {
                var loc = $location.path();
                var abs = $location.absUrl();

                if (route == '/') {
                    return ((abs.indexOf('/tours/?') > -1) || loc == route);
                }
                else {
                    if (loc.indexOf(route) > -1)
                        return true;
                    else
                        return false;
                }
            };


            $scope.isBodyBg = function () {
                return $scope.isActive('/avia/reservation/') || $scope.isActive('/packages/reservation/') || $scope.isActive('/buy/');
            };


            /**
             * Анимация формы поиска при скролле
             */
            $scope.FormExpand = false;
            $scope.$on('$routeChangeStart', function (next, current) {
                switch ($location.$$path) {
                    case '/':
                    case '/avia/':
                    case '/tours/':
                    case '/packages/':
                        $scope.FormExpand = true;
                        $scope.SearchFormExpandPadding = {'padding-top': 150};
                        document.addEventListener('scroll', onScroll, false);
                        break;
                    default:
                        $scope.FormExpand = false;
                        $scope.SearchFormExpandPadding = {'padding-top': 0};
                        document.removeEventListener('scroll', onScroll, false);
                        break;
                }
            });

            var onScroll = function () {
                var scroll = utils.getScrollTop();
                if (scroll > 150) {
                    $scope.$apply(function ($scope) {
                        $scope.FormExpand = false;
                        $scope.SearchFormExpandPadding = {'padding-top': 0}
                    });
                } else {
                    $scope.$apply(function ($scope) {
                        $scope.FormExpand = true;
                        $scope.SearchFormExpandPadding = {'padding-top': 150 - scroll}
                    });
                }
            };


            (function __INITIAL__() {
                var advParams = {
                    from: $location.search().from || '',
                    tourist: $location.search().tourist || '',
                    from_param: $location.search().from_param || '',
                    PartnerMarker: $location.search().PartnerMarker || '',
                    id_partner: $location.search().id_partner || '',
                    data: $location.search().data || ''
                };

                delete $location.$$search.from;
                delete $location.search().tourist;
                delete $location.$$search.from_param;
                delete $location.$$search.PartnerMarker;
                delete $location.$$search.id_partner;
                delete $location.$$search.data;
                $location.$$compose();
                if(advParams.from || advParams.PartnerMarker){
                    dataService.getPartnershipCookie(advParams);
                }
            })();


            ['/spa/img/hotels/back-0.jpg', '/spa/img/hotels/back-1.jpg', '/spa/img/hotels/back-2.jpg'].forEach(function (img) {
                try {
                    //preload dp backgrounds
                    var preload = new Image();

                    preload.src = img;
                } catch (e) {
                    //do nothing
                }

            });
        }]);