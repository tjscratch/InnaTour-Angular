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

                scope.$watch('hotels', function(newVal){
                    var hotels = scope.$eval(newVal);
                    var bounds = new google.maps.LatLngBounds();

                    _.each(markers, function(marker){
                        marker.setMap(null);
                    });

                    markers = [];

                    _.each(hotels, function(hotel){
                        if(hotel.Latitude && hotel.Longitude)  {
                            var pos = new google.maps.LatLng(hotel.Latitude, hotel.Longitude);

                            bounds.extend(pos);

                            markers.push(new google.maps.Marker({
                                position: pos,
                                title: hotel.HotelName
                            }));
                        }
                    });

                    new MarkerClusterer(map, markers, {gridSize: 20});

                    map.fitBounds(bounds);
                });
            }
        }
    });