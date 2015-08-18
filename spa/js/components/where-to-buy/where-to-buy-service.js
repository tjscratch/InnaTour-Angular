innaAppConponents.service('whereToBuyService', function ($q, $http, appApi) {
    var CurrentLocationCacheKey = 'whereToBuyUserCurrentLocation';

    return {
        /**
         * Получение текущей локации по IP адресу из сереверного API
         */
        getCurrentLocationByIp: function () {
            return $http({
                url: appApi.GET_CURRENT_LOCATION_BY_IP,
                method: 'GET',
                cache: true
            });
        },
        /**
         * Сохранение текущей локации в кэш
         */
        saveCacheCurrentLocation: function (obj) {
            localStorage.setItem(CurrentLocationCacheKey, obj);
        },
        /**
         * Получение текущей локации из кэша
         */
        getCacheCurrentLocation: function () {
            var data = localStorage.getItem(CurrentLocationCacheKey) || null;
            return data;
        },
        /**
         * Получение текущей локации, вначале ищется в кэше, если не находится то дергается из API
         * возвращет промис объект
         */
        getCurrentLocation: function () {
            var self = this;
            var deferred = $q.defer();
            
            var currentLocation = self.getCacheCurrentLocation();
            if (currentLocation) {
                deferred.resolve(currentLocation);
            } else {
                self.getCurrentLocationByIp()
                    .success(function (data) {
                        var currentLocation = data.CountryName + ", " + data.Name;
                        self.saveCacheCurrentLocation(currentLocation);
                        deferred.resolve(currentLocation);
                    });
            }
            return deferred.promise;
        }
    }
});