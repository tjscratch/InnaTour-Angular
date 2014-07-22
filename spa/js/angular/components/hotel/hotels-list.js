/**
 * ListPanel - панель для списка элементов
 * Выводит список отелей или билетов
 *
 * По скроллингу добавляем новые елементы
 * Количество элемментов порции задается в параметре - countHotelsVisible
 *
 * Панель подписывается на фильтры и фильтрует свой набор
 */

angular.module('innaApp.conponents').
    factory('HotelsList', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        'DynamicPackagesDataProvider',
        'HotelItem',
        function (EventManager, $filter, $templateCache, $routeParams, Events, DynamicPackagesDataProvider, HotelItem) {

            var ListPanel = Ractive.extend({
                template: $templateCache.get('components/hotel/templ/list.hbs.html'),
                data: {
                    countHotelsVisible: 20,
                    hotelList: []
                },
                components: {
                    HotelItem: HotelItem
                },
                init: function () {
                    var that = this;
                    this.hotelsClone = [];
                    this.hotelsDose = [];

                    //this.set('Hotels', this.get('Hotels').splice(0, 2));

                    /**
                     * Вызов метода не чаще 500
                     * так как срабатывает по скроллингу
                     * {@link http://underscorejs.org/}
                     */
                    this.debounceDose = _.throttle(this.nextArrayDoseHotels.bind(this), 300);


                    this.eventListener = function () {
                        that.onScroll();
                    };

                    this.addScroll();

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {
                            console.log('teardown sdfgsjhdgfhsd');
                            document.removeEventListener('scroll', this.eventListener);
                        }
                    })


                    /**
                     * Срабатывает один раз
                     * Далее копируем массив Hotels и работаем с копией
                     */
                    this.observe('Hotels', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            this.cloneData();
                        }
                    });

                    /**
                     * Сделим за изменениями массива hotelList
                     * Происходит когда добавляем новую порцию отелей
                     */
                    this.observe('hotelList', function (newValue, oldValue, keypath) {
                        if (newValue) {

                            /*console.table([
                             {
                             newValue: newValue.length,
                             hotelList: this.get('hotelList').length,
                             Hotels: this.get('Hotels').length,
                             hotelsClone: this.hotelsClone.length
                             }
                             ]);*/

                            // после добавления элементов в hotelList
                            // обновляем координаты
                            // оборачиваем в setTimeout, так как нужно дождаться вставки элементов в DOM
                            if (newValue.length != this.get('Hotels').length) {
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
                        that.doFilter(that.get('Hotels'), data);
                    });

                    EventManager.on('filter-panel:reset', function (data) {
                        that.resetFilter();
                    });
                },


                /**
                 * Высчитываем координаты нижней границы блока с отелями
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

                addScroll : function(){
                    console.log('addScroll');
                    document.addEventListener('scroll', this.eventListener);
                    this.set({scroll : true});
                },

                removeScroll : function(){
                    console.log('removeScroll');
                    document.removeEventListener('scroll', this.eventListener);
                    this.set({scroll : false});
                },

                toggleScroll : function(){

                },

                updateCoords: function () {
                    var elem = this.find('.b-list-hotels__list');
                    var coords = utils.getCoords(elem);
                    this.set({
                        coords: coords,
                        elHeight: (elem.offsetHeight + coords.top)
                    });
                },

                /**
                 * Новая порция отелей, добавляем по 50 штук
                 * Добавляем в массив this.get('hotelList')
                 * Берем порцию из клонированного массива
                 * @returns {Array}
                 */
                nextArrayDoseHotels: function () {
                    var that = this,
                        start = 0,
                        end = that.get('countHotelsVisible'),
                        newDose = that.hotelsClone.splice(start, end);

                    if (newDose.length) {
                        this.set({hotelList: this.get('hotelList').concat(newDose)});
                        //this.push('hotelList', newDose);
                    }
                },

                getHotels: function () {
                    var that = this,
                        param = this.get('combinationModel').ticket.data.VariantId1,
                        searchParam = angular.copy($routeParams);

                    //console.log(param);

                    return DynamicPackagesDataProvider['getHotelsByCombination'](
                        param,
                        searchParam,
                        function (data) {
                            console.log(data);

                            if (data.Hotels) {
                                that.set({ Hotels: data.Hotels });
                            }

                            EventManager.fire('Dynamic.SERP.Tab.Loaded');
                        });
                },

                parse: function (end) {

                },

                /**
                 * Метод фильтрации списка отелей
                 * Вызываем по событию от панели набора фильтров
                 *
                 * Фильтруем исходный массив Hotels
                 * Выставляем новый набор для hotelList
                 * И для this.hotelsClone
                 * Если фильтруемое свойство строка, ищем в ней совпадение с помощью RegExp
                 * @param {Array} collection - коллекция для фильтрации
                 * @param {Array} param_filters - набор фильров
                 * @return {Array} новый набор
                 */
                doFilter: function (collection, param_filters) {
                    var that = this;

                    // проходим циклом по отелям
                    var filterHotel = collection.filter(function (item) {
                        var tempArrFilter = [];

                        // проходим по коллекции фильтров
                        param_filters.forEach(function (filters) {

                            // если в объекте есть свойство фильтра
                            if (item[filters.name] != undefined) {

                                // игноррируем название отеля и цену
                                if ((item[filters.name] != 'Price')) {

                                    // проходим по значениям фильтра
                                    var temp = filters.val.filter(function (filter_val) {

                                        // если это строка ищем в ней совпадение с помощью RegExp
                                        if (typeof item[filters.name] === 'string') {

                                            var reg = new RegExp('...' + filter_val + '...', 'i');
                                            if (reg.test(item[filters.name])) return true;

                                        } else {
                                            if (item[filters.name] == filter_val) return true;
                                        }
                                    });
                                    if (temp.length) tempArrFilter.push(temp);
                                }
                            }
                        });

                        if (tempArrFilter.length == param_filters.length) {
                            return true;
                        }
                    })

                    setTimeout(function(){
                        that.cloneData(filterHotel);
                    },0);

                    if(!this.get('scroll') && filterHotel.length > 2){
                        this.addScroll();
                    }
                    if(filterHotel.length < 3) this.removeScroll();
                    //console.log(filterHotel, filterHotel.length, 'filterHotel');
                },

                resetFilter: function () {
                    console.log('filter-panel:reset');
                    if(!this.get('scroll')){
                        this.addScroll();
                    }
                    this.cloneData();
                },

                cloneData: function (opt_data) {
                    this.merge('hotelList', []);
                    this.hotelsClone = [].concat(opt_data || this.get('Hotels'));

                    // получаем первую порцию из 50 отелей
                    // далее по скроллингу
                    this.nextArrayDoseHotels();
                },


                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return ListPanel;
        }]);

