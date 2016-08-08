innaAppServices.service('Payment', function ($http, appApi) {
    return {
        getPaymentData: function (params) {
            return $http({
                url: appApi.GET_PAYMENT,
                method: 'GET',
                params: params,
                cache: false
            });
        },
        qiwiMakeBill: function (orderNum) {
            return $http({
                url: appApi.QIWI_MAKE_BILL,
                method: 'POST',
                data: {orderNum: orderNum},
                cache: false
            });
        }
    }
});