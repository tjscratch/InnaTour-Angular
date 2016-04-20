innaAppServices.service('HotelService', function ($http, $q, appApi, AppRouteUrls) {
    return {
        getSuggest: function (text) {
            var deferred = $q.defer();

            function prepareData (response) {
                var data = [];
                angular.forEach(response, function (item) {
                    var fullName = item.Name + ", " + item.CountryName;
                    var fullNameHtml = "<span class='b-search-form-hotels-typeahead-list-item__country'>" + item.Name + "</span>, " +
                        "<span class='b-search-form-hotels-typeahead-list-item__name'>" + item.CountryName + "</span>";
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
            return $http({
                url: appApi.HOTELS_GET_LIST,
                method: "GET",
                params: params
            })
        },
        getBusList: function (params) {
            return $http({
                url: appApi.BUS_GET_LIST,
                method: "GET",
                params: params
            })
        },
        getHotelsDetails: function (params) {
            return $http({
                url: appApi.HOTELS_GET_DETAILS,
                method: "GET",
                params: params
            })
        },
        getHotelBuy: function (params) {
            return $http({
                url: appApi.HOTELS_HOTEL_BUY,
                method: "GET",
                params: params
            })
        },
        hotelConcatParams: function (params) {
            var urlParams = [
                params.ArrivalId,
                params.NightCount,
                params.Adult
            ].join('-');
            return params.StartVoyageDate + '/' + urlParams
        },
        getHotelsIndexUrl: function (params) {
            return AppRouteUrls.URL_HOTELS + this.hotelConcatParams(params);
        },
        getBusIndexUrl: function (params) {
            return AppRouteUrls.URL_BUS + this.hotelConcatParams(params);
        },
        getHotelsShowUrl: function (hotelId, providerId, params) {
            var hotelParams = this.hotelConcatParams(params);
            var hotelUrl = AppRouteUrls.URL_HOTELS + hotelId + '/' + providerId + '/' + hotelParams;
            return hotelUrl
        },
        getBusShowUrl: function (hotelId, providerId, params) {
            var hotelParams = this.hotelConcatParams(params);
            var hotelUrl = AppRouteUrls.URL_BUS + hotelId + '/' + providerId + '/' + hotelParams;
            return hotelUrl
        },
        getHotelsResevationUrl: function (hotelId, providerId, roomId, params) {
            var hotelParams = this.hotelConcatParams(params);
            var hotelUrl = AppRouteUrls.URL_RESERVATIONS + 'hotels/' + hotelId + '/' + providerId + '/' + roomId +'/' + hotelParams;
            return hotelUrl
        },
        getBusResevationUrl: function (hotelId, providerId, roomId, params) {
            var hotelParams = this.hotelConcatParams(params);
            var hotelUrl = AppRouteUrls.URL_RESERVATIONS + 'bus/' + hotelId + '/' + providerId + '/' + roomId +'/' + hotelParams;
            return hotelUrl
        },
        getShowPageMenu: function () {
            return [
                {
                    id: 'SectionDetail',
                    name: 'Описание отеля',
                    active: false,
                    klass: 'icon-sprite-description'
                },
                {
                    id: 'SectionRoom',
                    name: 'Выбор номера',
                    active: false,
                    klass: 'icon-sprite-room'
                },
                {
                    id: 'SectionServices',
                    name: 'Сервисы',
                    active: false,
                    klass: 'icon-sprite-services'
                },
                {
                    id: 'SectionMap',
                    name: 'Отель на карте',
                    active: false,
                    klass: 'icon-sprite-map'
                },
                {
                    id: 'SectionReviews',
                    name: 'Отзывы',
                    active: false,
                    klass: 'icon-sprite-reviews'
                },
            ];
        },
        getShowPageMenuBus: function () {
            return [
                {
                    id: 'SectionDetail',
                    name: 'Описание тура',
                    active: false,
                    klass: 'icon-sprite-description'
                },
                {
                    id: 'SectionRoom',
                    name: 'Выбор номера',
                    active: false,
                    klass: 'icon-sprite-room'
                },
                {
                    id: 'SectionServices',
                    name: 'Сервисы',
                    active: false,
                    klass: 'icon-sprite-services'
                },
                {
                    id: 'SectionMap',
                    name: 'Место отправления',
                    active: false,
                    klass: 'icon-sprite-map'
                },
                {
                    id: 'SectionReviews',
                    name: 'Отзывы',
                    active: false,
                    klass: 'icon-sprite-reviews'
                },
            ];
        }
    }
});
