innaAppControllers.controller('HotelsShowController', function ($scope, $timeout, $routeParams, Balloon, HotelService) {

    $scope.hotelLoaded = false;
    $scope.hotelsIndexPath = '/#' + HotelService.getHotelsIndexUrl($routeParams);

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


    HotelService.getHotelsDetails($routeParams)
        .success(function (data) {
            console.log(data)
            $scope.hotelLoaded = true;
            $scope.baloonHotelLoad.teardown();
        });

    $scope.$on('$destroy', function () {
        if ($scope.baloonHotelLoad) {
            $scope.baloonHotelLoad.teardown();
            $scope.baloonHotelLoad = null;
        }
    });
});
