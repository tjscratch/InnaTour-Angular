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
                append: true,
                data: {
                    //searchParams: angular.copy($routeParams)
                },
                components: {
                    HotelItem: HotelItem
                },
                init: function () {
                    var that = this;

                    console.log('list');

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {

                        }
                    })

                    this.observe('TaFactor', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            //this.set({ TaFactorArr: ''})
                        }
                    });
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

