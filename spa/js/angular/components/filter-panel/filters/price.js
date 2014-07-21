angular.module('innaApp.conponents').
    factory('FilterPrice', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterPrice = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/price.hbs.html'),
                data: {
                    value : {
                        name : 'Price',
                        val : ''
                    },
                    priceValue : null
                },
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;

                    this.on({
                        change: function (data) {
                            if(data.priceValue){
                                if (data.priceValue > 0) {
                                    this.set('value.val', data.priceValue)
                                } else {
                                    this.set('value.val', '')
                                }
                            }
                        },
                        teardown: function (evt) {

                        }
                    });
                },


                parse: function (end) {

                },


                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                slide : function(val){
                    this.set('priceValue', val );
                },

                complete: function (data) {
                    var that = this;
                    var slider = this.find('.js-range')

                    $(slider).slider({
                        range: "min",
                        min: 10000,
                        max: 100000,
                        value: that.get('price.value'),
                        slide: function(event, ui) {
                            that.slide(ui.value)
                        }
                    });
                }
            });

            return FilterPrice;
        }]);


