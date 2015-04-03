angular.module('innaApp.components').
    factory('FilterTime', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            /**
             * Главный компонент FilterTime имеет набор данных airTime
             * Дочерние компоненты соответственно имеют тот же самый набор
             * Тем самым изменяя данные дочерними компонентами,
             * parent может отслеживать изменения в общем наборе данных
             *
             *
             * getDesignationDayTime
             *  'Утро', 6, 12,
             *  'День', 12, 18,
             *  'Вечер', 18, 24
             *  'Ночь', 0, 6
             *
             * @type {null}
             */
            var FilterTime = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/time.hbs.html'),
                data: {
                    value: {
                        name: 'DepartureDate',
                        val: [],

                        // todo: получает на вход сам item билета
                        // немного сложная фильтрация
                        fn: function (data_item, component_val) {
                            var data = angular.copy(data_item);
                            data_item = null;

                            var partDaysConf = [
                                {
                                    value: 'Morning',
                                    start: '6',
                                    end: '11:59'
                                },
                                {
                                    value: 'Afternoon',
                                    start: '12',
                                    end: '17:59'
                                },
                                {
                                    value: 'Evening',
                                    start: '18',
                                    end: '23:59'
                                },
                                {
                                    value: 'Night',
                                    start: '0',
                                    end: '5:59'
                                }
                            ];

                            if (!data.DepartureDate) throw new Error('error');


                            // проходим по собранным значениям
                            var resultFilterTimeDate = component_val.val.filter(function (item) {

                                // берем дату - значения направления
                                // предполагаем что дата валидна
                                var stateResult = item.state.filter(function (st) {
                                    return st.isActive;
                                });


                                var timeTicket = moment(data[stateResult[0].value]);
                                var hours = timeTicket.hours();
                                var minute = timeTicket.minute();

                                //console.log(hours+':'+minute);

                                /** если есть минуты, то к часу прибавляем еще один час */
                                //if (minute) hours + 1


                                /** выбранные части дня */

                                var resultPartDay = item.dayState.filter(function (dayItem) {

                                    if (!dayItem.isChecked) return false;


                                    // получаем выбранную часть дня
                                    var partDay = (function (part) {
                                        var result = partDaysConf.filter(function (dayTime) {
                                            return dayTime.value == part;
                                        });
                                        return result[0];
                                    }(dayItem.state))


                                    /**
                                     * сравниваем часть дня и время вылета - прилета
                                     * если время входит в диапазон части дня, то возвращаем true
                                     */
                                    //console.log(hours, partDay.start, partDay.end);
                                    if (hours >= partDay.start) {
                                        var endTime = partDay.end.split(':'),
                                            endTimeHours = endTime[0],
                                            endTimeMinutes = endTime[1];

                                        if ((hours <= endTimeHours) && (minute <= endTimeMinutes)) {
                                            return true;
                                        }
                                    }
                                });


                                /** Если хоть одна часть дня есть во времени билета */
                                if (resultPartDay.length) return true;
                            });

                            // если хоть какой то вернулься результат фильтрации
                            if (resultFilterTimeDate.length) {
                                if (component_val.val.length == resultFilterTimeDate.length) {
                                    return true;
                                }
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

                        filterChange: function (data) {
                            this.set('value.val', this.filter());
                            this.fire('onCheckedFilter', {
                                name : this.get('value.name'),
                                value : this.get('value')
                            });
                            this.hasSelected();
                        },

                        changeState: function (data) {
                            this.set('value.val', this.filter());
                            if(this.get('value.val') && this.get('value.val').length){
                                this.fire('onCheckedFilter', {
                                    name : this.get('value.name'),
                                    value : this.get('value')
                                });
                            }
                        },

                        resetItem: function (data) {
                            var that = this;

                            if (data && data.context) {
                                this.get('FilterData').forEach(function (item, i) {
                                    if (item.direction == data.context.direction) {
                                        that.set('FilterData.' + i + '.state.0.isActive', true);
                                        that.set('FilterData.' + i + '.state.1.isActive', false);
                                        that.set('FilterData.' + i + '.dayState.*.isChecked', false);
                                    }
                                });
                            }

                            this.set('value.val', this.filter());
                            this.fire('onCheckedFilter', {
                                name : this.get('value.name'),
                                value : this.get('value')
                            });
                            this.hasSelected();
                        },

                        resetFilter: function (data) {
                            this.set('FilterData.*.state.0.isActive', true);
                            this.set('FilterData.*.state.1.isActive', false);
                            this.set('FilterData.*.dayState.*.isChecked', false);
                        },

                        teardown: function (evt) {

                        }
                    });
                },

                /**
                 * Сбор данных, проходим по airTime и
                 * собираем только те данные которые isActive или isChecked
                 * @returns {Array}
                 */
                filter: function () {
                    var result = this.get('FilterData').filter(function (item) {
                        var dayStateResult = item.dayState.filter(function (st) {
                            return st.isChecked ? true : false;
                        });

                        if (dayStateResult.length) return true;
                    });

                    this.SaveData = result;
                    return result;
                },


                mergeData: function () {
                    if (this.SaveData.length)
                        this.set('FilterData', this.SaveData);
                },

                /**
                 * @param context
                 * @override
                 */
                spliceSaveData: function () {
                    this.filter();
                },


                /**
                 * Копипаста метода filter
                 *
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove: function (data) {
                    this._super(data);
                    var that = this;

                    this.spliceSaveData();

                    this.get('FilterData').forEach(function (item, i) {
                        item.dayState.forEach(function (st, j) {
                            if ((item.direction == data.direction) && (st.state == data.state)) {
                                that.set('FilterData.' + i + '.dayState.' + j + '.isChecked', false);
                                st.isChecked = false;
                            }
                        });
                    });

                    this.fire('filterChange');
                    this.fire('onCheckedFilter', {
                        name : this.get('value.name'),
                        value : this.get('value')
                    });
                    this.hasSelected();
                }
            });

            return FilterTime;
        }]);


