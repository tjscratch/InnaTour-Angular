angular.module('innaApp.directives')
    .directive('dynamicSerpMap', function(){
        return {
            templateUrl: '/spa/templates/pages/dynamic/inc/serp.hotels.map.html',
            replace : true,
            scope: {
                hotels: '=dynamicSerpMapHotels'
            },
            controller: [
                '$scope',
                function($scope) {
                    $scope.currentHotel = null;

                    // прячем footer
                    $scope.$emit('region-footer:hide');
                }
            ],
            link: function(scope, elem, attrs){
                var mapContainer = $('.b-hotels-on-map', elem)[0];

                var map = new google.maps.Map(mapContainer, {
                    center: new google.maps.LatLng(0, 0),
                    zoom: 7
                });

                var markers = [];

                scope.$watchCollection('hotels', function(hotels){
                    var bounds = new google.maps.LatLngBounds();

                    markers.forEach(function(marker){ marker.setMap(null); });
                    markers = [];

                    hotels.each(function(hotel){

                        if(hotel.hidden) return;

                        if(!hotel.data.Latitude || !hotel.data.Longitude) return;

                        var pos = new google.maps.LatLng(hotel.data.Latitude, hotel.data.Longitude);
                        var marker = new google.maps.Marker({
                            position: pos,
                            title: hotel.data.HotelName
                        });

                        marker.$inna__hotel = hotel;

                        google.maps.event.addListener(marker, 'click', function() {
                            var marker = this;

                            scope.$apply(function($scope){
                                $scope.currentHotel = marker.$inna__hotel;
                            });

                            var pos = this.getPosition();
                            var proj = this.getMap().getProjection();
                            var point = proj.fromLatLngToPoint(pos);

                            $('.pin', elem).css({
                                top: parseInt(point.x),
                                left: parseInt(point.y)
                            });
                        });

                        bounds.extend(pos);

                        markers.push(marker);
                    });

                    new MarkerClusterer(map, markers, {
                        gridSize: 20 /*,
                        styles: [{
                            url: '../images/people35.png',
                            height: 35,
                            width: 35,
                            anchor: [16, 0],
                            textColor: '#ff00ff',
                            textSize: 10
                        }, {
                            url: '../images/people45.png',
                            height: 45,
                            width: 45,
                            anchor: [24, 0],
                            textColor: '#ff0000',
                            textSize: 11
                        }, {
                            url: '../images/people55.png',
                            height: 55,
                            width: 55,
                            anchor: [32, 0],
                            textColor: '#ffffff',
                            textSize: 12
                        }]*/
                    });
                    map.fitBounds(bounds);
                });
            }
        }
    });