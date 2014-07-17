angular.module('innaApp.conponents').
    factory('HotelItem', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var HotelItem = Ractive.extend({
                template: $templateCache.get('components/hotel/templ/item.hbs.html'),
                append: true,
                data: {

                },
                init: function () {
                    var that = this;

                    console.log('item');

                    this.on({
                        change : function(data){

                        },
                        teardown: function (evt) {

                        }
                    })

                    this.observe('TaFactor', function(newValue, oldValue, keypath) {
                        if (newValue) {

                        }
                    });
                },

                parse: function (end) {

                }

            });

            return HotelItem;
        }]);

