innaAppControllers.controller('HotelsShowController', function ($rootScope, $scope, $timeout, $location, $routeParams, Balloon, HotelService, dataService) {

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
        var Label = 'Что-то пошло не так';
        var Text = 'Попробуйте начать поиск заново';

        $scope.baloonHotelLoad.updateView({
            template: 'err.html',
            title: Label,
            content: Text,
            callbackClose: function () {
                $scope.redirectHotels();
            },
            callback: function () {
                $scope.redirectHotels();
            }
        });

        /**
         * Трекаем события для GTM
         * https://innatec.atlassian.net/browse/IN-7071
         */
        var dataLayerObj = {
            'event': 'UM.Event',
            'Data': {
                'Category': 'Hotels',
                'Action': 'Message',
                'Label': Label,
                'Text': Text
            }
        };
        console.table(dataLayerObj);
        if (window.dataLayer) {
            window.dataLayer.push(dataLayerObj);
        }


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
        // searchParams.Children = searchParams.Children.split('_').map(function (age) {
        //     return { value: age };
        // });
    }

    var help = dateHelper;
    var today = help.getTodayDate();
    var startDate = dateHelper.apiDateToJsDate(searchParams.StartVoyageDate);
    if(+today <= +startDate) {

        /**
         * Трекаем события для GTM
         * https://innatec.atlassian.net/browse/IN-7071
         */
        if (searchParams.Children) {
            var Travelers = searchParams.Adult + "-" + searchParams.Children.length;
            var TotalTravelers = Math.ceil(searchParams.Adult) + Math.ceil(searchParams.Children.length);
        } else {
            var Travelers = searchParams.Adult + "-" + 0;
            var TotalTravelers = Math.ceil(searchParams.Adult);
        }
        dataService.getLocationById($routeParams.ArrivalId)
            .then(function (res) {
                var CityCode = res.data.CountryName + "/" + res.data.Name;
                var dataLayerObj = {
                    'event': 'UI.PageView',
                    'Data': {
                        'PageType': 'HotelsDetailsLoading',
                        'CityCode': CityCode,
                        'DateFrom': searchParams.StartVoyageDate,
                        'NightCount': searchParams.NightCount,
                        'Travelers': Travelers,
                        'TotalTravelers': TotalTravelers
                    }
                };
                console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
            });


        HotelService.getHotelsDetails(searchParams)
            .then(function (response) {
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

                    /**
                     * Трекаем события для GTM
                     * https://innatec.atlassian.net/browse/IN-7071
                     */
                    dataService.getLocationById($routeParams.ArrivalId)
                        .then(function (res) {
                            var CityCode = res.data.CountryName + "/" + res.data.Name;
                            var dataLayerObj = {
                                'event': 'UI.PageView',
                                'Data': {
                                    'PageType': 'HotelsDetailsLoad',
                                    'CityCode': CityCode,
                                    'DateFrom': searchParams.StartVoyageDate,
                                    'NightCount': searchParams.NightCount,
                                    'Travelers': Travelers,
                                    'TotalTravelers': TotalTravelers,
                                    'Price': response.data.Rooms[0].Price,
                                    'HotelName': response.data.Hotel.HotelName
                                }
                            };
                            console.table(dataLayerObj);
                            if (window.dataLayer) {
                                window.dataLayer.push(dataLayerObj);
                            }
                        });

                } else {
                    baloonError();
                }
            }, function (response) {
                console.log(response)
                baloonError();
            });
    } else {
        var Label = 'Дата заезда должна быть больше текущей даты!';
        var Title = 'Попробуйте начать поиск заново';

        /**
         * Трекаем события для GTM
         * https://innatec.atlassian.net/browse/IN-7071
         */
        var dataLayerObj = {
            'event': 'UM.Event',
            'Data': {
                'Category': 'Hotels',
                'Action': 'Message',
                'Label': Label,
                'Text': Text
            }
        };
        console.table(dataLayerObj);
        if (window.dataLayer) {
            window.dataLayer.push(dataLayerObj);
        }

        $scope.baloonHotelLoad.updateView({
            template: 'err.html',
            title: Label,
            content: Title,
            callbackClose: function () {
                $scope.redirectHotels();
            },
            callback: function () {
                $scope.redirectHotels();
            }
        });
    }


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
    $scope.goReservation = function (room) {
        var dataLayerObj = {
            'event': 'UM.Event',
            'Data': {
                'Category': 'Hotels',
                'Action': 'HotelsBuyDetails',
                'Label': room.RoomName,
                'Content': room.CancellationRule,
                'Context': room.Price,
                'Text': '[no data]'
            }
        };
        console.table(dataLayerObj);
        if (window.dataLayer) {
            window.dataLayer.push(dataLayerObj);
        }

        var searchParams = angular.copy($routeParams);
        console.log(searchParams)
        if(searchParams.Children){
            searchParams.Children = searchParams.Children.split('_').map(function (age) {
                return { value: age };
            });
        }
        if(isActive('/bus/')){
            var url = HotelService.getBusResevationUrl(searchParams.hotelId, searchParams.providerId, room.RoomId, searchParams);
        }else{
            var url = HotelService.getHotelsResevationUrl(searchParams.hotelId, searchParams.providerId, room.RoomId, searchParams);
        }
        $location.url(url);
    };


    $scope.toggleRoom = function (room) {
        //converts undefined into boolean on the fly
        if (!room.isOpen) {
            var dataLayerObj = {
                'event': 'UM.Event',
                'Data': {
                    'Category': 'Hotels',
                    'Action': 'RoomDetails',
                    'Label': room.RoomName,
                    'Content': room.CancellationRule,
                    'Context': room.Price,
                    'Text': '[no data]'
                }
            };
            console.table(dataLayerObj);
            if (window.dataLayer) {
                window.dataLayer.push(dataLayerObj);
            }
        }
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
