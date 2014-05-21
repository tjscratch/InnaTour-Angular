angular.module('innaApp.directives')
    .directive('innaHotelDetails', function(){
        return {
            templateUrl: '/spa/templates/components/hotel-details.html',
            scope: {
                hotel: '=innaHotelDetailsHotel',
                collection: '=innaHotelDetailsCollection'
            },
            controller: [
                '$scope',
                function($scope){
                    console.log('innaHotelDetails', $scope);
                }
            ]
        }
    });