innaAppConponents.
    factory('dynamicBlock', [
        'innaApp.API.events',
        '$templateCache',
        function (Events, $templateCache) {

            var dynamicBlock = Ractive.extend({
                debug: true,
                template: $templateCache.get('components/dynamic-block/templ/avia-hotel.html'),
                partials: {
                    ticket2ways: $templateCache.get('components/ticket/templ/ticket2ways.html'),
                    partialInfoHotel: $templateCache.get('components/hotel/templ/partial-info.html')
                },
                init: function () {
                    console.log('avia-hotel.html');
                    console.log(this.get('Hotel'));
                }
            });


            return dynamicBlock;
        }
    ]);