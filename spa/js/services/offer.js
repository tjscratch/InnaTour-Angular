innaAppServices.service('Offer', function ($http, appApi) {
    return {
        getOffers: function (params) {
            return $http({
                url: appApi.GET_OFFERS,
                method: "GET",
                params: params
            })
        }
    }
});
