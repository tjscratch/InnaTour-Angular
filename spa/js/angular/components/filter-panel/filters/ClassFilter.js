angular.module('innaApp.components').
    factory('ClassFilter', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        function (EventManager, $filter, $templateCache, $routeParams, Events) {

            var ClassFilter = Ractive.extend({
                data: {
                    clearTimeHover : null,
                    isOpen: false,
                    hasSelected: false,
                    value: null
                },
                init: function () {
                    var that = this;

                    this.on({
                        toggle: function (evt) {
                            if(evt && evt.original)
                                evt.original.stopPropagation();

                            this.toggle('isOpen')
                        },
                        show: function () {
                            this.set({ isOpen: true });
                        },
                        hide: function (opt_child) {
                            this.set({ isOpen: false });
                        },
                        resetFilter: function () {
                            if(!this.get('sortValue')) {
                                this.set({
                                    'value.val': [],
                                    //'isOpen': false,
                                    'hasSelected': false
                                });
                            }
                        },
                        onHover : function(evt){
                            clearTimeout(this.get('clearTimeHover'));

                            if(!evt.hover) {
                                var time = setTimeout(function(){
                                    that.fire('hide')
                                }, 500);
                                this.set('clearTimeHover', time);
                            }
                        },
                        filtersItemRemove : this.IndicatorFiltersItemRemove,
                        teardown: function (evt) {
                            console.log('teardown child');
                        }
                    })
                },

                hasSelected: function () {
                    if (this.get('value.val') && this.get('value.val').length) {
                        this.set('hasSelected', true);
                    } else {
                        this.set('hasSelected', false);
                    }
                },

                /**
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove : function(data){

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


