/**
 * ListPanel - панель для списка элементов
 * Выводит список отелей или билетов
 * Принемает параметр {List<Array:Object>} Enumerable
 *
 * По скроллингу добавляем новые елементы
 * Количество элемментов порции задается в параметре - {Number} countItemsVisible
 *
 * Панель подписывается на изменения панели фильтров
 * Можно указать свои ( компоненты - шаблоны ) для EnumerableItemHotels или EnumerableItemTickets, так же можно расширить
 * и добавить новые части, нужно будет поменять и шаблон @link list.hbs.html где нужно добавить условие
 */

angular.module('innaApp.components').
    factory('ListPanel', [
        'EventManager',
        '$filter',
        '$timeout',
        '$templateCache',
        '$routeParams',
        '$location',
        'innaApp.API.events',
        'DynamicPackagesDataProvider',
        'IndicatorFilters',
        'HotelItem',
        'TicketItem',
        function (EventManager, $filter, $timeout, $templateCache, $routeParams, $location, Events, DynamicPackagesDataProvider, IndicatorFilters, HotelItem, TicketItem) {

            var ListPanel = Ractive.extend({
                template: $templateCache.get('components/list-panel/templ/list.hbs.html'),
                data: {
                    iterable_hotels: false,
                    iterable_tickets: false,

                    EnumerableCount: 0,
                    EnumerableClone: [],
                    EnumerableList: [],
                    countItemsVisible: 10,
                    showButtonMore : true
                },
                partials: {
                    EnumerableItemHotels: $templateCache.get('components/list-panel/templ/enumerableItemHotel.hbs.html'),
                    EnumerableItemTickets: $templateCache.get('components/list-panel/templ/enumerableItemTicket.hbs.html')
                },
                components: {
                    IndicatorFilters: IndicatorFilters,
                    HotelItem: HotelItem,
                    TicketItem: TicketItem
                },
                init: function () {
                    var that = this;

                    utils.bindAll(this);

                    this.enumerableClone = [];
                    this._filterTimeout = null;
                    this._scrollTimeout = null;
                    this.observeEnumerable = null;

                    if (this.get('iterable_hotels'))
                        this.parse(this.get('Enumerable'), { hotel: true });
                    else
                        this.parse(this.get('Enumerable'), { ticket: true });

                    /**
                     * Вызов метода не чаще 300
                     * так как срабатывает по скроллингу
                     * {@link http://underscorejs.org/}
                     */
                    this.debounceDose = _.throttle(this.nextArrayDoseItems, 300);

                    //this.set('Enumerable', this.get('Enumerable').concat(this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable')))


                    this.eventListener = function () {
                        that.onScroll();
                    };

                    this.addScroll();

                    this.on({
                        change: function (data) {

                        },
                        goToMap: function (data) {
                            EventManager.fire(Events.DYNAMIC_SERP_TOGGLE_MAP, this.get('EnumerableList'), data);
                        },
                        goToMore: function (){
                            this.debounceDose();
                        },

                        '*.setCurrent' : this.setCurrent,

                        teardown: function (evt) {
                            //console.log('teardown ListPanel');
                            this.observeEnumerable.cancel();
                            document.removeEventListener('scroll', this.eventListener);
                            clearTimeout(this._filterTimeout);
                            clearTimeout(this._scrollTimeout);
                            EventManager.off(Events.DYNAMIC_SERP_CLOSE_BUNDLE, this.updateCoords);
                            EventManager.off(Events.DYNAMIC_SERP_OPEN_BUNDLE, this.updateCoords);
                            EventManager.off(Events.FILTER_PANEL_CHANGE, this.FILTER_PANEL_CHANGE);
                            EventManager.off(Events.DYNAMIC_SERP_GO_TO_MAP, this.proxyGoToMap);
                        }
                    })


                    /**
                     * Срабатывает один раз
                     * Далее копируем массив Enumerable и работаем с копией
                     */
                    this.observeEnumerable = this.observe({
                        Enumerable: function (newValue, oldValue, keypath) {
                            if (newValue) this.cloneData(newValue);
                        },
                        EnumerableList: function (newValue, oldValue, keypath) {
                            if (newValue) {

//                                console.log(newValue.length, 'newValue');
//                                    console.log(this.get('Enumerable').length, 'oldValue');

                                /* console.table([
                                 {
                                 newValue: newValue.length,
                                 EnumerableList: this.get('EnumerableList').length,
                                 Enumerable: this.get('Enumerable').length,
                                 enumerableClone: this.enumerableClone.length
                                 }
                                 ]);*/

                                // после добавления элементов в EnumerableList
                                // обновляем координаты
                                // оборачиваем в setTimeout, так как нужно дождаться вставки элементов в DOM
                                if (newValue.length) {
                                    if (newValue.length != this.get('Enumerable').length - 1) {
                                        setTimeout(this.updateCoords, 0);
                                    } else {
                                        this.removeScroll();
                                    }
                                }
                            }
                        }
                    }, {defer: true});


                    /**
                     * Слушаем события от бандла
                     * Обновляем координаты
                     */
                    EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, this.updateCoords);
                    EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, this.updateCoords);
                    EventManager.on(Events.DYNAMIC_SERP_GO_TO_MAP, this.proxyGoToMap);
                    
                    /** Событие изменения фильтров или сортировки */
                    EventManager.on(Events.FILTER_PANEL_CHANGE, this.FILTER_PANEL_CHANGE);
                },

                FILTER_PANEL_CHANGE : function(data){
                    // подписываемся на событие скролла если еще нет этого события
                    if (!this.get('scroll') && data.length > this.get('countItemsVisible'))
                        this.addScroll();

                    // если список меньше колличества разовой порции, то скролл нам не нужен
                    if (data.length <= this.get('countItemsVisible')) this.removeScroll();

                    /* ставим в конец очереди чтоб не блокировать переключение фильтров */
                    this.cloneData(data);
                },

                setCurrent : function(modelHotel, hotelId){
                    if(this.get('EnumerableCount') == 1){
                        this.set('EnumerableCount', 0);
                    }
                },

                proxyGoToMap: function (data) {
                    this.fire('goToMap', data);
                },

                /**
                 * Высчитываем координаты нижней границы блока
                 * и скроллинга окна браузера
                 * @param event
                 */
                onScroll: function (event) {
                    var scrollTop = utils.getScrollTop(),
                        viewportHeight = window.innerHeight,
                        elHeight = this.get('elHeight');


//                    console.log((elHeight), (scrollTop + (viewportHeight + 100)));


                    /**
                     *  Вешаем класс на body - disable-hover
                     *
                     */
                    clearTimeout(this._scrollTimeout);
                    if (!document.body.classList.contains('disable-hover')) {
                        document.body.classList.add('disable-hover')
                    }

                    this._scrollTimeout = setTimeout(function () {
                        document.body.classList.remove('disable-hover')
                    }, 500);


                    if ((scrollTop + (viewportHeight + 120)) >= elHeight) {
                        // получаем новую порцию
                        this.debounceDose();
                    }
                },

                addScroll: function () {
                    document.addEventListener('scroll', this.eventListener);
                    this.set({scroll: true});
                },

                removeScroll: function () {
                    document.removeEventListener('scroll', this.eventListener);
                    this.set({scroll: false});
                    this.set('showButtonMore', false);
                },

                toggleScroll: function () {

                },

                updateCoords: function () {
                    var elem = this.find('.b-list-panel__list');
                    if (elem) {
                        var coords = utils.getCoords(elem);
                        this.set({
                            coords: coords,
                            elHeight: (elem.offsetHeight + coords.top)
                        });
                    }
                },

                /**
                 * Новая порция отелей, добавляем по -n- штук
                 * Добавляем в массив this.get('EnumerableList')
                 * Берем порцию из клонированного массива
                 * @returns {Array}
                 */
                nextArrayDoseItems: function () {
                    var that = this,
                        start = 0,
                        end = that.get('countItemsVisible'),
                        newDose = that.enumerableClone.splice(start, end);

                    //console.time("Execution time render");
                    if (newDose.length) {
                        this.set({EnumerableList: this.get('EnumerableList').concat(newDose)});
                    }
                    //console.timeEnd("Execution time render");
                },

                /**
                 * Проходим по всему списку и создаем virtualBundle
                 * дополняем объект данными
                 *
                 * @param data
                 * @param opt_param
                 * @returns {*}
                 */
                parse: function (data, opt_param) {
                    var that = this;

                    // подготавливаем данные для авиа отелей
                    if (opt_param.hotel) {

                        var routParam = angular.copy($routeParams);
                        var searchParams = angular.extend(routParam, {});
                        if (routParam.Children && routParam.Children != "0") {
                            searchParams.ChildrenAges = routParam.Children.split('_');
                        }


                        data.forEach(function (item) {
                            var modelHotel = new inna.Models.Hotels.Hotel(item)
                            var virtualBundle = new inna.Models.Dynamic.Combination();
                            virtualBundle.hotel = modelHotel;
                            virtualBundle.ticket = that.get('combinationModel').ticket;
                            item.getProfit = virtualBundle.getProfit();
                            item.FullPackagePrice = virtualBundle.getFullPackagePrice();
                            item.searchParams = searchParams;
                        })
                    }

                    // подготавливаем данные для авиа билетов
                    if (opt_param.ticket) {
                        data.forEach(function (item) {

                            var modelTicket = new inna.Models.Avia.Ticket();
                            modelTicket.setData(item);
                            var virtualBundle = new inna.Models.Dynamic.Combination();
                            virtualBundle.ticket = modelTicket;
                            virtualBundle.hotel = that.get('combinationModel').hotel;
                            item.getProfit = virtualBundle.getProfit();
                            item.FullPackagePrice = virtualBundle.getFullPackagePrice();
                            //item.etap

                            // авиалинии этого билета
                            var airline = _.union(modelTicket.collectAirlines().airlines);
                            var legsTo = modelTicket.getEtaps('To').length;
                            var legsBack = modelTicket.getEtaps('Back').length;

                            item.collectAirlines = airline;
                            item.legsTo = legsTo;
                            item.AirLegs = true;
                            item.legsBack = legsBack;
                        })
                    }
                    return data;
                },


                /**
                 * Исключаем выбранный вариант
                 * @param {Object} item
                 */
                excludeRecommended: function (collection) {
                    var recomented = null;
                    var result = null;

                    if (this.get('iterable_hotels')) {
                        recomented = this.get('combinationModel').hotel.data;
                        result = collection.filter(function (item) {
                            return (recomented.HotelId != item.HotelId);
                        })
                    }

                    if (this.get('iterable_tickets')) {
                        recomented = this.get('combinationModel').ticket.data;
                        result = collection.filter(function (item) {
                            return (recomented.VariantId1 != item.VariantId1);
                        })
                    }

                    return result;
                },


                /**
                 * Клонируем список отелей и далее работает с ним
                 * @param opt_data
                 */
                cloneData: function (opt_data) {
                    if(opt_data) this.set('EnumerableList', []);
                    var list = opt_data || this.set('Enumerable');

                    // исключаем рекомендованный вариант
                    //if (list.length == 1) {
                        list = this.excludeRecommended(list);
                    //}

                    this.enumerableCount(list);
                    this.enumerableClone = [].concat(list);

                    // получаем первую порцию из n item
                    // далее по скроллингу
                    this.nextArrayDoseItems();
                },

                enumerableCount: function (data) {
                    this.set('EnumerableCount', data.length);
                },

                wait: function () {
                    this.set({waitData: true})
                }
            });

            return ListPanel;
        }]);