angular.module('innaApp.components').
    factory('FilterAirPort', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterAirPortItem = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ-micro/avia.airports-item.hbs.html'),
                init: function () {
                    this.on({
                        resetFilter: function () {
                            this.set('airport.list.*.isChecked', false);
                        }
                    })
                }
            });


            var FilterAirPort = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/avia.airports.hbs.html'),
                data: {
                    value: {
                        name: 'AirportFrom',
                        val: [],
                        fn: function (data, component_val) {

                            var result = component_val.val.filter(function (airport) {
                                if (!data[airport.state]) return false;

                                var result = airport.list.filter(function (item) {
                                    return (item.isChecked && (data[airport.state] == item.name));
                                })

                                return result.length;
                            });

                            return  (result.length == component_val.val.length);
                        }

                    }
                },
                components: {
                    FilterAirPortItem: FilterAirPortItem
                },
                init: function (options) {
                    this._super(options);
                    var that = this;

                    this._timeOut = null;
                    this._next = 0;

                    this.on({
                        change: function (data) {

                            /**
                             * Собираем данные, отмеченные аэропорты
                             * Берем направление и смотрим какие из значений отмечены - isChecked
                             *
                             * data['airports.0'] == from
                             * data['airports.1'] == to
                             */

                            if (data['airports.0'] || data['airports.1']) {

                                var result = this.get('airports').filter(function (filter) {
                                    var r = filter.list.filter(function (item) {
                                        return item.isChecked
                                    })
                                    return r.length;
                                })


                                if (result.length) this.set('value.val', result)
                                else this.set('value.val', [])
                                this.hasSelected();
                            }
                        },

                        resetFilter: function () {

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


                    var result = this.get('airports').filter(function (filter, i) {
                        var r = filter.list.filter(function (item, j) {
                            if(item.name == data.name) {
                                that.set('airports.' + i + '.list.' + j + '.isChecked', false);
                                item.isChecked = false;
                            }
                            return item.isChecked
                        })
                        return r.length;
                    })


                    if (result.length) this.set('value.val', result)
                    else this.set('value.val', [])
                    this.hasSelected();
                }


            });

            return FilterAirPort;
        }]);


