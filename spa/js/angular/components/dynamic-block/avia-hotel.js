innaAppConponents.
    factory('DynamicBlockAviaHotel', [
        'innaApp.API.events',
        '$templateCache',
        'DynamicBlock',
        function (Events, $templateCache, DynamicBlock) {

            var DynamicBlockAviaHotel = DynamicBlock.extend({
                data : {
                    settings : {
                        height : 220,
                        countColumn: 2,
                        classBlock : 'buy__fly'
                    }
                },
                partials: {
                    collOneContent: $templateCache.get('components/dynamic-block/templ/ticket2ways.hbs.html'),
                    collTwoContent: $templateCache.get('components/dynamic-block/templ/hotel-info-bed-type.hbs.html')
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