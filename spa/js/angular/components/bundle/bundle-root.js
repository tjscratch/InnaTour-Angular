'use strict';

angular.module('innaApp.directives')
    .directive('dynamicBundleRoot', [
        '$templateCache',
        'DynamicPackagesDataProvider',
        '$routeParams',
        '$q',
        function ($templateCache, DynamicPackagesDataProvider, $routeParams, $q) {
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

                        $scope.toggleTab = function (data) {

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
                        if ($location.search().displayTicket) {
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

                        /*function getHotelDetails() {
                            var deferred = $q.defer();

                            DynamicPackagesDataProvider.hotelDetails({
                                HotelId: $scope.combination.hotel.data.HotelId,
                                HotelProviderId: $scope.combination.hotel.data.ProviderId,
                                TicketToId: $scope.combination.ticket.data.VariantId1,
                                TicketBackId: $scope.combination.ticket.data.VariantId2,
                                Filter: routParam,

                                success: function (data) {
                                    deferred.resolve();
                                },
                                error: function () { //error
                                    deferred.reject();
                                }
                            });

                            return deferred.promise;
                        };*/



                        /**
                         * Управляем состоянием - выбранного варианта
                         * Раскрывает его и скрывает
                         */
                        $scope.display = new function () {
                            var that = this;

                            this.shortDisplay = function (opt_param) {
                                if(!timeOutCloseBundle) {
                                    if (!opt_param) unwatchScroll();
                                    $scope.isVisible = false;
                                    EventManager.fire(Events.DYNAMIC_SERP_CLOSE_BUNDLE, false);
                                }
                            }

                            this.fullDisplay = function (opt_param) {
                                if (!opt_param) doc.on('scroll', onScroll);

                                timeOutCloseBundle = setTimeout(function(){
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
                                $scope.isChooseHotel = true;
                                $scope.display.fullDisplay();
                                //getHotelDetails();
                            });
                        });

                        EventManager.on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function (data) {
                            $scope.safeApply(function () {
                                $scope.isChooseHotel = true;
                                $scope.display.fullDisplay();
                            });
                        });

                        var onScroll = function () {
                            scroll = true;
                            var body = document.body || document.documentElement;

                            if (body.scrollTop >= 200) {
                                $scope.$apply(function ($scope) {
                                    $scope.display.shortDisplay(true);
                                });
                            } else {
                                $scope.$apply(function ($scope) {
                                    $scope.display.fullDisplay(true);
                                });
                            }
                        };

                        function openBundle(){
                            $scope.safeApply(function () {
                                $scope.isVisible = true;
                            });
                        }

                        function closeBundle(){
                            $scope.safeApply(function () {
                                $scope.isVisible = false;
                            });
                        }


                        EventManager.on(Events.DYNAMIC_SERP_MAP_DESTROY, $scope.display.fullDisplay);
                        EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, openBundle);
                        EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, closeBundle);


                        var unwatchScroll = function () {
                            doc.off('scroll', onScroll);
                            scroll = false;
                        };

                        function filtersLoadDone(data){
                            if(data.length < 10 && scroll) {
                                unwatchScroll();
                            } else if(data.length > 10 && !scroll) {
                                doc.on('scroll', onScroll);
                            }
                        }

                        function filtersPanelReset(){
                            if(!scroll) doc.on('scroll', onScroll);
                        }

                        doc.on('scroll', onScroll);

                        EventManager.on(Events.LIST_PANEL_FILTES_HOTELS_DONE, filtersLoadDone);
                        EventManager.on(Events.FILTER_PANEL_RESET, filtersPanelReset);


                        /*Events*/
                        $scope.$on('$destroy', function () {
                            console.log('$destroy bundle root');
                            EventManager.off(Events.DYNAMIC_SERP_MAP_DESTROY, $scope.display.fullDisplay);
                            EventManager.off(Events.DYNAMIC_SERP_CHOOSE_HOTEL);
                            EventManager.off(Events.DYNAMIC_SERP_CHOOSE_TICKET);
                            EventManager.off(Events.DYNAMIC_SERP_OPEN_BUNDLE, openBundle);
                            EventManager.off(Events.DYNAMIC_SERP_CLOSE_BUNDLE, closeBundle);
                            EventManager.off(Events.LIST_PANEL_FILTES_HOTELS_DONE, filtersLoadDone);
                            EventManager.off(Events.FILTER_PANEL_RESET, filtersPanelReset);
                            //EventManager.off(Events.DYNAMIC_SERP_CHOOSE_HOTEL, getHotelDetails);
                            unwatchScroll();
                        });
                    }
                ]
            }
        }]);