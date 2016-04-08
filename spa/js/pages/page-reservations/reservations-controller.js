/**
 * для валидации используется библиотека
 * https://github.com/huei90/angular-validation
 * во вьюхе используем как
 * ReservationsController as reservation
 */
innaAppControllers.controller('ReservationsController', function ($scope,
                                                                  $routeParams,
                                                                  $location,
                                                                  AppRouteUrls,
                                                                  $injector,
                                                                  Balloon,
                                                                  HotelService,
                                                                  ReservationService) {

    var self = this;
    self.hotelsIndexPath = '/#' + HotelService.getHotelsIndexUrl($routeParams);

    self.hotelsShowPath = HotelService.getHotelsShowUrl($routeParams.hotelId, $routeParams.providerId, $routeParams);


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
        console.log(self.hotelsShowPath)
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

    /**
     * получение данных выбранной комнаты
     * и проверка доступности выбранной комнаты
     */
    HotelService.getHotelBuy($routeParams)
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
        self.ReservationModel = ReservationService.getReservationModel($routeParams.Adult, 1);
    } else {
        self.ReservationModel = ReservationService.getReservationModel($routeParams.Adult);
    }

    self.ReservationModel.SearchParams = $routeParams;


    self.form = {
        checkValid: $validationProvider.checkValid,
        submit: function (form) {
            $validationProvider.validate(form);
            ReservationService.reservation(self.ReservationModel)
                .success(function (data) {
                    console.log(data);
                })
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
    });

});
