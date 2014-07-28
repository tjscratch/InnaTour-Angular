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
                        name : 'PackagePrice',
                        val : [],
                        fn : function(data){
                            console.log(data , FilterThis.get('value.val')[0]);
                            return (data <= FilterThis.get('value.val')[0]);
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

                        },
                        resetFilter: function () {

                            this.set({
                                'price.value' : 0,
                                'value.val' : 0,
                                'isOpen': false
                            });
                        },
                        teardown: function (evt) {
                            FilterThis = null;
                        }
                    });
                },


                parse: function (end) {

                },

                slide : function(val){
                    this.set('price.value', val);
                    if(val) {
                        clearTimeout(this._timeOut);
                        this._timeOut = setTimeout(function () {
                            if (val > 0) {
                                this.set('value.val', [val])
                            } else {
                                this.set('value.val', [])
                            }
                        }.bind(this), 500);
                    }
                },

                complete: function (data) {
                    var that = this;
                    var slider = this.find('.js-range')

                    $(slider).slider({
                        range: "min",
                        min: that.get('price.min'),
                        max: that.get('price.max'),
                        value: that.get('price.value'),
                        slide: function(event, ui) {
                            that.slide(ui.value)
                        }
                    });
                }
            });

            return FilterPrice;
        }]);


