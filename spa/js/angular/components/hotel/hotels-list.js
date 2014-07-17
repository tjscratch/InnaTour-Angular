angular.module('innaApp.conponents').
    factory('HotelsList', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'DynamicPackagesDataProvider',
        'HotelItem',
        function (EventManager, $filter, $templateCache, $routeParams, DynamicPackagesDataProvider, HotelItem) {

            var HotelsList = Ractive.extend({
                template: $templateCache.get('components/hotel/templ/list.hbs.html'),
                data: {
                    searchParams: angular.copy($routeParams),
                    countHotelsVisible: 100,
                    hotelList: []
                },
                components: {
                    HotelItem: HotelItem
                },
                init: function () {
                    var that = this;
                    this.hotelsClone = [];
                    this.hotelsDose = [];

                    document.addEventListener('scroll', this.onScroll.bind(this), false);

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {
                            document.removeEventListener('scroll');
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
                            console.log(this.get('hotelList'));

                        }
                    });

                    /**
                     * Сделим за изменениями массива hotelList
                     * Происходит когда добавляем новую порцию отелей
                     */
                    this.observe('hotelList', function (newValue, oldValue, keypath) {
                        if (newValue) {

                            console.log(newValue.length, this.get('Hotels').length, 'newValue');

                            if (newValue.length == this.get('Hotels').length) {
                                document.removeEventListener('scroll');
                                this.set({hotelList: []});
                            } else {
                                this.updateCoords();
                            }
                        }
                    });
                },

                beforeInit: function (data) {
                    console.log('beforeInit');
                },

                complete: function (data) {
                    console.log('complete');
                },

                /**
                 * Высчитываем координаты нижней границы блока с отелями
                 * и скроллинга окна браузера
                 * @param event
                 */
                onScroll: function (event) {
                    var elem = this.find('.b-list-hotels__list');   
                    var coords =  utils.getCoords(elem),
                        scrollTop = utils.getScrollTop(),
                        viewportHeight = window.innerHeight;


                    console.log(coords.top, (coords.bottom), (scrollTop + (viewportHeight)), scrollTop);

                    if ((coords.bottom) <= (scrollTop + (viewportHeight))) {
                        console.log('get new dose');
                        this.nextArrayDoseHotels();
                    }
                },

                updateCoords: function () {
                    var elem = this.find('.b-list-hotels__list');
                    this.set({coords: utils.getCoords(elem)});
                },

                /**
                 * Новая порция отелей, добавляем по 50 штук
                 * Добавляем в массив this.get('hotelList')
                 * Берем порцию из клонированного массива
                 * @returns {Array}
                 */
                nextArrayDoseHotels: function () {
                    var that = this,
                        start = null,
                        end = null,
                        newDose = null;

                    var throttle = _.throttle(function () {

                        start = that.get('hotelList').length;
                        end = that.get('countHotelsVisible');
                        newDose = that.hotelsClone.splice(start, end);

                        that.set({hotelList: that.get('hotelList').concat(newDose)});
                    }, 500);

                    throttle();

                    console.log(this.get('hotelList'));
                    return newDose;
                },

                getHotels: function () {
                    DynamicPackagesDataProvider['getHotelsByCombination'](
                        param,
                        this.get('searchParams '),
                        function (data) {
                            console.log(data);
                            EventManager.fire('Dynamic.SERP.Tab.Loaded');
                        });
                },

                parse: function (end) {

                }

            });

            return HotelsList;
        }]);

