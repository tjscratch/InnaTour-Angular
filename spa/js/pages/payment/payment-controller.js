/**
 * во вьюхе используем как
 * ReservationsController as reservation
 */
innaAppControllers.controller('PaymentController', function ($scope, $routeParams, $location, Payment, aviaHelper) {
    
    var self = this;
    
    /**
     * получение от сервера данных для оплаты
     */
    Payment.getPaymentData({orderNum: $routeParams.OrderNum})
        .then(
            getPaymentDataSuccess,
            getPaymentDataError
        );
    
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
        self.data = data;
    
        self.ExperationDate = moment(data.ExperationDate).format('DD MMM YYYY, HH:mm');
        self.ExperationMinute = data.ExperationMinute * 60;
        setTimeout(data);
        
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
        
    }
    
    
    /**
     * при загрузке данных произошла ошибка
     * коллбек для обработки этой ошибки
     */
    function getPaymentDataError(response) {
        console.error('Произошла ошибка', response);
    }
    
    
    /**
     * колбэк при истечении времени
     */
    self.callbackTimer = function () {
        console.log('cancel timeout pay');
    };
    
    
    /**
     * todo
     * старый код, отрефакторить
     */
    
    
});
