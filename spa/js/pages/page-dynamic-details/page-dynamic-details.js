innaAppControllers
    .controller('PageHotelDetails', [
        'RavenWrapper',
        'EventManager',
        '$window',
        '$scope',
        '$rootScope',
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

        'Balloon',
        '$filter',

        'ModelRecommendedPair',
        'ModelHotelsCollection',
        'ModelTicketsCollection',
        'ModelTicket',
        'ModelHotel',
        function (RavenWrapper, EventManager, $window, $scope, $rootScope, $timeout, aviaHelper, Urls, Events, $location, DynamicPackagesDataProvider, $routeParams, DynamicFormSubmitListener, $q, $anchorScroll, Balloon, $filter,
                  ModelRecommendedPair, ModelHotelsCollection, ModelTicketsCollection, ModelTicket, ModelHotel) {

            DynamicFormSubmitListener.listen();

            Raven.setExtraContext({key: "__DETAILS_DP_CONTEXT__"})

            var routParam = angular.copy($routeParams);
            $scope.OrderId = routParam.OrderId;
            $scope.userIsAgency = null;

            document.body.classList.add('bg_white');
            document.body.classList.remove('light-theme');

            /**
             * Смотрим на условие - переход из B2B
             */
            if (routParam.OrderId) {

                $scope.displayTicket = ('displayTicket' in $location.search());

                /*Methods*/
                $scope.getTicketDetails = function () {
                    $scope.$broadcast(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, {noChoose: true, ticket: $scope.recommendedPair.ticket});
                };

            } else {
                var StartVoyageDateGoBack = routParam.StartVoyageDate;
                var EndVoyageDateGoBack = routParam.EndVoyageDate;

                var searchParams = angular.extend(routParam, {
                    StartVoyageDate: dateHelper.ddmmyyyy2yyyymmdd(routParam.StartVoyageDate),
                    EndVoyageDate: dateHelper.ddmmyyyy2yyyymmdd(routParam.EndVoyageDate)
                });

                if (routParam.Children) {
                    searchParams.ChildrenAges = routParam.Children.split('_');
                }
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
            $scope.recommendedPair = new ModelRecommendedPair();
            $scope.NewPrice = null;
            $scope.OldPrice = null;
            $scope.NewPricePackage = null;
            var _balloonLoad = new Balloon();
            $scope.hoverImageObject = {
                timeOutHover : null,
                hoverImageShow : false,
                hoverImageStyle : {}
            };

            // есть ли хоть в одной из комнат фотографии
            $scope.RoomsPhotosIsEmpty = true;


            <!-- Меню с якорями -->
            $scope.Menu = [
                {
                    id : 'SectionDetail',
                    name : 'Описание отеля',
                    active : false,
                    klass: 'icon-sprite-description'
                },
                {
                    id : 'SectionRoom',
                    name : 'Выбор номера',
                    active : false,
                    klass: 'icon-sprite-room'
                },
                {
                    id : 'SectionServices',
                    name : 'Сервисы',
                    active : false,
                    klass: 'icon-sprite-services'
                },
                {
                    id : 'SectionMap',
                    name : 'Отель на карте',
                    active : false,
                    klass: 'icon-sprite-map'
                },
                {
                    id : 'SectionReviews',
                    name : 'Отзывы',
                    active : false,
                    klass: 'icon-sprite-reviews'
                },
            ];

/*
            var backgrounds = [
                '/spa/img/hotels/back-0.jpg',
                '/spa/img/hotels/back-1.jpg',
                '/spa/img/hotels/back-2.jpg'
            ];*/

            _balloonLoad.updateView({
                loading: true,
                title: 'Собираем данные',
                balloonContent: 'Это может занять какое-то время'
            });

            function parseAmenities (hotel){
                hotel.AmenitiesArray = [];

                if(hotel && Object.keys(hotel.Amenities).length) {

                    for(var key in hotel.Amenities) {
                        var countPart = Math.ceil(hotel.Amenities[key].List.length / 2);
                        var ListOrigin = [].concat(hotel.Amenities[key].List);
                        var ListPart1 = [].concat(ListOrigin.splice(countPart, ListOrigin.length));
                        var ListPart2 = [].concat(ListOrigin);

                        hotel.Amenities[key].part = {
                            part1 : ListPart1,
                            part2 : ListPart2
                        }

                        hotel.AmenitiesArray.push(hotel.Amenities[key]);
                    }
                }
            }

            /**
             * Добавляем в отель комнату
             * Нужно для отрисовки блока пары билет и отель
             * @param rooms
             */
            function parseRooms(rooms){

                rooms.find(function(room){
                    if(room.Photos) {
                        $scope.RoomsPhotosIsEmpty = false;
                        return true;
                    }
                })

                rooms.find(function(room){
                    if(room.Default) {
                        $scope.recommendedPair.setRoom(room);
                        return true;
                    }
                })
            }


            function getDisplayOrder() {

                $scope.isDisplayOrder = true;

                DynamicPackagesDataProvider.displayOrder({
                    orderId: routParam.OrderId,
                    success: function (resp) {
                        _balloonLoad.fire('hide');

                        $scope.recommendedPair.setTicket(new ModelTicket(resp.AviaInfo))


                        if (resp.Hotel) {
                            $scope.recommendedPair.setHotel(new ModelHotel(resp.Hotel));
                            $scope.hotel = resp.Hotel;
                            $scope.hotelRooms = [$scope.hotel.Room];
                            $scope.hotelRooms[0].isOpen = true;
                            $scope.hotelOnly = true;
                            $scope.hotelLoaded = true;
                            $scope.TAWidget = app_main.tripadvisor + $scope.hotel.HotelId;
                            EventManager.fire(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED);

                            parseAmenities(resp.Hotel);
                            parseRooms($scope.hotelRooms);
                            loadMap();
                            onload();
                        }

                        if (('displayTicket' in $location.search())) {
                           $scope.$broadcast(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, {noClose: true, noChoose: true, ticket : $scope.recommendedPair.ticket})
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


            /** Получаем данные по отелю */
            function getHotelDetails() {
                var deferred = $q.defer();
                track.dpBuyPackage();

                DynamicPackagesDataProvider.hotelDetails({
                    data : {
                        HotelId: searchParams.HotelId,
                        HotelProviderId: searchParams.ProviderId,
                        TicketToId: searchParams.TicketId,
                        TicketBackId: searchParams.TicketBackId,
                        Filter: searchParams
                    },
                    success: function (data) {
                       _balloonLoad.fire('hide');

                        setWlModel(data);

                        parseAmenities(data.Hotel);

                        var hotel = new ModelHotel(data.Hotel);
                        var ticket = new ModelTicket(data.AviaInfo);
                        //ticket.modelTicket = ticket;
                        $scope.recommendedPair.setTicket(ticket);
                        $scope.recommendedPair.setHotel(hotel);

                        $location.search('displayHotel', hotel.data.HotelId);

                        $scope.hotel = data.Hotel;
                        $scope.hotelRooms = data.Rooms;

                        $scope.hotelLoaded = true;
                        EventManager.fire(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED);

                        $scope.dataFullyLoaded = false;
                        $scope.TAWidget = app_main.tripadvisor + $scope.hotel.HotelId;

                        $scope.$digest();

                        $timeout(function () {
                            loadMap();
                        }, 50);

                        deferred.resolve();
                    },
                    error: function (data) {
                        RavenWrapper.raven({
                            captureMessage : 'PACKAGE DETAILS: SERVER ERROR',
                            dataResponse: data.responseJSON,
                            dataRequest: searchParams
                        });

                        var timeoutId = setTimeout(function () {
                            onClose();
                        }, 3000);
                        function onClose() {
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }
                            $scope.$apply(function ($scope) {
                                delete $location.$$search.displayHotel;
                                $location.$$compose();
                                $location.path(goToSearchDynamic());
                            });
                        }
                        _balloonLoad.updateView({
                            template: 'not-found.html',
                            title: "Перелет + Отель недоступен",
                            content: "К сожалению, выбранный пакет Перелет + Отель <br/>недоступен, выберите другой вариант.",
                            callbackClose: onClose,
                            callback: onClose
                        });
                        deferred.reject();
                    }
                });

                return deferred.promise;
            };

            function getHotelDetailsRooms() {

                DynamicPackagesDataProvider.hotelDetails({
                    data: {
                        HotelId: searchParams.HotelId,
                        HotelProviderId: searchParams.ProviderId,
                        TicketToId: searchParams.TicketId,
                        TicketBackId: searchParams.TicketBackId,
                        Filter: searchParams,
                        Rooms: true
                    },
                    success: function (data) {
                        if (data.Rooms.length) {

                            $scope.hotelRooms = data.Rooms;

                            parseRooms(data.Rooms);

                            if ($scope.hotel.CheckInTime == '00:00' && data.Hotel.CheckInTime) {
                                $scope.hotel.CheckInTime = data.Hotel.CheckInTime
                            }

                            if ($scope.hotel.CheckOutTime == '00:00' && data.Hotel.CheckOutTime) {
                                $scope.hotel.CheckOutTime = data.Hotel.CheckOutTime
                            }

                            $scope.OldPrice = $scope.recommendedPair.getFullPackagePrice();

                            // для теста новой цены
                            //data.NewPrice = 70000;

                            if(data.NewPrice) {
                                $scope.NewPrice = data.NewPrice;
                                $scope.NewPricePackage = ($scope.NewPrice - $scope.OldPrice);
                                data.PackagePrice = data.NewPrice;
                                $scope.recommendedPair.setFullPackagePrice(data);
                            }

                            onload();

                        } else {
                            RavenWrapper.raven({
                                captureMessage : 'PACKAGE DETAILS ROOMS NOT FOUND',
                                dataResponse: data,
                                dataRequest: searchParams
                            });

                            showErrNotFound("К сожалению, свободных номеров в данный момент нет.");
                        }
                    },
                    error: function (data) {
                        RavenWrapper.raven({
                            captureMessage : 'PACKAGE DETAILS ROOMS NOT FOUND: SERVER ERROR',
                            dataResponse: data.responseJSON,
                            dataRequest: searchParams
                        });

                        $scope.$apply(function(){
                            showErrNotFound("К сожалению, выбранный вариант перелета или проживания больше не доступен.");
                        })

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

                    // если пришли с параметром покупки
                    // нажали в бандле - купить
                    if ($scope.buyAction) {
                        $timeout(function () {
                            if (window.partners && window.partners.isFullWL()) {
                                var elementHotelDetails = document.querySelector('.hotel-details-rooms');
                                var positionTop = utils.getCoords(elementHotelDetails).top;
                                window.partners.setScrollTo(positionTop);
                            } else {
                                $scope.goToScroll('SectionRoom');
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

                var urlDetails = '/#' + Urls.URL_DYNAMIC_PACKAGES_SEARCH + [
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
                    $routeParams.Children,
                    $routeParams.HotelId,
                    $routeParams.TicketId,
                    $routeParams.TicketBackId,
                    $routeParams.ProviderId
                ].join('-');


                $location.search({
                    room: room.RoomId,
                    hotel: $scope.hotel.HotelId,
                    ticket: $scope.recommendedPair.ticket.data.VariantId1
                });

                //аналитика
                track.dpGoReserve();

                //чтобы на брони попапы были наверху страницы
                if (window.partners && window.partners.isFullWL()) {
                    window.partners.resetParentScrollTop();
                    window.partners.setScrollPage(20);
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


            /*Methods*/
            $scope.toggleDescription = function () {
                $scope.showFullDescription = !$scope.showFullDescription;
            };

            $scope.toggleRoom = function (room) {
                //converts undefined into boolean on the fly
                room.isOpen = !!!room.isOpen;
            };


            $scope.goToScroll = function(menu_item){

                var ID = '';

                if(menu_item.id){
                    ID = menu_item.id;
                    $scope.menu_item = menu_item;
                } else {
                    ID = menu_item;
                }

                var element = document.querySelector('#'+ ID);

                if(element) {
                    var coords = utils.getCoords(element);
                    var headerHeight = angular.element('.Header').height();
                    var body = angular.element('html, body');
                    body.animate({scrollTop:(coords.top - headerHeight) - 30}, 300);


                    if (window.partners) {
                        if (window.partners.isFullWL() === true) {
                            window.partners.setScrollTo((coords.top) + 100);
                        }
                    }
                }


                if(menu_item.id) {
                    $scope.Menu.forEach(function (item) {
                        if (item.id != menu_item.id) {
                            item.active = false;
                        }
                    });
                    menu_item.active = true;
                }

            };

            $scope.$watch('user', function(User){
                if(User){

                    $scope.userIsAgency = User.isAgency();
                    $scope.AgencyId = parseInt(User.getAgencyId());
                    $scope.onCondition = function () {
                        return true;
                    }
                }
            });

            

            $scope.$on('$destroy', function () {

                document.body.classList.remove('bg_white');
                document.body.classList.add('light-theme');
                $('body').removeAttr('style');

                if(_balloonLoad){
                    _balloonLoad.teardown();
                    _balloonLoad = null;
                }
            })
        }
    ]);