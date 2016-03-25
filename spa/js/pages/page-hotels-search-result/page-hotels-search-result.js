innaAppControllers.controller('PageHotelsSearchResultCtrl', function ($scope, $routeParams, HotelService, ListPanel) {

    if ($routeParams) {
        HotelService.getHotelsList($routeParams)
            .success(function (data) {
                console.log('HotelService.getHotelsList')
                console.log(data)
                $scope.hotels = data.Hotels;
            })
    }


});
