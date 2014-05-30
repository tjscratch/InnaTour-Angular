angular.module('innaApp.directives')
    .directive('innaHotel', ['$templateCache', function ($templateCache) {
        return {
            template: $templateCache.get('components/hotel.html'),
            //templateUrl: '/spa/templates/components/hotel.html',
            scope: {
                hotel: '=innaHotelHotel',
                getDetails: '=innaHotelGetDetails'
            },
            transclude: true,

            controller: [
                '$scope',
                '$element',
                function ($scope, $element) {
                    //console.log($scope.hotel);
                }]
        }
    }]);