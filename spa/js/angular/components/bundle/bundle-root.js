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
                        $scope.displayHotel = false;
                        $scope.displayTicket = false;
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

                            if ($scope.asMap) {
                                EventManager.fire(Events.MAP_CLOSE);
                            }

                            if ($scope.tabActive == data) return false;
                            $scope.tabActive = data;

                            setActiveTab(data);

                            EventManager.fire(Events.DYNAMIC_SERP_LOAD_TAB, data);
                        };

                        // по дефолту активный таб - hotel
                        setActiveTab('hotel');


                        if ($location.search().displayTicket) $scope.displayTicket = true;
                        if ($location.search().displayHotel) $scope.displayHotel = true;
                        if ($location.search().ticket || $location.search().hotel) {
                            $scope.isChooseHotel = true;
                        }


                        function setActiveTab(data) {
                            $scope.tabActive = data;
                            if (data == 'ticket') {
                                $scope.stateTicket = true;
                                $scope.stateHotel = false;
                            }
                            if (data == 'hotel') {
                                $scope.stateTicket = false;
                                $scope.stateHotel = true;
                            }
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
                                EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE, false);
                            }

                            this.fullDisplay = function (opt_param) {
                                if (!opt_param) doc.on('scroll', onScroll);
                                $scope.isVisible = true;
                                EventManager.fire(Events.DYNAMIC_SERP_OPEN_BUNDLE, true);
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


                        EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, function () {
                            $scope.safeApply(function () {
                                $scope.isVisible = true;
                            });
                        });

                        EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, function () {
                            $scope.safeApply(function () {
                                $scope.isVisible = false;
                            });
                        });


                        var unwatchScroll = function () {
                            doc.off('scroll', onScroll);
                        };

                        doc.on('scroll', onScroll);


                        /*Events*/
                        $scope.$on('$destroy', function () {
                            console.log('$destroy bundle root');
                            EventManager.off(Events.DYNAMIC_SERP_BUNDLE_SET_ACTIVE_TAB, $scope.toggleTab);
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