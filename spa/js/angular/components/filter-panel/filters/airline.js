angular.module('innaApp.components').
    factory('FilterAirline', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterAirline = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/avia.airlines.hbs.html'),
                data: {
                    value: {
                        name: 'collectAirlines',
                        val: [],
                        fn: function (data, component_val) {
                            if (data.length) {
                                var resultFilter = data.filter(function (airline) {
                                    var result = component_val.val.filter(function (airline_local) {
                                        return airline_local == airline;
                                    })
                                    return (result.length) ? true : false;
                                })
                                return (resultFilter.length) ? true : false;
                            }
                        }
                    }
                },

                init: function (options) {
                    this._super(options);
                    var that = this;

                    this._timeOut = null;

                    this.on({

                        onChecked: function (data) {
                            if (data && data.context) {
                                if (data.context.isChecked) {
                                    this.push('value.val', data.context.name)
                                } else if (!data.context.isChecked) {
                                    this.splice('value.val', this.get('value.val').indexOf(data.context.name), 1);
                                }
                                this.hasSelected();
                            }
                        },
                        resetFilter: function () {
                            this.set('airlines.*.isChecked', false);
                        },
                        teardown: function (evt) {
                        }
                    });
                },

                /**
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove: function (data) {
                    this._super(data);
                    var that = this;



                    this.get('value.val').forEach(function (item, i) {
                        if (data == item) that.splice('value.val', i, 1);
                    })

                    this.get('airlines').forEach(function (item, i) {
                        if (item.name == data) {
                            that.set('airlines.' + i + '.isChecked', false);
                        }
                    })

                    this.hasSelected();
                }

            });

            return FilterAirline;
        }]);


