angular.module('innaApp.directives')
    .directive('innaHotelDetails', function(){
        return {
            templateUrl: '/spa/templates/components/hotel-details.html',
            scope: {
                hotel: '=innaHotelDetailsHotel',
                collection: '=innaHotelDetailsCollection',
                back: '=innaHotelDetailsBack',
                next: '=innaHotelDetailsNext',
                combination: '=innaHotelDetailsBundle'
            },
            controller: [
                '$scope', '$element', '$timeout', 'aviaHelper',
                function($scope, $element, $timeout, aviaHelper){
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

                    $scope.showMapFullScreen = false;

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;
                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;

                    /*Methods*/
                    $scope.toggleDescription = function(){
                        $scope.showFullDescription = !$scope.showFullDescription;
                    };

                    $scope.toggleMapDisplay = function(){
                        function closeByEsc(event){
                            if(event.which == 27) { //esc
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

                    /*Watchers*/
                    $scope.$watch('hotel', function(hotel){
                        if(!hotel) return;

                        if(!hotel.data.Latitude || !hotel.data.Longitude) return;

                        var point = new google.maps.LatLng(hotel.data.Latitude, hotel.data.Longitude)

                        /*map is from Private section*/
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