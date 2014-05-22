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
                '$scope', '$element',
                function($scope, $element){
                    var backgrounds = [
                        '/spa/img/hotels/back-0.jpg',
                        '/spa/img/hotels/back-1.jpg',
                        '/spa/img/hotels/back-2.jpg'
                    ];

                    $scope.background = backgrounds[parseInt(Math.random() * 100) % backgrounds.length];

                    $scope.showFullDescription = false;

                    $scope.toggleDescription = function(){
                        $scope.showFullDescription = !$scope.showFullDescription;
                    }

                    $scope.$watch('hotel', function(hotel){
                        var point = new google.maps.LatLng(hotel.data.Latitude, hotel.data.Langitude);

                        var map = new google.maps.Map($('#hotel-details-map', $element)[0], {
                            center: point,
                            zoom: 7
                        });

                        new google.maps.Marker({
                            map: map,
                            point: point
                        });
                    });
                }
            ]
        }
    });