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
        },

        /**
         * Получение списка агенств
         */
        getAgencyList: function(){
            return $http({
                url: appApi.GET_AGENCY_LIST,
                method: 'GET',
                cache: true
            })
        },


        /**
         * поиск локации
         */
        getLocation: function (text) {
            var deferred = $q.defer();

            function prepareData(response) {
                var data = [];
                angular.forEach(response, function (item) {
                    var fullName = item.CountryName + ", " + item.Name;
                    data.push({id: item.Id, name: fullName});
                });
                return data;
            }

            $http({
                url: appApi.DYNAMIC_TO_SUGGEST,
                method: "GET",
                params: {
                    term: text.split(', ')[0].trim()
                }
            }).success(function (data) {
                deferred.resolve(prepareData(data));
            });

            return deferred.promise;
        }
        
    }
});