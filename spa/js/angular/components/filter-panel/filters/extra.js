angular.module('innaApp.conponents').
    factory('FilterExtra', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterThis = null;
            var FilterExtra = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/extra.hbs.html'),
                data: {
                    value: {
                        name: 'Extra',
                        val: [],
                        fn: function (data) {
                            if (typeof data == 'object' && Object.keys(data).length) {
                                var result = FilterThis.get('value.val').filter(function (filterExtra) {
                                    return data[filterExtra.value] != undefined
                                })
                                return (FilterThis.get('value.val').length == result.length)
                            }
                        }
                    }
                },
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;

                    this.on({
                        change: function (data) {

                        },

                        /**
                         * nameExtra для вывода названия на русском справа панели
                         * indicator-filters
                         * @param data
                         */
                        onChecked: function (data) {
                            var that = this;
                            if (data && data.context) {
                                if (data.context.isChecked) {
                                    this.push('value.val', data.context);
                                } else if (!data.context.isChecked) {

                                    this.get('value.val').forEach(function (item, i) {
                                        if (data.context.value == item.value) that.splice('value.val', i, 1);
                                    })
                                }
                            }
                            this.hasSelected();
                        },
                        resetFilter: function () {
                            this.set('Extra.list.*.isChecked', false);
                        },
                        teardown: function (evt) {
                            FilterThis = null;
                        }
                    })
                },

                /**
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove: function (data) {
                    this._super(data);
                    var that = this;


                    this.get('value.val').forEach(function (item, i) {
                        if (data.value == item.value) that.splice('value.val', i, 1);
                    })

                    this.get('Extra.list').forEach(function (item, i) {
                        if (item.value == data.value) {
                            that.set('Extra.list.' + i + '.isChecked', false);
                        }
                    })

                    this.hasSelected();
                }
            });

            return FilterExtra;
        }]);


