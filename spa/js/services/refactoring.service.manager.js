innaAppServices.service('ManagerService', function ($http, appApi, $q) {
    return {
        getManagerStatus: function () {

            var deferred = $q.defer();

            $http({
                url: appApi.GET_MANAGER_STATUS,
                method: 'GET'
            }).then(function (res) {
                if (res.status == 200) {
                    if (res.data['Data']) {
                        if (res.data['Data']['meetings']) {
                            if (res.data['Data']['meetings']['meeting']) {
                                if (res.data['Data']['meetings']['meeting']['running']) {
                                    deferred.resolve(true);
                                }
                            }
                        }
                    } else {
                        deferred.resolve(false);
                    }
                } else {
                    deferred.resolve(false);
                }
            }, function (res) {
                deferred.resolve(false);
            });

            return deferred.promise;
        }
    }
});
