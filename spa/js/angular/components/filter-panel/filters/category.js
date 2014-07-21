angular.module('innaApp.conponents').
    factory('FilterCategory', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterCategory = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/category.hbs.html'),
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

            return FilterCategory;
        }]);


