innaAppServices.service('PackagesService', function ($http, appApi) {
    return {
        getCombinationTickets: function (params) {
            return $http({
                url: appApi.DYNAMIC_SEARCH_TICKETS,
                method: 'GET',
                params: params,
                cache: true
            });
        },
        getCombinationHotels: function (params) {
            return $http({
                url: appApi.DYNAMIC_SEARCH_HOTELS,
                method: 'GET',
                params: params,
                cache: true
            });
        },
        sendEmptySearch: function (params) {
            return $http({
                url: appApi.PACKAGES_EMPTY_SEARCH,
                method: 'POST',
                params: params,
                cache: false
            });
        }
    }
});