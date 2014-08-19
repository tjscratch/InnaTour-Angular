angular.module('innaApp.components').
    factory('FilterAviaLegs', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterAviaLegs = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/avia.legs.hbs.html'),
                data: {
                    value: {
                        name: 'AirLegs',
                        val: [],
                        fn: function (data, component_val) {
                            var legsBoth = data.legsTo + data.legsBack;
                            var result = component_val.val.filter(function (item) {
                                if (item.Value == 1 && legsBoth == 2) {
                                    return true;
                                }
                                else if (item.Value == 2) {
                                    if (legsBoth == 3 || legsBoth == 4) {
                                        return true;
                                    }
                                }
                                else if (item.Value == 3) {
                                    if ((data.legsTo >= 3) || (data.legsBack >= 3)) {
                                        return true
                                    }
                                }
                            });
                            return (result.length) ? true : false;
                        }
                    }
                },
                init: function (options) {
                    this._super(options);
                    var that = this;


                    this.on({
                        onChecked: function (data) {
                            if (data && data.context) {

                                if (data.context.isChecked) {
                                    this.push('value.val', data.context)
                                } else if (!data.context.isChecked) {
                                    this.get('value.val').forEach(function (item, i) {
                                        if (data.context.Value == item.Value) that.splice('value.val', i, 1);
                                    })
                                }
                            }
                            this.hasSelected();
                        },
                        resetFilter: function () {
                            this.set('AirLegs.List.*.isChecked', false);
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
                    /*this.splice('value.val', this.get('value.val').indexOf(data), 1);

                    this.get('airLegs.List').forEach(function (item, i) {
                        if (item.Value == data) {
                            that.set('airLegs.List.' + i + '.isChecked', false);
                        }
                    })*/

                    this.get('value.val').forEach(function (item, i) {
                        if (data.Value == item.Value) that.splice('value.val', i, 1);
                    })

                    this.get('AirLegs.List').forEach(function (item, i) {
                        if (item.Value == data.Value) {
                            that.set('AirLegs.List.' + i + '.isChecked', false);
                        }
                    })

                    this.hasSelected();
                }

            });

            return FilterAviaLegs;
        }]);


