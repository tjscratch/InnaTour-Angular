angular.module('innaApp.directives')
    .directive('dynamicSerpMap', function(){
        return {
            templateUrl: '/spa/templates/pages/dynamic_package_serp.map.html',
            scope: {
                hotels: '@'
            },
            link: function(scope, elem, attrs){
                var mapContainer = $('.b-hotels-on-map', elem)[0];

                var map = new google.maps.Map(mapContainer, {
                    center: new google.maps.LatLng(0, 0),
                    zoom: 7
                });

                var markers = [];
                var infoWindows = [];

                scope.$watch('hotels', function(newVal){
                    var hotels = scope.$eval(newVal);
                    var bounds = new google.maps.LatLngBounds();

                    _.each(markers, function(marker){
                        marker.setMap(null);
                    });

                    markers = [];
                    infoWindows = [];

                    _.each(hotels, function(hotel){
                        if(hotel.Latitude && hotel.Longitude)  {
                            var pos = new google.maps.LatLng(hotel.Latitude, hotel.Longitude);
                            var marker = new google.maps.Marker({
                                position: pos,
                                title: hotel.HotelName
                            });
                            var infoWindow = new google.maps.InfoWindow({
                                content: '<h1 style="color:red;font-style:italic;">' + hotel.HotelName + '</h1>'
                            });

                            google.maps.event.addListener(marker, 'click', function() {
                                _.each(infoWindows, function(iW){ iW.close(); });
                                infoWindow.open(map, marker);
                            });

                            bounds.extend(pos);
                            markers.push(marker);
                            infoWindows.push(infoWindow);
                        }
                    });

                    new MarkerClusterer(map, markers, {gridSize: 20});

                    map.fitBounds(bounds);
                });
            }
        }
    });