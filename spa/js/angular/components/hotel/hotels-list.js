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
                    searchParams: angular.copy($routeParams)
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

                    this.observe('Hotels', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            this.hotelsClone = [].concat(this.get('Hotels'));

                            // получаем первую порцию из 50 отелей
                            // далее по скроллингу
                            this.set({ hotelList: this.nextArrayDoseHotels() })

                        }
                    });

                    /*this.observe('hotelList', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            this.set({ hotelList: this.hotelsClone })
                        }
                    });*/
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
                    var coords = utils.getCoords(this.find('.b-list-hotels__list'))
                    var scrollTop = utils.getScrollTop();

                    if((coords.bottom - scrollTop) <= scrollTop) {
                        console.log('get new dose');
                    }
                },

                /**
                 * Новая порция отелей, добавляем по 50 штук
                 * Добавляем в массив this.get('hotelList')
                 * Берем порцию из клонированного массива
                 * @returns {Array}
                 */
                nextArrayDoseHotels : function(){
                    var newDose = this.hotelsClone.splice(0, 50);
                    this.get('hotelList').push(newDose);
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

