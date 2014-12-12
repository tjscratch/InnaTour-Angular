'use strict';
innaAppControllers
    .controller('PageDynamicPackage', [
        'RavenWrapper',
        'EventManager',
        '$scope',
        '$rootScope',
        'DynamicFormSubmitListener',
        'DynamicPackagesDataProvider',
        '$routeParams',
        '$anchorScroll',
        'innaApp.API.events',
        '$location',
        'innaApp.Urls',
        'aviaHelper',


        // components

        '$templateCache',
        'Balloon',
        'ListPanel',
        '$filter',

        'ModelRecommendedPair',
        'ModelHotelsCollection',
        'ModelTicketsCollection',
        'ModelTicket',
        'ModelHotel',
        function (RavenWrapper, EventManager, $scope, $rootScope, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams, $anchorScroll, Events, $location, Urls, aviaHelper, $templateCache, Balloon, ListPanel, $filter,
                  ModelRecommendedPair, ModelHotelsCollection, ModelTicketsCollection, ModelTicket, ModelHotel) {

            Raven.setExtraContext({key: "__SEARCH_DP_CONTEXT__"});

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

            if (routParam.Children) {
                searchParams.ChildrenAges = routParam.Children.split('_');
            }


            $scope.hotelsRaw = null;
            $scope.hotelsForMap = null;
            $scope.padding = true;


            /*Properties*/
            var ListPanelComponent = null;
            $scope.hotels = new ModelHotelsCollection();
            $scope.tickets = new ModelTicketsCollection();
            $scope.recommendedPair = new ModelRecommendedPair();
            $scope.airports = null;
            $scope.showLanding = true;
            $scope.passengerCount = 0;

            /*Simple proxy*/
            $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
            $scope.dateHelper = dateHelper;
            $scope.events = Events;
            $scope.filtersSettingsHotels = null;
            $scope.filtersSettingsTicket = null;

            //кнопка нового поиска для WL
            function setWlModel(data) {
                $scope.WlNewSearchModel = new inna.Models.WlNewSearch({
                    dateFilter: $filter("date"),
                    from: data.RecommendedPair.AviaInfo.CityFrom,
                    to: data.RecommendedPair.AviaInfo.CityTo,
                    start: searchParams.StartVoyageDate,
                    end: searchParams.EndVoyageDate,
                    passengerCount: parseInt(searchParams.Adult) + (searchParams.ChildrenAges ? searchParams.ChildrenAges.length : 0),
                    ticketClass: searchParams.TicketClass
                });
            }

            $scope.recommendedPairStatus = 1;

            var Page = Ractive.extend({
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
                    loadTicketsData: null,
                    updateHotel: false,
                    updateTicket: false
                },
                onrender: function () {
                    var that = this;
                    this._balloonLoad = new Balloon();

                    this.on({
                        teardown: function () {
                            if (this._balloonLoad) {
                                this._balloonLoad.teardown();
                                this._balloonLoad = null;
                            }
                            this.loadHotelsDataLoadData.cancel();
                            if (ListPanelComponent) ListPanelComponent.teardown();
                            ListPanelComponent = null;
                        }
                    })

                    /** Слушаем событие изменения формы поиска */
                    DynamicFormSubmitListener.listen();


                    // загружаем или отели или билеты
                    if ($location.search().displayTicket || $location.search().display == 'tickets')
                        this.set('defaultTab', 'ticket');
                    else if ($location.search().displayHotel)
                        this.set('defaultTab', 'hotel');

                    this.balloonSearch();
                    this.loadTab();

                    $scope.passengerCount = parseInt(searchParams.Adult) + (searchParams.ChildrenAges ? searchParams.ChildrenAges.length : 0);

                    // переход с карты на список по кнопке НАЗАД в браузере
                    // работает тольео в одну сторону - назад
                    this.backFromMap = $scope.$on('$locationChangeSuccess', function (data, url, datatest) {
                        that.setAsMap(($location.search().map) ? 1 : 0);
                    });


                    EventManager.on(Events.DYNAMIC_SERP_CHOOSE_HOTEL, function (data) {
                        $scope.safeApply(function () {
                            $scope.recommendedPair.setHotel(data);
                            $location.search('hotel', data.data.HotelId);
                        });
                    });

                    EventManager.on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function (data) {
                        $scope.safeApply(function () {
                            $scope.recommendedPair.setTicket(data);
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

                    };

                    /**
                     * Слушаем свойства loadHotelsData и loadTicketsData
                     * Устанавливаем их после успешной загрузки отелей или билетов
                     */
                    this.loadHotelsDataLoadData = this.observe({
                        loadHotelsData: function (value) {
                            if (value) {


                                // рекомендованный вариант
                                this.getCombination(value);


                                if (ListPanelComponent) {
                                    ListPanelComponent.teardown();
                                    ListPanelComponent = null;
                                }


                                that.set({
                                    iterable_hotels: true,
                                    iterable_tickets: false,
                                    Enumerable: value.Hotels,
                                    combinationModel: $scope.recommendedPair
                                });


                                /* данный для настроек панели фильтров */
                                $scope.filtersSettingsHotels = {
                                    combinationModel: $scope.recommendedPair,
                                    filtersData: value.Filters,
                                    Collection: value.Hotels,
                                    filter_hotel: true,
                                    filter_avia: false
                                };

                                // прямая ссылка на карту
                                // показываем только после загрузки данных для отелей и фильтров
                                that.setAsMap(($location.$$search.map) ? 1 : 0);

                                ListPanelComponent = new ListPanel({
                                    el: that.find('.b-page-dynamic'),
                                    data: {
                                        updateHotel: this.get('updateHotel'),
                                        iterable_hotels: true,
                                        Enumerable: value.Hotels,
                                        combinationModel: $scope.recommendedPair
                                    }
                                });

                                this.set('updateHotel', true);
                            }
                        },

                        loadTicketsData: function (value) {
                            if (value) {
                                // рекомендованный вариант
                                this.getCombination(value);

                                /** Выполняем это условие после того как данные загрузились */
                                if ($location.search().displayTicket) {
                                    that.loadTicketDetails($location.search().displayTicket);
                                }


                                if (ListPanelComponent) {
                                    ListPanelComponent.teardown();
                                    ListPanelComponent = null;
                                }

                                that.set({
                                    iterable_tickets: true,
                                    Enumerable: value.AviaInfos,
                                    combinationModel: $scope.recommendedPair
                                })


                                ListPanelComponent = new ListPanel({
                                    el: that.find('.b-page-dynamic'),
                                    data: {
                                        updateTicket: this.get('updateTicket'),
                                        iterable_tickets: true,
                                        Enumerable: value.AviaInfos,
                                        combinationModel: $scope.recommendedPair
                                    }
                                });


                                /* данный для настроек панели фильтров */
                                $scope.filtersSettingsTicket = {
                                    combinationModel: $scope.recommendedPair,
                                    Collection: value.AviaInfos,
                                    filtersData: value.Filters,
                                    filter_hotel: false,
                                    filter_avia: true
                                };

                                this.set('updateTicket', true);
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

                getIdCombination: function () {


                    var routeParams = angular.copy(searchParams);
                    var HotelId = ($scope.recommendedPair.hotel) ? $scope.recommendedPair.hotel.data.HotelId : null;
                    var TicketId = ($scope.recommendedPair.ticket) ? $scope.recommendedPair.ticket.data.VariantId1 : null;
                    var params = {};

                    if (!HotelId) HotelId = routeParams.hotel;
                    if (!TicketId) TicketId = routeParams.ticket;


                    params = {
                        HotelId: HotelId || null,
                        TicketId: TicketId || null,
                        AddFilter: true
                    };
                    params = angular.extend(routeParams, params);

                    return {
                        HotelId: HotelId || null,
                        TicketId: TicketId || null,
                        params : params
                    }
                },

                /**
                 * Загрузка списка отелей
                 * Инициализирует компонент @link ListPanelComponent
                 * @returns {jQuery.Deferred}
                 */
                loadHotels: function () {
                    var that = this;

                    var deferred = new $.Deferred();

                    if (ListPanelComponent) ListPanelComponent.wait();

                    DynamicPackagesDataProvider
                        .getHotelsByCombination({
                            // параметры
                            data: this.getIdCombination().params,
                            success: function (data) {
                                that.set('loadHotelsData', data);

                                if (data && !angular.isUndefined(data.Hotels)) {

                                    $scope.safeApply(function () {
                                        $scope.hotelsForMap = data.Hotels;
                                    });

                                    $scope.safeApply(function () {
                                        $scope.hotels.flush();
                                        $scope.hotelsRaw = data;

                                        for (var i = 0, raw = null; raw = data.Hotels[i++];) {
                                            if (!raw.HotelName) continue;
                                            var hotel = new ModelHotel(raw);
                                            hotel.hidden = false;
                                            hotel.data.hidden = false;
                                            hotel.currentlyInvisible = false;
                                            $scope.hotels.push(hotel);
                                        }

                                        $scope.$broadcast('Dynamic.SERP.Tab.Loaded');
                                        deferred.resolve();
                                    })
                                    that._balloonLoad.dispose();
                                } else {
                                    that.combination404()
                                    deferred.reject();
                                    RavenWrapper.raven({
                                        captureMessage : 'SEARCH PACKAGES: ERROR - [Hotels empty]',
                                        dataResponse: data,
                                        dataRequest: that.getIdCombination().params
                                    });
                                }
                            },
                            error: function (data) {
                                that.serverError500(data);
                                deferred.reject();
                            }

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
                    var deferred = new $.Deferred();


                    // TODO : заглушка
                    // позже будет прелоадер
                    if (ListPanelComponent) ListPanelComponent.wait();

                    DynamicPackagesDataProvider
                        .getTicketsByCombination({
                            // параметры
                            data: this.getIdCombination().params,
                            success: function (data) {

                                if(!data || angular.isUndefined(data.AviaInfos) || !data.AviaInfos.length) {
                                    RavenWrapper.raven({
                                        captureMessage : 'SEARCH PACKAGES AVIA: ERROR - AviaInfos',
                                        dataResponse: data,
                                        dataRequest: that.getIdCombination().params
                                    });
                                    that.combination404()
                                    deferred.reject();
                                } else {
                                    that._balloonLoad.dispose();
                                    $scope.safeApply(function () {
                                        $scope.tickets.flush();
                                        for (var i = 0, raw = null; raw = data.AviaInfos[i++];) {
                                            var ticket = new ModelTicket();
                                            ticket.setData(raw);
                                            $scope.tickets.push(ticket);
                                        }
                                        that.set('loadTicketsData', data);
                                        deferred.resolve();
                                    });
                                }
                            },
                            error: function (data) {
                                that.serverError500(data);
                            }

                        });

                    return deferred;
                },


                /**
                 * Получаем рекомендованный вариант
                 * @param data
                 * @returns {*}
                 */
                getCombination: function (data) {
                    var RecommendedPair = data.RecommendedPair;

                    if (!data || !RecommendedPair)
                        return this.combination404();


                    $scope.recommendedPairStatus = (RecommendedPair.Status) ? RecommendedPair.Status : 1;
                    //аналитика
                    this.trackAnalyst();

                    $scope.airports = data.Airports || [];

                    $scope.safeApply(function () {
                        //кнопка нового поиска для WL
                        setWlModel(data);

                        $location.search('hotel', RecommendedPair.Hotel.HotelId);
                        $location.search('ticket', RecommendedPair.AviaInfo.VariantId1);

                        $scope.recommendedPair.setTicket(new ModelTicket(RecommendedPair.AviaInfo));
                        $scope.recommendedPair.setHotel(new ModelHotel(RecommendedPair.Hotel));
                        $scope.showLanding = false;
                    });

                },

                combination404: function () {
                    var that = this;
                    //аналитика
                    track.noResultsDp();

                    this._balloonLoad.updateView({
                        template: 'not-found.html',
                        title: 'Мы ничего не нашли',
                        content: 'Попробуйте изменить условия поиска',
                        callbackClose: function () {
                            that.balloonCloser();
                        }
                    });
                },

                serverError500: function (data) {
                    RavenWrapper.raven({
                        captureMessage : 'SEARCH PACKAGES: SERVER ERROR',
                        dataResponse: data.responseJSON,
                        dataRequest: this.getIdCombination().params
                    });

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
                            //аналитика
                            track.dpSearchInterrupted();

                            that.balloonCloser();
                        },
                        callback: function () {
                            //аналитика
                            track.dpSearchInterrupted();

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
                    $scope.$broadcast(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, {ticket: ticket})
                },

                loadTicketDetails: function (ids) {
                    var that = this;

                    if (!ids) return;

                    try {
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

                if (ListPanelComponent) {
                    ListPanelComponent.teardown();
                    ListPanelComponent = null;
                }

                $(document).off('scroll');
            })
        }
    ]);
