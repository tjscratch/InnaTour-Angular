angular.module('innaApp.conponents').
    factory('FilterName', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterName = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/name.hbs.html'),
                data: {
                    value : {
                        name : 'name',
                        val : ''
                    }
                },
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

                    this.observe('name.*', function (newValue, oldValue) {
                        console.log('newValue', newValue);

                        if (newValue && newValue.length) {
                            this.set('value.val', newValue)
                        } else {
                            this.set('value.val', '')
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

            return FilterName;
        }]);


