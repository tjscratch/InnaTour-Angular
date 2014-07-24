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
        function (EventManager, $filter, $templateCache, $routeParams, Events, DynamicPackagesDataProvider, IndicatorFilters, HotelItem) {

            var ListPanel = Ractive.extend({
                template: $templateCache.get('components/list-panel/templ/list.hbs.html'),
                data: {
                    countItemsVisible: 20,
                    Enumerable : [],
                    EnumerableList: []
                },
                partials : {
                    EnumerableItemHotels : $templateCache.get('components/list-panel/templ/enumerableItemHotel.hbs.html'),
                    EnumerableItemTickets : $templateCache.get('components/list-panel/templ/enumerableItemTicket.hbs.html')
                },
                components: {
                    IndicatorFilters : IndicatorFilters,
                    HotelItem: HotelItem
                },
                init: function () {
                    var that = this;
                    this.enumerableClone = [];
                    this.enumerableDose = [];
                    /**
                     * Вызов метода не чаще 500
                     * так как срабатывает по скроллингу
                     * {@link http://underscorejs.org/}
                     */
                    this.debounceDose = _.throttle(this.nextArrayDoseItems.bind(this), 300);


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
                    this.observe('Enumerable', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            this.cloneData();
                            this.set({waitData : false})
                        }
                    });

                    /**
                     * Сделим за изменениями массива EnumerableList
                     * Происходит когда добавляем новую порцию отелей
                     */
                    this.observe('EnumerableList', function (newValue, oldValue, keypath) {
                        if (newValue) {

                            /*console.table([
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
                            if (newValue.length != this.get('Enumerable').length) {
                                setTimeout(this.updateCoords.bind(this), 0);
                            } else {
                                this.removeScroll();
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

                    EventManager.on('filter-panel:change', function (data) {
                        that.doFilter(that.get('Enumerable'), data);
                    });

                    EventManager.on('filter-panel:reset', function (data) {
                        that.resetFilter();
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

                    if (newDose.length) {
                        this.set({EnumerableList: this.get('EnumerableList').concat(newDose)});
                        //this.push('EnumerableList', newDose);
                    }
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
                 * Так же можно обработать поля по имени отдельно
                 * в блоке switch - case
                 *
                 * @param {Array} collection - коллекция для фильтрации
                 * @param {Array} param_filters - набор фильров
                 * @return {Array} новый набор
                 */
                doFilter: function (collection, param_filters) {
                    var that = this;

                    //console.log(param_filters);
                    // проходим циклом по отелям
                    var filterEnumerable = collection.filter(function (item) {
                        var tempArrFilter = [];

                        // проходим по коллекции фильтров
                        param_filters.forEach(function (filters) {

                            // если в объекте есть свойство фильтра
                            if (item[filters.name] == undefined) return false;

                            // exclude
                            switch(filters.name){
                                case 'Price':
                                    return false
                            }


                            // проходим по значениям фильтра
                            var temp = filters.val.filter(function (filter_val) {

                                // отдельно обрабатываем поля если это необходимо
                                switch(filters.name){
                                    case 'TaFactor':
                                       if (Math.floor(item[filters.name]) == filter_val) return true;
                                    case 'HotelName':
                                        var reg = new RegExp(filter_val, 'i');
                                        if (reg.test(item[filters.name])) return true;
                                    case 'Extra':
                                        if(item[filters.name][filter_val] != undefined) return true;
                                    default:
                                        if (item[filters.name] == filter_val) return true;
                                }
                            });


                            if (temp.length) tempArrFilter.push(temp);

                        });

                        if (tempArrFilter.length == param_filters.length) {
                            return true;
                        }
                    })


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
                    this.merge('EnumerableList', []);
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

