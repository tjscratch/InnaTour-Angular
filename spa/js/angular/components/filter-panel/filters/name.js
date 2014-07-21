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
                    value: {
                        name: 'HotelName',
                        val: []
                    }
                },
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;

                    var setName = _.throttle(function(data){
                        that.set('value.val', data);
                        console.log('onChecked', that.get('name.value'), data);
                    }, 1500);

                    this.on({
                        change: function (data) {

                            if (data && this.get('name.value')) {
                                if (this.get('name.value').length) {
                                    var nameData = this.get('name.value').toLowerCase();
                                    setName(nameData);
                                } else {
                                    that.set('value.val', [])
                                }
                            }
                        }
                    });
                },

                changeName: function (data) {
                    var that = this;


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


