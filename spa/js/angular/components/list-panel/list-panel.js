/**
 * ListPanel - панель для списка элементов
 * Выводит список отелей или билетов
 * Принемает параметр {List<Array:Object>} Enumerable
 *
 * По скроллингу добавляем новые елементы
 * Количество элемментов порции задается в параметре - {Number} countItemsVisible
 *
 * Панель подписывается на фильтры и фильтрует свой набор
 * Можно указать свои ( компоненты - шаблоны ) для EnumerableItemHotels или EnumerableItemTickets, так же можно расширить
 * и добавить новые части, нужно будет поменять и шаблон @link list.hbs.html где нужно добавить условие
 */


angular.module('innaApp.components').
    factory('ListPanel', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        '$location',
        'innaApp.API.events',
        'DynamicPackagesDataProvider',
        'IndicatorFilters',
        'HotelItem',
        'TicketItem',
        function (EventManager, $filter, $templateCache, $routeParams, $location, Events, DynamicPackagesDataProvider, IndicatorFilters, HotelItem, TicketItem) {

            var ListPanel = Ractive.extend({
                template: $templateCache.get('components/list-panel/templ/list.hbs.html'),
                data: {
                    iterable_hotels: false,
                    iterable_tickets: false,
                    EnumerableCount: 0,
                    EnumerableClone: [],
                    EnumerableList: [],
                    countItemsVisible: 10
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
                    this.enumerableClone = [];
                    this._filterTimeout = null;

                    if (this.get('iterable_hotels')) {
                        this.parse(this.get('Enumerable'), { hotel: true });
                    } else {
                        this.parse(this.get('Enumerable'), { ticket: true });
                    }

                    /**
                     * Вызов метода не чаще 300
                     * так как срабатывает по скроллингу
                     * {@link http://underscorejs.org/}
                     */
                    this.debounceDose = _.throttle(this.nextArrayDoseItems.bind(this), 300);

                    //this.set('Enumerable', this.get('Enumerable').concat(this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable'), this.get('Enumerable')))


                    this.eventListener = function () {
                        that.onScroll();
                    };

                    this.addScroll();

                    this.on({
                        change: function (data) {

                        },
                        goToMap: function (data) {
                            EventManager.fire(Events.DYNAMIC_SERP_TOGGLE_MAP, this.actualData(), data);
                        },
                        teardown: function (evt) {
                            //console.log('teardown ListPanel');
                            that.set('sortComponent', null);
                            this.reset();
                            this.off();
                            document.removeEventListener('scroll', this.eventListener);
                            EventManager.off(Events.DYNAMIC_SERP_BACK_LIST);
                            EventManager.off(Events.DYNAMIC_SERP_CLOSE_BUNDLE, this.updateCoords);
                            EventManager.off(Events.DYNAMIC_SERP_OPEN_BUNDLE, this.updateCoords);
                            EventManager.off(Events.FILTER_PANEL_CHANGE);
                            EventManager.off(Events.FILTER_PANEL_RESET);
                            EventManager.off(Events.FILTER_PANEL_SORT);
                            EventManager.off(Events.DYNAMIC_SERP_GO_TO_MAP, this.proxyGoToMap);
                        }
                    })


                    /**
                     * Срабатывает один раз
                     * Далее копируем массив Enumerable и работаем с копией
                     */
                    this.observe('Enumerable', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            this.cloneData();
                            this.enumerableCount(newValue);
                            this.set({waitData: false})
                        }
                    });

                    /**
                     * Сделим за изменениями массива EnumerableList
                     * Происходит когда добавляем новую порцию отелей
                     */
                    this.observe('EnumerableList', function (newValue, oldValue, keypath) {
                        if (newValue) {

                            /*console.log(newValue, 'newValue');

                             console.table([
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
                                if (newValue.length != this.get('Enumerable').length) {
                                    setTimeout(this.updateCoords.bind(this), 0);
                                } else {
                                    this.removeScroll();
                                }
                            }
                        }
                    });


                    /**
                     * Слушаем события от бандла
                     * Обновляем координаты
                     */
                    EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, this.updateCoords.bind(this));
                    EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, this.updateCoords.bind(this));
                    EventManager.on(Events.DYNAMIC_SERP_GO_TO_MAP, this.proxyGoToMap.bind(this));

                    // выполняем фильтрацию не чаще 300ms
                    // защита от слишком частого нажатия на кнопки фильтрации
                    EventManager.on(Events.FILTER_PANEL_CHANGE, function (data) {
                        clearTimeout(that._filterTimeout);
                        that._filterTimeout = setTimeout(function () {
                            that.doFilter(that.get('Enumerable'), data);
                        }, 300);
                    });

                    /** событие сброса фильтров */
                    EventManager.on(Events.FILTER_PANEL_RESET, function (data) {
                        clearTimeout(that._filterTimeout);
                        that._filterTimeout = setTimeout(function () {
                            that.resetFilter();
                        }, 100);
                    });


                    /** Событие сортировки */
                    EventManager.on(Events.FILTER_PANEL_SORT, function (sortComponent) {
                        setTimeout(function () {
                            that.cloneData(that.sorting());
                        }, 0)
                    });


                    /**
                     * запрашиваем и отдаем компонент сортировки
                     * используем не стандартный механизм общения компонентов
                     */
                    EventManager.observe('getSortComponent', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            that.set('sortComponent', newValue);
                            newValue.sortDefault();
                        }
                    })
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


                    //console.log((elHeight), (scrollTop + (viewportHeight + 100)));


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
                        var searchParams = angular.extend(routParam, {
                            ChildrenAges: (routParam.Children) ? routParam.Children.split('_') : null
                        });

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
                 * Метод фильтрации списка
                 * Вызываем по событию от панели набора фильтров
                 *
                 * Фильтруем исходный массив Enumerable
                 * Выставляем новый набор для EnumerableList
                 * И для this.enumerableClone
                 *
                 * Каждый фильтр должен иметь функцию фильтрации - fn
                 * filters.fn();
                 * в качестве параметра примемает значение свойства item[filters.name]
                 *
                 * @param {Array} collection - коллекция для фильтрации
                 * @param {Array} param_filters - набор фильров
                 * @return {Array} новый набор
                 */

                doFilter: function (collection, param_filters) {
                    var that = this;
                    var filterEnumerable = [];

                    // проход по коллекции данных
                    for (var j = 0; j < collection.length; j++) {
                        var item = collection[j];

                        // проход по фильтрам
                        var filterResult = param_filters.filter(function (filters) {
                            if (item[filters.name] == undefined) return false;

                            // для некоторых компонентов нужно передать не просто поле
                            // по которому фильтруем, а весь item, так как более сложному фильтру нужно несколько полей
                            if (filters.fn != undefined) {
                                var paramForFn = item[filters.name];

                                switch (filters.name) {
                                    case 'DepartureDate':
                                        paramForFn = item;
                                    case 'AirportFrom':
                                        paramForFn = item;
                                    case 'AirLegs':
                                        paramForFn = item;
                                }

                                //console.log(filters.fn(paramForFn), 'filters.fn(paramForFn)');
                                return filters.fn(paramForFn, filters);
                            }
                        });


                        if (filterResult.length == param_filters.length)
                            filterEnumerable.push(item)
                    }

                    // подписываемся на событие скролла если еще нет этого события
                    if (!this.get('scroll') && filterEnumerable.length > this.get('countItemsVisible'))
                        this.addScroll();


                    // если список меньше колличества разовой порции, то скролл нам не нужен
                    if (filterEnumerable.length <= this.get('countItemsVisible')) this.removeScroll();

                    EventManager.fire(Events.LIST_PANEL_FILTES_HOTELS_DONE, [].concat(filterEnumerable));

                    this.insertAfterFiltered(filterEnumerable);


                    //console.log(filterEnumerable, filterEnumerable.length, 'filterEnumerable');

                },


                /**
                 * ставим фильтр в конец очереди чтоб не блокировать
                 * например переключение самих фильтров
                 * если есть свойство sortValue, то сортируем после фильтрации
                 */
                insertAfterFiltered: function (filteredData) {
                    var that = this;

                    this.set({
                        filtered: true,
                        EnumerableFiltered: filteredData
                    })

                    this.enumerableCount(filteredData, true);

                    setTimeout(function () {
                        that.cloneData(that.sorting(filteredData));
                    }, 0);
                },


                /**
                 * Сортируем список
                 * Используем $filter('orderBy') из angular
                 * @param {String} sortValue
                 * @param {List<>} opt_sort_data
                 */
                sorting: function (opt_sort_data) {
                    var sortData = null;

                    // Если когда то была фильтрация, то берем и сортируем именно отфильтрованный набор
                    if (this.isFiltred())
                        sortData = this.actualData();
                    else
                        sortData = opt_sort_data || this.actualData();

                    // вызываем метод сортировки из компонента sortComponent
                    var sortComponent = this.get('sortComponent');
                    var sortResult = sortComponent.get('fn')(sortData, sortComponent.get('sortValue'));

                    return (sortResult && sortResult.length) ? sortResult : [];
                },

                isFiltred: function () {
                    return (this.get('filtered') && this.get('EnumerableFiltered').length);
                },

                actualData: function () {
                    var actual = null;
                    if (this.isFiltred()) {
                        actual = this.get('EnumerableFiltered');
                    } else {
                        actual = this.get('Enumerable')
                    }
                    return actual;
                },

                /**
                 * Сбрасываем список до начального состояния без фильтров
                 * Если установлено свойство sortValue, то сортируем набор
                 */
                resetFilter: function () {
                    console.log('resetFilter -- resetFilter');
                    this.set({
                        filtered: false,
                        EnumerableFiltered: []
                    })

                    if (!this.get('scroll')) this.addScroll();

                    var sortResult = this.sorting();

                    EventManager.fire(Events.LIST_PANEL_FILTES_RESET_DONE, [].concat(sortResult));

                    this.cloneData(sortResult);
                    this.enumerableCount(sortResult);
                },

                /**
                 * Клонируем список отелей и далее работает с ним
                 * @param opt_data
                 */
                cloneData: function (opt_data) {
                    if (opt_data) this.set('EnumerableList', []);

                    var list = opt_data || this.get('Enumerable');
                    this.enumerableClone = [].concat(list);

                    // получаем первую порцию из n item
                    // далее по скроллингу
                    this.nextArrayDoseItems();
                },

                enumerableCount: function (data, opt_param) {

                    if(opt_param){
                        this.set('EnumerableCount', data.length);
                    } else {
                        if (data.length) {
                            this.set('EnumerableCount', data.length - 1);
                        } else {
                            this.set('EnumerableCount', data.length);
                        }
                    }
                },

                wait: function () {
                    this.set({waitData: true})
                }
            });

            return ListPanel;
        }]);

