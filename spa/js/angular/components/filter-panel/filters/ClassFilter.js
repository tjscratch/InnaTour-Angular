angular.module('innaApp.conponents').
    factory('ClassFilter', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        function (EventManager, $filter, $templateCache, $routeParams, Events) {

            var ClassFilter = Ractive.extend({
                data: {
                    isOpen: false,

                    // значение фильтра
                    value : null
                },
                init: function () {
                    var that = this;
                    console.log(this.get('data'));
                    this.set(this.get('data'))

                    /**
                     * Events
                     */
                    this.on({
                        toggle : function(){
                            this.toggle('isOpen')
                        },
                        show: function () {
                            this.set({ isOpen: true });
                        },
                        hide: function (opt_child) {
                            this.set({ isOpen: false });
                        },
                        resetFilter : function(){
                          console.log('reset');
                        },
                        change: function (data) {

                        },
                        teardown: function (evt) {
                            console.log('teardown filter all');
                        }
                    })
                },


                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return ClassFilter;
        }]);


