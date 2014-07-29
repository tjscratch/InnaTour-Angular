angular.module('innaApp.conponents').
    factory('FilterAirline', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'FilterSettings',
        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, FilterSettings,  ClassFilter) {

            var FilterThis = null;

            var FilterAirline = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/avia.airlines.hbs.html'),
                data: {
                    value: {
                        name: 'FilterAirline',
                        val: '',
                        fn: function (data) {

                        }
                    }
                },
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;

                    this._timeOut = null;

                    this.on({
                        change: function (data) {
                            console.log(data, 'airline');
                        },
                        resetFilter: function () {
                            this.set('airlines.*.isChecked', false);
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

            return FilterAirline;
        }]);


