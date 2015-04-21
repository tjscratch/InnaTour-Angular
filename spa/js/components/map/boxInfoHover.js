innaAppConponents.
    factory('MapInfoBoxHover', [
        'EventManager',
        'innaAppApiEvents',
        '$templateCache',

        // components
        // components
        'MapInfoBox',
        function (EventManager, Events, $templateCache, MapInfoBox) {

            /**
             * Выводим выбранные значения фильтров
             */
            var MapInfoBoxHover = MapInfoBox.extend({
                template: $templateCache.get('components/map/templ/box-info.hbs.html'),
                data: {

                },
                onrender: function (options) {
                    var that = this;

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {

                        }
                    })


                }
            });

            return MapInfoBoxHover;
        }
    ]);

