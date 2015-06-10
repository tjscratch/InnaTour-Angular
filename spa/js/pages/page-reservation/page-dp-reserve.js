angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
        'RavenWrapper',
        '$scope',
        '$controller',
        '$routeParams',
        '$location',
        'DynamicFormSubmitListener',
        'DynamicPackagesDataProvider',
        'aviaHelper',
        'paymentService',
        'innaApp.Urls',
        'storageService',
        'urlHelper',
        '$timeout',

        '$templateCache',
        //components
        'Balloon',
        function (RavenWrapper, $scope, $controller, $routeParams, $location, DynamicFormSubmitListener, DynamicPackagesDataProvider, aviaHelper, paymentService, Urls, storageService, urlHelper, $timeout, $templateCache, Balloon) {

            $scope.baloon.showExpireCheck();

            Raven.setExtraContext({key: "__RESERVATION_CONTEXT__"});

            // TODO : наследование контроллера
            $controller('ReserveTicketsCtrl', {$scope: $scope});

            if ($scope.isAgency() || (window.partners && window.partners.isWL())) {
            }
            else {
                //тоолько для B2C
                //и не на WL
                $scope.isRequestEnabled = true;
            }

            /*----------------- INIT -------------------*/

            var children = $routeParams.Children ?
                _.partition($routeParams.Children.split('_'), function (age) {
                    return age > 2;
                }) :
                [
                    [],
                    []
                ];

            var searchParams = angular.copy($routeParams);

            searchParams.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.StartVoyageDate);
            searchParams.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.EndVoyageDate);
            searchParams.Children && (searchParams.ChildrenAges = searchParams.Children.split('_'));

            if ($location.search().hotel) searchParams['HotelId'] = $location.search().hotel;
            if ($location.search().ticket) searchParams['TicketId'] = $location.search().ticket;
            if ($location.search().room) searchParams['RoomId'] = $location.search().room;

            //дата до - для проверки доков
            $scope.expireDateTo = null;
            if (searchParams.EndVoyageDate){
                $scope.expireDateTo = dateHelper.apiDateToJsDate(searchParams.EndVoyageDate);
            }
            else {
                $scope.expireDateTo = dateHelper.apiDateToJsDate(searchParams.StartVoyageDate);
            }

            $scope.searchParams = searchParams;
            $scope.combination = {};
            $scope.fromDate = $routeParams.StartVoyageDate;
            $scope.AdultCount = parseInt($routeParams.Adult);
            $scope.ChildCount = children[0].length;
            $scope.Child = children[0];
            $scope.InfantsCount = children[1].length;
            $scope.peopleCount = $scope.AdultCount + $scope.ChildCount + $scope.InfantsCount;

            $scope.ticketsCount = aviaHelper.getTicketsCount($scope.AdultCount, $scope.ChildCount, $scope.InfantsCount);
            $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $routeParams.TicketClass);

            //:DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children?-:HotelId-:TicketId-:TicketBackId-:ProviderId
            $scope.getHotelInfoLink = function (ticketId, ticketBackId, hotelId, providerId) {
                var url = '/#' + Urls.URL_DYNAMIC_HOTEL_DETAILS +
                    [
                        $routeParams.DepartureId,
                        $routeParams.ArrivalId,
                        $routeParams.StartVoyageDate,
                        $routeParams.EndVoyageDate,
                        $routeParams.TicketClass,
                        $routeParams.Adult,
                        $routeParams.Children > 0 ? $routeParams.Children : '',
                        hotelId,
                        ticketId,
                        ticketBackId,
                        providerId
                    ].join('-');

                if (window.partners && window.partners.isFullWL()) {
                    url = window.partners.getParentLocationWithUrl(url);
                }

                return url;
            };

            function addition() {
                var self = this;
                this.customerWishlist = '';
                this.isNeededVisa = false;
                this.isNeededTransfer = false;
                this.isNeededMedicalInsurance = false;
            }


            function goToSearch() {
                var url = $scope.goBackUrl().replace('/#', '');
                $location.url(url);
            }

            $scope.goBackUrl = function () {
                var url = '/#' + Urls.URL_DYNAMIC_PACKAGES_SEARCH +
                    [
                        $routeParams.DepartureId,
                        $routeParams.ArrivalId,
                        $routeParams.StartVoyageDate,
                        $routeParams.EndVoyageDate,
                        $routeParams.TicketClass,
                        $routeParams.Adult,
                        $routeParams.Children
                    ].join('-');
                return url;
            };


            function getCheckParams() {
                var qData = {
                    HotelId: $scope.hotel.HotelId,
                    HoteProviderId: $scope.hotel.ProviderId,
                    Rooms: $location.search().room,
                    TicketToId: $scope.item.VariantId1,
                    TicketBackId: $scope.item.VariantId2,
                    TicketClass: $routeParams.TicketClass,
                    'Filter[DepartureId]': $routeParams.DepartureId,
                    'Filter[ArrivalId]': $routeParams.ArrivalId,
                    'Filter[StartVoyageDate]': searchParams.StartVoyageDate,
                    'Filter[EndVoyageDate]': searchParams.EndVoyageDate,
                    'Filter[TicketClass]': $routeParams.TicketClass,
                    'Filter[Adult]': $routeParams.Adult
                };
                if ($routeParams.Children) {
                    var childs = $routeParams.Children.split('_');
                    qData['Filter[ChildrenAges]'] = [];
                    _.each(childs, function (age) {
                        qData['Filter[ChildrenAges]'].push(age);
                    });
                }
                return qData;
            }

            function successSearch(data) {
                $scope.$apply(function ($scope) {

                    $scope.addition = new addition();

                    //console.log('data:');
                    //console.log(data);
                    //дополняем полями
                    aviaHelper.addCustomFields(data.AviaInfo);
                    aviaHelper.addAggInfoFields(data.Hotel);

                    $scope.item = data.AviaInfo;
                    $scope.hotel = data.Hotel;
                    $scope.room = data.Hotel.Room;
                    $scope.price = data.Price;

                    //грузим тарифы
                    $scope.loadTarifs($scope.item.VariantId1, $scope.item.VariantId2, data.AviaInfo);


                    $scope.afterPayModelInit = function () {
                        $scope.baloon.hide();
                    };

                    $scope.combination.Hotel = data.Hotel;
                    $scope.combination.Ticket = data.AviaInfo;

                    $scope.Is_it_tarif = data.AviaInfo.ItTariff;
                });
            }

            function errorSearch(data, status) {
                $scope.safeApply(function () {
                    $scope.baloon.showNotFound("Вариант больше недоступен", "Вы будете направлены на результаты поиска",
                        function () {
                            $timeout.cancel($scope.tmId);
                            goToSearch();
                        });
                });

                $scope.tmId = $timeout(function () {
                    //очищаем хранилище для нового поиска
                    //storageService.clearAviaSearchResults();
                    $scope.baloon.hide();
                    //билеты не доступны - отправляем на поиск
                    goToSearch();
                }, 3000);
            }


            /**
             * проверяем, что остались билеты для покупки
             */
            function packageCheckAvailability() {
                var getCheckParamsRaven = getCheckParams()
                paymentService.packageCheckAvailability({
                    data: getCheckParamsRaven,
                    success: function (data) {
                        if ((data != null && data.IsTicketAvailable == true) &&
                            (data.Rooms != null && data.Rooms.length) &&
                            (data.Rooms[0].IsAvailable == true && data.Rooms[0].RoomId.length)) {
                            //если проверка из кэша - то отменяем попап
                            //$timeout.cancel(availableChecktimeout);
                            $scope.roomId = data.Rooms[0].RoomId;

                            //правила отмены отеля
                            $scope.hotelRules.fillData($scope.hotel);

                            //загружаем все
                            $scope.initPayModel();
                        }
                        else {
                            RavenWrapper.raven({
                                captureMessage: 'CHECK AVAILABILITY ROOMS: ERROR',
                                dataResponse: data,
                                dataRequest: getCheckParamsRaven
                            });

                            //================analytics========================
                            //Страница оплаты. Ошибка проверки доступности пакета
                            track.dpPackageNotAvialable();
                            //================analytics========================

                            errorSearch();
                        }
                    },
                    error: function (data) {
                        RavenWrapper.raven({
                            captureMessage: 'CHECK AVAILABILITY ROOMS: SERVER ERROR',
                            dataResponse: data.responseJSON,
                            dataRequest: getCheckParamsRaven
                        });

                        //================analytics========================
                        //Страница оплаты. Ошибка проверки доступности пакета
                        track.dpPackageNotAvialable();
                        //================analytics========================

                        $scope.safeApply(function () {
                            $scope.showReserveError();
                        });
                    }
                });
            }


            /**
             * ----- INIT -------
             * Получаем данные об отеле
             */
            DynamicPackagesDataProvider.hotelDetails({
                data: {
                    HotelId: searchParams.HotelId,
                    HotelProviderId: searchParams.ProviderId,
                    TicketToId: searchParams.TicketId,
                    TicketBackId: searchParams.TicketBackId,
                    Filter: searchParams,
                    Rooms: true
                },
                success: successSearch,
                error: errorSearch
            }).done(function (data) {
                if(data && !$scope.hotel){
                    $scope.hotel = data.Hotel;
                }
                //console.log('done');
                packageCheckAvailability()
            });


            DynamicFormSubmitListener.listen();

            $scope.objectToReserveTemplate = 'pages/page-reservation/templ/reserve-include.html';

            $scope.afterCompleteCallback = function () {
                //переходим на страницу оплаты
                var url = Urls.URL_DYNAMIC_PACKAGES_BUY + $scope.OrderNum;
                $location.url(url);
            }

            $scope.getApiModel = function (data) {
                var m = {};
                m.I = data.name;
                m.F = data.secondName;
                m.Email = data.email;
                m.Phone = data.phone;
                m.IsSubscribe = data.wannaNewsletter;

                var pasList = [];
                _.each(data.passengers, function (item) {
                    pasList.push($scope.getPassenger(item));
                });
                m.Passengers = pasList;

                //Children: "1_2"
                var childAgers = [];
                if ($routeParams.Children != null && $routeParams.Children.length > 0) {
                    _.each($routeParams.Children.split('_'), function (item) {
                        childAgers.push(item);
                    });
                }

                m.IsNeededVisa = $scope.addition.isNeededVisa,
                    m.IsNeededTransfer = $scope.addition.isNeededTransfer,
                    m.IsNeededMedicalInsurance = $scope.addition.isNeededMedicalInsurance,

                    m.SearchParams = {
                        HotelId: $scope.hotel.HotelId,
                        HotelProviderId: $scope.hotel.ProviderId,
                        TicketToId: $scope.item.VariantId1,
                        TicketBackId: $scope.item.VariantId2,
                        RoomId: $scope.roomId,
                        Filter: {
                            DepartureId: $routeParams.DepartureId,
                            ArrivalId: $routeParams.ArrivalId,
                            StartVoyageDate: $scope.searchParams.StartVoyageDate,
                            EndVoyageDate: $scope.searchParams.EndVoyageDate,
                            TicketClass: $routeParams.TicketClass,
                            Adult: $routeParams.Adult,
                            ChildrenAges: childAgers
                        },
                        CustomerWishlist: $scope.addition.customerWishlist
                    };
                return m;
            }

            //бронируем
            $scope.reserve = function () {
                //console.log('$scope.reserve');
                var m = $scope.getApiModelForReserve();
                var model = m.model;
                var apiModel = angular.copy(m.apiModel);


                RavenWrapper.raven({
                    level: 3,
                    captureMessage: 'START RESERVE PACKAGES',
                    dataRequest: apiModel
                });


                paymentService.packageReserve({
                    data: apiModel,
                    success: function (data) {

                        $scope.safeApply(function () {
                            //console.log('order: ' + angular.toJson(data));
                            if (data != null && data.OrderNum != null && data.OrderNum.length > 0 && data.Status != null && data.Status == 1 && data.OrderNum.length > 0) {
                                //сохраняем orderId
                                //storageService.setAviaOrderNum(data.OrderNum);
                                $scope.OrderNum = data.OrderNum;

                                //аналитика
                                track.dpGoBuy();

                                if ($scope.isAgency()) {
                                    $scope.goToB2bCabinet();
                                }
                                else {
                                    //сохраняем модель
                                    //storageService.setReservationModel(model);

                                    //успешно
                                    $scope.afterCompleteCallback();
                                }
                            }
                            else {
                                RavenWrapper.raven({
                                    level: 2,
                                    captureMessage: 'RESERVE PACKAGES: ERROR',
                                    dataResponse: data,
                                    dataRequest: apiModel
                                });
                                //аналитика
                                track.dpReservationError();

                                console.error('packageReserve: %s', angular.toJson(data));
                                $scope.showReserveError();
                            }
                        });
                    },
                    error: function (data) {

                        RavenWrapper.raven({
                            level: 6,
                            captureMessage: 'RESERVE PACKAGES: SERVER ERROR',
                            dataResponse: data.responseJSON,
                            dataRequest: apiModel
                        });
                        //аналитика
                        track.dpReservationError();

                        $scope.safeApply(function () {
                            //ошибка
                            console.error('paymentService.reserve error');
                            $scope.showReserveError();
                        });
                    }
                });
            };

            $scope.showReserveError = function () {
                $scope.baloon.hide();


                new Balloon().updateView({
                    template: 'server-error.html',
                    callbackClose: function () {
                        //отправляем на поиск пакетов
                        goToSearch();
                    }
                });
            }


            $scope.$on('$destroy', function () {
                $scope.baloon.hide();
                $timeout.cancel($scope.tmId);
            });
        }
    ]);