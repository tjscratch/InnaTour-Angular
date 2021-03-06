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
    
    self.hotelRules = new aviaHelper.hotelRules();

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
     * Трекаем события для GTM
     * https://innatec.atlassian.net/browse/IN-7071
     */
    if (buyParams.Children) {
        var Travelers = buyParams.Adult + "-" + buyParams.Children.length;
        var TotalTravelers = Math.ceil(buyParams.Adult) + Math.ceil(buyParams.Children.length);
    } else {
        var Travelers = buyParams.Adult + "-" + 0;
        var TotalTravelers = Math.ceil(buyParams.Adult);
    }

    $scope.$watch('reservation.ReservationModel.Agree', function (newValue, oldValue) {
        if(newValue != null) {
            var dataLayerObj = {
                'event': 'UM.Event',
                'Data': {
                    'Category': 'Hotels',
                    'Action': 'AcceptConditions',
                    'Label': newValue ? 'Select' : 'UnSelect',
                    'Content': '[no data]',
                    'Context': '[no data]',
                    'Text': '[no data]'
                }
            };
            // console.table(dataLayerObj);
            if (window.dataLayer) {
                window.dataLayer.push(dataLayerObj);
            }
        }
    });
    
    $scope.gtmRules = function ($event, type) {
        var dataLayerObj = {
            'event': 'UM.Event',
            'Data': {
                'Category': 'Hotels',
                'Action': type == 'oferta' ? 'Oferta' : '',
                'Label': $event.target.textContent,
                'Content': '[no data]',
                'Context': '[no data]',
                'Text': '[no data]'
            }
        };
        // console.table(dataLayerObj);
        if (window.dataLayer) {
            window.dataLayer.push(dataLayerObj);
        }
    };

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

    function baloonError (message) {
        self.baloonHotelError = new Balloon();
        self.baloonHotelError.updateView({
            template: 'err.html',
            title: message ? message : 'Возникла ошибка при бронировании',
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

        /**
         * Трекаем события для GTM
         * https://innatec.atlassian.net/browse/IN-7071
         */
        dataService.getLocationById(buyParams.ArrivalId)
            .then(function (res) {
                var cityCode = res.data.Location.Location.NameEnglish + '/' + res.data.NameEn;
                var dataLayerObj = {
                    'event': 'UI.PageView',
                    'Data': {
                        'PageType': 'HotelsReservationCheck',
                        'CityCode': cityCode ? cityCode : '[no data]',
                        'DateFrom': buyParams.StartVoyageDate,
                        'NightCount': buyParams.NightCount,
                        'Travelers': Travelers,
                        'TotalTravelers': TotalTravelers,
                        'hotelId': buyParams.hotelId,
                        'roomId': buyParams.roomId,
                        //'Price': 10,
                        //'HotelName': ''
                    }
                };
                // console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
            });


        HotelService.getHotelBuy(buyParams)
            .then(function (response) {
                if (response.status == 200 && response.data.Available) {
                    self.baloonHotelAvailable.teardown();
                    self.hotelInfo = response.data;
    
    
                    //правила отмены отеля
                    self.hotelRules.fillData(response.data);
    
                    /**
                     * Трекаем события для GTM
                     * https://innatec.atlassian.net/browse/IN-7071
                     */
                    dataService.getLocationById(buyParams.ArrivalId)
                        .then(function (res) {
                            var cityCode = res.data.Location.Location.NameEnglish + '/' + res.data.NameEn;
                            var dataLayerObj = {
                                'event': 'UI.PageView',
                                'Data': {
                                    'PageType': 'HotelsReservationLoad',
                                    'CityCode': cityCode ? cityCode : '[no data]',
                                    'DateFrom': buyParams.StartVoyageDate,
                                    'NightCount': buyParams.NightCount,
                                    'Travelers': Travelers,
                                    'TotalTravelers': TotalTravelers,
                                    'Price': self.hotelInfo.Room.Price,
                                    'HotelName': self.hotelInfo.Hotel.HotelName,
                                    'hotelId': buyParams.hotelId,
                                    'roomId': buyParams.roomId
                                }
                            };
                            // console.table(dataLayerObj);
                            if (window.dataLayer) {
                                window.dataLayer.push(dataLayerObj);
                            }
                        });

                } else {
                    baloonError(response.data.Message ? response.data.Message : null);
                }
            }, function (response) {
                // console.log(response)
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
        // console.log('start reservation');
        baloonReservation();

        var dataLayerObj = {
            'event': 'UM.Event',
            'Data': {
                'Category': 'Hotels',
                'Action': 'HotelsBook',
                'Label': '[no data]',
                'Content': '[no data]',
                'Context': '[no data]',
                'Text': '[no data]'
            }
        };
        // console.table(dataLayerObj);
        if (window.dataLayer) {
            window.dataLayer.push(dataLayerObj);
        }

        /**
         * Трекаем события для GTM
         * https://innatec.atlassian.net/browse/IN-7071
         */
        dataService.getLocationById(buyParams.ArrivalId)
            .then(function (res) {
                var cityCode = res.data.Location.Location.NameEnglish + '/' + res.data.NameEn;
                var dataLayerObj = {
                    'event': 'UI.PageView',
                    'Data': {
                        'PageType': 'HotelsBooking',
                        'CityCode': cityCode ? cityCode : '[no data]',
                        'DateFrom': buyParams.StartVoyageDate,
                        'NightCount': buyParams.NightCount,
                        'Travelers': Travelers,
                        'TotalTravelers': TotalTravelers,
                        'Price': self.hotelInfo.Room.Price,
                        'HotelName': self.hotelInfo.Hotel.HotelName,
                        'hotelId': buyParams.hotelId,
                        'roomId': buyParams.roomId
                    }
                };
                // console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
            });


        ReservationService.reservation(self.ReservationModel)
            .then(
                function (res) {
                    // console.log('reservation success', res);
                    self.baloonHotelReservation.teardown();
                    if (res.data.OrderNum) {
                        var url = res.data.RedirectUrl;
                        window.location = url;
                    }
                    if (res.data.HotelBooked == false) {
                        baloonError();
                    }
                },
                function () {
                    baloonError();
                }
            );
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
                // console.log(data)
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
            // console.log('ReservationService.countries: ' + data);
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
