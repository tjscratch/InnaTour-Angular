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

                    /**
                     * Вызов метода не чаще 500
                     * так как срабатывает по скроллингу
                     * {@link http://underscorejs.org/}
                     */
                    this.debounceDose = _.throttle(this.nextArrayDoseHotels.bind(this), 300);


                    var eventListener = function () {
                        that.onScroll();
                    };
                    document.addEventListener('scroll', eventListener);

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {
                            console.log('teardown sdfgsjhdgfhsd');
                            document.removeEventListener('scroll', eventListener);
                        }
                    })


                    /**
                     * Срабатывает один раз
                     * Далее копируем массив Hotels и работаем с копией
                     */
                    this.observe('Hotels', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            this.hotelsClone = [].concat(this.get('Hotels'));

                            // получаем первую порцию из 50 отелей
                            // далее по скроллингу
                            this.nextArrayDoseHotels();
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
                                console.log('removeEventListener');
                                document.removeEventListener('scroll', eventListener);
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
                        that.set({hotelList: that.get('hotelList').concat(newDose)});
                    }
                },

                getHotels: function () {
                    var that = this,
                        param = this.get('combinationModel').ticket.data.VariantId1,
                        searchParam = angular.copy($routeParams);

                    console.log(param);

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


                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return ListPanel;
        }]);

