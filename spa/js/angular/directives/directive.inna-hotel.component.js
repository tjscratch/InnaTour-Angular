angular.module('innaApp.directives')
    .directive('innaHotel', function(){
        return {
            templateUrl: '/spa/templates/components/hotel.html',
            scope: {
                hotel: '=innaHotelHotel',
                getDetails: '=innaHotelGetDetails'
            },
            transclude: true
        }
    });