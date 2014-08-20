angular.module('innaApp.components').
    factory('FilterSort', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {


            var FilterSort = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/sort.hbs.html'),
                data: {
                    lowercaseFirst: $filter('lowercaseFirst'),
                    current: '',
                    sortValue: {
                        name: 'Sort',
                        val: '',
                        defaultSort: 'byPackagePrice'
                    },
                    fn: function (data, component_val) {
                        if (!data || !data.length) return false;

                        var sortType = {
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
                            byName: 'HotelName',
                            byProfit: '-getProfit'
                        };


                        var val = component_val.val;
                        var defaultSort = component_val.defaultSort;
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

                    this.on({
                        onSort: function (data) {
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

                        }
                    });

                    EventManager.on(Events.DYNAMIC_SERP_MAP_DESTROY, function () {
                        that.set('asMap', false);
                    });
                },

                /**
                 * Настройка сортировки поумолчанию устанавливается
                 * в filter-settings.js
                 * sort -> isChecked: true
                 */
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


