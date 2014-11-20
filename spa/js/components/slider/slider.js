angular.module('innaApp.components').
        factory('Stars', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var Slider = Ractive.extend({
                template: $templateCache.get('components/stars/templ/index.hbs.html'),
                append: true,
                data: {

                },
                onrender: function () {

                    this.observe('dataSlider', function (newValue, oldValue, keypath) {

                    });
                }
            });

            return Slider;
        }]);

