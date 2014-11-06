innaAppConponents.
    factory('MapInfoBoxAir', [
        'EventManager',
        'innaApp.API.events',
        '$templateCache',

        // components
        'MapInfoBox',
        function (EventManager, Events, $templateCache, MapInfoBox) {

            /**
             * Выводим выбранные значения фильтров
             */
            var MapInfoBoxAir = MapInfoBox.extend({
                template: $templateCache.get('components/map/templ/box-info-air.hbs.html'),
                data: {

                },
                onrender: function (options) {
                    var that = this;

                    this.on({
                        change : function(data){

                        },
                        teardown: function (evt) {

                        }
                    })


                }
            });

            return MapInfoBoxAir;
        }
    ]);

