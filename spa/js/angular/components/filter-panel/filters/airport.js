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
                                if (!data[airport.State]) return false;
                                if(airport.State == 'AirportTo'){
                                    return (data['InCode'] == airport.Code);
                                } else if(airport.State == 'AirportFrom'){
                                    return (data['OutCode'] == airport.Code);
                                }
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
                        change: function (data) {

                        },

                        onChecked: function (data) {
                            var that = this;
                            if (data && data.context) {
                                if (data.context.isChecked) {
                                    this.push('value.val', data.context);
                                } else if (!data.context.isChecked) {
                                    this.get('value.val').forEach(function (item, i) {
                                        if (data.context.Code == item.Code) that.splice('value.val', i, 1);
                                    })
                                }
                            }
                            this.hasSelected();
                        },

                        resetFilter: function () {
                            this.set('airports.*.List.*.isChecked', false);
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


                    this.get('value.val').forEach(function (item, i) {
                        if (data.Code == item.Code) that.splice('value.val', i, 1);
                    })

                    this.get('airports').forEach(function (airport, i) {
                        airport.List.filter(function (item, j) {
                            if(item.Code == data.Code) {
                                that.set('airports.' + i + '.List.' + j + '.isChecked', false);
                                item.isChecked = false;
                            }
                            return item.isChecked
                        })
                    })
                    this.hasSelected();
                }


            });

            return FilterAirPort;
        }]);


