innaAppControllers
    .controller('DynamicPackageSERPCtrl', [
        'EventManager',
        '$scope',
        'DynamicFormSubmitListener',
        'DynamicPackagesDataProvider',
        '$routeParams',
        'innaApp.API.events',
        '$location',
        'innaApp.Urls',
        'aviaHelper',

        // components

        '$templateCache',
        'Balloon',
        'HotelsList',
        function (EventManager, $scope, DynamicFormSubmitListener, ServiceDynamicPackagesDataProvider, $routeParams, Events, $location, Urls, aviaHelper, $templateCache, Balloon, HotelsList) {

            /*Private*/
            var searchParams = angular.copy($routeParams);
            var cacheKey = '';
            var serpScope = $scope;
            $scope.isChooseHotel = null;
            var MAX_HOTEL_LEN = 180;

            /*Properties*/
            var HotelsListComponent = null;
            $scope.hotels = new inna.Models.Hotels.HotelsCollection();
            $scope.airports = null;
            $scope.hotelFilters = new inna.Models.Avia.Filters.FilterSet();
            $scope.hotelToShowDetails = null;
            $scope.tickets = new inna.Models.Avia.TicketCollection();
            $scope.ticketFilters = new inna.Models.Avia.Filters.FilterSet();
            $scope.combination = new inna.Models.Dynamic.Combination();

            $scope.state = new function () {
                this.HOTELS_TAB = null;
                this.TICKETS_TAB = null;
                this.HOTEL = 'hotel';
                this.TICKET = 'ticket';

                this.HOTELS_TAB = true;

                if ($location.search().displayTicket) {
                    this.TICKETS_TAB = true;
                    this.HOTELS_TAB = false;
                }
                if ($location.search().displayHotel) {
                    this.HOTELS_TAB = true;
                    this.TICKETS_TAB = false;
                }

                this.switchTo = function (tabName) {
                    if (tabName == 'ticket') {
                        this.TICKETS_TAB = true;
                        this.HOTELS_TAB = false;
                    } else if (tabName == 'hotel') {
                        this.HOTELS_TAB = true;
                        this.TICKETS_TAB = false;
                    }

                    return loadTab();
                };

                this.isActive = function (tabName) {
                    return tabName;
                };
            };

            $scope.showLanding = true;

            if ($location.search().ticket || $location.search().hotel) {
                $scope.isChooseHotel = true;
            }

            /**
             * Изменяем класс у results-container
             * Смотри DynamicPackageSERPRecommendedBundleCtrl
             * @type {{}}
             */
            $scope.padding = {
                scrollTop: 0
            };

            $scope.passengerCount = 0;

            /*Simple proxy*/
            $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
            $scope.dateHelper = dateHelper;
            $scope.events = Events;


            // TODO : Hotel.prototype.setCurrent method is deprecated
            // Use event choose:hotel = Events.DYNAMIC_SERP_CHOOSE_HOTEL
            inna.Models.Hotels.Hotel.prototype.setCurrent = function () {
                $scope.combination.hotel = this;
                $location.search('hotel', this.data.HotelId);
            };

            EventManager.on(Events.DYNAMIC_SERP_CHOOSE_HOTEL, function (data) {
                $scope.safeApply(function () {
                    $scope.combination.hotel = data;
                    $location.search('hotel', data.data.HotelId);
                    $scope.isChooseHotel = true;
                });
            });

            EventManager.on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function (data) {
                $scope.safeApply(function () {
                    $scope.combination.ticket = data;
                    $location.search('ticket', data.data.VariantId1);
                    $scope.isChooseHotel = true;
                });
            });

            /*Methods*/
            var getHotelDetails = function (hotel, buyAction) {
                serpScope.hotelToShowDetails = hotel;
                $location.search('displayHotel', hotel.data.HotelId);

                if (buyAction) {
                    $location.search('action', 'buy');
                }

                if ($location.search().map) {
                    delete $location.$$search.map;
                    $location.$$compose();
                }


                if (!hotel.detailed) {
                    ServiceDynamicPackagesDataProvider.hotelDetails(
                        hotel.data.HotelId,
                        hotel.data.ProviderId,
                        $scope.combination.ticket.data.VariantId1,
                        $scope.combination.ticket.data.VariantId2,
                        searchParams,
                        function (resp) {
                            hotel.detailed = resp;
                            serpScope.$broadcast(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED);
                            serpScope.$digest();
                        },
                        function () { //error
                            $scope.$apply(function ($scope) {
                                hotel404();
                                $scope.hotels.drop(hotel);
                                $scope.closeHotelDetails();
                            });
                        }
                    );
                } else {
                    serpScope.$broadcast(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED);
                }
            };

            $scope.getHotelDetails = getHotelDetails;


            /**
             * Событие more:detail:hotel вызывает метод getHotelDetails
             * Переход в раздел - подробно об отеле
             */
            EventManager.on('more:detail:hotel', function (data) {
                console.log(data);
                // показать header - форма поиска перед переходом на страницу подробнее
                EventManager.fire(Events.HEADER_VISIBLE);
                if (data) getHotelDetails(data);
            });

            function loadTab() {
                var method, param, apply;
                var deferred = new $.Deferred();

                if ($scope.state.isActive($scope.state.HOTELS_TAB)) {
                    method = 'getHotelsByCombination';
                    param = $scope.combination.ticket.data.VariantId1;

                    apply = function ($scope, data) {
                        $scope.hotels.flush();

                        for (var i = 0, raw = null; raw = data.Hotels[i++];) {
                            if (!raw.HotelName) continue;
                            var hotel = new inna.Models.Hotels.Hotel(raw);
                            $scope.hotels.push(hotel);
                        }
                    };

                } else if ($scope.state.isActive($scope.state.TICKETS_TAB)) {
                    method = 'getTicketsByCombination';
                    param = $scope.combination.hotel.data.HotelId;
                    apply = function ($scope, data) {
                        $scope.tickets.flush();

                        for (var i = 0, raw = null; raw = data.AviaInfos[i++];) {
                            var ticket = new inna.Models.Avia.Ticket();
                            ticket.setData(raw);
                            $scope.tickets.push(ticket);
                        }
                    };
                }

                if (!method || !param) return;

                //console.log(param, 'param');
                ServiceDynamicPackagesDataProvider[method](param, searchParams, function (data) {

                    if (data.Hotels) {

                        HotelsListComponent = new HotelsList({
                            el: document.querySelector('.results-list'),
                            data: {
                                Hotels: data.Hotels, //[],
                                combinationModel: $scope.combination
                            }
                        });
                    } else {
                        console.log('load tickets');
                    }

                    $scope.safeApply(function () {
                        apply($scope, data);
                        $scope.$broadcast('Dynamic.SERP.Tab.Loaded');
                        $scope.baloon.hide();
                        deferred.resolve();
                    })
                });

                return deferred.promise();
            }

            function combination404() {
                $scope.baloon.showNotFound(balloonCloser);
            }

            function combination500() {
                $scope.$apply(function ($scope) {
                    $scope.baloon.showErr(
                        "Что-то пошло не так",
                        "Попробуйте начать поиск заново",
                        balloonCloser
                    );
                });
            }

            function ticket404() {
                $scope.baloon.showErr(
                    "Запрашиваемая билетная пара не найдена",
                    "Вероятно, она уже продана. Однако у нас есть множество других вариантов перелетов! Смотрите сами!",
                    function () {
                        delete $location.$$search.displayTicket
                        $location.$$compose();
                    }
                );
            }

            function hotel404() {
                $scope.baloon.showErr(
                    "Запрашиваемый отель не найден",
                    "Вероятно, комнаты в нем уже распроданы.",
                    function () {
                        delete $location.$$search.displayHotel
                        $location.$$compose();
                    }
                );
            }

            function balloonCloser() {
                $location.search({});
                $location.path(Urls.URL_DYNAMIC_PACKAGES);
            }

            function combination200(data) {
                var onTabLoad = angular.noop;
                var onTabLoadParam;
                var defaultTab = $scope.state.HOTEL;

                if (!data || !data.RecommendedPair) return $scope.$apply(combination404);

                $scope.airports = data.Airports || [];
                cacheKey = data.SearchId;

                $scope.$apply(function ($scope) {
                    $scope.combination.ticket = new inna.Models.Avia.Ticket();
                    $scope.combination.ticket.setData(data.RecommendedPair.AviaInfo);
                    $scope.combination.hotel = new inna.Models.Hotels.Hotel(data.RecommendedPair.Hotel);
                    $scope.showLanding = false;
                });

                if ($location.search().displayTicket) {
                    onTabLoad = loadTicketDetails;
                    onTabLoadParam = $location.search().displayTicket;
                    defaultTab = $scope.state.TICKET;
                } else if ($location.search().displayHotel) {
                    onTabLoad = loadHotelDetails;
                    onTabLoadParam = $location.search().displayHotel;
                    defaultTab = $scope.state.HOTEL;
                }


                $scope.$apply(function ($scope) {
                    $.when($scope.state.switchTo(defaultTab))
                        .then(function () {
                            onTabLoad(onTabLoadParam);

                            //calibrate($scope.hotels, 0);

                            $scope.baloon.hide();
                        });
                });
            }

            function loadTicketDetails(ids) {
                try {
                    var ticketIds = ids.split('_');
                    var ticket = $scope.tickets.search(ticketIds[0], ticketIds[1]);
                    if (ticket) {
                        $scope.getTicketDetails(ticket);
                    } else throw false;
                } catch (e) {
                    ticket404();
                }
            }

            function loadHotelDetails(id) {
                try {
                    var hotel = $scope.hotels.search(id);

                    if (hotel) {
                        $scope.getHotelDetails(hotel);
                    } else throw false;
                } catch (e) {
                    hotel404();
                }
            }


            $scope.closeHotelDetails = function () {
                $scope.hotelToShowDetails = null;
                delete $location.$$search.displayHotel;
                delete $location.$$search.action;
                $location.$$compose();
            };

            $scope.getTicketDetails = function (ticket) {
                $scope.$broadcast(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, ticket);
            };

            $scope.setHotel = function (hotel) {
                throw Error('NOT IMPLEMENTED! Use hote.setCurrent() or Events.DYNAMIC_SERP_CHOOSE_HOTEL instead');
            };

            $scope.setTicket = function (ticket) {
                /*$scope.combination.ticket = ticket;
                 $location.search('ticket', ticket.data.VariantId1);*/
                throw Error('NOT IMPLEMENTED! Use Events.DYNAMIC_SERP_CHOOSE_TICKET instead');
            };

            $scope.goReservation = function (room, hotel) {

                var url = Urls.URL_DYNAMIC_PACKAGES_RESERVATION + [
                    $routeParams.DepartureId,
                    $routeParams.ArrivalId,
                    $routeParams.StartVoyageDate,
                    $routeParams.EndVoyageDate,
                    $routeParams.TicketClass,
                    $routeParams.Adult,
                    $routeParams.Children
                ].join('-');


                $location.search({
                    room: room.RoomId,
                    hotel: hotel.data.HotelId,
                    ticket: $scope.combination.ticket.data.VariantId1
                });

                $location.path(url);
            };

            /*EventListener*/
            DynamicFormSubmitListener.listen();

            /*$scope.$watch('hotels', function (data) {
             //$scope.$broadcast('change:hotels:filters', data);
             }, true);*/

            $scope.$watch('hotelFilters', function (data) {
                console.log('hotelFilters', data);
                //$scope.hotels.filter($scope.hotelFilters);
                //$scope.$broadcast('change:filters', data);

                //calibrate($scope.hotels, utils.getScrollTop(), true);
            }, true);

            /*$scope.$on('Dynamic.SERP.*.Sorting', function () {
             //calibrate($scope.hotels, utils.getScrollTop(), true);
             });*/


            function getAsMap() {
                return $scope.asMap;
            }

            function setAsMap(param) {
                $scope.asMap = param;
            }


            function locatioAsMap() {
                if (!getAsMap()) {
                    delete $location.$$search.map;
                    $location.$$compose();
                } else {
                    $location.search('map', 'show');
                }
            }

            // слушаем событие от компонента отеля
            //  открываем карту с точкой этого отеля
            EventManager.on('hotel:go-to-map', function (data) {
                $scope.safeApply(function () {
                    setAsMap(1);

                    // TODO - переделать
                    // прокидываем данные глубже для дочерних компонентов
                    // так как карта инитится с задержкой видимо, и поэтому не может подписаться на событие
                    setTimeout(function () {
                        locatioAsMap();
                        $scope.$broadcast('map:show-one-hotel', data);
                    }, 1000);
                });
            });


            // прямая ссылка на карту
            setAsMap(($location.$$search.map) ? 1 : 0);


            // переход с карты на список по кнопке НАЗАД в браузере
            // работает тольео в одну сторону - назад
            $scope.$on('$locationChangeSuccess', function (data, url, datatest) {
                setAsMap(($location.search().map) ? 1 : 0);
            });

            // случаем событие переключения контрола с карты на список и обратно
            $scope.$on('toggle:view:hotels:map', function () {
                setAsMap((getAsMap()) ? 0 : 1);
                locatioAsMap();
            });

            /*Initial Data fetching*/
            (function () {
                $scope.baloon.showWithCancel('Ищем варианты', 'Поиск займет не более 30 секунд', balloonCloser);

                searchParams.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.StartVoyageDate);
                searchParams.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.EndVoyageDate);
                searchParams.Children && (searchParams.ChildrenAges = searchParams.Children.split('_'));

                $scope.passengerCount = parseInt(searchParams.Adult) + (searchParams.ChildrenAges ? searchParams.ChildrenAges.length : 0);

                if ($location.search().hotel) searchParams['HotelId'] = $location.search().hotel;
                if ($location.search().ticket) searchParams['TicketId'] = $location.search().ticket;

                ServiceDynamicPackagesDataProvider.search(searchParams, combination200, combination500);
            }());


            $scope.$on('$destroy', function () {
                console.log('$destroy serp');
                HotelsListComponent.teardown();
                HotelsListComponent = null;
                $(document).off('scroll');
            })
        }
    ])
    .controller('DynamicPackageSERPTicketPopupCtrl', [
        '$scope',
        '$element',
        '$location',
        'innaApp.API.events',
        'aviaHelper',

        // components
        'ShareLink',
        function ($scope, $element, $location, Events, aviaHelper, ShareLink) {
            $(function () {
                $(document.body).append($element);
            });


            /*Scope Properties*/
            $scope.ticket = null;
            $scope.link = '';

            /*Scope Methods*/
            $scope.closePopup = function () {
                //drop ?displayTicket = ...
                delete $location.$$search.displayTicket;
                $location.$$compose();

                $scope.ticket = null;
            };

            $scope.setCurrent = function () {
                //from parentScope
                //$scope.setTicket($scope.ticket);
                $scope.$emit(Events.DYNAMIC_SERP_CHOOSE_TICKET, $scope.ticket);

                $scope.closePopup();
            };

            $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
            $scope.dateHelper = dateHelper;

            $scope.sharePopup = new inna.Models.Aux.AttachedPopup(function () {
                $scope.link = document.location;
            });

            /*Listeners*/
            $scope.$on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, function (event, ticket) {

                $scope.ticket = ticket;

                $scope.etapsZipped = (function () {
                    var zipped = [];

                    var to = ticket.getEtaps('To');
                    var back = ticket.getEtaps('Back');

                    var maxLength = Math.max(to.length, back.length);

                    for (var i = 0; i < maxLength; i++) {
                        var eTo = to[i];
                        var eBack = back[i];

                        zipped.push([eTo, eBack]);
                    }

                    //console.log('EtapsZipped = ', zipped);

                    return zipped;
                })();

                $location.search('displayTicket', [$scope.ticket.data.VariantId1, $scope.ticket.data.VariantId2].join('_'));


                setTimeout(function () {
                    new ShareLink({
                        el: $element.find('.js-share-component'),
                        data: {
                            right: true
                        }
                    })
                }, 0)

            });
        }
    ])
    .controller('DynamicPackageSERPRecommendedBundleCtrl', [
        'EventManager',
        '$scope',
        '$element',
        'innaApp.API.events',
        '$location',
        function (EventManager, $scope, $element, Events, $location) {
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
            $scope.$on('$destroy', unwatchScroll);
        }
    ]);