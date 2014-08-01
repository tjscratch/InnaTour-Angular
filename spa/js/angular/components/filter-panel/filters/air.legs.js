angular.module('innaApp.conponents').
    factory('FilterAviaLegs', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterThis = null;

            var FilterAviaLegs = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/avia.legs.hbs.html'),
                data: {
                    value: {
                        name: 'AirLegs',
                        val: [],
                        fn: function (data) {
                            var legsBoth = data.legsTo + data.legsBack;
                            var result = FilterThis.get('value.val').filter(function (item) {
                                if (item == 1) {
                                    if (legsBoth == 3 || legsBoth == 4) {
                                        return true;
                                    }
                                }
                                else if (item == 2) {
                                    if ((data.legsTo >= 3) || (data.legsBack >= 3)) {
                                        return true
                                    }
                                }
                            });
                            return (result.length) ? true : false;
                        }
                    }
                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;


                    this.on({
                        onChecked: function (data) {
                            if (data && data.context) {

                                if (data.context.isChecked) {
                                    this.push('value.val', data.context.value)
                                } else if (!data.context.isChecked) {
                                    this.splice('value.val', this.get('value.val').indexOf(data.context.value), 1);
                                }
                            }
                            this.hasSelected();
                        },
                        resetFilter: function () {
                            this.set('airLegs.list.*.isChecked', false);
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

            return FilterAviaLegs;
        }]);


