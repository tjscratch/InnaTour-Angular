innaAppConponents.
    factory('DynamicBlockAviaHotel', [
        'innaApp.API.events',
        '$templateCache',
        'DynamicBlock',
        function (Events, $templateCache, DynamicBlock) {

            var DynamicBlockAviaHotel = DynamicBlock.extend({
                template: $templateCache.get('components/dynamic-block/templ/avia-hotel.html'),
                partials: {
                    ticket2ways: $templateCache.get('components/dynamic-block/templ/ticket2ways.html'),
                    partialInfoHotel: $templateCache.get('components/dynamic-block/templ/partial-info.html')
                },
                init: function (options) {
                    this._super(options);
                }
            });

            return DynamicBlockAviaHotel;
        }
    ]);