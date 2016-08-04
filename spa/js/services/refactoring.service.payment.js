innaAppServices.service('Payment', function ($http, appApi) {
    return {
        getPaymentData: function (params) {
            return $http({
                url: appApi.GET_PAYMENT,
                method: 'GET',
                params: params,
                cache: false
            });
        }
    }
});