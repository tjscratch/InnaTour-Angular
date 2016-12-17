angular.module('innaApp.components').
    factory('FilterSort', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',

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
                        defaultSort: 'byProfit'
                    }
                },
                onrender: function (options) {
                    this._super(options);
                    var that = this;

                    this.on({
                        onSort: function (data) {
                            this.set({
                                'current': data.context.name,
                                'sortValue.val': data.context.value
                            });

                            this.fire('toggle');
                            this.fire('onSorting', this.get('sortValue'));
                            this.hasSelected();
                        },
                        teardown: function (evt) {
                            this.set('Sort.*.isChecked', false);
                            this.set('Sort.0.isChecked', true)
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
                    this.get('Sort').find(function (item) {
                        if (item.isChecked) {
                            that.set({
                                'current': item.name,
                                'sortValue.val': 'byProfit'
                            });
                            that.fire('onSorting', that.get('sortValue'));
                            that.hasSelected();
                            return true;
                        }
                    })
                }
            });

            return FilterSort;
        }]);


