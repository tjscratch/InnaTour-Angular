innaAppControllers
    .controller('PageDynamicPackage', [
        'EventManager',
        '$scope',
        '$q',
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
        function (EventManager, $scope, $q, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams, Events, $location, Urls, aviaHelper, $templateCache, Balloon, ListPanel, FilterPanel) {

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
            $scope.airports = null;
            $scope.hotelFilters = new inna.Models.Avia.Filters.FilterSet();
            $scope.tickets = new inna.Models.Avia.TicketCollection();
            $scope.ticketFilters = new inna.Models.Avia.Filters.FilterSet();
            $scope.combination = new inna.Models.Dynamic.Combination();
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
                    //ListPanel: ListPanel
                },
                data: {
                    loadData: false,
                    TICKETS_TAB: null,
                    HOTEL: 'hotel',
                    TICKET: 'ticket',
                    HOTELS_TAB: true,
                    loadHotelsData : null,
                    loadTicketsData : null
                },
                init: function () {
                    var that = this;

                    this.on({
                        change: function () {}
                    })

                    /** Слушаем событие изменения формы поиска */
                    DynamicFormSubmitListener.listen();

                    this.stateTab();
                    this.getCombination();

                    $scope.baloon.showWithCancel('Ищем варианты', 'Поиск займет не более 30 секунд', this.balloonCloser);
                    $scope.passengerCount = parseInt(searchParams.Adult) + (searchParams.ChildrenAges ? searchParams.ChildrenAges.length : 0);

                    // прямая ссылка на карту
                    this.setAsMap(($location.$$search.map) ? 1 : 0);

                    $scope.goMap = function () {
                        $scope.$emit('toggle:view:hotels:map');
                    }

                    // переход с карты на список по кнопке НАЗАД в браузере
                    // работает тольео в одну сторону - назад
                    $scope.$on('$locationChangeSuccess', function (data, url, datatest) {
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
                            $scope.hotelsForMap = data

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


                    $scope.getTicketDetails = function (ticket) {
                        EventManager.fire(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, ticket);
                    };

                    $scope.loadHotelDetails = function (ticket) {
                        //EventManager.fire(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, ticket);
                    };




                    /*-------------------------------------------------------*/
                    /*-------------------------------------------------------*/
                    /*-------------------------------------------------------*/
                    /*-------------------------------------------------------*/
                    /*-------------------------------------------------------*/
                    /*-------------                              ------------*/
                    /*-------------                              ------------*/
                    /*-------------                              ------------*/
                    /*-------------------------------------------------------*/
                    /*-------------------------------------------------------*/
                    /*-------------------------------------------------------*/
                    /*-------------------------------------------------------*/
                    /*-------------------------------------------------------*/

                    /**
                     * Слушаем свойства loadHotelsData и loadTicketsData
                     * Устанавливаем их после успешной загрузки отелей или билетов
                     */
                    this.observe('loadHotelsData', function(value){
                        if(value){

                            if (FilterPanelComponent) FilterPanelComponent.teardown();
                            if (ListPanelComponent) ListPanelComponent.teardown();

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
                            })

                            ListPanelComponent = new ListPanel({
                                el: that.find('.b-page-dynamic'),
                                data: {
                                    iterable_hotels: true,
                                    Enumerable: value.Hotels,
                                    combinationModel: $scope.combination
                                }
                            });
                        }
                    }, {init : false});

                    this.observe('loadTicketsData', function(value){
                        if(value){
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
                    }, {init : false});
                },

                /**
                 *
                 * @param {String} opt_param
                 */
                stateTab: function (opt_param) {
                    if ($location.search().displayTicket || (opt_param && opt_param == 'ticket')) {
                        this.set('TICKETS_TAB', true);
                        this.set('HOTELS_TAB', false);
                    }
                    if ($location.search().displayHotel || (opt_param && opt_param == 'hotel')) {
                        this.set('TICKETS_TAB', false);
                        this.set('HOTELS_TAB', true);
                    }


                },

                /**
                 * Загрузка списка отелей
                 * Инициализирует компонент @link ListPanelComponent
                 * @returns {jQuery.Deferred}
                 */
                loadHotels: function () {
                    var that = this;
                    var param = $scope.combination.ticket.data.VariantId1;
                    var routeParams = angular.copy(searchParams);
                    var deferred = new $.Deferred();

                    if (!param) return;

                    if (ListPanelComponent) ListPanelComponent.wait();

                    DynamicPackagesDataProvider
                        .getHotelsByCombination(param, routeParams, function (data) {
                            that.set('loadHotelsData', data);
                            $scope.baloon.hide();
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
                                $scope.baloon.hide();
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
                    var param = $scope.combination.hotel.data.HotelId;
                    var routeParams = angular.copy(searchParams);
                    var deferred = new $.Deferred();

                    if (!param) return;

                    // TODO : заглушка
                    // позже будет прелоадер
                    if (ListPanelComponent) ListPanelComponent.wait();

                    DynamicPackagesDataProvider
                        .getTicketsByCombination(param, routeParams, function (data) {
                            that.set('loadTicketsData', data);
                            $scope.baloon.hide();
                            $scope.safeApply(function () {
                                $scope.tickets.flush();
                                for (var i = 0, raw = null; raw = data.AviaInfos[i++];) {
                                    var ticket = new inna.Models.Avia.Ticket();
                                    ticket.setData(raw);
                                    $scope.tickets.push(ticket);
                                }
                                deferred.resolve();
                            })
                        });

                    return deferred;
                },

                getCombination: function () {
                    var that = this;
                    return DynamicPackagesDataProvider.search({
                        data: searchParams,
                        success: this.combination200.bind(that),
                        error: this.combination500.bind(that)
                    });
                },

                combination200: function (data) {
                    var that = this;

                    var onTabLoad = angular.noop;
                    var onTabLoadParam;
                    var defaultTab = 'hotel';

                    if (!data || !data.RecommendedPair) return $scope.$apply(this.combination404);

                    //аналитика
                    var trackKey = $location.url();
                    if (track.isTrackSuccessResultAllowed(track.dpKey, trackKey)) {
                        track.successResultsDp(track.dpKey);
                        //console.log('analitics: dp success result');
                        track.denyTrackSuccessResult(track.dpKey, trackKey);
                    }

                    $scope.airports = data.Airports || [];
                    cacheKey = data.SearchId;

                    $scope.$apply(function ($scope) {
                        $scope.combination.ticket = new inna.Models.Avia.Ticket();
                        $scope.combination.ticket.setData(data.RecommendedPair.AviaInfo);
                        $scope.combination.hotel = new inna.Models.Hotels.Hotel(data.RecommendedPair.Hotel);
                        $scope.showLanding = false;
                    });

                    if ($location.search().displayTicket || $location.search().display == 'tickets') {

                        onTabLoad = this.loadTicketDetails;
                        onTabLoadParam = $location.search().displayTicket;
                        defaultTab = 'ticket';
                    }
                    else if ($location.search().displayHotel) {

                        onTabLoad = this.loadHotelDetails;
                        onTabLoadParam = $location.search().displayHotel;
                        defaultTab = 'hotel';

                    }


                    $scope.$apply(function ($scope) {
                        that.loadTab(defaultTab);
                        onTabLoad(onTabLoadParam);
                    });
                },

                combination404: function () {
                    var that = this;
                    //аналитика
                    track.noResultsDp();
                    $scope.baloon.showNotFound(that.balloonCloser);
                },

                combination500: function () {
                    var that = this;
                    $scope.$apply(function ($scope) {
                        $scope.baloon.showErr(
                            "Что-то пошло не так",
                            "Попробуйте начать поиск заново",
                            that.balloonCloser
                        );
                    });
                },

                loadTab: function (data_tab) {
                    var that = this;

                    this.stateTab(data_tab);

                    if (this.get('HOTELS_TAB'))
                        return this.loadHotels();
                    else if (this.get('TICKETS_TAB'))
                        return this.loadTickets();
                },

                ticket404: function () {
                    var that = this;

                    $scope.baloon.showErr(
                        "Запрашиваемая билетная пара не найдена",
                        "Вероятно, она уже продана. Однако у нас есть множество других вариантов перелетов! Смотрите сами!",
                        function () {
                            delete $location.$$search.displayTicket
                            $location.$$compose();
                        }
                    );
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

                loadTicketDetails: function (ids) {
                    var that = this;

                    if (!ids) return;

                    try {
                        var ticketIds = ids.split('_');
                        var ticket = $scope.tickets.search(ticketIds[0], ticketIds[1]);
                        if (ticket) {
                            $scope.getTicketDetails(ticket);
                        } else throw false;
                    } catch (e) {
                        this.ticket404();
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
                console.log('$destroy serp');
                EventManager.off(Events.DYNAMIC_SERP_BACK_TO_MAP);
                EventManager.off(Events.DYNAMIC_SERP_CHOOSE_HOTEL);
                EventManager.off(Events.DYNAMIC_SERP_CHOOSE_TICKET);
                EventManager.off(Events.DYNAMIC_SERP_TOGGLE_MAP);
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
