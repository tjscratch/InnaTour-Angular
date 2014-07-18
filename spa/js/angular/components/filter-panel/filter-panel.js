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

        'HotelItem',
        function (EventManager, $filter, $templateCache, $routeParams, Events, HotelItem) {

            var FilterPanel = Ractive.extend({
                template: $templateCache.get('components/hotel/templ/list.hbs.html'),
                data: {
                    countHotelsVisible: 20,
                    hotelList: [],
                    asMap : false,
                    state : {
                        HOTELS_TAB : true,
                        TICKETS_TAB : false
                    }
                },
                components: {
                    HotelsFilter: '<div>HotelsFilter</div>',
                    TicketFilter: '<div>TicketFilter</div>',
                    MapFilter: '<div>MapFilter</div>'
                },
                init: function () {
                    var that = this;
                    this.hotelsClone = [];
                    this.hotelsDose = [];

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {

                        }
                    })
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

            return FilterPanel;
        }]);


