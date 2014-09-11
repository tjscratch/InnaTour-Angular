innaAppControllers
    .controller('PageDynamicPackage', [
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
        'ListPanel',
        'FilterPanel',
        function (EventManager, $scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams, Events, $location, Urls, aviaHelper, $templateCache, Balloon, ListPanel, FilterPanel) {


            /**
             * Преобразуем даты и собираем данные для запроса
             * StartVoyageDate и EndVoyageDate
             * Так как в url не можем сразу передавать дату формата 2014-10-22
             * знак дефис служебный для angular
             */
            var routParam = angular.copy($routeParams);
            var searchParams = angular.extend(routParam, {
                StartVoyageDate: dateHelper.ddmmyyyy2yyyymmdd(routParam.StartVoyageDate),
                EndVoyageDate: dateHelper.ddmmyyyy2yyyymmdd(routParam.EndVoyageDate),
                HotelId: $location.search().hotel,
                TicketId: $location.search().ticket
            });

            if (routParam.Children && routParam.Children != "0") {
                searchParams.ChildrenAges = routParam.Children.split('_');
            }

            var cacheKey = '';
            $scope.hotelsRaw = null;
            $scope.hotelsForMap = null;
            $scope.padding = true;

            /*Properties*/
            var FilterPanelComponent = null;
            var ListPanelComponent = null;
            $scope.hotels = new inna.Models.Hotels.HotelsCollection();
            $scope.tickets = new inna.Models.Avia.TicketCollection();
            $scope.combination = new inna.Models.Dynamic.Combination();
            $scope.airports = null;
            $scope.showLanding = true;
            $scope.passengerCount = 0;

            /*Simple proxy*/
            $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
            $scope.dateHelper = dateHelper;
            $scope.events = Events;


            var Page = Ractive.extend({
                debug: true,
                append: true,
                el: document.querySelector('.results-container_list'), //results-body
                template: $templateCache.get('pages/page-dynamic/templ/page-dynamic.hbs.html'),

                partials: {

                },
                components: {
                    ListPanel: ListPanel
                },
                data: {
                    loadData: false,
                    TICKETS_TAB: null,
                    HOTEL: 'hotel',
                    TICKET: 'ticket',
                    HOTELS_TAB: true,
                    defaultTab: 'hotel',
                    loadHotelsData: null,
                    loadTicketsData: null
                },
                init: function () {
                    var that = this;
                    this._balloonLoad = new Balloon();

                    this.on({
                        teardown: function () {
                            if (this._balloonLoad) {
                                this._balloonLoad.teardown();
                                this._balloonLoad = null;
                            }
                            this.loadHotelsDataLoadData.cancel();
                            if (FilterPanelComponent) FilterPanelComponent.teardown();
                            if (ListPanelComponent) ListPanelComponent.teardown();
                            ListPanelComponent = FilterPanelComponent = null;
                        }
                    })

                    /** Слушаем событие изменения формы поиска */
                    DynamicFormSubmitListener.listen();

                    //this.stateTab();
                    this.getCombination();

                    $scope.passengerCount = parseInt(searchParams.Adult) + (searchParams.ChildrenAges ? searchParams.ChildrenAges.length : 0);

                    // прямая ссылка на карту
                    this.setAsMap(($location.$$search.map) ? 1 : 0);

                    // переход с карты на список по кнопке НАЗАД в браузере
                    // работает тольео в одну сторону - назад
                    this.backFromMap = $scope.$on('$locationChangeSuccess', function (data, url, datatest) {
                        that.setAsMap(($location.search().map) ? 1 : 0);
                    });


                    EventManager.on(Events.DYNAMIC_SERP_CHOOSE_HOTEL, function (data) {
                        $scope.safeApply(function () {
                            $scope.combination.hotel = data;
                            $location.search('hotel', data.data.HotelId);
                        });
                    });

                    EventManager.on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function (data) {
                        $scope.safeApply(function () {
                            $scope.combination.ticket = data;
                            $location.search('ticket', data.data.VariantId1);
                        });
                    });


                    /**
                     * переход со списка на карту
                     * срабатывает также когда переходим с карточки отеля
                     */
                    EventManager.on(Events.DYNAMIC_SERP_TOGGLE_MAP, function (data, single_hotel) {
                        $scope.safeApply(function () {
                            that.setAsMap((that.getAsMap()) ? 0 : 1);
                            that.locatioAsMap();
                            $scope.hotelsForMap = data;

                            if (single_hotel) {
                                setTimeout(function () {
                                    // прокидываем данные в карту
                                    $scope.$broadcast(Events.DYNAMIC_SERP_TOGGLE_MAP_SINGLE, single_hotel);
                                }, 1000);
                            }

                        });
                    });

                    // случаем событие переключения контрола с карты на список и обратно
                    EventManager.on(Events.DYNAMIC_SERP_BACK_TO_MAP, function (data) {
                        $scope.safeApply(function () {
                            that.setAsMap((that.getAsMap()) ? 0 : 1);
                            that.locatioAsMap();
                        })
                    });


                    /**
                     * События открытия закрытия - рекомендованного варианта
                     */
                    EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, this.changePadding.bind(this));
                    EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, this.changePadding.bind(this));


                    /**
                     * Получаем событие от innaDynamicBundle
                     * запрашиваем или отели или билеты
                     */
                    EventManager.on(Events.DYNAMIC_SERP_LOAD_TAB, function (data_tab) {
                        $scope.safeApply(function () {
                            that.loadTab(data_tab);
                        });
                    })

                    EventManager.on(Events.MAP_CLOSE, function (data_tab) {
                        that.setAsMap(0);
                        that.locatioAsMap();
                    })


                    $scope.loadHotelDetails = function (ticket) {
                        //EventManager.fire(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, ticket);
                    };

                    /**
                     * Слушаем свойства loadHotelsData и loadTicketsData
                     * Устанавливаем их после успешной загрузки отелей или билетов
                     */
                    this.loadHotelsDataLoadData = this.observe({
                        loadHotelsData: function (value) {
                            if (value) {

                                if (FilterPanelComponent) FilterPanelComponent.teardown();
                                if (ListPanelComponent) ListPanelComponent.teardown();


                                /** перезагружаем рекомендованную пару */
                                if(value.Ticket && value.Hotel) {
                                    $scope.combination.ticket = new inna.Models.Avia.Ticket();
                                    $scope.combination.ticket.setData(value.Ticket);
                                    $scope.combination.hotel = new inna.Models.Hotels.Hotel(value.Hotel);
                                }

                                that.set({
                                    iterable_hotels: true,
                                    iterable_tickets: false,
                                    Enumerable: value.Hotels,
                                    combinationModel: $scope.combination
                                });

                                FilterPanelComponent = new FilterPanel({
                                    el: document.querySelector('.recommend-bundle-container'),
                                    data: {
                                        combinationModel: $scope.combination,
                                        filtersData: value.Filters
                                    }
                                });

                                ListPanelComponent = new ListPanel({
                                    el: that.find('.b-page-dynamic'),
                                    data: {
                                        iterable_hotels: true,
                                        Enumerable: value.Hotels,
                                        combinationModel: $scope.combination
                                    }
                                });
                            }
                        },

                        'loadTicketsData': function (value) {
                            if (value) {

                                /** Выполняем это условие после того как данные загрузились */
                                if ($location.search().displayTicket) {
                                    that.loadTicketDetails($location.search().displayTicket);
                                }

                                /** перезагружаем рекомендованную пару */
                                if(value.Ticket && value.Hotel) {
                                    $scope.combination.ticket = new inna.Models.Avia.Ticket();
                                    $scope.combination.ticket.setData(value.Ticket);
                                    $scope.combination.hotel = new inna.Models.Hotels.Hotel(value.Hotel);
                                }



                                if (FilterPanelComponent) FilterPanelComponent.teardown();
                                if (ListPanelComponent) ListPanelComponent.teardown();

                                that.set({
                                    iterable_tickets: true,
                                    Enumerable: value.AviaInfos,
                                    combinationModel: $scope.combination
                                })

                                FilterPanelComponent = new FilterPanel({
                                    el: document.querySelector('.recommend-bundle-container'),
                                    data: {
                                        combinationModel: $scope.combination,
                                        filtersData: value.Filters,
                                        filter_hotel: false,
                                        filter_avia: true
                                    }
                                })

                                ListPanelComponent = new ListPanel({
                                    el: that.find('.b-page-dynamic'),
                                    data: {
                                        iterable_tickets: true,
                                        Enumerable: value.AviaInfos,
                                        combinationModel: $scope.combination
                                    }
                                });
                            }
                        }
                    }, {init: false});

                },

                /**
                 *
                 * @param {String} opt_param
                 */
                stateTab: function () {
                    if ($location.search().displayTicket || (this.get('defaultTab') == 'ticket')) {
                        this.set('TICKETS_TAB', true);
                        this.set('HOTELS_TAB', false);
                        this.set('defaultTab', 'ticket');

                    }
                    if ($location.search().displayHotel || (this.get('defaultTab') == 'hotel')) {
                        this.set('TICKETS_TAB', false);
                        this.set('HOTELS_TAB', true);
                        this.set('defaultTab', 'hotel');
                    }
                },

                /**
                 * Загрузка списка отелей
                 * Инициализирует компонент @link ListPanelComponent
                 * @returns {jQuery.Deferred}
                 */
                loadHotels: function () {
                    var that = this;

                    if (!$scope.combination.ticket.data.VariantId1) return;

                    var routeParams = angular.copy(searchParams);
                    var deferred = new $.Deferred();

                    var param = {
                        Id : $scope.combination.ticket.data.VariantId1,
                        HotelId : $scope.combination.hotel.data.HotelId,
                        TicketId : $scope.combination.ticket.data.VariantId1
                    };

                    param = angular.extend(routeParams, param);





                    if (ListPanelComponent) ListPanelComponent.wait();

                    DynamicPackagesDataProvider
                        .getHotelsByCombination(param, function (data) {
                            that.set('loadHotelsData', data);

                            if(data && data.Hotels) {
                                $scope.hotelsForMap = data.Hotels;
                            }

                            that._balloonLoad.dispose();

                            $scope.safeApply(function () {
                                $scope.hotels.flush();
                                $scope.hotelsRaw = data;

                                for (var i = 0, raw = null; raw = data.Hotels[i++];) {
                                    if (!raw.HotelName) continue;
                                    var hotel = new inna.Models.Hotels.Hotel(raw);
                                    hotel.hidden = false;
                                    hotel.data.hidden = false;
                                    hotel.currentlyInvisible = false;
                                    $scope.hotels.push(hotel);
                                }

                                $scope.$broadcast('Dynamic.SERP.Tab.Loaded');
                                deferred.resolve();
                            })
                        });

                    return deferred;
                },

                /**
                 * Загрузка списка авиа билетов
                 * Инициализирует компонент @link ListPanelComponent
                 * @returns {jQuery.Deferred}
                 */
                loadTickets: function () {
                    var that = this;
                    if (!$scope.combination.hotel.data.HotelId) return;

                    var param = {
                        Id : $scope.combination.hotel.data.HotelId,
                        HotelId : $scope.combination.hotel.data.HotelId,
                        TicketId : $scope.combination.ticket.data.VariantId1
                    }
                    var routeParams = angular.copy(searchParams);
                    var deferred = new $.Deferred();



                    param = angular.extend(routeParams, param);

                    // TODO : заглушка
                    // позже будет прелоадер
                    if (ListPanelComponent) ListPanelComponent.wait();

                    DynamicPackagesDataProvider
                        .getTicketsByCombination(param, function (data) {

                            that._balloonLoad.dispose();

                            $scope.safeApply(function () {
                                $scope.tickets.flush();
                                for (var i = 0, raw = null; raw = data.AviaInfos[i++];) {
                                    var ticket = new inna.Models.Avia.Ticket();
                                    ticket.setData(raw);
                                    $scope.tickets.push(ticket);
                                }
                                that.set('loadTicketsData', data);
                                deferred.resolve();
                            });
                        });

                    return deferred;
                },

                getCombination: function () {
                    var that = this;
                    this.balloonSearch();
                    return DynamicPackagesDataProvider.search({
                        data: searchParams,
                        success: this.combination200.bind(that),
                        error: this.combination500.bind(that)
                    });
                },

                combination200: function (data) {
                    var that = this;

                    var onTabLoadParam;

                    if (!data || !data.RecommendedPair) {
                        return this.combination404();
                    }


                    //аналитика
                    this.trackAnalyst();

                    $scope.airports = data.Airports || [];
                    cacheKey = data.SearchId;

                    $scope.$apply(function ($scope) {
                        $scope.combination.ticket = new inna.Models.Avia.Ticket();
                        $scope.combination.ticket.setData(data.RecommendedPair.AviaInfo);
                        $scope.combination.hotel = new inna.Models.Hotels.Hotel(data.RecommendedPair.Hotel);
                        $scope.showLanding = false;
                    });

                    if ($location.search().displayTicket || $location.search().display == 'tickets') {
                        onTabLoadParam = $location.search().displayTicket;
                        that.set('defaultTab', 'ticket');
                    }
                    else if ($location.search().displayHotel) {
                        onTabLoadParam = $location.search().displayHotel;
                        that.set('defaultTab', 'hotel');
                    }


                    $scope.$apply(function ($scope) {
                        that.loadTab();
                    });
                },

                combination404: function () {
                    var that = this;
                    //аналитика
                    track.noResultsDp();


                    this._balloonLoad.updateView({
                        template: 'not-found.html',
                        callbackClose: function () {
                            that.balloonCloser();
                        }
                    });
                },

                combination500: function () {
                    var that = this;
                    this._balloonLoad.updateView({
                        template: 'err.html',
                        title: 'Что-то пошло не так',
                        content: 'Попробуйте начать поиск заново',
                        callbackClose: function () {
                            that.balloonCloser();
                        },
                        callback: function () {
                            that.balloonCloser();
                        }
                    })
                },

                loadTab: function (data_tab) {
                    var that = this;

                    if (data_tab) this.set('defaultTab', data_tab);

                    this.stateTab();

                    if (this.get('HOTELS_TAB'))
                        return this.loadHotels();
                    else if (this.get('TICKETS_TAB'))
                        return this.loadTickets();
                },

                getAsMap: function () {
                    return $scope.asMap;
                },

                setAsMap: function (param) {
                    $scope.asMap = param;
                },

                closeMap: function () {
                    this.setAsMap(0);
                    delete $location.$$search.map;
                    $location.$$compose();
                },

                locatioAsMap: function () {
                    if (!this.getAsMap()) {
                        this.closeMap();
                    } else {
                        $location.search('map', 'show');
                    }
                },

                balloonCloser: function () {
                    $location.search({});
                    $location.path(Urls.URL_DYNAMIC_PACKAGES);
                },

                balloonSearch: function () {
                    var that = this;

                    this._balloonLoad.updateView({
                        template: 'search.html',
                        callbackClose: function () {
                            that.balloonCloser();
                        },
                        callback: function () {
                            that.balloonCloser();
                        }
                    })
                },


                /*--------TICKET DETAILS---------*/
                /**
                 * Если есть параметр в url displayTicket,
                 * то загружаем tab ticket и поднимаем попап подробнее об этом билете
                 * @param ticket
                 */
                getTicketDetails: function (ticket) {
                    EventManager.fire(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, null, ticket);
                },

                loadTicketDetails: function (ids) {
                    var that = this;

                    if (!ids) return;

                    try {
                        //dfdf;
                        var ticketIds = ids.split('_');
                        var ticket = $scope.tickets.search(ticketIds[0], ticketIds[1]);
                        if (ticket) {
                            this.getTicketDetails(ticket);
                        } else throw false;
                    } catch (e) {
                        this.ticket404();
                    }
                },

                ticket404: function () {
                    var that = this;

                    $scope.baloon.showErr(
                        "Запрашиваемая билетная пара <br/> не найдена",
                        "Вероятно, она уже продана. Однако у нас есть множество других вариантов перелетов! Смотрите сами!",
                        function () {
                            delete $location.$$search.displayTicket
                            $location.$$compose();
                        }
                    );
                },

                /*--------TICKET DETAILS---------*/
                trackAnalyst: function () {
                    var trackKey = $location.url();
                    if (track.isTrackSuccessResultAllowed(track.dpKey, trackKey)) {
                        track.successResultsDp(track.dpKey);
                        //console.log('analitics: dp success result');
                        track.denyTrackSuccessResult(track.dpKey, trackKey);
                    }
                },

                /**
                 * Изменяем класс у results-container
                 */
                changePadding: function (data) {
                    $scope.safeApply(function () {
                        $scope.padding = data;
                    });
                }

            });

            var PageDynamic = new Page();


            $scope.$on('$destroy', function () {
                PageDynamic.backFromMap();
                EventManager.off(Events.DYNAMIC_SERP_BACK_TO_MAP);
                EventManager.off(Events.DYNAMIC_SERP_CHOOSE_HOTEL);
                EventManager.off(Events.DYNAMIC_SERP_CHOOSE_TICKET);
                EventManager.off(Events.DYNAMIC_SERP_TOGGLE_MAP);
                EventManager.off(Events.MAP_CLOSE);
                EventManager.off(Events.DYNAMIC_SERP_LOAD_TAB);
                EventManager.off(Events.DYNAMIC_SERP_CLOSE_BUNDLE, PageDynamic.changePadding);
                EventManager.off(Events.DYNAMIC_SERP_OPEN_BUNDLE, PageDynamic.changePadding);

                PageDynamic.teardown();
                PageDynamic = null;

                if (FilterPanelComponent) {
                    FilterPanelComponent.teardown();
                    FilterPanelComponent = null;
                }
                if (ListPanelComponent) {
                    ListPanelComponent.teardown();
                    ListPanelComponent = null;
                }

                $(document).off('scroll');
            })
        }
    ]);
