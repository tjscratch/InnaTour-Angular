innaAppControllers
    .controller('PageHotelDetails', [
        'EventManager',
        '$window',
        '$scope',
        '$timeout',
        'aviaHelper',
        'innaApp.Urls',
        'innaApp.API.events',
        '$location',
        'DynamicPackagesDataProvider',
        '$routeParams',
        'DynamicFormSubmitListener',
        '$q',
        '$anchorScroll',

        // components
        'Tripadvisor',
        'Stars',
        'Balloon',
        '$filter',
        function (EventManager, $window, $scope, $timeout, aviaHelper, Urls, Events, $location, DynamicPackagesDataProvider, $routeParams, DynamicFormSubmitListener, $q, $anchorScroll, Tripadvisor, Stars, Balloon, $filter) {

            DynamicFormSubmitListener.listen();

            var routParam = angular.copy($routeParams);
            $scope.userIsAgency = null;

            /**
             * Смотрим на условие - переход из B2B
             */
            if (routParam.OrderId) {

                $scope.displayTicket = ('displayTicket' in $location.search());

                /*Methods*/
                $scope.getTicketDetails = function () {
                    $scope.$broadcast(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, $scope.bundle.ticket);
                };

            } else {
                var StartVoyageDateGoBack = routParam.StartVoyageDate;
                var EndVoyageDateGoBack = routParam.EndVoyageDate;

                var searchParams = angular.extend(routParam, {
                    StartVoyageDate: dateHelper.ddmmyyyy2yyyymmdd(routParam.StartVoyageDate),
                    EndVoyageDate: dateHelper.ddmmyyyy2yyyymmdd(routParam.EndVoyageDate),
                });

                if (routParam.Children && routParam.Children != "0") {
                    searchParams.ChildrenAges = routParam.Children.split('_');
                }
                ;
            }

            //кнопка нового поиска для WL
            function setWlModel(data) {
                $scope.WlNewSearchModel = new inna.Models.WlNewSearch({
                    dateFilter: $filter("date"),
                    from: data.AviaInfo.CityFrom,
                    to: data.AviaInfo.CityTo,
                    start: searchParams.StartVoyageDate,
                    end: searchParams.EndVoyageDate,
                    passengerCount: parseInt(searchParams.Adult) + (searchParams.ChildrenAges ? searchParams.ChildrenAges.length : 0),
                    ticketClass: searchParams.TicketClass
                });
            }

            /*Private*/
            var _tripadvisor = null;
            var _stars = null;
            var map = null;
            $scope.hotelLoaded = false;
            $scope.showFullDescription = false;
            $scope.dataFullyLoaded = false;
            $scope.TAWidget = '';
            $scope.displayRoom = $location.search().room;
            $scope.onlyRoom = null;
            $scope.buyAction = ($location.search().action == 'buy');
            $scope.dateHelper = dateHelper;
            $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
            var _balloonLoad = new Balloon();

            var backgrounds = [
                '/spa/img/hotels/back-0.jpg',
                '/spa/img/hotels/back-1.jpg',
                '/spa/img/hotels/back-2.jpg'
            ];

            _balloonLoad.updateView({
                loading: true,
                title: 'Собираем данные',
                balloonContent: 'Это может занять какое-то время'
            });


            function getDisplayOrder() {

                $scope.isDisplayOrder = true;

                DynamicPackagesDataProvider.displayOrder({
                    orderId: routParam.OrderId,
                    success: function (resp) {
                        _balloonLoad.fire('hide');

                        $scope.bundle = new inna.Models.Dynamic.Combination();
                        $scope.bundle.ticket = new inna.Models.Avia.Ticket();
                        $scope.bundle.ticket.setData(resp.AviaInfo);

                        if (resp.Hotel) {
                            var hotel = new inna.Models.Hotels.Hotel(resp.Hotel);
                            $scope.bundle.setHotel(hotel);
                            $scope.hotel = resp.Hotel;
                            $scope.hotelRooms = [$scope.hotel.Room];
                            $scope.hotelRooms[0].isOpen = true;
                            $scope.hotelOnly = true;
                            $scope.hotelLoaded = true;
                            $scope.TAWidget = app_main.tripadvisor + $scope.hotel.HotelId;
                            EventManager.fire(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED);
                            loadMap();
                            onload();
                        }


                        if (('displayTicket' in $location.search())) {
                           $scope.$broadcast(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, $scope.bundle.ticket, {noClose: true, noChoose: true})
                        }
                    },
                    error: function () {
                        _balloonLoad.dispose();
                        _balloonLoad.updateView({
                            template: "err.html",
                            title: 'Oops...',
                            content: 'Указанного заказа не существует',
                            callbackClose: function () {
                                $scope.$apply(function ($scope) {
                                    delete $location.$$search.displayHotel
                                    $location.$$compose();
                                });
                            }
                        });
                    }
                });
            }

            /**
             * Получаем данные по отелю
             */
            function getHotelDetails() {
                var deferred = $q.defer();
                track.dpBuyPackage();

                DynamicPackagesDataProvider.hotelDetails({
                    HotelId: searchParams.HotelId,
                    HotelProviderId: searchParams.ProviderId,
                    TicketToId: searchParams.TicketId,
                    TicketBackId: searchParams.TicketBackId,
                    Filter: searchParams,

                    success: function (data) {
                        _balloonLoad.fire('hide');

                        setWlModel(data);
                        
                        var hotel = new inna.Models.Hotels.Hotel(data.Hotel);
                        var ticket = new inna.Models.Avia.Ticket();
                        ticket.setData(data.AviaInfo);

                        $location.search('displayHotel', hotel.data.HotelId);

                        $scope.hotel = data.Hotel;
                        $scope.hotelRooms = data.Rooms;
                        $scope.bundle = new inna.Models.Dynamic.Combination();
                        $scope.bundle.setTicket(ticket);
                        $scope.bundle.setHotel(hotel);
                        $scope.$digest();
                        $scope.hotelLoaded = true;
                        EventManager.fire(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED);

                        $scope.dataFullyLoaded = false;
                        $scope.TAWidget = app_main.tripadvisor + $scope.hotel.HotelId;

                        $timeout(function () {
                            loadMap();

                            /* Tripadvisor */
                            _tripadvisor = new Tripadvisor({
                                el: document.querySelector('.js-tripadvisor-container'),
                                data: {
                                    TaCommentCount: $scope.hotel.TaCommentCount,
                                    TaFactor: $scope.hotel.TaFactor,
                                    TaFactorCeiled: $scope.hotel.TaFactorCeiled
                                }
                            })

                            /* Stars */
                            _stars = new Stars({
                                el: document.querySelector('.js-hotel-details-stars'),
                                data: {
                                    stars: $scope.hotel.Stars
                                }
                            })
                        }, 50);

                        deferred.resolve();
                    },
                    error: function () {
                        _balloonLoad.updateView({
                            template: 'err.html',
                            title: "Запрашиваемый отель не найден",
                            content: "Вероятно, комнаты в нем уже распроданы.",
                            callbackClose: function () {
                                $scope.$apply(function ($scope) {
                                    delete $location.$$search.displayHotel;
                                    $location.$$compose();
                                    $location.path(goToSearchDynamic());
                                });
                            }
                        });
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };

            function getHotelDetailsRooms() {

                DynamicPackagesDataProvider.hotelDetails({
                    HotelId: searchParams.HotelId,
                    HotelProviderId: searchParams.ProviderId,
                    TicketToId: searchParams.TicketId,
                    TicketBackId: searchParams.TicketBackId,
                    Filter: searchParams,
                    Rooms: true,

                    success: function (data) {
                        if (data.Rooms.length) {
                            $scope.hotelRooms = data.Rooms;

                            if ($scope.hotel.CheckInTime == '00:00' && data.Hotel.CheckInTime) {
                                $scope.hotel.CheckInTime = data.Hotel.CheckInTime
                            }

                            if ($scope.hotel.CheckOutTime == '00:00' && data.Hotel.CheckOutTime) {
                                $scope.hotel.CheckOutTime = data.Hotel.CheckOutTime
                            }

                            onload();

                        } else {
                            showErrNotFound("К сожалению, свободных номеров в данный момент нет.");
                        }
                    },
                    error: function () {
                        showErrNotFound("К сожалению, выбранный вариант перелета или проживания больше не доступен.");
                    }
                });
            };

            function showErrNotFound(msg) {
                $scope.baloon.showNotFound(msg, "Пожалуйста, выполните новый поиск.", function () {
                    var url = Urls.URL_DYNAMIC_PACKAGES_SEARCH + [
                        $routeParams.DepartureId,
                        $routeParams.ArrivalId,
                        $routeParams.StartVoyageDate,
                        $routeParams.EndVoyageDate,
                        $routeParams.TicketClass,
                        $routeParams.Adult,
                        $routeParams.Children
                    ].join('-');
                    $location.url(url);
                });
            }

            if (!routParam.OrderId) {
                getHotelDetails().then(function () {
                    var scrollPosition = 0;
                    if($scope.hotel && $scope.hotel.Photos) {
                        scrollPosition = ($scope.hotel.Photos.LargePhotos.length || $scope.hotel.Photos.MediumPhotos.length) ? 1300 : 600;
                    }
                    
                    // если пришли с параметром покупки
                    // нажали в бандле - купить
                    if ($scope.buyAction) {
                        $timeout(function () {
                            /*$location.hash('ScrollRooms');
                            $anchorScroll();*/

                            window.scrollTo(0, scrollPosition);
                            if (window.partners) {
                                window.partners.setScrollTo(scrollPosition);
                            }
                        }, 1000);
                    }

                    getHotelDetailsRooms();

                });
            } else {
                getDisplayOrder();
            }

            function goToSearchDynamic() {
                var DepartureId = searchParams.DepartureId;
                var ArrivalId = searchParams.ArrivalId;
                var StartVoyageDate = StartVoyageDateGoBack;
                var EndVoyageDate = EndVoyageDateGoBack;
                var TicketClass = searchParams.TicketClass;
                var Adult = searchParams.Adult || 0;
                var Children = searchParams.Children || '';

                var urlDetails = Urls.URL_DYNAMIC_PACKAGES_SEARCH + [
                    DepartureId,
                    ArrivalId,
                    StartVoyageDate,
                    EndVoyageDate,
                    TicketClass,
                    Adult,
                    Children
                ].join('-');

                return urlDetails;
            };
            $scope.goToSearchDynamic = goToSearchDynamic;


            $scope.goReservation = function (room) {

                var url = Urls.URL_DYNAMIC_PACKAGES_RESERVATION + [
                    $routeParams.DepartureId,
                    $routeParams.ArrivalId,
                    $routeParams.StartVoyageDate,
                    $routeParams.EndVoyageDate,
                    $routeParams.TicketClass,
                    $routeParams.Adult,
                    $routeParams.Children
                ].join('-');


                $location.search({
                    room: room.RoomId,
                    hotel: $scope.hotel.HotelId,
                    ticket: $scope.bundle.ticket.data.VariantId1
                });

                //аналитика
                track.dpGoReserve();

                //чтобы на брони попапы были наверху страницы
                if (window.partners && window.partners.isFullWL()) {
                    window.partners.resetParentScrollTop();
                }

                $location.path(url);
            };

            var loadMap = function () {
                if ($scope.hotel.Latitude && $scope.hotel.Longitude) {

                    $timeout(function () {
                        var point = new google.maps.LatLng($scope.hotel.Latitude, $scope.hotel.Longitude)

                        /*map is from Private section*/
                        map = new google.maps.Map(document.getElementById('hotel-details-map'), {
                            zoom: 16,
                            center: point
                        });

                        var marker = new google.maps.Marker({
                            position: point,
                            icon: '/spa/img/map/pin-grey.png?' + Math.random().toString(16),
                            title: $scope.hotel.HotelName
                        });

                        marker.setMap(map);
                    }, 1);
                }
            };

            var onload = function () {
                $scope.dataFullyLoaded = true;

                if ($scope.displayRoom) {
                    var onlyRoom = null;

                    $scope.hotelRooms.every(function (room) {
                        if (room.RoomId === $scope.displayRoom) {
                            onlyRoom = room;
                        }

                        return true;
                    });

                    if (onlyRoom) {
                        $scope.onlyRoom = [onlyRoom];
                        onlyRoom.isOpen = true;
                    }
                }

                try {
                    $scope.$digest();
                } catch (e) {
                }
            }

            /*Properties*/
            $scope.background = 'url($)'.split('$').join(
                backgrounds[parseInt(Math.random() * 100) % backgrounds.length]
            );

            if (!(window.partners && window.partners.isFullWL())) {
                $('body').css({
                    "background": "#000 " + $scope.background + "repeat fixed"
                });
            }

            /*Methods*/
            $scope.toggleDescription = function () {
                $scope.showFullDescription = !$scope.showFullDescription;
            };

            $scope.toggleRoom = function (room) {
                //converts undefined into boolean on the fly
                room.isOpen = !!!room.isOpen;
            };

            //$scope.$on(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED, onload);

            /*$scope.$on('$locationChangeSuccess', function (data, url, datatest) {
             if (!('displayHotel' in $location.search())) {
             $scope.back();
             }
             });*/


            $scope.scrollToTripadvisor = function () {
                var body = angular.element('html, body'),
                    headerHeight = angular.element('.Header').height(),
                    positionTop = angular.element('#tripadvisor-widget-iframe').position().top;
                body.animate({ scrollTop: positionTop - headerHeight }, 500)
            };

            $scope.$watch('user', function(User){
                if(User){
                    $scope.userIsAgency = User.isAgency();
                }
            });


            $scope.$on('$destroy', function () {
                $('body').removeAttr('style');

                if (_tripadvisor) {
                    _tripadvisor.teardown();
                    _tripadvisor = null;
                }
                if (_stars) {
                    _stars.teardown();
                    _stars = null;
                }

                if(_balloonLoad){
                    _balloonLoad.teardown();
                    _balloonLoad = null;
                }
            })
        }
    ]);