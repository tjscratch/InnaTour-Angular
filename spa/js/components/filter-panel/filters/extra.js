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
                    this.SaveData = [];


                    this.on({
                        change: function (data) {

                        },

                        onChecked: function (data) {
                            var that = this;
                            if (data && data.context) {
                                if (data.context.isChecked) {
                                    this.SaveData.push(data.context);
                                    this.push('value.val', data.context);
                                } else if (!data.context.isChecked) {
                                    this.splice('value.val', this.get('value.val').indexOf(data.context.Value), 1);
                                    this.spliceSaveData(data.context);
                                }
                                this._parent.fire('changeChildFilter', this.get('value.val'));
                                this.hasSelected();
                            }
                        },
                        resetFilter: function () {
                            this.set('FilterData.List.*.isChecked', false);
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

                    this.get('FilterData.List').forEach(function (item, i) {
                        if (item.Value == data.Value) {
                            that.set('FilterData.List.' + i + '.isChecked', false);
                            that.SaveData.splice(i, 1);
                        }
                    })

                    this._parent.fire('changeChildFilter', this.get('value.val'));
                    this.hasSelected();
                }
            });

            return FilterExtra;
        }]);


