innaAppControllers.controller('BusIndexController', function ($scope, $routeParams, $location, $timeout,
                                                              AppRouteUrls, Balloon, HotelService) {

    // toDo хрень какая то, удалить надо бы
    document.body.classList.add('bg_gray-light');
    document.body.classList.remove('light-theme');


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
        $scope.baloonHotelNotFound.teardown();
        $location.path(AppRouteUrls.URL_HOTELS);
    };


    if ($routeParams) {
        $scope.baloonHotelLoad.show();
        HotelService.getBusList($routeParams)
            .then(function (response) {
                if (response.status == 200 && response.data.Hotels.length > 0) {
                    $scope.hotels = response.data.Hotels;
                    $scope.baloonHotelLoad.teardown();
                } else {
                    $scope.baloonHotelNotFound = new Balloon();
                    $scope.baloonHotelNotFound.updateView({
                        template: 'not-found.html',
                        title: 'Мы ничего не нашли',
                        content: "Попробуйте изменить условия поиска",
                        callbackClose: function () {
                            $scope.redirectHotels();
                        },
                        callback: function () {
                            $scope.redirectHotels();
                        },
                    });
                }
            }, function (response) {
                console.log(response)
                $scope.baloonHotelLoad.updateView({
                    template: 'err.html',
                    title: 'Что-то пошло не так',
                    content: 'Попробуйте начать поиск заново',
                    callbackClose: function () {
                        $scope.redirectHotels();
                    },
                    callback: function () {
                        $scope.redirectHotels();
                    }
                });
            });
    }

    if ($routeParams) {
        $scope.getHotelUrl = function (hotelId, providerId) {
            return '/#' + HotelService.getHotelsShowUrl(hotelId, providerId, $routeParams);
        };
    }


    $scope.$on('$destroy', function () {
        if ($scope.baloonHotelLoad) {
            $scope.baloonHotelLoad.teardown();
            $scope.baloonHotelLoad = null;
        }
        if ($scope.baloonHotelNotFound) {
            $scope.baloonHotelNotFound.teardown();
            $scope.baloonHotelNotFound = null;
        }
    });
});
