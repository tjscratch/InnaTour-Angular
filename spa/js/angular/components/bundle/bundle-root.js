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

                        function orientation() {
                            var ua = navigator.userAgent.toLowerCase();
                            var isAndroid = ua.indexOf("android") > -1;

                            if (isAndroid) {
                                switch (window.orientation) {
                                    case 0:
                                        $scope.$emit(Events.DYNAMIC_SERP_SET_CLOSE_BUNDLE);
                                        break;
                                    case -90:
                                        $scope.$emit(Events.DYNAMIC_SERP_SET_OPEN_BUNDLE);
                                        break;
                                    case 90:
                                        $scope.$emit(Events.DYNAMIC_SERP_SET_OPEN_BUNDLE);
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                switch (window.orientation) {
                                    case 0:
                                        $scope.$emit(Events.DYNAMIC_SERP_SET_OPEN_BUNDLE);
                                        break;
                                    case -90:
                                        $scope.$emit(Events.DYNAMIC_SERP_SET_CLOSE_BUNDLE);
                                        break;
                                    case 90:
                                        $scope.$emit(Events.DYNAMIC_SERP_SET_CLOSE_BUNDLE);
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


                        /*DOM*/
                        var doc = $(document);
                        $scope.isVisible = true;


                        /**
                         * слушаем isVisible
                         * Кидаем события открытия и закрытия бандла
                         */
                        $scope.$watch('isVisible', function (data) {
                            if (data) {
                                EventManager.fire(Events.DYNAMIC_SERP_OPEN_BUNDLE);
                            } else {
                                EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE);
                            }
                        });


                        $scope.$root.$on(Events.DYNAMIC_SERP_CHOOSE_HOTEL, function (evt, data) {
                            $scope.display.fullDisplay();
                        });
                        $scope.$root.$on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function (evt, data) {
                            $scope.display.fullDisplay();
                        });


                        // Ractive Events
                        EventManager.on(Events.DYNAMIC_SERP_CHOOSE_HOTEL, function (data) {
                            $scope.safeApply(function () {
                                $scope.display.fullDisplay();
                            });
                        });

                        EventManager.on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function (data) {
                            $scope.safeApply(function () {
                                $scope.display.fullDisplay();
                            });
                        });

                        EventManager.on(Events.DYNAMIC_SERP_SET_CLOSE_BUNDLE, function () {
                            $scope.safeApply(function () {
                                $scope.display.shortDisplay();
                            });
                        });

                        // подписываемся на событие toggle:visible:bundle
                        // скрываем бандл вместе с шапкой
                        $scope.$root.$on(Events.DYNAMIC_SERP_SET_CLOSE_BUNDLE, function () {
                            $scope.display.shortDisplay();
                        });

                        $scope.$root.$on(Events.DYNAMIC_SERP_SET_OPEN_BUNDLE, function () {
                            $scope.display.fullDisplay();
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

                        var unwatchScroll = function () {
                            doc.off('scroll', onScroll);
                        };

                        doc.on('scroll', onScroll);


                        /*Properties*/
                        $scope.display = new function () {
                            var that = this;
                            this.FULL = 1;
                            this.SHORT = 2;

                            this.current = this.FULL;

                            this.isCurrent = function (display) {
                                return this.current == display;
                            }

                            this.setCurrent = function (display) {
                                this.current = display;
                            }

                            function changeParentScopePadding(param) {
                                (param == 2) ?
                                    $scope.padding.value = true :
                                    $scope.padding.value = false

                            }

                            this.shortDisplay = function (opt_param) {
                                if (!opt_param)
                                    unwatchScroll();

                                this.current = this.SHORT;
                                changeParentScopePadding(this.current);
                                $scope.isVisible = false;
                            }

                            this.fullDisplay = function (opt_param) {
                                if (!opt_param)
                                    doc.on('scroll', onScroll);
                                this.current = this.FULL;
                                changeParentScopePadding(this.current);
                                $scope.isVisible = true;
                            }

                            this.toggle = function () {
                                var that = this;
                                if (this.isCurrent(this.FULL)) {
                                    that.shortDisplay()
                                }
                                else {
                                    that.fullDisplay();
                                }
                            }
                        };

                        /*Events*/
                        $scope.$on('$destroy', function () {
                            EventManager.off(Events.DYNAMIC_SERP_CHOOSE_HOTEL);
                            EventManager.off(Events.DYNAMIC_SERP_CHOOSE_TICKET);
                            EventManager.off(Events.DYNAMIC_SERP_SET_CLOSE_BUNDLE);
                            unwatchScroll();
                        });
                    }
                ]
            }
        }]);