angular.module('innaApp.components').
    factory('FilterAirPort', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

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
                init: function (options) {
                    this._super(options);
                    var that = this;

                    this._timeOut = null;
                    this._next = 0;

                    this.on({
                        onChecked: function (data) {
                            var result = this.get('airports').filter(function (filter) {
                                var r = filter.List.filter(function (item) {
                                    return item.isChecked
                                })
                                return r.length;
                            })

                            if (result.length)
                                this.set('value.val', result);
                            else
                                this.set('value.val', [])

                            this.hasSelected();
                        },

                        resetFilter: function (data) {
                            if (data && data.context) {
                                this.set(data.keypath + '.List.*.isChecked', false);
                            } else {
                                this.set('airports.*.List.*.isChecked', false);
                            }

                            this.set('value.val', this.filter());
                            this.hasSelected();
                        },
                        teardown: function (evt) {

                        }
                    });
                },

                /**
                 * Сбор данных, проходим по airports и
                 * собираем только те данные которые isChecked
                 * @returns {Array}
                 */
                filter: function () {
                    var result = this.get('airports').filter(function (item) {
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


                    var result = this.get('airports').filter(function (filter, i) {
                        var r = filter.List.filter(function (item, j) {
                            if (item.Code == data.Code) {
                                that.set('airports.' + i + '.List.' + j + '.isChecked', false);
                                item.isChecked = false;
                            }
                            return item.isChecked
                        })
                        return r.length;
                    });

                    if (result.length) this.set('value.val', result)
                    else this.set('value.val', [])
                    this.hasSelected();
                }


            });

            return FilterAirPort;
        }]);


