innaAppServices.service('HotelService', function ($http, $q, appApi) {
    return {
        getSuggest: function (text) {
            var deferred = $q.defer();

            function prepareData (response) {
                var data = [];
                angular.forEach(response, function (item) {
                    var fullName = item.CountryName + ", " + item.Name;
                    var fullNameHtml = "<span class='b-search-form-hotels-typeahead-list-item__country'>" + item.CountryName + "</span>, " +
                        "<span class='b-search-form-hotels-typeahead-list-item__name'>" + item.Name + "</span>";
                    data.push({ id: item.Id, nameHtml: fullNameHtml, name: fullName });
                });
                return data;
            }

            $http({
                url: appApi.HOTELS_GET_SUGGEST,
                method: "GET",
                params: {
                    searchterm: text.split(', ')[0].trim()
                }
            }).success(function (data) {
                deferred.resolve(prepareData(data));
            });

            return deferred.promise;
        },
        /**
         * @param params
         * ArrivalId=6733&StartVoyageDate=2016-05-24&NightCount=2&Adult=2
         */
        getHotelsList: function (params) {
            //console.log(params)
            return $http({
                url: appApi.HOTELS_GET_LIST,
                method: "GET",
                params: params
            })
        }
    }
});
