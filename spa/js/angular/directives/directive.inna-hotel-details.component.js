angular.module('innaApp.directives')
    .directive('innaHotelDetails', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/hotel-details.html'),
            scope: {
                hotel: '=innaHotelDetailsHotel',
                collection: '=innaHotelDetailsCollection',
                back: '=innaHotelDetailsBack',
                next: '=innaHotelDetailsNext',
                combination: '=innaHotelDetailsBundle',
                goReservation: '=innaHotelDetailesReservationFn',
                getTicketDetails: '=innaHotelDetailsGetTicketDetails'
            },
            controller: [
                '$scope',
                '$element',
                '$timeout',
                'aviaHelper',
                'innaApp.API.events',
                '$location',
                function($scope, $element, $timeout, aviaHelper, Events, $location){
                    /*Dom*/
                    document.body.scrollTop = document.documentElement.scrollTop = 0;

                    /*Private*/
                    var backgrounds = [
                        '/spa/img/hotels/back-0.jpg',
                        '/spa/img/hotels/back-1.jpg',
                        '/spa/img/hotels/back-2.jpg'
                    ];

                    var map = null;

                    /*Properties*/
                    $scope.background = 'url($)'.split('$').join(
                        backgrounds[parseInt(Math.random() * 100) % backgrounds.length]
                    );

                    $scope.showFullDescription = false;

                    $scope.bundle = new inna.Models.Dynamic.Combination();
                    $scope.bundle.setTicket($scope.combination.ticket);
                    $scope.bundle.setHotel($scope.hotel);

                    $scope.dataFullyLoaded = false;

                    $scope.displayRoom = $location.search().room;
                    $scope.onlyRoom = null;

                    $scope.buyAction = ($location.search().action == 'buy');

                    $scope.TAWidget = '';

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;
                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;

                    /*Methods*/
                    $scope.toggleDescription = function(){
                        $scope.showFullDescription = !$scope.showFullDescription;
                    };

                    $scope.toggleRoom = function(room){
                        //converts undefined into boolean on the fly
                        room.isOpen = !!!room.isOpen;
                    };

                    /*Watchers*/
                    $scope.$watch('hotel', function(hotel){
                        if(!hotel) return;

                        if(!$scope.buyAction && hotel.data.Latitude && hotel.data.Longitude) {
                            $timeout(function(){
                                var point = new google.maps.LatLng(hotel.data.Latitude, hotel.data.Longitude)

                                /*map is from Private section*/
                                map = new google.maps.Map($element.find('#hotel-details-map')[0], {
                                    zoom: 16,
                                    center: point
                                });

                                var marker = new google.maps.Marker({
                                    position: point,
                                    icon: '/spa/img/map/pin-grey.png?' + Math.random().toString(16),
                                    title: hotel.data.HotelName
                                });

                                marker.setMap(map);
                            }, 100);
                        };

                        $scope.dataFullyLoaded = false;

                        $scope.TAWidget = 'http://www.tripadvisor.ru/WidgetEmbed-cdspropertydetail?display=true&partnerId=32CB556934404C699237CD7F267CF5CE&lang=ru&locationId=' + $scope.hotel.data.HotelId;

                        $scope.bundle.setHotel(hotel);
                    });

                    $scope.$on(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED, function(){
                        $scope.dataFullyLoaded = true;

                        if($scope.displayRoom) {
                            var onlyRoom = null;

                            $scope.hotel.detailed.Rooms.every(function(room){
                                if(room.RoomId === $scope.displayRoom) {
                                    onlyRoom = room;
                                }

                                return true;
                            });

                            if(onlyRoom) {
                                $scope.onlyRoom = [onlyRoom];
                                onlyRoom.isOpen = true;
                            }
                        }

                        $scope.$digest();
                    })
                }
            ],
            link : function($scope, $element){

            }
        }
    }]);