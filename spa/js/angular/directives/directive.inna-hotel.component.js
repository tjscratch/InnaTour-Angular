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


                }],
            link : function($scope, $element){
                $element.find('.b-carousel').innaCarousel({
                    photoList : $scope.hotel.data.Photos,
                    style : {
                        width:200,
                        height:190
                    }
                })
            }
        }
    }]);