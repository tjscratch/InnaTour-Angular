'use strict';

/* Controllers */

innaAppControllers.
    controller('RootCtrl', [
        'EventManager',
        '$log',
        '$scope',
        '$location',
        'dataService',
        'AuthDataProvider',
        'eventsHelper',
        'urlHelper',
        'innaApp.Urls',
        'innaAppApiEvents',
        'aviaHelper',
        function (EventManager, $log, $scope, $location, dataService, AuthDataProvider, eventsHelper, urlHelper, appUrls, Events, aviaHelper) {

            //js загрузился - показываем все спрятанные элементы
            setTimeout(function () {
                $('.hide-while-loading').removeClass('hide-while-loading');
            }, 0);

            //определяем что iOS
            $scope.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

            /*
                Title
             */

            $scope.getTitle = function () {

                var loc = $location.path();
                var abs = $location.absUrl();

                if (loc == '/') {
                    return "Главная";
                } else if (loc.indexOf(appUrls.URL_DYNAMIC_PACKAGES) > -1) {
                    return "Динамические пакеты";
                }
                else if (loc.indexOf(appUrls.URL_AVIA) > -1) {
                    return "Авиабилеты";
                }
                else if (loc.indexOf(appUrls.URL_PROGRAMMS) > -1) {
                    return "Программы";
                }
                else if (loc.indexOf(appUrls.URL_ABOUT) > -1) {
                    return "О компании";
                }
                else if (loc.indexOf(appUrls.URL_CONTACTS) > -1) {
                    return "Контакты";
                }
                else {
                    return "Главная";
                }
            };

            $scope.getPartnersTitle = function () {

                var loc = $location.path();
                var abs = $location.absUrl();

                if (loc == '/') {
                    return "Перелет + Отель";
                } else if (loc.indexOf(appUrls.URL_DYNAMIC_PACKAGES) > -1) {
                    return "Перелет + Отель";
                }
                else if (loc.indexOf(appUrls.URL_AVIA) > -1) {
                    return "Авиабилеты";
                }
                else if (loc.indexOf(appUrls.URL_PROGRAMMS) > -1) {
                    return "Программы";
                }
                else if (loc.indexOf(appUrls.URL_ABOUT) > -1) {
                    return "О компании";
                }
                else if (loc.indexOf(appUrls.URL_CONTACTS) > -1) {
                    return "Контакты";
                }
                else {
                    return "Перелет + Отель";
                }
            };

            setTitle();

            function setTitle() {
                var partner = window.partners ? window.partners.getPartner() : null;
                if (partner && partner.realType == window.partners.WLType.b2b){
                    $scope.title = partner.title + " - " + $scope.getPartnersTitle();
                }
                else {
                    $scope.title = "ИННА ТУР - " + $scope.getTitle();
                }
            }


            $scope.$on('$routeChangeSuccess', function () {
                setTitle();
            });

            /*
             Title
             */


            $scope.$on('$routeChangeStart', function (next, current) {
                EventManager.fire(Events.AJAX__RESET);
            });


            $scope.baloon = aviaHelper.baloon;


            $scope.isActive = function (route) {
                var loc = $location.path();
                var abs = $location.absUrl();

                if (route == '/') {
                    return ((abs.indexOf('/tours/?') > -1) || loc == route);
                } else {
                    if (loc.indexOf(route) > -1)
                        return true;
                    else
                        return false;
                }
            };


            // $scope.isBodyBg = function () {
            //     return $scope.isActive('/avia/reservation/') || $scope.isActive('/packages/reservation/') || $scope.isActive('/reservations/') || $scope.isActive('/buy/');
            // };

            $scope.isTransferBg = function () {
                return $scope.isActive(appUrls.URL_TRANSFERS);
            };

            /**
             * Анимация формы поиска при скролле
             */
            $scope.FormExpand = false;
            $scope.isEnableSearchForm = false;
            $scope.StaticPage = false;
            
            $scope.$on('$routeChangeStart', function (next, current) {
                switch ($location.$$path) {
                    case '/':
                    case '/avia/':
                    case '/tours/':
                    case '/packages/':
                    case '/hotels/':
                    case '/bus/':
                        // if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
                        //     $scope.SearchFormExpandPadding = {'padding-top': 0}
                        // }else{
                            $scope.FormExpand = true;
                            $scope.SearchFormExpandPadding = {'padding-top': 250};
                            document.addEventListener('scroll', onScroll, false);
                        // }
                        break;
                    default:
                        $scope.FormExpand = false;
                        $scope.SearchFormExpandPadding = {'padding-top': 0};
                        document.removeEventListener('scroll', onScroll, false);
                        break;
                }
                switch ($location.$$path) {
                    case '/':
                    case '/avia/':
                    case '/tours/':
                    case '/packages/':
                    case '/hotels/':
                    case '/bus/':
                            $scope.isEnableSearchForm = true;
                        break;
                    default:
                        $scope.isEnableSearchForm = false;
                        break;
                }
                switch ($location.$$path) {
                    case '/contacts/':
                    case '/about/':
                    case '/where-to-buy/':
                    case '/certificates/':
                    case '/certificates_kit/':
                    case '/individualtours/':
                    case '/transfers/':
                        $scope.FormExpand = true;
                        $scope.StaticPage = true;
                        $scope.SearchFormExpandPadding = {'padding-top': 0};
                        break;
                    default:
                        $scope.StaticPage = false;
                        break;
                }
            });

            var onScroll = function () {
                var scroll = utils.getScrollTop();
                // if (scroll > 250) {
                //     $scope.$apply(function ($scope) {
                //         $scope.FormExpand = false;
                //         $scope.SearchFormExpandPadding = {'padding-top': 0};
                //     });
                // } else {
                //     $scope.$apply(function ($scope) {
                //         $scope.FormExpand = true;
                //         $scope.SearchFormExpandPadding = {'padding-top': 250 - scroll};
                //     });
                // }
            };

            $scope.isVisibleNotifNewDesign = true;

            $scope.closeNotifNewDesign = function () {
                $scope.isVisibleNotifNewDesign = false;
            };

            (function __INITIAL__() {

                //параметры забираются из урла и до # (location.search) и после ($location.search())

                //yandex
                var label = getParameterByName('label') || $location.search().label;
                var from = getParameterByName('from') || $location.search().from;
                var tourist = getParameterByName('tourist') || $location.search().tourist;
                var fromParam = getParameterByName('from_param') || $location.search().from_param;

                var partnerMarker = getParameterByName('PartnerMarker') || getParameterByName('partnermarker') || getParameterByName('partner_marker')
                    || $location.search().PartnerMarker || $location.search().partnermarker || $location.search().partner_marker;

                var idPartner = getParameterByName('id_partner') || $location.search().id_partner;
                var data = getParameterByName('data') || $location.search().data;

                var advParams = {
                    from: from || '',
                    tourist: tourist || '',
                    from_param: fromParam || '',
                    PartnerMarker: label || partnerMarker || '',//label перекрывает partnerMarker
                    id_partner: idPartner || '',
                    data: data || ''
                };

                delete $location.$$search.from;
                delete $location.search().tourist;
                delete $location.$$search.from_param;

                delete $location.$$search.PartnerMarker;
                delete $location.$$search.partnermarker;
                delete $location.$$search.partner_marker;

                delete $location.$$search.id_partner;
                delete $location.$$search.data;
                $location.$$compose();
                if(advParams.from || advParams.PartnerMarker){
                    console.log('advParams', advParams);
                    dataService.getPartnershipCookie(advParams);
                }

                function getParameterByName(name) {
                    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                        results = regex.exec(location.search);
                    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                }


                //partners
                if (window.partners && window.partners.partnerOperatorId && window.partners.innaOperatorId) {
                    var dataSingIn = {
                        InnaUserId: window.partners.innaOperatorId,
                        ExternalUserId: window.partners.partnerOperatorId
                    };
                    console.log('AuthDataProvider.signIn', dataSingIn);
                    AuthDataProvider.signInWL(dataSingIn,
                        function (data) { //success
                            console.log('AuthDataProvider.signIn success', data);
                            $scope.$emit(Events.AUTH_SIGN_IN, data);
                        }, function (err) { //error
                            console.log('AuthDataProvider.signIn error', err);
                        });
                }
            })();
        }]);
