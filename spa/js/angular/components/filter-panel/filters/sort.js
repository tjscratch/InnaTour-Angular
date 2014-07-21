angular.module('innaApp.conponents').
    factory('FilterSort', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterSort = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/sort.hbs.html'),
                data: {},
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;

                    this.on({
                        selectSort : this.selectSort
                    })
                },


                parse: function (end) {

                },


                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                selectSort : function(val){
                    console.log(val);
                },

                complete: function (data) {

                }
            });

            return FilterSort;
        }]);


