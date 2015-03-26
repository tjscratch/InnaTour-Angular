angular.module('innaApp.components').
    factory('FilterExtra', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',

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

                onrender: function (options) {
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
                                    this.spliceValItem(data.context.Value, 'Value');
                                    this.spliceSaveData(data.context);
                                }

                                this.fire('onCheckedFilter', {
                                    name : this.get('value.name'),
                                    value : this.get('value')
                                });
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

                mergeData: function () {
                    var that = this;

                    if (this.SaveData.length && this.get('FilterData.List').length) {
                        this.set({
                            'value.val': [],
                            'hasSelected': false
                        });
                        this.get('FilterData.List').forEach(function (item, i) {
                            that.SaveData.filter(function (saveItem) {
                                if (item.Value == saveItem.Value) {
                                    var updateItem = angular.extend(saveItem, item);
                                    that.set('FilterData.List.' + i, updateItem);
                                    that.push('value.val', updateItem);
                                    return true;
                                }
                            });
                        });
                    }
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

                    this.fire('onCheckedFilter', {
                        name : this.get('value.name'),
                        value : this.get('value')
                    });
                    this.hasSelected();
                }
            });

            return FilterExtra;
        }]);


