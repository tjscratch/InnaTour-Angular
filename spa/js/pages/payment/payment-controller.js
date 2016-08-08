/**
 * во вьюхе используем как
 * ReservationsController as reservation
 */
innaAppControllers.controller('PaymentController', function ($routeParams, Payment) {
    
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
     */
    function getPaymentDataSuccess(response) {
        var data = response.data;
        self.data = data;
        self.data.passengerCount = self.data.Passengers.length;
    
        // data.ProductType
        // Avia = 1
        // Динамический пакет = 2
        // Сервисный сбор = 3
        // Отели = 4
        // Не определен = 0
    }
    
    
    /**
     * при загрузке данных произошла ошибка
     * коллбек для обработки этой ошибки
     */
    function getPaymentDataError(response) {
        console.error('Произошла ошибка', response);
    }
    
});
