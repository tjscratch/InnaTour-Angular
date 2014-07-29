angular.module('innaApp.conponents').
    factory('FilterTime', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterThis = null;

            var AviaTimeItem = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ-micro/time-item.hbs.html'),
                data : {
                    value : {

                    }
                },
                init: function (options) {
                    this.on({
                        change : function(data){
                            console.log('change');
                        },
                        changeState : function(data){

                        },
                        resetFilter : function(data){
                            this.set({
                                'data.state.0.isActive': true,
                                'data.state.1.isActive': false
                            });

                            this.set('data.dayState.*.isChecked', false);
                        }
                    })
                }
            });


            var FilterTime = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/time.hbs.html'),
                data: {
                    value: {
                        val: '',
                        fn: function (data) {

                        }
                    }
                },
                components: {
                    AviaTimeItem : AviaTimeItem
                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;

                    this.on({
                        change: function (data) {

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

            return FilterTime;
        }]);


