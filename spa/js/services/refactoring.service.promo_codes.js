innaAppServices.service('PromoCodes', function ($http, appApi) {
    return {
        getPackagesDiscountedPrice: function (params) {
            return $http({
                url: appApi.PACKAGES_DISCOUNTED_PRICE,
                method: 'POST',
                data: params
            });
        },
        getPackagesDiscountedPriceRosneft: function (params) {
            console.log('UUUUUUUUU', params);
            return $http({
                url: appApi.PACKAGES_DISCOUNTED_PRICE_ROSNEFT + '?number=' + params.number + '&cardType=' + params.cardType + '&price=' + params.price,
                method: 'GET',
                data: params
            });
        },
        getAviaDiscountedPrice: function (params) {
            return $http({
                url: appApi.AVIA_DISCOUNTED_PRICE,
                method: 'POST',
                data: params
            });
        }
    }
});
