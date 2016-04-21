/**
 * для валидации используется библиотека
 * https://github.com/huei90/angular-validation
 * во вьюхе используем как
 * ReservationsController as reservation
 */
innaAppControllers.controller('ReservationsController', function ($rootScope,
                                                                  $scope,
                                                                  $timeout,
                                                                  $routeParams,
                                                                  $location,
                                                                  AppRouteUrls,
                                                                  $injector,
                                                                  Balloon,
                                                                  HotelService,
                                                                  ReservationService) {

    var self = this;
    self.hotelsIndexPath = '/#' + HotelService.getHotelsIndexUrl($routeParams);
    self.busIndexPath = '/#' + HotelService.getBusIndexUrl($routeParams);

    self.hotelsShowPath = HotelService.getHotelsShowUrl($routeParams.hotelId, $routeParams.providerId, $routeParams);
    self.busShowPath = HotelService.getBusShowUrl($routeParams.hotelId, $routeParams.providerId, $routeParams);

    self.typeProduct = $routeParams.typeProduct;

    self.passengerCount = Math.ceil($routeParams.Adult) + Math.ceil($routeParams.ChildrenCount);


    /**
     * проверяем доступность выбранной комнаты
     */
    self.baloonHotelAvailable = new Balloon();
    self.baloonHotelAvailable.updateView({
        template: 'expireHotel.html',
        balloonClose: false,
        callback: function () {
            redirectHotel();
        }
    });

    function redirectHotel () {
        self.baloonHotelAvailable.teardown();
        $location.path(self.hotelsShowPath);
    };

    function baloonError () {
        self.baloonHotelAvailable.updateView({
            template: 'err.html',
            title: 'Выбранная комната не доступна',
            content: 'Попробуйте начать поиск заново',
            callbackClose: function () {
                console.log(33333)
                redirectHotel();
            },
            callback: function () {
                console.log(44444)
                redirectHotel();
            }
        });
    }

    function baloonReservation () {
        self.baloonHotelReservation = new Balloon();
        self.baloonHotelReservation.updateView({
            template: 'load.html',
            title: 'Бронирование комнаты',
            content: 'Это займет не более 30 секунд',
            callbackClose: function () {
                redirectHotel();
            },
            callback: function () {
                redirectHotel();
            }
        });
    }

    /**
     * получение данных выбранной комнаты
     * и проверка доступности выбранной комнаты
     */
    var buyParams = angular.copy($routeParams);
    buyParams.Adult = self.passengerCount;
    buyParams.ChildrenCount = null;
    buyParams.typeProduct = null;
    HotelService.getHotelBuy(buyParams)
        .then(function (response) {
            console.log(response)
            if (response.status == 200 && response.data.Available) {
                self.baloonHotelAvailable.teardown();
                self.hotelInfo = response.data;
            } else {
                baloonError();
            }
        }, function (response) {
            console.log(response)
            baloonError();
        });


    var $validationProvider = $injector.get('$validation');
    // если в url есть параметр ?test=1
    // заполняем данные пассажира фейковыми данными
    if ($location.$$search && $location.$$search.test == 1) {
        self.ReservationModel = ReservationService.getReservationModel(self.passengerCount, 1);
    } else {
        self.ReservationModel = ReservationService.getReservationModel(self.passengerCount);
    }

    self.ReservationModel.SearchParams = $routeParams;


    self.form = {
        checkValid: $validationProvider.checkValid,
        submit: function (form) {
            $validationProvider.validate(form);
            console.log('start reservation');
            baloonReservation();
            ReservationService.reservation(self.ReservationModel)
                .success(function (data) {
                    console.log('reservation success', data);
                    self.baloonHotelReservation.teardown();
                    if (data.RedirectUrl) {
                        window.location.replace(data.RedirectUrl);
                    }
                });
        }
    };


    /**
     * begin
     * ui-select
     * @type {undefined}
     */
    ReservationService.getCountries()
        .success(function (data) {
            self.countries = data;
        })
        .error(function (data) {
            console.log('ReservationService.countries: ' + data);
        });


    self.documentTypes = ReservationService.getDocumentTypes();


    $scope.$on('$destroy', function () {
        if (self.baloonHotelAvailable) {
            self.baloonHotelAvailable.teardown();
            self.baloonHotelAvailable = null;
        }
        if (self.baloonHotelReservation) {
            self.baloonHotelReservation.teardown();
            self.baloonHotelReservation = null;
        }
    });

});
