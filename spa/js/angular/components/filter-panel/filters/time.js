angular.module('innaApp.conponents').
    factory('FilterTime', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

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

            var FilterThis = null;

            var AviaTimeItem = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ-micro/time-item.hbs.html'),
                init: function () {
                    this.on({
                        resetFilter: function (data) {
                            this.set({
                                'data.state.0.isActive': true,
                                'data.state.1.isActive': false
                            });
                            this.set('data.dayState.*.isChecked', false);

                            this._parent.fire('resetFilter', data)
                        },
                        changeDay: function (data) {
                            this._parent.fire('filterChange', data)
                        },
                        changeState : function(data){
                            this._parent.fire('changeState', data)
                        }
                    })
                }
            });


            var FilterTime = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/time.hbs.html'),
                data: {
                    partDay: [
                        {
                            value: 'Morning',
                            start: '6',
                            end: '12'
                        },
                        {
                            value: 'Afternoon',
                            start: '12',
                            end: '18'
                        },
                        {
                            value: 'Evening',
                            start: '18',
                            end: '24'
                        },
                        {
                            value: 'Night',
                            start: '0',
                            end: '6'
                        }
                    ],

                    value: {
                        name: 'DepartureDate',
                        val: [],

                        // todo: получает на вход сам item билета
                        // немного сложная фильтрация
                        fn: function (data_item) {
                            var data = angular.copy(data_item);
                            data_item = null;

                            if (!data.DepartureDate) throw new Error('error');


                            // проходим по собранным значениям
                            var resultFilterTimeDate = FilterThis.get('value.val').filter(function (item) {

                                // берем дату - значения направления
                                // предполагаем что дата валидна
                                var stateResult = item.state.filter(function (st) {
                                    return st.isActive;
                                });


                                var timeTicket = moment(data[stateResult[0].value]);
                                var hours = timeTicket.hours();
                                var minute = timeTicket.minute();

                                /** если есть минуты, то к часу прибавляем еще один час */
                                //if (minute) hours + 1


                                /** выбранные части дня */

                                var resultPartDay = item.dayState.filter(function (dayItem) {

                                    if (!dayItem.isChecked) return false;


                                    // получаем выбранную часть дня
                                    var partDay = FilterThis.getPartDay(dayItem.state);

                                    /**
                                     * сравниваем часть дня и время вылета - прилета
                                     * если время входит в диапазон части дня, то возвращаем true
                                     */
                                    //console.log(hours, partDay.start, partDay.end);

                                    if ((hours >= partDay.start) && (hours <= partDay.end)) {
                                        return true;
                                    }
                                });


                                /** Если хоть одна часть дня есть во времени билета */
                                if (resultPartDay.length) return true;
                            });

                            // если хоть какой то вернулься результат фильтрации
                            if (resultFilterTimeDate.length) {
                                // условие AND
                                if (FilterThis.get('value.val').length == resultFilterTimeDate.length) {
                                    return true;
                                }
                            }


                        }
                    }
                },


                components: {
                    AviaTimeItem: AviaTimeItem
                },

                init: function (options) {

                    this._super(options);

                    var that = this;

                    FilterThis = this;

                    this.on({
                        change: function (data) {
                        },

                        filterChange: function (data) {
                            this.set('value.val', this.filter());
                        },

                        changeState : function(){
                            this.set('value.val', this.filter());
                        },

                        resetFilter : function(){
                            this.set('value.val', this.filter());
                        },

                        teardown: function (evt) {
                            FilterThis = null;
                        }
                    });
                },

                /**
                 * Сбор данных, проходим по airTime и
                 * собираем только те данные которые isActive или isChecked
                 * @returns {Array}
                 */
                filter: function () {
                    var airTime = [].concat(this.get('airTime'));

                    var result = airTime.filter(function (item) {
                        var dayStateResult = item.dayState.filter(function (st) {
                            return st.isChecked ? true : false;
                        });
                        if (dayStateResult.length) return true;
                    });

                    return result;
                },

                getPartDay: function (part) {
                    var result = this.get('partDay').filter(function (dayTime) {
                        return dayTime.value == part;
                    });
                    return result[0];
                },

                parse: function (data) {

                }
            });

            return FilterTime;
        }]);


