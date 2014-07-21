angular.module('innaApp.conponents').
    factory('FilterStars', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        'Stars',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter, Stars) {

            var FilterStars = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/stars.hbs.html'),
                data: {},
                init: function (options) {
                    this._super(options);
                    var that = this;

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {

                        }
                    })
                },

                components : {
                    Stars : Stars
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

            return FilterStars;
        }]);


