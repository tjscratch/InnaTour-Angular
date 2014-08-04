angular.module('innaApp.conponents').
    factory('ClassFilter', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        'FilterSettings',
        function (EventManager, $filter, $templateCache, $routeParams, Events, FilterSettings) {

            var ClassFilter = Ractive.extend({
                data: {
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
                            this.set({
                                'value.val': [],
                                'isOpen': false,
                                'hasSelected': false
                            });
                        },
                        teardown: function (evt) {
                            EventManager.off('IndicatorFiltersItem:remove:'+ this.get('value.name'), this.IndicatorFiltersItemRemove);
                        }
                    })

                    EventManager.on('IndicatorFiltersItem:remove:'+ this.get('value.name'), this.IndicatorFiltersItemRemove.bind(this));
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


