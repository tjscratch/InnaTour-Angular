angular.module('innaApp.components').
    factory('FilterExtra', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterExtra = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/extra.hbs.html'),
                data: {
                    value: {
                        name: 'Extra',
                        val: [],
                        fn: function (data, component_val) {
                            if (typeof data == 'object' && Object.keys(data).length) {
                                var result = component_val.val.filter(function (filterExtra) {
                                    return data[filterExtra.Value] != undefined
                                })
                                return (component_val.val.length == result.length)
                            }
                        }
                    }
                },

                init: function (options) {
                    this._super(options);
                    var that = this;


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
                                        if (data.context.Value == item.Value) that.splice('value.val', i, 1);
                                    })
                                }
                                this._parent.fire('changeChildFilter', this.get('value.val'));
                                this.hasSelected();
                            }
                        },
                        resetFilter: function () {
                            this.set('Extra.List.*.isChecked', false);
                        },
                        teardown: function (evt) {

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
                        if (data.Value == item.Value) that.splice('value.val', i, 1);
                    })

                    this.get('Extra.List').forEach(function (item, i) {
                        if (item.Value == data.Value) {
                            that.set('Extra.List.' + i + '.isChecked', false);
                        }
                    })

                    this._parent.fire('changeChildFilter', this.get('value.val'));
                    this.hasSelected();
                }
            });

            return FilterExtra;
        }]);


