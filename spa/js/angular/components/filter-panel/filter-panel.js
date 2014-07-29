/**
 * Панель фильтрации для отелей и билетов
 * Вообще сама панель не чего не фильтрует
 *
 * Просто передает массив данных по которым нужно будет фильтровать
 *
 * При выборе любого свойства на панели, собираем новый набор и диспачим событие с этим набором
 *
 * EventManager.fire('FilterPanel:change', filtersCollection)
 * Логику фильтрации реализуют все компоненты подписчики
 */


angular.module('innaApp.conponents').
    factory('FilterPanel', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'FilterSettings',

        'FilterTime',
        'FilterAirline',
        'FilterAirPort',

        'FilterExtra',
        'FilterPrice',
        'FilterName',
        'FilterSlider',
        'FilterStars',
        'FilterTaFactor',
        'FilterType',
        'FilterSort',
        function (EventManager, $filter, $templateCache, $routeParams, Events, FilterSettings, FilterTime, FilterAirline, FilterAirPort, FilterExtra, FilterPrice, FilterName, FilterSlider, FilterStars, FilterTaFactor, FilterType, FilterSort) {


            /**
             * Компонент FilterPanel
             * @constructor
             */
            var FilterPanel = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ/panel.hbs.html'),
                append: true,
                data: {
                    asMap: false,
                    filtersCollection: [],
                    filter_hotel: true,
                    filter_avia: false,

                    // данные для компонентов фильтров
                    filtersData: FilterSettings.get('settings')
                },

                // части шаблонов которые содержат компоненты фильтров
                partials: {
                    HotelsFilter: $templateCache.get('components/filter-panel/templ/panel.hotel.filters.hbs.html'),
                    TicketFilter: $templateCache.get('components/filter-panel/templ/panel.avia.hbs.html'),
                    MapFilter: '<div>MapFilter</div>',

                    ruble: $templateCache.get('components/ruble.html')
                },
                components: {
                    'FilterTime': FilterTime,
                    'FilterAirline': FilterAirline,
                    'FilterAirPort': FilterAirPort,

                    'FilterExtra': FilterExtra,
                    'FilterPrice': FilterPrice,
                    'FilterName': FilterName,
                    'FilterSlider': FilterSlider,
                    'FilterStars': FilterStars,
                    'FilterTaFactor': FilterTaFactor,
                    'FilterType': FilterType,
                    'FilterSort': FilterSort
                },
                init: function () {
                    var that = this;

                    FilterSettings.on('change', function (data) {
                        that.set('filtersData', FilterSettings.get('settings'));
                    })

                    this.listenChildren();

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {

                        }
                    })

                    this.on('filter-panel:child:change', function (data) {
                        that.collectChildData();
                    })

                    // сортировка
                    this.on('filter-panel:sort:change', function (newValue) {
                        EventManager.fire(Events.FILTER_PANEL_SORT, newValue);
                    });

                    /** если нужно закрыть все открытые фильтры */
                    EventManager.on(Events.FILTER_PANEL_CLOSE_FILTERS, function () {
                        var childComponents = that.findAllComponents();

                        childComponents.forEach(function (child) {
                            child.set({isOpen: false});
                        })
                    });
                },

                /**
                 * Слушаем событие изменения дочерних компонентов
                 * FilterPanel выступает EventManager-ром для своих детей
                 *
                 * child._parent - каждый child слушает своего родителя
                 *
                 * if(childComponent._guid != child._guid) Если событие от другого компонента
                 * то прячем попап
                 *
                 *
                 *  Слушаем изменения свойства value
                 *  В нем содержится название свойства и собственно его значение
                 */
                listenChildren: function () {
                    var that = this;
                    var childComponents = this.findAllComponents();

                    childComponents.forEach(function (child) {

                        child.observe('isOpen', function (newValue, oldValue) {
                            if (newValue) {
                                that.fire('hide:child', child);
                            }
                        });

                        child._parent.on('hide:child', function (childComponent) {
                            if (childComponent._guid != child._guid) {
                                child.fire('hide');
                            }
                        })
                    })
                },

                /**
                 * Проходим по всем дочерним компонентам и
                 * собираем данные для фильтрации
                 * обновляем массив filtersCollection
                 */
                collectChildData: function () {
                    var that = this;
                    var tempArr = [];

                    this.findAllComponents().forEach(function (child) {
                        if (child.get('value') && child.get('value.val') && child.get('value.val').length) {
                            tempArr.push(child.get('value'));
                        }
                    })
                    this.merge('filtersCollection', tempArr);

                    if (this.get('filtersCollection').length) {
                        this.set('alreadyFiltered', true);
                        EventManager.fire(Events.FILTER_PANEL_CHANGE, this.get('filtersCollection'));
                    } else {
                        if (this.get('alreadyFiltered')) {
                            EventManager.fire(Events.FILTER_PANEL_RESET);
                        }
                    }
                },

                toggleFilters: function () {
                    this.toggle('filter_hotel');
                    this.toggle('filter_avia');
                    this.listenChildren();
                },


                /**
                 *
                 * @param {Object} data - данные на основе которых собираются фильтры
                 */
                prepareAviaFiltersData: function (data) {
                    var that = this;
                    // если это билет

                    var collectAirlines = [];

                    // собираем аэропорты
                    //CityFrom
                    //CityTo
                    //AirportTo
                    //AirportFrom
                    var collectAirPort = [
                        {
                            state: 'from',
                            name: data[0].CityFrom,
                            list: []
                        },
                        {
                            state: 'to',
                            name: data[0].CityTo,
                            list: []
                        }
                    ];

                    // проходим по билетам
                    data.forEach(function (item) {
                        var modelTicket = new inna.Models.Avia.Ticket();
                        modelTicket.setData(item);
                        var virtualBundle = new inna.Models.Dynamic.Combination();
                        virtualBundle.ticket = modelTicket;
                        virtualBundle.hotel = that.get('combinationModel').hotel;


                        // собираем коллекцию уникальных авиалиний
                        var airline = _.union(modelTicket.collectAirlines().airlines);
                        collectAirlines.push(airline);


                        collectAirPort[0].list.push(item.AirportFrom);
                        collectAirPort[1].list.push(item.AirportTo);
                    })


                    // удаляем вровни вложенности массива
                    var flatten = _.flatten(collectAirlines)
                    // возвращаем уникальные значания массива
                    var union = _.union(flatten);

                    var newAirLines = [];
                    for (var i = 0; i < union.length; i++) {
                        var o = union[i];
                        newAirLines.push({
                            name: o
                        })
                    }

                    var from = _.union(collectAirPort[0].list);
                    var to = _.union(collectAirPort[1].list);

                    collectAirPort[0].list = [];
                    collectAirPort[1].list = [];

                    for (var i = 0; i < from.length; i++) {
                        collectAirPort[0].list.push({ name: from[i] })
                    }
                    for (var i = 0; i < to.length; i++) {
                        collectAirPort[1].list.push({ name: to[i] })
                    }

                    // передаем данные в модель фильтров
                    FilterSettings.set({'settings.airlines': newAirLines});
                    FilterSettings.set({'settings.airports': collectAirPort});
                },

                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return FilterPanel;
        }]);


