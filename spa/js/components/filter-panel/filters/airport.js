angular.module('innaApp.components').
    factory('FilterAirPort', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterAirPort = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/avia.airports.hbs.html'),
                data: {
                    value: {
                        name: 'AirportFrom',
                        val: [],
                        fn: function (data, component_val) {

                            var result = component_val.val.filter(function (airport) {

                                var result = airport.List.filter(function (item) {
                                    //console.log(item.Code, data['OutCode']);

                                    if (airport.State == 'AirportTo') {
                                        return (item.isChecked && (data['InCode'] == item.Code));
                                    } else if (airport.State == 'AirportFrom') {
                                        return (item.isChecked && (data['OutCode'] == item.Code));
                                    }
                                })

                                return result.length;
                            });

                            return  (result.length == component_val.val.length);
                        }

                    }
                },
                onrender: function (options) {
                    this._super(options);
                    var that = this;
                    this.SaveData = [];

                    this._timeOut = null;
                    this._next = 0;

                    this.on({
                        onChecked: function (data) {

                            /* сборка для сохранения фильтров */
                            if (data && data.context) {
                                if (data.context.isChecked)
                                    this.SaveData.push(data.context);
                                else if (!data.context.isChecked)
                                    this.spliceSaveData(data.context);
                            }


                            this.filterAirport();

                            this.fire('onCheckedFilter', {
                                name : this.get('value.name'),
                                value : this.get('value')
                            });
                            this.hasSelected();
                        },

                        resetItem: function (data) {
                            if (data && data.context) {
                                this.set(data.keypath + '.List.*.isChecked', false);
                                this.set('value.val', this.filter());
                                this.fire('onCheckedFilter', {
                                    name : this.get('value.name'),
                                    value : this.get('value')
                                });
                                this.hasSelected();
                            }
                        },

                        resetFilter: function (data) {
                           this.set('FilterData.*.List.*.isChecked', false);
                        },
                        teardown: function (evt) {

                        }
                    });
                },

                filterAirport : function(){
                    var result = this.get('FilterData').filter(function (filter) {
                        var r = filter.List.filter(function (item) {
                            return item.isChecked;
                        });
                        return r.length;
                    })

                    if (result.length) {
                        this.set('value.val', result);
                    }
                    else {
                        this.set('value.val', []);
                    }
                },

                mergeData: function () {
                    var that = this;

                    if (this.SaveData.length) {
                        this.get('FilterData').forEach(function (item, i) {
                            if (item.List.length) {
                                item.List.forEach(function (itemList, j) {
                                    that.SaveData.filter(function (saveItem) {
                                        if (itemList.Code == saveItem.Code) {
                                            that.set('FilterData.' + i + '.List.' + j, angular.extend(saveItem, itemList));
                                            return true;
                                        }
                                    });
                                })
                            }
                        });
                        //this.filterAirport();
                    }
                },

                spliceSaveData: function (context) {
                    var that = this;

                    if (this.SaveData.length) {
                        this.SaveData.forEach(function (item, i) {
                            if (context.Code == item.Code) {
                                that.SaveData.splice(i, 1);
                            }
                        });
                    }
                },


                /**
                 * Сбор данных, проходим по airports и
                 * собираем только те данные которые isChecked
                 * @returns {Array}
                 */
                filter: function () {
                    var result = this.get('FilterData').filter(function (item) {
                        var airport = item.List.filter(function (st) {
                            return st.isChecked ? true : false;
                        });
                        if (airport.length) return true;
                    });

                    return result;
                },

                /**
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove: function (data) {
                    this._super(data);
                    var that = this;


                    var result = this.get('FilterData').filter(function (filter, i) {
                        var r = filter.List.filter(function (item, j) {
                            if (item.Code == data.Code) {
                                that.set('FilterData.' + i + '.List.' + j + '.isChecked', false);
                                that.SaveData.splice(j, 1);
                                item.isChecked = false;
                            }
                            return item.isChecked
                        })
                        return r.length;
                    });

                    if (result.length) this.set('value.val', result)
                    else this.set('value.val', [])

                    this.fire('onCheckedFilter', {
                        name : this.get('value.name'),
                        value : this.get('value')
                    });
                    this.hasSelected();
                }


            });

            return FilterAirPort;
        }]);


