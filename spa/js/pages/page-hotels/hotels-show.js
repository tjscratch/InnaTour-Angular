innaAppControllers.controller('HotelsShowController', function ($scope, $timeout, $routeParams, Balloon, HotelService) {

    // toDo хрень какая то, удалить надо бы
    document.body.classList.add('bg_white');
    document.body.classList.remove('light-theme');


    $scope.hotelLoaded = false;
    $scope.hotelsIndexPath = '/#' + HotelService.getHotelsIndexUrl($routeParams);
    $scope.TAWidget = '';
    $scope.showFullDescription = false;

    $scope.toggleDescription = function () {
        $scope.showFullDescription = !$scope.showFullDescription;
    };

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
            $scope.hotel = data.Hotel;
            $scope.hotelRooms = data.Rooms;
            $scope.hotelLoaded = true;
            if ($scope.hotel.ProviderId == 4) {
                $scope.TAWidget = app_main.tripadvisorEx + $scope.hotel.HotelId;
            } else if ($scope.hotel.ProviderId == 2) {
                $scope.TAWidget = app_main.tripadvisorOk + $scope.hotel.HotelId;
            }
            if ($scope.hotel.Latitude && $scope.hotel.Longitude) {
                loadMap($scope.hotel.Latitude, $scope.hotel.Longitude, $scope.hotel.HotelName);
            }
            $scope.baloonHotelLoad.teardown();
        });


    /**
     * отрисовка меню страницы
     */
    $scope.Menu = HotelService.getShowPageMenu();


    /**
     * отрисовка карты
     */
    var loadMap = function (Latitude, Longitude, name) {
        $timeout(function () {
            var point = new google.maps.LatLng(Latitude, Longitude)
            var map = new google.maps.Map(document.getElementById('hotel-details-map'), {
                zoom: 16,
                center: point
            });
            var marker = new google.maps.Marker({
                position: point,
                icon: '/spa/img/map/pin-grey.png?' + Math.random().toString(16),
                title: name
            });
            marker.setMap(map);
        }, 0);
    };


    $scope.$on('$destroy', function () {
        if ($scope.baloonHotelLoad) {
            $scope.baloonHotelLoad.teardown();
            $scope.baloonHotelLoad = null;
        }
    });
});
