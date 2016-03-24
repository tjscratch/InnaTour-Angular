'use strict';

// old name dynamicBundleRoot
angular.module('innaApp.directives').directive('recommendedPairComponent', function ($templateCache,
                                                                                     DynamicPackagesDataProvider,
                                                                                     $routeParams,
                                                                                     $animate,
                                                                                     $timeout) {
    return {
        template: $templateCache.get('components/recommended-pair/templ/recommended-root.html'),
        controller: [
            'EventManager',
            '$scope',
            'aviaHelper',
            '$location',
            '$element',
            'innaAppApiEvents',
            function (EventManager, $scope, aviaHelper, $location, $element, Events) {

                $scope.isChooseHotel = null;
                $scope.isVisible = true;
                $scope.isClosed = false;
                $scope.displayHotel = false;
                $scope.displayTicket = false;

                var scroll = false;
                var doc = $(document);
                var timeOutCloseBundle = null;
                var routParam = angular.copy($routeParams);

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

                //setTimeout(orientation, 0);
                //window.addEventListener("orientationchange", orientation, false);

                $scope.toggleTab = function (data, event) {
                    event.stopPropagation();
                    //preventBubbling(event);
                    if ($scope.asMap) {
                        EventManager.fire(Events.MAP_CLOSE);
                    }

                    if ($scope.tabActive == data) return false;
                    setActiveTab(data);

                    EventManager.fire(Events.DYNAMIC_SERP_LOAD_TAB, data);
                };


                /**
                 * Выставляем активный таб
                 * подефолту активный таб - hotel
                 */
                if ($location.search().displayTicket || $location.search().display == 'tickets') {
                    setActiveTab('ticket');
                    $scope.displayTicket = true;
                }
                else if ($location.search().displayHotel) {
                    setActiveTab('hotel');
                    $scope.displayHotel = true;
                }
                else {
                    setActiveTab('hotel');
                }


                $scope.monitorRecommendedChange = function () {
                    var isChooseHotel = true;
                    //если выбран отличный от рекомендованного варианта - проставляем флаг
                    if ($location.search().ticket || $location.search().hotel) {
                        if ($scope.defaultRecommendedPair &&
                            $scope.defaultRecommendedPair.HotelId == $location.search().hotel &&
                            $scope.defaultRecommendedPair.TicketId == $location.search().ticket
                        )
                            isChooseHotel = false;

                        //if ($scope.defaultRecommendedPair){
                        //    console.log('recommended hotel', $scope.defaultRecommendedPair.HotelId, 'from url', $location.search().hotel);
                        //}
                    }
                    $scope.isChooseHotel = isChooseHotel;
                };


                $scope.$root.$on('$locationChangeSuccess', function () {
                    //console.log('$locationChangeSuccess');
                    $scope.monitorRecommendedChange();
                });

                $scope.$watch('defaultRecommendedPair', function (val) {
                    //console.log('defaultRecommendedPair val', val);
                    $scope.monitorRecommendedChange();
                });

                function setActiveTab(data) {
                    $scope.tabActive = data;
                    if (data == 'ticket') {
                        $location.search('display', 'tickets');
                        $scope.stateTicket = true;
                        $scope.stateHotel = false;
                    }
                    if (data == 'hotel') {
                        delete $location.$$search.display;
                        $location.$$compose();

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
                        if (!timeOutCloseBundle) {
                            if (!opt_param) unwatchScroll();
                            $scope.isVisible = false;
                            EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE, false);
                        }
                    }

                    this.fullDisplay = function (opt_param) {
                        if (!opt_param) doc.on('scroll', onScroll);

                        timeOutCloseBundle = setTimeout(function () {
                            clearTimeout(timeOutCloseBundle);
                            timeOutCloseBundle = null;
                        }, 1000);

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
                        $animate.addClass('.recommended-pair', 'hotel-loading');
                        $timeout(function () {
                            $animate.removeClass('.recommended-pair', 'hotel-loading')
                        }, 500);
                        $scope.display.fullDisplay();
                    });
                });

                EventManager.on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function (data) {
                    $scope.safeApply(function () {

                        $animate.addClass('.recommended-pair', 'ticket-loading');
                        $timeout(function () {
                            $animate.removeClass('.recommended-pair', 'ticket-loading')
                        }, 500);

                        // TODO : заменяем дату заезда  в отель
                                // ToDo: дату заезда берем из поля CheckIn  билета, хз насколько это клево
                                // так как при выборе другого авиа билета может измениться дата прилета
                                $scope.recommendedPair.hotel.data.CheckIn = $scope.recommendedPair.ticket.data.CheckIn;
                                $scope.recommendedPair.hotel.data.CheckOut = $scope.recommendedPair.ticket.data.HotelCheckOut;


                                // пересчитываем количество ночей
                                var start = moment($scope.recommendedPair.hotel.data.CheckIn);
                                var end   = moment($scope.recommendedPair.hotel.data.CheckOut);
                                $scope.recommendedPair.hotel.data.NightCount = Math.ceil(end.diff(start,  'days', true));

                        //console.info(Math.ceil(end.diff(start,  'days', true)));


                        $scope.display.fullDisplay();
                    });
                });

                var onScroll = function () {
                    scroll = true;
                    var scrollTop = utils.getScrollTop();

                    if (scrollTop >= 200) {
                        $scope.display.shortDisplay(true);
                    } else {
                        $scope.display.fullDisplay(true);
                    }
                };

                function openBundle() {
                    $scope.safeApply(function () {
                        $scope.isVisible = true;
                    });
                }

                function closeBundle() {
                    $scope.safeApply(function () {
                        $scope.isVisible = false;
                        $scope.isClosed = true;
                    });
                }


                EventManager.on(Events.DYNAMIC_SERP_MAP_DESTROY, $scope.display.fullDisplay);
                EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, openBundle);
                EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, closeBundle);


                var unwatchScroll = function () {
                    doc.off('scroll', onScroll);
                    scroll = false;
                };

                doc.on('scroll', onScroll);


                /**
                 * IN-5387
                 * показ блока с ценой за человека
                 */
                $scope.CostPerPersonShow = true;


                /*Events*/
                $scope.$on('$destroy', function () {
                    EventManager.off(Events.DYNAMIC_SERP_MAP_DESTROY, $scope.display.fullDisplay);
                    EventManager.off(Events.DYNAMIC_SERP_CHOOSE_HOTEL);
                    EventManager.off(Events.DYNAMIC_SERP_CHOOSE_TICKET);
                    EventManager.off(Events.DYNAMIC_SERP_OPEN_BUNDLE, openBundle);
                    EventManager.off(Events.DYNAMIC_SERP_CLOSE_BUNDLE, closeBundle);
                    unwatchScroll();
                });
            }
        ]
    }
});
