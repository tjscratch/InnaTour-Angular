innaAppConponents.
    factory('MapInfoBox', [
        'EventManager',
        'innaApp.API.events',
        '$templateCache',

        // components
        'Tripadvisor',
        'Stars',
        'HotelGallery',
        function (EventManager, Events, $templateCache, Tripadvisor, Stars, HotelGallery) {

            /**
             * Выводим выбранные значения фильтров
             */
            var MapInfoBox = Ractive.extend({
                template: $templateCache.get('components/map/templ/box-info.hbs.html'),
                data: {
                    settings: {
                        disableAutoPan: false,
                        closeBoxURL: "",
                        pixelOffset: new google.maps.Size(-10, 0),
                        zIndex: 2000,
                        infoBoxClearance: new google.maps.Size(1, 1),
                        isHidden: false,
                        pane: "floatPane",
                        enableEventPropagation: false
                    }
                },
                components: {
                    Tripadvisor: Tripadvisor,
                    Stars: Stars,
                    HotelGallery: HotelGallery
                },
                init: function (options) {
                    var that = this;

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {

                        }
                    })


                }
            });

            return MapInfoBox;
        }
    ]);

