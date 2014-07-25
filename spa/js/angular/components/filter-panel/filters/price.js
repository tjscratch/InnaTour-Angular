angular.module('innaApp.conponents').
    factory('FilterPrice', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterThis = null;
            var FilterPrice = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/price.hbs.html'),
                data: {
                    value : {
                        name : 'Price',
                        val : [],
                        fn : function(data){

                        }
                    },
                    priceValue : null
                },
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    this._timeOut = null;
                    FilterThis = this;

                    this.on({
                        change: function (data) {

                            // ставим условие чтоб тело функции change
                            // выполнялось на изменение priceValue
                            if(data && data['price.value']) {
                                clearTimeout(this._timeOut);
                                this._timeOut = setTimeout(function () {
                                    if (data['price.value'] > 0) {
                                        this.push('value.val', data['price.value'])
                                    } else {
                                        this.set('value.val', [])
                                    }
                                }.bind(this), 1000);
                            }
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

                slide : function(val){
                    this.set('price.value', val );
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


