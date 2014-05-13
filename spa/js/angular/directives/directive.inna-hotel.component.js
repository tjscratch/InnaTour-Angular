angular.module('innaApp.directives')
    .directive('innaHotel', function(){
        return {
            templateUrl: '/spa/templates/components/hotel.html',
            scope: {
                hotel: '=innaHotelHotel'
            },
            transclude: true
        }
    });