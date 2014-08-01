angular.module('innaApp.conponents').
    factory('FilterAirline', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'FilterSettings',
        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, FilterSettings, ClassFilter) {

            var FilterThis = null;

            var FilterAirline = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/avia.airlines.hbs.html'),
                data: {
                    value: {
                        name: 'collectAirlines',
                        val: [],
                        fn: function (data) {
                            if (data.length) {
                                var resultFilter = data.filter(function (airline) {
                                    var result = FilterThis.get('value.val').filter(function (airline_local) {
                                        return airline_local == airline;
                                    })
                                    return (result.length) ? true : false;
                                })
                                return (resultFilter.length) ? true : false;
                            }
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

                        onChecked: function (data) {
                            if (data && data.context) {
                                if (data.context.isChecked) {
                                    this.push('value.val', data.context.name)
                                } else if (!data.context.isChecked) {
                                    this.splice('value.val', this.get('value.val').indexOf(data.context.name), 1);
                                }
                            }
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


