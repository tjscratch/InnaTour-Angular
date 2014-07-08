innaAppConponents.
    factory('DynamicBlockAviaHotel', [
        'innaApp.API.events',
        '$templateCache',
        'DynamicBlock',
        function (Events, $templateCache, DynamicBlock) {

            var DynamicBlockAviaHotel = DynamicBlock.extend({
                debug: true,
                template: $templateCache.get('components/figure-block/templ/avia-hotel.html'),
                partials: {
                    ticket2ways: $templateCache.get('components/figure-block/templ/ticket2ways.html'),
                    partialInfoHotel: $templateCache.get('components/figure-block/templ/partial-info.html')
                },
                init: function (options) {
                    this._super(options);

                    this.on({
                        getHotelDetails: this.getHotelDetails
                    })
                }
            });

            return DynamicBlockAviaHotel;
        }
    ]);