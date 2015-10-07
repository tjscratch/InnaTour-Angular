angular.module('innaApp.components').
    factory('FilterLuggageLimits', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterLuggageLimits = ClassFilter.extend({

                template: $templateCache.get('components/filter-panel/templ-filters/avia.luggagelimits.hbs.html'),

                data: {
                    value: {
                        name: 'LuggageLimits',
                        val: [],
                        fn: function (data, filter) {
                            var result = [];
                            _(filter.val).forEach(function (f) {
                                if (_.include(data, f)){
                                    result.push(f);
                                }
                            });
                            return (result.length) ? true : false;
                        }
                    }
                },

                onrender: function (options) {
                    this._super(options);
                    var that = this;
                    this.SaveData = [];

                    this._timeOut = null;

                    this.on({

                        onChecked: function (data) {
                            if (data && data.context) {
                                
                                if (data.context.isChecked) {
                                    this.SaveData.push(data.context);
                                    this.push('value.val', data.context.Name)
                                } else if (!data.context.isChecked) {
                                    this.spliceValItem(data.context.Name);
                                    this.spliceSaveData(data.context);
                                }
                                
                                this.fire('onCheckedFilter', {
                                    name: this.get('value.name'),
                                    value: this.get('value')
                                });
                                
                                this.hasSelected();
                                
                            }
                        },
                        resetFilter: function () {
                            this.set('FilterData.List.*.isChecked', false);
                        },
                        teardown: function (evt) {
                        }
                    });
                },


                mergeData: function () {
                    var that = this;

                    if (this.SaveData.length && this.get('FilterData.List').length) {
                        this.get('FilterData.List').forEach(function (item, i) {

                            that.SaveData.filter(function (saveItem) {
                                if (item.Name == saveItem.Name) {
                                    that.set('FilterData.List.' + i, angular.extend(saveItem, item));
                                    return true;
                                }
                            });
                        });
                    }
                },

                spliceSaveData: function (context) {
                    var that = this;

                    if (this.SaveData.length) {
                        this.SaveData.forEach(function (item, i) {
                            if (context.Name == item.Name) {
                                that.SaveData.splice(i, 1);
                            }
                        });
                    }
                },


                spliceValItem: function (data) {
                    var that = this;
                    var val = this.get('value.val');

                    if (val.length) {
                        val.forEach(function (item, i) {
                            if (data == item)
                                that.splice('value.val', i, 1);
                        })
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
                        if (data == item) that.splice('value.val', i, 1);
                    })

                    this.get('FilterData.List').forEach(function (item, i) {
                        if (item.Name == data) {
                            that.set('FilterData.List.' + i + '.isChecked', false);
                            that.SaveData.splice(i, 1);
                        }
                    });

                    this.fire('onCheckedFilter', {
                        name: this.get('value.name'),
                        value: this.get('value')
                    });
                    this.hasSelected();
                }

            });

            return FilterLuggageLimits;
        }]);


