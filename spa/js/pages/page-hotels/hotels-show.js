innaAppControllers.controller('HotelsShowController', function ($rootScope, $scope, $timeout, $location, $routeParams, Balloon, HotelService) {

    var self = this;

    // toDo хрень какая то, удалить надо бы
    document.body.classList.add('bg_white');
    document.body.classList.remove('light-theme');


    function isActive (route) {
        var loc = $location.path();
        var abs = $location.absUrl();

        if (route == '/') {
            return ((abs.indexOf('/tours/?') > -1) || loc == route);
        }
        else {
            if (loc.indexOf(route) > -1)
                return true;
            else
                return false;
        }
    };


    /**
     * Отели у нас работают только для b2b клиентов
     * поэтому если не b2b пользователь попал на страницу отелей
     * редиректим его на главную
     */
    //$timeout(function () {
    //    var isAgency = false;
    //    if ($rootScope.$root.user) {
    //        if (parseInt($rootScope.$root.user.getAgencyId()) == 20005 || parseInt($rootScope.$root.user.getAgencyId()) == 2) {
    //            isAgency = true;
    //        }
    //    }
    //    if (isAgency == false) {
    //        if (isActive('/hotels/')) {
    //            $location.path('/#/');
    //        }
    //    }
    //}, 500);
    // $timeout(function () {
    //     var isAgency = false;
    //     if ($rootScope.$root.user) {
    //         isAgency = $rootScope.$root.user.isAgency();
    //     }
    //     if (isAgency == false) {
    //         $location.path('/#/');
    //     }
    // }, 500);

    $scope.userIsAgency = null;
    
    $scope.$watch('user', function (User) {
        if (User) {
            $scope.userIsAgency = User.isAgency();
            $scope.AgencyId = parseInt(User.getAgencyId());
        }
    });

    $scope.hotelLoaded = false;
    $scope.hotelsIndexPath = '/#' + HotelService.getHotelsIndexUrl($routeParams);
    $scope.busIndexPath = '/#' + HotelService.getBusIndexUrl($routeParams);
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
        loading: true,
        title: 'Собираем данные',
        balloonContent: 'Это может занять какое-то время',
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
        if (isActive('/bus/')) {
            $location.path(AppRouteUrls.URL_BUS);
        } else {
            $location.path(AppRouteUrls.URL_HOTELS);
        }
    };


    //var searchParams = angular.copy($routeParams);
    //self.passengerCount = Math.ceil($routeParams.Adult) + Math.ceil($routeParams.ChildrenCount);
    //searchParams.Adult = self.passengerCount;
    //searchParams.ChildrenCount = null;
    var searchParams = angular.copy($routeParams);
    //self.passengerCount = Math.ceil($routeParams.Adult) + Math.ceil($routeParams.ChildrenCount);
    //searchParams.Adult = self.passengerCount;
    searchParams.Adult = $routeParams.Adult;
    //searchParams.ChildrenCount = null;


    if(searchParams.Children){
        searchParams.ChildrenAges = $routeParams.Children.split('_');
        searchParams.Children = searchParams.Children.split('_').map(function (age) {
            return { value: age };
        });
    }

    HotelService.getHotelsDetails(searchParams)
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
    if (isActive('/bus/')) {
        $scope.Menu = HotelService.getShowPageMenuBus();
    } else {
        $scope.Menu = HotelService.getShowPageMenu();
    }


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
        var searchParams = angular.copy($routeParams);
        console.log(searchParams)
        if(searchParams.Children){
            searchParams.Children = searchParams.Children.split('_').map(function (age) {
                return { value: age };
            });
        }
        if(isActive('/bus/')){
            var url = HotelService.getBusResevationUrl(searchParams.hotelId, searchParams.providerId, roomId, searchParams);
        }else{
            var url = HotelService.getHotelsResevationUrl(searchParams.hotelId, searchParams.providerId, roomId, searchParams);
        }
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
