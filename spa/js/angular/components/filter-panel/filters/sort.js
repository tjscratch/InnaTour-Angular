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
                        val: '',
                        defaultSort: 'byPackagePrice'
                    },
                    fn: function (data) {
                        if (!data.length) return false;

                        var sortType = FilterThis.get('sortType');
                        var val = FilterThis.get('sortValue.val');
                        var defaultSort = FilterThis.get('sortValue.defaultSort');
                        var expression = null;

                        if (val != '')
                            expression = sortType[val];
                        else
                            expression = sortType[defaultSort];


                        return $filter('orderBy')(data, expression);
                    }

                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;

                    console.log('init sort');

                    this.on({
                        onSort: function (data) {
                            console.log('data onSort', data);
                            this.set({
                                'current': data.context.name,
                                'sortValue.val': data.context.value
                            })
                            this.fire('toggle');
                            this.hasSelected();
                        },

                        reset: function (data) {

                        },
                        teardown: function (evt) {
                            console.log('teardown sort');
                            FilterThis = null;
                        }
                    });
                },

                sortDefault: function () {
                    var that = this;
                    
                    this.get('sort').filter(function (item) {
                        if (item.isChecked) {
                            that.set({
                                'current': item.name,
                                'sortValue.val': 'byPackagePrice'
                            })
                            that.hasSelected();

                            return true;
                        }
                    })
                }
            });

            return FilterSort;
        }]);


