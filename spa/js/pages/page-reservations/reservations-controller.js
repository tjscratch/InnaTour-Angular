/**
 * для валидации используется библиотека
 * https://github.com/huei90/angular-validation
 * во вьюхе используем как
 * ReservationsController as reservation
 */
innaAppControllers.controller('ReservationsController', function ($scope,
                                                                  $routeParams,
                                                                  $location,
                                                                  $injector,
                                                                  Balloon,
                                                                  HotelService,
                                                                  ReservationService) {

    var self = this;

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
        $location.path(AppRouteUrls.URL_HOTELS);
    };


    /**
     * проверка доступности выбранной комнаты
     */
    HotelService.getHotelsIsAvailable($routeParams)
        .success(function (data) {
            if (data.Rooms[0].IsAvailable) {
                self.baloonHotelAvailable.teardown();
            }
        })


    /**
     * получение данных выбранной комнаты
     */
    HotelService.getHotelBuy($routeParams)
        .success(function (data) {
            console.log(data);
            self.hotelInfo = data;
        })


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
