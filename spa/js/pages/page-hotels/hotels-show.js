innaAppControllers.controller('HotelsShowController', function ($rootScope, $scope, $timeout, $location, $routeParams, Balloon, HotelService) {

    // toDo хрень какая то, удалить надо бы
    document.body.classList.add('bg_white');
    document.body.classList.remove('light-theme');


    /**
     * Отели у нас работают только для b2b клиентов
     * поэтому если не b2b пользователь попал на страницу отелей
     * редиректим его на главную
     */
    $timeout(function () {
        var isAgency = false;
        if ($rootScope.$root.user) {
            isAgency = $rootScope.$root.user.isAgency();
        }
        if (isAgency == false) {
            $location.path('/#/');
        }
    }, 500);


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

    function baloonError () {
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
    }

    /**
     * клик на балуне, по кнопке закрыть или "прервать поиск"
     * редиректим на /hotels/
     */
    $scope.redirectHotels = function () {
        $scope.baloonHotelLoad.teardown();
        $location.path('/#' + AppRouteUrls.URL_HOTELS);
    };


    HotelService.getHotelsDetails($routeParams)
        .then(function (response) {
            console.log(response)
            if (response.status == 200 && response.data.Success) {
                $scope.hotel = response.data.Hotel;
                $scope.hotelRooms = response.data.Rooms;
                $scope.hotelLoaded = true;
                parseAmenities($scope.hotel);
                if ($scope.hotel.ProviderId == 4) {
                    $scope.TAWidget = app_main.tripadvisorEx + $scope.hotel.HotelId;
                } else if ($scope.hotel.ProviderId == 2) {
                    $scope.TAWidget = app_main.tripadvisorOk + $scope.hotel.HotelId;
                }
                if ($scope.hotel.Latitude && $scope.hotel.Longitude) {
                    loadMap($scope.hotel.Latitude, $scope.hotel.Longitude, $scope.hotel.HotelName);
                }
                $scope.baloonHotelLoad.teardown();
            } else {
                baloonError();
            }
        }, function (response) {
            console.log(response)
            baloonError();
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


    /**
     * Amenities
     */
    function parseAmenities (hotel) {
        hotel.AmenitiesArray = [];

        if (hotel && Object.keys(hotel.Amenities).length) {

            for (var key in hotel.Amenities) {
                var countPart = Math.ceil(hotel.Amenities[key].List.length / 2);
                var ListOrigin = [].concat(hotel.Amenities[key].List);
                var ListPart1 = [].concat(ListOrigin.splice(countPart, ListOrigin.length));
                var ListPart2 = [].concat(ListOrigin);

                hotel.Amenities[key].part = {
                    part1: ListPart1,
                    part2: ListPart2
                }

                hotel.AmenitiesArray.push(hotel.Amenities[key]);
            }
        }
    }


    /**
     * действия в комнате
     */
    $scope.goReservation = function (roomId) {
        var url = HotelService.getHotelsResevationUrl($routeParams.hotelId, $routeParams.providerId, roomId, $routeParams);
        $location.url(url);
    };


    $scope.toggleRoom = function (room) {
        //converts undefined into boolean on the fly
        room.isOpen = !!!room.isOpen;
    };


    $scope.hoverImageObject = {
        timeOutHover: null,
        hoverImageShow: false,
        hoverImageStyle: {}
    };

    $scope.$on('$destroy', function () {
        if ($scope.baloonHotelLoad) {
            $scope.baloonHotelLoad.teardown();
            $scope.baloonHotelLoad = null;
        }
    });
});
