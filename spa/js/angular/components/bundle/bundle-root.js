'use strict';

angular.module('innaApp.directives')
    .directive('dynamicBundleRoot', [
        '$templateCache',
        function ($templateCache) {
            return {
                template: $templateCache.get('components/bundle/templ/bundle-root.html'),
                controller: [
                    'EventManager',
                    '$scope',
                    'aviaHelper',
                    '$location',
                    '$element',
                    'innaApp.API.events',
                    function (EventManager, $scope, aviaHelper, $location, $element, Events) {

                        $scope.isChooseHotel = null;
                        $scope.isVisible = true;
                        var doc = $(document);


                        function orientation() {
                            var ua = navigator.userAgent.toLowerCase();
                            var isAndroid = ua.indexOf("android") > -1;

                            if (isAndroid) {
                                switch (window.orientation) {
                                    case 0:
                                        EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE);
                                        break;
                                    case -90:
                                        EventManager.fire(Events.DYNAMIC_SERP_OPEN_BUNDLE);
                                        break;
                                    case 90:
                                        EventManager.fire(Events.DYNAMIC_SERP_OPEN_BUNDLE);
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                switch (window.orientation) {
                                    case 0:
                                        EventManager.fire(Events.DYNAMIC_SERP_OPEN_BUNDLE);
                                        break;
                                    case -90:
                                        EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE);
                                        break;
                                    case 90:
                                        EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }

                        setTimeout(orientation, 0);
                        window.addEventListener("orientationchange", orientation, false);

                        $scope.toggleTab = function (data) {

                            if ($scope.tabActive == data) return false;

                            $scope.tabActive = data;

                            if (data == 'ticket') {
                                $scope.stateTicket = true;
                                $scope.stateHotel = false;
                            }
                            if (data == 'hotel') {
                                $scope.stateTicket = false;
                                $scope.stateHotel = true;
                            }

                            EventManager.fire(Events.DYNAMIC_SERP_LOAD_TAB, data);
                        };

                        // по дефолту активный таб - hotel
                        $scope.toggleTab('hotel');


                        if ($location.search().displayTicket) $scope.toggleTab('ticket')
                        if ($location.search().displayHotel) $scope.toggleTab('hotel')
                        if ($location.search().ticket || $location.search().hotel) {
                            $scope.isChooseHotel = true;
                        }


                        /**
                         * Управляем состоянием - выбранного варианта
                         * Раскрывает его и скрывает
                         */
                        $scope.display = new function () {
                            var that = this;

                            this.shortDisplay = function (opt_param) {
                                if (!opt_param) unwatchScroll();
                                $scope.isVisible = false;
                            }

                            this.fullDisplay = function (opt_param) {
                                if (!opt_param) doc.on('scroll', onScroll);
                                $scope.isVisible = true;
                            }

                            this.toggle = function () {
                                var that = this;
                                if (!$scope.isVisible) {
                                    that.fullDisplay();
                                } else {
                                    that.shortDisplay();
                                }
                            }
                        };


                        EventManager.on(Events.DYNAMIC_SERP_CHOOSE_HOTEL, function (data) {
                            $scope.safeApply(function () {
                                $scope.isChooseHotel = true;
                                $scope.display.fullDisplay();
                            });
                        });

                        EventManager.on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function (data) {
                            $scope.safeApply(function () {
                                $scope.isChooseHotel = true;
                                $scope.display.fullDisplay();
                            });
                        });

                        var onScroll = function () {
                            var body = document.body || document.documentElement;

                            if (body.scrollTop >= 100) {
                                $scope.$apply(function ($scope) {
                                    $scope.display.shortDisplay(true);
                                });
                            } else {
                                $scope.$apply(function ($scope) {
                                    $scope.display.fullDisplay(true);
                                });
                            }
                        };

                        /**
                         * слушаем isVisible
                         * Кидаем события открытия и закрытия бандла
                         */
                        $scope.$watch('isVisible', function (data) {
                            if (data) {
                                EventManager.fire(Events.DYNAMIC_SERP_OPEN_BUNDLE, true);
                            } else {
                                EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE, false);
                            }
                        });

                        var unwatchScroll = function () {
                            doc.off('scroll', onScroll);
                        };

                        doc.on('scroll', onScroll);


                        /*Events*/
                        $scope.$on('$destroy', function () {
                            EventManager.off(Events.DYNAMIC_SERP_CHOOSE_HOTEL);
                            EventManager.off(Events.DYNAMIC_SERP_CHOOSE_TICKET);
                            EventManager.off(Events.DYNAMIC_SERP_CLOSE_BUNDLE);
                            EventManager.off(Events.DYNAMIC_SERP_OPEN_BUNDLE);
                            unwatchScroll();
                        });
                    }
                ]
            }
        }]);