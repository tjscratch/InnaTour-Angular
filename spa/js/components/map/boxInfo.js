innaAppConponents.
    factory('MapInfoBox', [
        'EventManager',
        'innaAppApiEvents',
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
                    computedUrlDetails : this.computedUrlDetails,
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
                onrender: function (options) {
                    var that = this;

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {

                        }
                    })
                },

                /**
                 * Строим URL для страницы подробнее об отеле
                 * :DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children-:HotelId-:TicketId-:ProviderId?
                 *
                 * searchParams -  добавляется в каждую карточку отеля в компоненте list-panel:parse
                 */
                computedUrlDetails: function () {
                    var routParam = angular.copy($routeParams);

                    var ticketId = scope.combination.ticket.data.VariantId1;
                    var ticketBackId = scope.combination.ticket.data.VariantId2;


                    var urlDetails = '/#/packages/details/' + [
                        routParam.DepartureId,
                        routParam.ArrivalId,
                        routParam.StartVoyageDate,
                        routParam.EndVoyageDate,
                        routParam.TicketClass,
                            routParam.Adult || 0,
                            routParam.Children || 0,
                        data.activeMarker.$inna__hotel.HotelId,
                        ticketId,
                        ticketBackId,
                        data.activeMarker.$inna__hotel.ProviderId
                    ].join('-');

                    return urlDetails;
                }
            });

            return MapInfoBox;
        }
    ]);

