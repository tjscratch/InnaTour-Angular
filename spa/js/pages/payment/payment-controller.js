/**
 * во вьюхе используем как
 * ReservationsController as reservation
 */
innaAppControllers.controller('PaymentController',
    function ($scope,
              $routeParams,
              $location,
              $anchorScroll,
              $filter,
              $timeout,
              AppRouteUrls,
              Payment,
              aviaHelper,
              dataService,
              gtm) {
        
        var self = this;
        self.paySuccess = true;
        self.OrderNum = $routeParams.OrderNum;
        var baloon = aviaHelper.baloon;
        
        
        /**
         * первым делом проверяем изменение цены заказа
         * todo закоментил на этап тестирования/разработки
         */
        Payment.getRepricing(self.OrderNum)
            .then(
                getRepricingSuccess,
                getRepricingError
            );
        // getOrderData();
        
        /**
         * getRepricingSuccess
         */
        function getRepricingSuccess(response) {
            var data = response.data;
            
            switch (data.Type) {
                case 1: {
                    //все норм - получаем данные и продолжаем заполнять
                    getOrderData();
                    break;
                }
                case 2: {
                    //цена изменилась
                    var oldPrice = data.OldPrice;
                    var newPrice = data.NewPrice;
                    var msg = 'Изменилась стоимость заказа c <b>' + $filter('price')(oldPrice) + '<span class='
                    b - rub
                    '>q</span></b> на <b>' + $filter('price')(newPrice) + '<span class='
                    b - rub
                    '>q</span></b>';
                    baloon.showPriceChanged("Изменилась цена", msg, function () {
                        
                        setTimeout(function () {
                            $scope.safeApply(function () {
                                $scope.baloon.show('Подождите', 'Это может занять несколько секунд');
                            });
                        }, 0);
                        
                        //все норм - получаем данные и продолжаем заполнять
                        getOrderData();
                    });
                    break;
                }
                case 3: {
                    //данные для нового поиска
                    getOrderData();
                    //вариант перелета больше недоступен (например бронь была снята а/к)
                    baloon.showNotFound("Перелет недоступен", "К сожалению, вариант перелета больше недоступен",
                        function () {
                            $location.url(self.searchUrl);
                        });
                    break;
                }
                case 4: {
                    //данные для нового поиска
                    getOrderData();
                    //вариант проживания больше недоступен (например уже нет выбранного номера)
                    baloon.showNotFound("Отель недоступен", "К сожалению, вариант проживания больше недоступен",
                        function () {
                            $location.url(self.searchUrl);
                        });
                    break;
                }
            }
        }
        
        /**
         * getRepricingError
         * при запросе на репрайсинг произошла ошибка
         */
        function getRepricingError() {
            globalError();
        }
        
        
        /**
         * получение от сервера данных для оплаты
         * вызов идет после репрайсинга
         */
        function getOrderData() {
            baloon.show('Подготовка к оплате', 'Это может занять несколько секунд');
            Payment.getPaymentData({orderNum: self.OrderNum})
                .then(
                    getPaymentDataSuccess,
                    getPaymentDataError
                );
        }
        
        /**
         * успешная загрузка данных для оплаты
         * установка типа продукта
         * dp, avia, hotel
         * по умолчанию dp
         * ProductType
         * Avia = 1
         * Динамический пакет = 2
         * Сервисный сбор = 3
         * Отели = 4
         * Не определен = 0
         */
        function getPaymentDataSuccess(response) {
            var data = response.data;
            if (data != null) {
                self.data = data
                self.searchUrl = self.data.Filter ? Payment.getSearchUrl(self.data) : null; // url для нового поиска
                self.paySuccess = false;
                self.SvyaznoyExperationDate = data.ExperationDate;
                self.ExperationDate = moment(data.ExperationDate).format('DD MMM YYYY, HH:mm');
                self.ExperationMinute = data.ExperationMinute * 60;
                
                // проверяем статус заказа
                // todo отрефакторить это все потом и надо наверное избавиться от репрайсинга https://innatec.atlassian.net/browse/IN-7173
                if (data.IsPayed == true) {
                    //уже оплачен
                    baloon.showAlert('Заказ уже оплачен', '',
                        function () {
                            baloon.hide();
                            $location.url(AppRouteUrls.URL_ROOT);
                        });
                } else if (data.OrderStatus == 2) {
                    //[Description("Аннулирован")]
                    baloon.showNotFound("Заказ аннулирован", "Воспользуйтесь поиском, чтобы оформить новый заказ.",
                        function () {
                            baloon.hide();
                            $location.url(self.searchUrl);
                        });
                    // } else {
                    //     baloon.hide();
                    //     // если таймлимит равен нулю
                    //     if (self.ExperationMinute == 0) {
                    //         self.callbackTimer();
                    //     } else {
                    //         self.data.IsAvailable = true;
                    //
                    //         svyaznoyPayment();
                    //
                    //         if (self.data.ProductType != 3) {
                    //             var topMinus = 126;
                    //             $timeout(function () {
                    //                 $('html, body').animate({
                    //                     scrollTop: $('.Payment__OrderInfo').offset().top - topMinus
                    //                 }, 300);
                    //             }, 1200);
                    //         }
                    //     }
                    // }
                    // todo проверку IsAvailable убрал на время, сейчас постоянно приходит false
                } else if (data.IsAvailable) {
                    baloon.hide();
                    // если таймлимит равен нулю
                    if (self.ExperationMinute == 0) {
                        self.callbackTimer();
                    } else {
                        self.data.IsAvailable = true;
                        gtmTrackLoadSuccess(self.data);
                        svyaznoyPayment();
                        
                        if (self.data.ProductType != 3) {
                            var topMinus = 126;
                            $timeout(function () {
                                $('html, body').animate({
                                    scrollTop: $('.Payment__OrderInfo').offset().top - topMinus
                                }, 300);
                            }, 1200);
                        }
                    }
                } else {
                    baloon.showNotFound("Заказ недоступен", "Воспользуйтесь поиском, чтобы оформить новый заказ.",
                        function () {
                            baloon.hide();
                            $location.url(self.searchUrl);
                        });
                }
                
            } else {
                globalError();
            }
        }
        
        
        /**
         * при загрузке данных произошла ошибка
         * коллбек для обработки этой ошибки
         */
        function getPaymentDataError(response) {
            globalError();
        }
        
        
        /**
         * колбэк при истечении времени
         */
        self.callbackTimer = function () {
            self.data.IsAvailable = false;
            baloon.showNotFound("Срок оплаты вашего заказа истёк, заказ недоступен", "Воспользуйтесь поиском, чтобы оформить новый заказ.",
                function () {
                    baloon.hide();
                    $location.url(self.searchUrl);
                });
        };
        
        
        /**
         * todo
         * старый код, отрефакторить
         */
        function globalError() {
            baloon.showGlobalAviaErr();
        }
        
        /**
         * оплата через связной
         */
        function svyaznoyPayment() {
            var partner = window.partners ? window.partners.getPartner() : null;
            // если агенство проверяем доступность способов оплаты картой и через связной
            var isB2bAgency = $scope.$root.user ? $scope.$root.user.getType() == 2 : null;
            var isPayWithBankCardEnabled = $scope.$root.user ? $scope.$root.user.isPayWithBankCardEnabled() : false;
            var isPayWithSvyaznoyEnabled = $scope.$root.user ? $scope.$root.user.isPayWithSvyaznoyEnabled() : false;
            
            // тип оплаты 1 - карта, 2 - связной, 3 - qiwi
            if ($location.search().payType) {
                self.payType = $location.search().payType;
            } else {
                self.payType = 1;
            }
            
            self.isPayWithBankCardAllowed = isB2bAgency ? isPayWithBankCardEnabled : true; // доступность оплаты банковской картой
            self.isPayWithSvyaznoyAllowed = isB2bAgency ? isPayWithSvyaznoyEnabled : true; // доступность оплаты через связной
            
            self.SvyaznoyblockViewTypeEnum = {
                all     : 'all',
                svyaznoy: 'svyaznoy',
                euroset : 'euroset'
            };
            
            self.SvyaznoyOrderNum = null;
            self.SvyaznoyOrderNum = 467 + '-' + self.OrderNum;
            self.SvyaznoyCheckListTitle = 'наличными в Связном или Евросети'; //заголовок в чекбоксе выбора
            self.SvyaznoyblockViewType = self.SvyaznoyblockViewTypeEnum.all; //тип блока в описании
            
            if (partner) {
                //согласно задаче
                //https://innatec.atlassian.net/browse/IN-4927
                var pageType = window.partners.getSvyaznoyPageType();
                switch (pageType) {
                    case window.partners.SvyaznoyPageType.OperatorPage: {
                        self.SvyaznoyOrderNum = 466 + '-' + self.OrderNum;
                        break;
                    }
                    case window.partners.SvyaznoyPageType.ToursPage: {
                        self.SvyaznoyOrderNum = 468 + '-' + self.OrderNum;
                        break;
                    }
                    case window.partners.SvyaznoyPageType.NotSvyaznoyPage: {
                        self.SvyaznoyOrderNum = 467 + '-' + self.OrderNum;
                        break;
                    }
                }
                
                
                if (partner.name == 'svyaznoy') {
                    self.SvyaznoyCheckListTitle = 'наличными в Связном';
                    self.SvyaznoyblockViewType = self.blockViewTypeEnum.svyaznoy;
                }
                else if (partner.name == 'euroset') {
                    self.SvyaznoyCheckListTitle = 'наличными в Евросети';
                    self.SvyaznoyblockViewType = self.blockViewTypeEnum.euroset;
                }
                
            }
            
            if ($scope.reservationModel && $scope.reservationModel.expirationDate != null) {
                self.time = '&time=' + +($scope.reservationModel.expirationDate);
            }
            
        }
        
        
        /**
         * сообщение после успешной/неуспешной оплаты
         * @param event
         */
        
        function listener(event) {
            if (event.data.payment) {
                self.paySuccess = true;
                gtmTrackSuccessPay(self.data, true);
                $timeout(function () {
                    aviaHelper.baloon.show('Спасибо за покупку!', 'В ближайшие 10 минут ожидайте на <b>' + self.data.Email + '</b> письмо с подтверждением выполнения заказа и документами (билеты/ваучеры)',
                        aviaHelper.baloonType.email,
                        function () {
                            $location.path(AppRouteUrls.URL_ROOT);
                        },
                        {
                            buttonCaption: 'Ok', successFn: function () {
                            aviaHelper.baloon.hide();
                            $location.path(AppRouteUrls.URL_ROOT);
                        }
                        });
                }, 0)
            } else if (event.data.payment == false) {
                gtmTrackSuccessPay(self.data, false);
                globalError();
            }
        }
        
        if (window.addEventListener) {
            window.addEventListener("message", listener);
        } else {
            window.attachEvent("onmessage", listener);
        }
        
        
        /**
         * Трекаем события для GTM
         * https://innatec.atlassian.net/browse/IN-7071
         */
        function gtmTrackLoadSuccess(data) {
            if (data.Filter) {
                var Filter = JSON.parse(data.Filter);
                if (Filter.ChildrenAges) {
                    var Travelers = Filter.Adult + "-" + Filter.ChildrenAges.length;
                }
                var GaCityTo = Filter.ArrivalId;
                
                
                //коды аэропортов
                function getIATACodes(info) {
                    var res = {codeFrom: '', codeTo: ''};
                    if (info.EtapsTo != null && info.EtapsTo.length > 0) {
                        res.codeFrom = info.EtapsTo[0].OutCode;//первый
                        res.codeTo = info.EtapsTo[info.EtapsTo.length - 1].InCode;//последний
                    }
                    return res;
                }
                
                if (data.AviaInfo) {
                    var ports = getIATACodes(data.AviaInfo);
                }
                // data.ProductType
                // Avia = 1
                // Динамический пакет = 2
                // Сервисный сбор = 3
                // Отели = 4
                // Не определен = 0
                switch (data.ProductType) {
                    case 1:
                        gtm.GtmTrack(
                            {
                                'PageType': 'AviaPayLoad'
                            },
                            {
                                'CityFrom'      : ports.codeFrom,
                                'CityTo'        : ports.codeTo,
                                'DateFrom'      : moment(data.AviaInfo.DepartureDate).format('YYYY-MM-DD'),
                                'DateTo'        : data.AviaInfo.BackDepartureDate ? moment(data.AviaInfo.BackDepartureDate).format('YYYY-MM-DD') : null,
                                'Travelers'     : data.AviaInfo.AdultCount + "-" + data.AviaInfo.ChildCount + "-" + data.AviaInfo.InfantCount,
                                'TotalTravelers': data.Passengers.length,
                                'Price'         : data.Price,
                                'ServiceClass'  : Filter.CabinClass == 0 ? 'Economy' : 'Business',
                                'AirlineName'   : data.AviaInfo.EtapsTo[0].TransporterName
                            }
                        );
                        break;
                    case 2:
                        gtm.GtmTrack(
                            {
                                'PageType': 'PackagesPayLoad'
                            },
                            {
                                'CityFrom'      : data.LocationFrom.City.Code,
                                'CityTo'        : data.LocationTo.City.Code,
                                'DateFrom'      : moment(data.Hotel.CheckIn).format('YYYY-MM-DD'),
                                'DateTo'        : moment(data.Hotel.CheckOut).format('YYYY-MM-DD'),
                                'Travelers'     : data.AviaInfo.AdultCount + "-" + (Math.ceil(data.AviaInfo.ChildCount) + Math.ceil(data.AviaInfo.InfantCount)),
                                'TotalTravelers': data.Passengers.length,
                                'Price'         : data.Price,
                                'HotelName'     : data.Hotel.HotelName,
                                'ServiceClass'  : Filter.TicketClass == 0 ? 'Economy' : 'Business'
                            }
                        );
                        break;
                    case 3:
                        break;
                    case 4:
                        /**
                         * Трекаем события для GTM
                         * https://innatec.atlassian.net/browse/IN-7071
                         */
                        console.log(Filter);
                        dataService.getLocationById(Filter.ArrivalId)
                            .then(function (res) {
                                gtm.GtmTrack(
                                    {
                                        'PageType': 'HotelsPayLoad'
                                    },
                                    {
                                        'CityCode': res.data.Location.Location.Code ? res.data.Location.Location.Code : null,
                                        'DateFrom'      : moment(data.Hotel.CheckIn).format('YYYY-MM-DD'),
                                        'NightCount'    : data.Hotel.NightCount,
                                        'Travelers'     : Filter.Adult + "-" + Filter.ChildrenAges.length,
                                        'TotalTravelers': data.Passengers.length,
                                        'Price'         : data.Price,
                                        'HotelName'     : data.Hotel.HotelName
                                    }
                                );
                            });
                        break;
                    default:
                        break;
                }
            }
        }
        
        
        function gtmTrackSuccessPay(data, status) {
            // self.payType тип оплаты 1 - карта, 2 - связной, 3 - qiwi
            var payType;
            if (self.payType == 1) {
                payType = 'Card';
            } else if (self.payType == 2) {
                payType = 'svyaznoy';
            } else if (self.payType == 3) {
                payType = 'qiwi';
            }
            
            var Status;
            var Title;
            var Text;
            if (status) {
                Status = 'Complete';
                Title = 'Заказ успешно оплачее';
                Text = '[no data]';
            } else {
                Status = 'Fail';
                Title = 'Не удалось оплатать заказ';
                Text = 'Проверьте наличие достаточной суммы на счете, данные вашей карты';
            }
            // data.ProductType
            // Avia = 1
            // Динамический пакет = 2
            // Сервисный сбор = 3
            // Отели = 4
            // Не определен = 0
            switch (data.ProductType) {
                case 1:
                    gtm.GtmTrack(
                        {
                            'PageType'     : 'AviaDone',
                            'PaymentMethod': payType,
                            'Status'       : Status,
                            'Title'        : Title,
                            'Text'         : Text
                        }
                    );
                    break;
                case 2:
                    gtm.GtmTrack(
                        {
                            'PageType'     : 'PackagesDone',
                            'PaymentMethod': payType,
                            'Status'       : Status,
                            'Title'        : Title,
                            'Text'         : Text
                        }
                    );
                    break;
                case 3:
                    break;
                case 4:
                    gtm.GtmTrack(
                        {
                            'PageType'     : 'HotelDone',
                            'PaymentMethod': payType,
                            'Status'       : Status,
                            'Title'        : Title,
                            'Text'         : Text
                        }
                    );
                    break;
                default:
                    break;
            }
        }
        
    });
