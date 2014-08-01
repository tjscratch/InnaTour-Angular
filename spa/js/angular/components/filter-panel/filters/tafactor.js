angular.module('innaApp.conponents').
    factory('FilterTaFactor', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        'Tripadvisor',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter, Tripadvisor) {

            var FilterThis = null;
            var FilterTaFactor = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/tafactor.hbs.html'),
                data: {
                    value: {
                        name: 'TaFactor',
                        val: [],
                        fn : function(data){

                            var result = FilterThis.get('value.val').filter(function(item){
                                if (Math.floor(data) == item) return true;
                            });

                            return (result.length) ? true : false;
                        }
                    },
                    tafactorValue: []
                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;

                    this.on({
                        onChecked: function (data) {
                            if (data && data.context) {
                                if (data.context.isChecked) {
                                    this.push('value.val', data.context.value)
                                } else if (!data.context.isChecked) {
                                    this.splice('value.val', this.get('value.val').indexOf(data.context.value), 1);
                                }

                                this.hasSelected();
                            }
                        },
                        resetFilter: function () {
                            this.set('tafactor.list.*.isChecked',  false);
                        },
                        teardown: function (evt) {
                            FilterThis = null;
                        }
                    });
                },

                components: {
                    Tripadvisor: Tripadvisor
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

            return FilterTaFactor;
        }]);


