angular.module('innaApp.conponents').
    factory('FilterAirPort', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterThis = null;

            var FilterAirPortItem = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ-micro/avia.airports-item.hbs.html'),
                data: {

                },
                init: function () {
                    console.log(this);

                    this.on({
                        change: function (data) {
                            console.log(data);
                        },
                        resetFilter: function () {
                            console.log('reset');
                            this.set('airport.list.*.isChecked', false);
                        }
                    })
                }
            });

            var FilterAirPort = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/avia.airports.hbs.html'),
                data: {
                    value: {
                        name: 'FilterAirPort',
                        val: '',
                        fn: function (data) {

                        }
                    }
                },
                components : {
                    FilterAirPortItem : FilterAirPortItem
                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;

                    this._timeOut = null;
                    this._next = 0;

                    this.on({
                        change: function (data) {
                            console.log(data, 'sakdhdjf');
                        },
                        resetFilter: function () {
                            console.log('reset');

                            this.set({
                                'value.val': [],
                                'name.value': '',
                                'isOpen': false
                            });
                        },
                        teardown: function (evt) {
                            FilterThis = null;
                        }
                    });
                },

                parse: function (end) {

                },


                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return FilterAirPort;
        }]);


