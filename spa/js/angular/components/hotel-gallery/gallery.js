angular.module('innaApp.conponents').
    factory('HotelGallery', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var HotelGallery = Ractive.extend({
                template: $templateCache.get('components/hotel-gallery/templ/gallery.hbs.html'),
                append: true,
                data: {

                },
                init: function () {
                    var that = this;

                    this.on({
                        change : function(data){

                        },
                        teardown: function (evt) {

                        }
                    })

                    this.observe('Photos', function(newValue, oldValue, keypath) {
                        if (newValue) {

                        }
                    });
                },

                parse: function (end) {

                }

            });

            return HotelGallery;
        }]);

