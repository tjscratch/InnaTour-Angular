/**
 * во вьюхе используем как
 * ReservationsController as reservation
 */
innaAppControllers.controller('PaymentController', function ($scope, $routeParams, $location, $anchorScroll, $filter, AppRouteUrls, Payment, aviaHelper) {
    
    var self = this;
    var baloon = aviaHelper.baloon;
    
    /**
     * первым делом проверяем изменение цены заказа
     * todo закоментил на этап тестирования/разработки
     */
    // Payment.getRepricing($routeParams.OrderNum)
    //     .then(
    //         getRepricingSuccess,
    //         getRepricingError
    //     );
    getOrderData();
    
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
                var msg = 'Изменилась стоимость заказа c <b>' + $filter('price')(oldPrice) + '<span class="b-rub">q</span></b> на <b>' + $filter('price')(newPrice) + '<span class="b-rub">q</span></b>';
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
        Payment.getPaymentData({orderNum: $routeParams.OrderNum})
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
            self.searchUrl = Payment.getSearchUrl(self.data); // url для нового поиска
            
            self.ExperationDate = moment(data.ExperationDate).format('DD MMM YYYY, HH:mm');
            self.ExperationMinute = data.ExperationMinute * 60;
            
            // тип оплаты 1 - карта, 2 - связной, 3 - qiwi
            if ($location.search().payType) {
                self.payType = $location.search().payType;
            } else {
                self.payType = 1;
            }
            
            // если агенство проверяем доступность способов оплаты картой и через связной
            self.isB2bAgency = $scope.$root.user ? $scope.$root.user.getType() == 2 : null;
            var isPayWithBankCardEnabled = $scope.$root.user ? $scope.$root.user.isPayWithBankCardEnabled() : false;
            var isPayWithSvyaznoyEnabled = $scope.$root.user ? $scope.$root.user.isPayWithSvyaznoyEnabled() : false;
            
            // доступность оплаты банковской картой
            if (self.isB2bAgency) {
                self.isPayWithBankCardAllowed = isPayWithBankCardEnabled;
            } else {
                self.isPayWithBankCardAllowed = true;
            }
            
            // доступность оплаты через связной
            if (self.isB2bAgency) {
                self.isPayWithSvyaznoyAllowed = isPayWithSvyaznoyEnabled;
            } else {
                self.isPayWithSvyaznoyAllowed = true;
            }
            
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
                baloon.showAlert('Заказ аннулирован', '',
                    function () {
                        baloon.hide();
                        $location.url(self.searchUrl);
                    });
            } else if (data.IsAvailable) {
                baloon.hide();
                // если таймлимит равен нулю
                if (self.ExperationMinute == 0) {
                    self.callbackTimer();
                }else{
                    // скролим страницу до нужного места
                    // todo
                    // при добавлении хеша в url идет перезагрузка контроллера, надо починить
                    // https://innatec.atlassian.net/browse/IN-7171
                    $location.hash('OrderInfo');
                    $anchorScroll.yOffset = 126;
                    $anchorScroll();
                    // var offsetTop = angular.element('.Payment__OrderInfo');
                    // console.log(offsetTop.offsetTop)
                    // $('html, body').animate({
                    //     scrollTop: $("#OrderInfo").offset().top + 300
                    // }, 200);
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
    
    
});
