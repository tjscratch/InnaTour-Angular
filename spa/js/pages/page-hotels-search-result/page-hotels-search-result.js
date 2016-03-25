innaAppControllers.controller('PageHotelsSearchResultCtrl', function ($scope, $routeParams, HotelService) {


    console.log($routeParams)
    var params = $routeParams
    console.log('params')
    console.log(params)
    if (params) {
        HotelService.getHotelsList($routeParams)
            .success(function (data) {
                console.log(data);
            })
    }


});
