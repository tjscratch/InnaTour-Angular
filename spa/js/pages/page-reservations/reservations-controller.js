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
                                                                  dataService,
                                                                  ReservationService,
                                                                  aviaHelper,
                                                                  $interval,
                                                                  CheckSmsService) {

    var self = this;
    self.hotelsIndexPath = '/#' + HotelService.getHotelsIndexUrl($routeParams);
    self.busIndexPath = '/#' + HotelService.getBusIndexUrl($routeParams);

    self.hotelsShowPath = HotelService.getHotelsShowUrl($routeParams.hotelId, $routeParams.providerId, $routeParams);
    self.busShowPath = HotelService.getBusShowUrl($routeParams.hotelId, $routeParams.providerId, $routeParams);

    self.typeProduct = $routeParams.typeProduct;

    var buyParams = angular.copy($routeParams);
    buyParams.test = null;
    if(buyParams.Children){
        buyParams.ChildrenAges = buyParams.Children.split('_');
        //buyParams.Children = buyParams.Children.split('_').map(function (age) {
        //    return { value: age };
        //});
        self.passengerCount = Math.ceil($routeParams.Adult) + Math.ceil($routeParams.Children.split('_').length);
    }else{
        self.passengerCount = Math.ceil($routeParams.Adult);
    }

    /**
     * проверяем доступность выбранной комнаты
     */
    self.baloonHotelAvailable = new Balloon();

    function redirectHotel () {
        if(!self.baloonDateError) {
        $timeout(function () {
            if (self.typeProduct == 'bus') {
                $location.path(self.busShowPath);
            } else {
                $location.path(self.hotelsShowPath);
            }
        }, 0);
        }
        if (self.baloonHotelAvailable) {
            self.baloonHotelAvailable.teardown();
            self.baloonHotelAvailable = null;
        }
        if (self.baloonHotelReservation) {
            self.baloonHotelReservation.teardown();
            self.baloonHotelReservation = null;
        }
        if (self.baloonHotelError) {
            self.baloonHotelError.teardown();
            self.baloonHotelError = null;
        }
        if (self.baloonDateError) {
            self.baloonDateError.teardown();
            self.baloonDateError = null;
            $location.path('/#/hotels/');
        }
    };

    function baloonError () {
        self.baloonHotelError = new Balloon();
        self.baloonHotelError.updateView({
            template: 'err.html',
            title: 'Возникла ошибка при бронировании',
            content: 'Попробуйте начать поиск заново',
            callbackClose: function () {
                redirectHotel();
            },
            callback: function () {
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

    function baloonErrorDate () {
        self.baloonDateError = new Balloon();
        self.baloonDateError.updateView({
            template: 'err.html',
            title: 'Дата заезда должна быть больше текущей даты!',
            content: 'Попробуйте начать поиск заново',
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
    //buyParams.Adult = buyParams.Adult;
    //buyParams.Children = null;


    var help = dateHelper;
    var today = help.getTodayDate();
    var startDate = dateHelper.apiDateToJsDate($routeParams.StartVoyageDate);
    if(+today <= +startDate) {
        buyParams.Children = null;
        buyParams.typeProduct = null;
        self.baloonHotelAvailable.updateView({
            template: 'expireHotel.html',
            balloonClose: false,
            callback: function () {
                redirectHotel();
            }
        });
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
    } else {
        baloonErrorDate();
    }

    var $validationProvider = $injector.get('$validation');
    // если в url есть параметр ?test=1
    // заполняем данные пассажира фейковыми данными
    if ($location.$$search && $location.$$search.test == 1) {
        self.ReservationModel = ReservationService.getReservationModel(self.passengerCount, 1);
    } else {
        self.ReservationModel = ReservationService.getReservationModel(self.passengerCount);
    }

    self.ReservationModel.SearchParams = buyParams;


    self.form = {
        checkValid: $validationProvider.checkValid,
        submit: function (e, form) {
            $validationProvider.validate(form);
            $timeout(function () {
                if (form.$valid) {
                    if (self.hotelInfo.NeedSmsValidation) {
                        $scope.submitSms();
                        $scope.checkReserveSms.show(e);
                    } else {
                        reservation();
                    }
                }
            }, 0);
        }
    };


    function reservation () {
        console.log('start reservation');
        baloonReservation();
        ReservationService.reservation(self.ReservationModel)
            .success(function (data) {
                console.log('reservation success', data);
                self.baloonHotelReservation.teardown();
                if (data.RedirectUrl) {
                    window.location.replace(data.RedirectUrl);
                }
                if (data.HotelBooked == false) {
                    baloonError();
                }
            });
    };

    /**
     * begin checkReserveSms
     */
    $scope.checkReserveSms = new aviaHelper.checkReserveSms();
    $scope.sms_code = '';
    $scope.sms_code_error = false;
    $scope.timer = 60000;

    $scope.submitSms = function () {
        $scope.fight();
        $scope.timer = 60000;
        CheckSmsService.getSmsCode({ Phone: self.ReservationModel.Phone })
            .success(function (data) {
                console.log(data)
            })
    }

    //console.log($scope.validationModel.phone.value)

    $scope.submitSmsCode = function ($event, code) {
        CheckSmsService.checkSmsCode({ Phone: self.ReservationModel.Phone, Code: code })
            .then(function successCallback (response) {
                if (response.data == 0) {
                    $scope.sms_code_error = true;
                } else {
                    $scope.checkReserveSms.close($event);
                    reservation();
                }
            }, function errorCallback (response) {
                $scope.sms_code_error = true;
            });
    };

    var stop;
    $scope.fight = function () {
        if (angular.isDefined(stop)) return;
        stop = $interval(function () {
            if ($scope.timer > 0) {
                $scope.timer = $scope.timer - 1000;
            } else {
                $scope.stopFight();
            }
        }, 1000);
    };
    $scope.stopFight = function () {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };
    /**
     * end checkReserveSms
     */


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

    if ($routeParams.ArrivalId) {
        dataService.getDPLocationById($routeParams.ArrivalId)
            .then(function (data) {
                $scope.CountryId = data.CountryId;
                //массив с кодами стран СНГ
                var arrayCountryIds = [189, 69829, 35, 124, 215, 115];
                //если код выбранной страны не входит в массив стран СНГ то тип документа ставим 1 (Загранпаспорт)
                var zagran = _.indexOf(arrayCountryIds, $scope.CountryId);
                if(zagran == -1) {
                    self.ReservationModel.Passengers.forEach(function (item, i , arr) {
                        item.DocumentId = 1;
                    })
                }
            });
    }

    $scope.setOferta = function (isDp) {
        var url = app_main.staticHost + '/files/doc/offer.pdf';

        if (window.partners && window.partners.isFullWLOrB2bWl()) {
            url = normalizeUrl(window.partners.getPartner().offertaContractLink);
        }
        else {
            url = app_main.staticHost + '/files/doc/innatour_offerta.pdf';
        }

        function normalizeUrl (url) {
            //если путь относительный
            //"/Files/Doc/150715155346/150723141900/offer_premiertur76.pdf"
            if (url && url.indexOf('/') == 0) {
                //то дописываем до полного на статик
                url = app_main.staticHost + url;
            }
            return url;
        }

        $scope.oferta = {
            url: function () {
                return url;
            }
        };
    };
    $scope.setOferta();




    $scope.$on('$destroy', function () {
        if (self.baloonHotelAvailable) {
            self.baloonHotelAvailable.teardown();
            self.baloonHotelAvailable = null;
        }
        if (self.baloonHotelReservation) {
            self.baloonHotelReservation.teardown();
            self.baloonHotelReservation = null;
        }
        if (self.baloonHotelError) {
            self.baloonHotelError.teardown();
            self.baloonHotelError = null;
        }
    });

});
