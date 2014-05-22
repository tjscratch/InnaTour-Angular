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
                    $scope.showFullDescription = false;

                    $scope.toggleDescription = function(){
                        $scope.showFullDescription = !$scope.showFullDescription;
                    }
                }
            ]
        }
    });