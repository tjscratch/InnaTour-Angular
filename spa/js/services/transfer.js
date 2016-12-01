innaAppServices.service('Transfer', function ($http, appApi) {
    return {
        getTransfers: function (params) {
            return $http({
                url: appApi.GET_TRANSFERS,
                method: "GET",
                params: params
            })
        }
    }
});
