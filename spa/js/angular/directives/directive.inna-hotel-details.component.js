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
                '$scope',
                function($scope){
                    console.log('innaHotelDetails', $scope);

                    console.log('innaHotelDetails:next', $scope.collection.getNext($scope.hotel));
                }
            ]
        }
    });