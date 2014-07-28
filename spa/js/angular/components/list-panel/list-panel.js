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


angular.module('innaApp.conponents').
    factory('ListPanel', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        'DynamicPackagesDataProvider',
        'IndicatorFilters',
        'HotelItem',
        'TicketItem',
        function (EventManager, $filter, $templateCache, $routeParams, Events, DynamicPackagesDataProvider, IndicatorFilters, HotelItem, TicketItem) {

            var ListPanel = Ractive.extend({
                template: $templateCache.get('components/list-panel/templ/list.hbs.html'),
                append : true,
                data: {
                    iterable_hotels : true,
                    iterable_tickets : false,
                    countItemsVisible: 10,
                    Enumerable : [],
                    EnumerableList: [],
                    EnumerableListNew : []
                },
                /*partials : {
                    EnumerableItemHotels : $templateCache.get('components/list-panel/templ/enumerableItemHotel.hbs.html'),
                    EnumerableItemTickets : $templateCache.get('components/list-panel/templ/enumerableItemTicket.hbs.html')
                },*/
                components: {
                    IndicatorFilters : IndicatorFilters,
                    HotelItem: HotelItem,
                    TicketItem: TicketItem
                },
                init: function () {
                    var that = this;
                    this.enumerableClone = [];
                    this._filterTimeout = null;

                    /**
                     * Вызов метода не чаще 500
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
                        teardown: function (evt) {
                            console.log('teardown ListPanel');
                            document.removeEventListener('scroll', this.eventListener);
                        }
                    })


                    /**
                     * Срабатывает один раз
                     * Далее копируем массив Enumerable и работаем с копией
                     */
                    this.cloneData();

                   /* this.observe('Enumerable', function (newValue, oldValue, keypath) {
                        if (newValue) {

                            this.set({waitData : false})
                        }
                    });*/

                    /**
                     * Сделим за изменениями массива EnumerableList
                     * Происходит когда добавляем новую порцию отелей
                     */
                    this.observe('EnumerableList', function (newValue, oldValue, keypath) {
                        if (newValue) {

                            console.log(newValue, 'newValue');

                            console.table([
                                {
                                    newValue: newValue.length,
                                    EnumerableList: this.get('EnumerableList').length,
                                    Enumerable: this.get('Enumerable').length,
                                    enumerableClone: this.enumerableClone.length
                                }
                            ]);

                            // после добавления элементов в EnumerableList
                            // обновляем координаты
                            // оборачиваем в setTimeout, так как нужно дождаться вставки элементов в DOM
                            if(newValue.length) {
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
                    EventManager.on(Events.DYNAMIC_SERP_CLOSE_BUNDLE, function () {
                        that.updateCoords();
                    });

                    EventManager.on(Events.DYNAMIC_SERP_OPEN_BUNDLE, function () {
                        that.updateCoords();
                    });

                    // выполняем фильтрацию не чаще 300ms
                    // защита от слишком частого нажатия на кнопки фильтрации
                    EventManager.on('filter-panel:change', function (data) {
                        clearTimeout(that._filterTimeout);
                        that._filterTimeout = setTimeout(function(){
                            that.doFilter(that.get('Enumerable'), data);
                        }, 300);
                    });

                    EventManager.on('filter-panel:reset', function (data) {
                        clearTimeout(that._filterTimeout);
                        that._filterTimeout = setTimeout(function(){
                            that.resetFilter();
                        }, 300);
                    });

                    EventManager.on(Events.DYNAMIC_SERP_BACK_LIST, function () {
                        that.resetFilter();
                    });
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
                    var coords = utils.getCoords(elem);
                    this.set({
                        coords: coords,
                        elHeight: (elem.offsetHeight + coords.top)
                    });
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

                    console.time("Execution time render");
                    if (newDose.length) {
                        this.set({EnumerableList: this.get('EnumerableList').concat(newDose)});
                    }
                    console.timeEnd("Execution time render");
                },

                parse: function (end) {

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

                doFilter : function(collection, param_filters){
                    var that = this;
                    var filterEnumerable = [];

                    // проход по коллекции данных
                    console.time("Execution time took");
                    for (var j = 0; j < collection.length; j++) {
                        var item = collection[j];

                        // проход по фильтрам
                        var filterResult = param_filters.filter(function(filters){
                            if (item[filters.name] == undefined) return false;

                            if(filters.fn != undefined) {
                                return filters.fn(item[filters.name]);
                            }
                        });


                        //
                        if(filterResult.length == param_filters.length) {
                            filterEnumerable.push(item)
                        }
                    }
                    console.timeEnd("Execution time took");

                    // ставим фильтр в конец очереди чтоб не блокировать
                    // например переключение самих фильтров
                    setTimeout(function () {
                        that.cloneData(filterEnumerable);
                    }, 0);

                    // подписываемся на событие скролла если еще нет этого события
                    if (!this.get('scroll') && filterEnumerable.length > 2) {
                        this.addScroll();
                    }

                    // если отелей меньше 3, то скролл нам не нужен
                    if (filterEnumerable.length < 3) this.removeScroll();

                    console.log(filterEnumerable, filterEnumerable.length, 'filterEnumerable');
                },

                /**
                 * Сбрасываем список до начального состояния без фильтров
                 */
                resetFilter: function () {
                    if (!this.get('scroll')) {
                        this.addScroll();
                    }
                    this.cloneData();
                },

                /**
                 * Клонируем список отелей и далее работает с ним
                 * @param opt_data
                 */
                cloneData: function (opt_data) {
                    if(opt_data) this.set({EnumerableList: []});
                    this.enumerableClone = [].concat(opt_data || this.get('Enumerable'));
                    // получаем первую порцию из n item
                    // далее по скроллингу

                    this.nextArrayDoseItems();
                },

                wait : function(){
                    this.set({waitData : true})
                },

                beforeInit: function (options) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return ListPanel;
        }]);

