/*hotel: '=innaHotelDetailsHotel',
 collection: '=innaHotelDetailsCollection',
 back: '=innaHotelDetailsBack',
 next: '=innaHotelDetailsNext',
 combination: '=innaHotelDetailsBundle',
 goReservation: '=innaHotelDetailesReservationFn',
 getTicketDetails: '=innaHotelDetailsGetTicketDetails',
 hotelOnly: '@innaHotelDetailsHotelOnly'*/


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

        // components
        'Balloon',
        'Tripadvisor',
        'Stars',
        function (EventManager, $window, $scope, $timeout, aviaHelper, Urls, Events, $location, DynamicPackagesDataProvider, $routeParams, Balloon, Tripadvisor, Stars) {


            var routParam = angular.copy($routeParams);
            var StartVoyageDateGoBack = routParam.StartVoyageDate;
            var EndVoyageDateGoBack = routParam.EndVoyageDate;

            var searchParams = angular.extend(routParam, {
                StartVoyageDate: dateHelper.ddmmyyyy2yyyymmdd(routParam.StartVoyageDate),
                EndVoyageDate: dateHelper.ddmmyyyy2yyyymmdd(routParam.EndVoyageDate),
                ChildrenAges: (routParam.Children) ? routParam.Children.split('_') : null
            });

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

            var backgrounds = [
                '/spa/img/hotels/back-0.jpg',
                '/spa/img/hotels/back-1.jpg',
                '/spa/img/hotels/back-2.jpg'
            ];

            var _balloonLoading = new Balloon({
                data: {
                    balloonClose: false,
                    template: 'loading.html',
                    wait: 1000
                }
            })
            _balloonLoading.show();

            function hotel404() {
                $scope.baloon.showErr(
                    "Запрашиваемый отель не найден",
                    "Вероятно, комнаты в нем уже распроданы.",
                    function () {
                        delete $location.$$search.displayHotel
                        $location.$$compose();
                    }
                );
            }


            /**
             * Получаем данные по отелю
             */
            function getHotelDetails() {

                /*if (buyAction) {
                 $location.search('action', 'buy');
                 }*/

                track.dpBuyPackage();

                DynamicPackagesDataProvider.hotelDetails({
                    HotelId: searchParams.HotelId,
                    HotelProviderId: searchParams.ProviderId,
                    TicketToId: searchParams.TicketId,
                    TicketBackId: searchParams.TicketBackId,
                    Filter: searchParams,

                    success: function (data) {
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
                        _balloonLoading.hide();
                        EventManager.fire(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED);
                    },
                    error: function () { //error
                        $scope.$apply(function ($scope) {
                            hotel404();
                        });
                    }
                });
            };

            getHotelDetails();

            $scope.computedUrlBackList = function () {

                var urlDetails = '/#/packages/search/' + [
                    searchParams.DepartureId,
                    searchParams.ArrivalId,
                    StartVoyageDateGoBack,
                    EndVoyageDateGoBack,
                    searchParams.TicketClass,
                    searchParams.Adult,
                    searchParams.Children
                ].join('-');

                return urlDetails;
            };

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

                $location.path(url);
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


                setTimeout(function () {
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
                }, 0);
            }

            /*Properties*/
            $scope.background = 'url($)'.split('$').join(
                backgrounds[parseInt(Math.random() * 100) % backgrounds.length]
            );

            $('body').css({
                "background": "#000 " + $scope.background + "repeat fixed"
            });

            /*Methods*/
            $scope.toggleDescription = function () {
                $scope.showFullDescription = !$scope.showFullDescription;
            };

            $scope.toggleRoom = function (room) {
                //converts undefined into boolean on the fly
                room.isOpen = !!!room.isOpen;
            };


            $scope.goToSearchDynamic = function () {
                console.log('goToSearchDynamic');
            };

            /*Watchers*/
            $scope.$watch('hotel', function (hotel) {
                if (!hotel) return;

                if (hotel.Latitude && hotel.Longitude) {

                    $timeout(function () {
                        var point = new google.maps.LatLng(hotel.Latitude, hotel.Longitude)

                        /*map is from Private section*/
                        map = new google.maps.Map(document.querySelector('#hotel-details-map'), {
                            zoom: 16,
                            center: point
                        });

                        var marker = new google.maps.Marker({
                            position: point,
                            icon: '/spa/img/map/pin-grey.png?' + Math.random().toString(16),
                            title: hotel.HotelName
                        });

                        marker.setMap(map);
                    }, 100);
                }

                $scope.dataFullyLoaded = false;

                $scope.TAWidget = app_main.tripadvisor + $scope.hotel.HotelId;

                onload();

                console.log($scope.bundle, '$scope.bundle');
            });

            //$scope.$on(Events.DYNAMIC_SERP_HOTEL_DETAILS_LOADED, onload);

            /*$scope.$on('$locationChangeSuccess', function (data, url, datatest) {
             if (!('displayHotel' in $location.search())) {
             $scope.back();
             }
             });*/

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
            })
        }
    ]);
