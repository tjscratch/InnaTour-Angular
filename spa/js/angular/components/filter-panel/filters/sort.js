angular.module('innaApp.conponents').
    factory('FilterSort', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterThis = null;
            var FilterSort = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/sort.hbs.html'),
                data: {
                    sortType: {
                        byAgencyProfit: ['-PriceDetails.Profit'],
                        byRecommend: ['-IsRecomendation', 'RecommendedFactor', 'DepartureDate', 'ArrivalDate'],
                        byPrice: ['Price', 'DepartureDate', 'ArrivalDate'],
                        byTripTime: ['TimeTo', 'Price', 'DepartureDate', 'ArrivalDate'],
                        byDepartureDate: 'DepartureDate',
                        byBackDepartureDate: 'BackDepartureDate',
                        byArrivalDate: 'ArrivalDate',
                        byBackArrivalDate: 'BackArrivalDate',
                        byPackagePrice: 'PackagePrice',
                        byRecommendedFactor: '-RecommendedFactor',
                        byTaFactor: '-TaFactor',
                        byName: '-HotelName',
                        byProfit: '-getProfit'
                    },
                    lowercaseFirst: $filter('lowercaseFirst'),
                    current: '',
                    sortValue: {
                        name: 'Sort',
                        val: ''
                    },
                    fn: function (data) {
                        if(!data.length) return false;

                        var sortType =  FilterThis.get('sortType');
                        var expression = sortType[FilterThis.get('sortValue.val')];

                        return $filter('orderBy')(data, expression);
                    }

                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;

                    this.on({
                        onSort: function (data) {
                            this.set({
                                'current': data.context.name,
                                'sortValue.val': data.context.value
                            })
                            this.fire('toggle');
                            this.hasSelected();
                        },
                        resetFilter: function () {
                            this.set('sortValue.val', []);
                        },

                        reset: function(data){

                        },
                        teardown: function (evt) {
                            FilterThis = null;
                        }
                    });
                },


                parse: function (end) {

                },

                complete: function (data) {

                }
            });

            return FilterSort;
        }]);


