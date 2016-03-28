innaAppControllers.controller('HotelsIndexController', function ($scope, $routeParams, $location,
                                                                     refactoringAppUrls, Balloon, HotelService) {

    /**
     * при переходе на данную страницу
     * показываем прелоадер на время
     * получения ответа с результатами поиска
     */
    $scope.baloonHotelLoad = new Balloon();
    $scope.baloonHotelLoad.updateView({
        template: 'search.html',
        callbackClose: function () {
            $scope.redirectHotels();
        },
        callback: function () {
            $scope.redirectHotels();
        }
    });

    /**
     * клик на балуне, по кнопке закрыть или "прервать поиск"
     * редиректим на /hotels/
     */
    $scope.redirectHotels = function () {
        $scope.baloonHotelLoad.teardown();
        $location.path(refactoringAppUrls.URL_HOTELS);
    };


    if ($routeParams) {
        $scope.baloonHotelLoad.show();
        HotelService.getHotelsList($routeParams)
            .success(function (data) {
                $scope.hotels = data.Hotels;
                $scope.baloonHotelLoad.teardown();
            })
    }


    if ($routeParams) {
        $scope.getHotelUrl = function (hotelId, providerId) {
            return HotelService.getHotelsShowUrl(hotelId, providerId, $routeParams);
        };
    }


    $scope.$on('$destroy', function () {
        if ($scope.baloonHotelLoad) {
            $scope.baloonHotelLoad.teardown();
            $scope.baloonHotelLoad = null;
        }
    });
});
