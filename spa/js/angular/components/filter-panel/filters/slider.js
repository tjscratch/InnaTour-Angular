angular.module('innaApp.conponents').
    factory('FilterSlider', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterSlider = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/slider.hbs.html'),
                data: {},
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {
                            FilterThis = null;
                        }
                    })
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

            return FilterSlider;
        }]);


