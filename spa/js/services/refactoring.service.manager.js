innaAppServices.service('ManagerService', function ($http, appApi) {
    return {
        getManagerStatus: function () {
            return $http({
                url: appApi.GET_MANAGER_STATUS,
                method: 'GET'
            });
        }
    }
});
