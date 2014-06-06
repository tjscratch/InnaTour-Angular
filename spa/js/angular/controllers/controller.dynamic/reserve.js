angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
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
        function ($scope, $controller, $routeParams, $location, DynamicFormSubmitListener, DynamicPackagesDataProvider, aviaHelper,
            paymentService, Urls, storageService, urlHelper) {

            $scope.baloon.show('Проверка доступности билетов', 'Подождите пожалуйста, это может занять несколько минут');
            //initial
            (function(){
                var children = $routeParams.Children ?
                    _.partition($routeParams.Children.split('_'), function(age){ return age > 2; }) :
                    [[], []];

                var searchParams = angular.copy($routeParams);
                var cacheKey = '';

                searchParams.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.StartVoyageDate);
                searchParams.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.EndVoyageDate);
                searchParams.Children && (searchParams.ChildrenAges = searchParams.Children.split('_'));

                if($location.search().hotel) searchParams['HotelId'] = $location.search().hotel;
                if ($location.search().ticket) searchParams['TicketId'] = $location.search().ticket;
                if ($location.search().room) searchParams['RoomId'] = $location.search().room;

                $scope.searchParams = searchParams;

                $scope.combination = {};

                DynamicPackagesDataProvider.search(searchParams, function(data){
                    cacheKey = data.SearchId;

                    $scope.$apply(function($scope){
                        $controller('ReserveTicketsCtrl', { $scope: $scope });
                        $scope.fromDate = $routeParams.StartVoyageDate;
                        $scope.AdultCount = parseInt($routeParams.Adult);
                        $scope.ChildCount = children[0].length;
                        $scope.InfantsCount = children[1].length;
                        $scope.peopleCount = $scope.AdultCount + $scope.ChildCount + $scope.InfantsCount;

                        $scope.ticketsCount = aviaHelper.getTicketsCount($scope.AdultCount, $scope.ChildCount, $scope.InfantsCount);
                        $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $routeParams.TicketClass);

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

                        $scope.getHotelInfoLink = function (ticketId, hotelId) {
                            var url = $scope.goBackUrl();
                            url += "?ticket=" + ticketId + "&displayHotel=" + hotelId;
                            if ($location.search().room != null) {
                                url += "&room=" + $location.search().room;
                            }
                            return url;
                        }

                        function addition() {
                            var self = this;
                            this.customerWishlist = '';
                            this.isNeededVisa = false;
                            this.isNeededTransfer = false;
                            this.isNeededMedicalInsurance = false;
                        }
                        $scope.addition = new addition();

                        console.log('data:');
                        console.log(data);
                        //дополняем полями 
                        aviaHelper.addCustomFields(data.RecommendedPair.AviaInfo);
                        $scope.item = data.RecommendedPair.AviaInfo;
                                     
                        aviaHelper.addAggInfoFields(data.RecommendedPair.Hotel);
                        $scope.hotel = data.RecommendedPair.Hotel;
                        $scope.price = data.RecommendedPair.Price;

                        function getCheckParams() {
                            var qData = {
                                HotelId: $scope.hotel.HotelId,
                                HoteProviderId: $scope.hotel.ProviderId,
                                //Rooms: $scope.hotel.SelectedRoomId,//???
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
                        //проверяем, что остались билеты для покупки
                        paymentService.packageCheckAvailability(getCheckParams(),
                            function (data) {
                                //data = false;
                                if (data.IsTicketAvailable == true && data.Rooms != null &&
                                    data.Rooms.length > 0 && data.Rooms[0].IsAvail == true && data.Rooms[0].RoomId.length > 0) {
                                    //если проверка из кэша - то отменяем попап
                                    //$timeout.cancel(availableChecktimeout);
                                    $scope.roomId = data.Rooms[0].RoomId;

                                    //загружаем все
                                    loadDataAndInit();

                                    //ToDo: debug
                                    //$timeout(function () {
                                    //    loadDataAndInit();
                                    //}, 1000);
                                }
                                else {
                                    //log('checkAvailability, false');
                                    //$timeout.cancel(availableChecktimeout);

                                    function goToSearch() {
                                        var url = $scope.goBackUrl();
                                        console.log('redirect to url: ' + url);
                                        $location.url(url);
                                    }

                                    $scope.safeApply(function () {
                                        $scope.baloon.showWithClose("Вариант больше недоступен", "Вы будете направлены на результаты поиска",
                                            function () {
                                                goToSearch();
                                            });
                                    });
                                    

                                    //$timeout(function () {
                                    //    //очищаем хранилище для нового поиска
                                    //    storageService.clearAviaSearchResults();
                                    //    //билеты не доступны - отправляем на поиск
                                    //    goToSearch();
                                    //}, 3000);
                                }
                            },
                            function (data, status) {
                                //error
                                //$timeout.cancel(availableChecktimeout);
                                $scope.safeApply(function () {
                                    $scope.showReserveError();
                                });
                            });
                        
                        function loadDataAndInit() {
                            $scope.initPayModel();
                        }

                        $scope.afterPayModelInit = function () {
                            //log('$scope.afterPayModelInit');
                            $scope.baloon.hide();
                            //$scope.fillDefaultModelDelay();
                        };

                        $scope.combination.Hotel = data.RecommendedPair.Hotel;
                        $scope.combination.Ticket = data.RecommendedPair.AviaInfo;

                        //$scope.initPayModel();

                        //console.log($scope.combination);
                    });
                });
            })();

            DynamicFormSubmitListener.listen();

            $scope.objectToReserveTemplate = 'pages/dynamic/inc/reserve.html';

            //console.log('hi from DynamicReserveTicketsCtrl', $routeParams, $scope);

            $scope.afterCompleteCallback = function () {
                //переходим на страницу оплаты
                var url = Urls.URL_DYNAMIC_PACKAGES_BUY + $scope.OrderNum;
                //console.log('processToPayment, url: ' + url);
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

                m.SearchParams = {
                    HotelId: $scope.hotel.HotelId,
                    HotelProviderId: $scope.hotel.ProviderId,
                    TicketBackId: $scope.item.VariantId1,
                    TicketToId: $scope.item.VariantId2,
                    RoomId: $scope.roomId,
                    Filter: {
                        DepartureId: $routeParams.DepartureId,
                        ArrivalId: $routeParams.ArrivalId,
                        StartVoyageDate: $scope.searchParams.StartVoyageDate,
                        EndVoyageDate: $scope.searchParams.EndVoyageDate,
                        TicketClass: $routeParams.TicketClass,
                        Adult: $routeParams.Adult
                    },
                    IsNeededVisa: $scope.addition.isNeededVisa,
                    IsNeededTransfer: $scope.addition.isNeededTransfer,
                    IsNeededMedicalInsurance: $scope.addition.isNeededMedicalInsurance,
                    CustomerWishlist: $scope.addition.customerWishlist
                };
                return m;
            }

            //бронируем
            $scope.reserve = function () {
                var m = $scope.getApiModelForReserve();
                var model = m.model;
                var apiModel = m.apiModel;

                paymentService.packageReserve(apiModel,
                    function (data) {
                        $scope.$apply(function ($scope) {
                            console.log('order: ' + angular.toJson(data));
                            if (data != null && data.OrderNum != null && data.OrderNum.length > 0) {
                                //сохраняем orderId
                                //storageService.setAviaOrderNum(data.OrderNum);
                                $scope.OrderNum = data.OrderNum;

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
                                $scope.showReserveError();
                            }
                        });
                    },
                    function (data, status) {
                        $scope.$apply(function ($scope) {
                            //ошибка
                            console.log('paymentService.reserve error');
                            $scope.showReserveError();
                        });
                    });
            };

            $scope.showReserveError = function () {
                $scope.baloon.showErr("Что-то пошло не так", "Ожидайте, служба поддержки свяжется с вами, \nили свяжитесь с оператором по телефону <b>+7 495 742-1212</b>",
                    function () {
                        $location.url(Urls.URL_DYNAMIC_PACKAGES);
                    });
            }
        }
    ]);