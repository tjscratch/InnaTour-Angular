/**
 * сервис для ДП
 */
innaWidgetServices.service('Packages', function ($http, $q) {
    return {
        /**
         * определение текущей локали
         */
        currentLocale: function (defaultCity) {
            var deferred = $q.defer();

            function prepareCityData(data) {
                var fullName = data.Name + ", " + data.CountryName;
                return {id: data.Id, name: fullName, iata: data.CodeIata};
            }

            if (defaultCity) {
                $http({
                    url: 'https://inna.ru/api/v1/Dictionary/Hotel',
                    method: "GET",
                    params: {
                        term: defaultCity.trim()
                    }
                }).success(function (data) {
                    deferred.resolve(prepareCityData(data[0]));
                });
            }
            else {
                $http({
                    url: 'https://inna.ru/api/v1/Dictionary/GetCurrentLocation',
                    method: "GET"
                }).success(function (data) {
                    deferred.resolve(prepareCityData(data));
                });
            }

            return deferred.promise;
        },
        /**
         * поиск локации
         */
        getLocation: function (text) {
            var deferred = $q.defer();

            function prepareData(response) {
                var data = [];
                angular.forEach(response, function (item) {
                    var fullName = item.Name + ", " + item.CountryName;
                    var fullNameHtml = "<span class='i-name'>" + item.Name + "</span>," + "<span class='i-country'>" + item.CountryName + "</span>";
                    data.push({id: item.Id, nameHtml: fullNameHtml, name: fullName, iata: item.CodeIata});
                });
                return data;
            }

            $http({
                url: 'https://inna.ru/api/v1/Dictionary/Hotel',
                method: "GET",
                params: {
                    term: text.split(', ')[0].trim()
                }
            }).success(function (data) {
                deferred.resolve(prepareData(data));
            });

            return deferred.promise;
        }
    };
});


innaWidgetServices.service('Avia', function ($http, $q) {
    return {
        /**
         * поиск локации
         */
        getLocation: function (text) {
            var deferred = $q.defer();

            function prepareData(response) {
                var data = [];
                angular.forEach(response, function (item) {
                    var fullName = item.Name + ", " + item.CountryName;
                    var allArport = item.Airport ? " (все аэропорты)" : "";
                    var fullNameHtml = "<span class='i-name'>" + item.Name + "</span>," + "<span class='i-country'>" + item.CountryName + allArport + "</span>";
                    data.push({id: item.Id, nameHtml: fullNameHtml, name: fullName, iata: item.CodeIata});
                    if (item.Airport) {
                        angular.forEach(item.Airport, function (item) {
                            var fullName = item.Name + ", " + item.CountryName;
                            var fullNameHtml = "<span class='i-name i-name-airport'>" + item.Name + "</span>";
                            data.push({id: item.Id, nameHtml: fullNameHtml, name: fullName, iata: item.CodeIata});
                        });
                    }
                });
                return data;
            }

            $http({
                url: 'https://inna.ru/api/v1/Dictionary/Directory',
                method: "GET",
                params: {
                    term: text.split(', ')[0].trim()
                }
            }).success(function (data) {
                deferred.resolve(prepareData(data));
            });

            return deferred.promise;
        }
    };
});

innaWidgetServices.service('aviaCalendar', function () {
    this.avia = {
        oneWay: false,
        roaming: false
    };
});
