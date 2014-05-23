angular.module('innaApp.directives')
    .directive('innaHotelDetails', function(){
        return {
            templateUrl: '/spa/templates/components/hotel-details.html',
            scope: {
                hotel: '=innaHotelDetailsHotel',
                collection: '=innaHotelDetailsCollection',
                back: '=innaHotelDetailsBack',
                next: '=innaHotelDetailsNext'
            },
            controller: [
                '$scope', '$element', '$timeout',
                function($scope, $element, $timeout){
                    console.log('innaHotelDetails:$scope=', $scope);

                    /*Dom*/
                    document.body.scrollTop = document.documentElement.scrollTop = 0;

                    var backgrounds = [
                        '/spa/img/hotels/back-0.jpg',
                        '/spa/img/hotels/back-1.jpg',
                        '/spa/img/hotels/back-2.jpg'
                    ];

                    var map = null;

                    $scope.background = 'url($)'.split('$').join(
                        backgrounds[parseInt(Math.random() * 100) % backgrounds.length]
                    );

                    $scope.showFullDescription = false;

                    $scope.showMapFullScreen = false;

                    $scope.toggleDescription = function(){
                        $scope.showFullDescription = !$scope.showFullDescription;
                    }

                    $scope.toggleMapDisplay = function(){
                        function closeByEsc(event){
                            if(event.which == 27) { //esc
                                console.log('esc');
                                $scope.$apply(function(){
                                    $scope.showMapFullScreen = false;
                                });
                            }
                        }

                        $scope.showMapFullScreen = !$scope.showMapFullScreen;

                        if(map) {
                            $timeout(function(){
                                $(window).trigger('resize');
                                google.maps.event.trigger(map, 'resize');
                            }, 1);
                        }

                        $(document)[$scope.showMapFullScreen ? 'on' : 'off']('keyup', closeByEsc);
                    }

                    $scope.$watch('hotel', function(hotel){
                        if(!hotel) return;

                        if(!hotel.data.Latitude || !hotel.data.Longitude) return;

                        var point = new google.maps.LatLng(hotel.data.Latitude, hotel.data.Longitude)

                        /*map is from outer js-scope*/
                        map = new google.maps.Map($element.find('#hotel-details-map')[0], {
                            zoom: 8,
                            center: point
                        });

                        var marker = new google.maps.Marker({
                            position: point,
                            icon: '/spa/img/map/pin-grey.png?' + Math.random().toString(16),
                            title: hotel.data.HotelName
                        });

                        marker.setMap(map);
                    });
                }
            ]
        }
    });