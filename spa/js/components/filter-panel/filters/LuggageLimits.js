angular.module('innaApp.components').
    factory('FilterLuggageLimits',
    function (EventManager, $filter, $templateCache, $routeParams, ClassFilter) {

        var FilterLuggageLimits = ClassFilter.extend({

            template: $templateCache.get('components/filter-panel/templ-filters/avia.bagage.hbs.html'),

            data: {
                value: {
                    name: 'LuggageLimits',
                    val: [],
                    /**
                     *
                     * @param data фильтруемый объект
                     * @param filter фильтры
                     * @returns {boolean}
                     */
                    fn: function (data, filter) {

                        var result = [];

                        _(filter.val).forEach(function (fl) {
                            var eq;

                            // ищем бесплатный багаж
                            // если в фильтруемом объекте у всех сегментов перелета один тип багажа
                            // и он не равен "Платный багаж"
                            // и равен текущему фильтру fl то этот билет нам подходит кладем его в массив
                            if (data.length == 1 && data[0] != "Платный багаж" && fl != "Платный багаж") {
                                eq = data[0];
                                if (fl == eq) {
                                    result.push(fl);
                                }
                            }

                            // платный багаж во всех сегментах перелета
                            if (data.length == 1 && data[0] == "Платный багаж" && fl == "Платный багаж") {
                                result.push(fl);
                            }

                            // сегментов больше 1
                            // платный багаж хотя бы в одном сегменте
                            if (data.length > 1 && _.include(data, "Платный багаж") && fl == "Платный багаж") {
                                result.push(fl);
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
    });


