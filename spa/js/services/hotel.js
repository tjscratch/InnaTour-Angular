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
                params: params,
                cache: true
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
            var children = '';
            if (params.Children) {
                var childs = [];
                for (var i = 0; i < params.Children.length; i++) {
                    childs.push(params.Children[i].value);
                }
                children = childs.join('_');
            }
            var urlParams = [
                params.ArrivalId,
                params.NightCount,
                params.Adult,
                children
            ].join('-');
            //console.log(params.StartVoyageDate + '/' + urlParams)
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
            var hotelUrl = AppRouteUrls.URL_RESERVATIONS + 'hotels/' + hotelId + '/' + providerId + '/' + roomId + '/' + hotelParams;
            return hotelUrl
        },
        getBusResevationUrl: function (hotelId, providerId, roomId, params) {
            var hotelParams = this.hotelConcatParams(params);
            var hotelUrl = AppRouteUrls.URL_RESERVATIONS + 'bus/' + hotelId + '/' + providerId + '/' + roomId + '/' + hotelParams;
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
                    id: 'SectionMap',
                    name: 'Место отправления',
                    active: false,
                    klass: 'icon-sprite-map'
                }
            ];
        },


        /**
         * hotels filters
         */
        getHotelFilters: function () {
            return {
                "Hotels": {
                    "Price": {
                        "Min": 28180.0,
                        "Max": 138817.0,
                        "Value": 138817.0
                    }
                    ,
                    "Stars": {
                        "List": [{
                            "Value": 5.0,
                            "Price": 87851.0
                        }, {
                            "Value": 4.0,
                            "Price": 48171.0
                        }, {
                            "Value": 3.0,
                            "Price": 29725.0
                        }, {
                            "Value": 2.0,
                            "Price": 28180.0
                        }, {
                            "Value": 1.0,
                            "Price": 32636.0
                        }
                        ]
                    }
                    ,
                    "TaFactor": {
                        "List": [{
                            "Value": 5.0,
                            "Price": 33185.0
                        }, {
                            "Value": 4.0,
                            "Price": 34828.0
                        }, {
                            "Value": 1.0,
                            "Price": 28180.0
                        }
                        ]
                    }
                    ,
                    "HotelType": {
                        "List": [{
                            "Price": 32636.0,
                            "Value": "Апартаменты",
                            "Name": "Апартаменты"
                        }, {
                            "Price": 32636.0,
                            "Value": "Отель",
                            "Name": "Отель"
                        }, {
                            "Price": 37019.0,
                            "Value": "Пансион",
                            "Name": "Пансион"
                        }
                        ]
                    }
                    ,
                    "Extra": {
                        "List": [{
                            "Price": 28180.0,
                            "Value": "BarRestaurant",
                            "Name": "Бар/Ресторан"
                        }, {
                            "Price": 33254.0,
                            "Value": "SwimmingPool",
                            "Name": "Бассейн"
                        }, {
                            "Price": 36472.0,
                            "Value": "Breakfast",
                            "Name": "Завтрак"
                        }, {
                            "Price": 32703.0,
                            "Value": "Internet",
                            "Name": "Интернет"
                        }, {
                            "Price": 32703.0,
                            "Value": "Parking",
                            "Name": "Парковка"
                        }, {
                            "Price": 101494.0,
                            "Value": "ServicesForChildren",
                            "Name": "Сервисы для детей"
                        }, {
                            "Price": 28180.0,
                            "Value": "SPA",
                            "Name": "СПА"
                        }, {
                            "Price": 28180.0,
                            "Value": "Fitness",
                            "Name": "Фитнес"
                        }
                        ]
                    }
                    ,
                    "Meal": {
                        "List": [{
                            "Name": "Без питания",
                            "Order": 1,
                            "Price": 28180.0,
                            "Value": "RO"
                        }, {
                            "Name": "Завтраки",
                            "Order": 2,
                            "Price": 36472.0,
                            "Value": "BB"
                        }, {
                            "Name": "Полупансион",
                            "Order": 3,
                            "Price": 40607.0,
                            "Value": "HB"
                        }, {
                            "Name": "Полный пансион",
                            "Order": 5,
                            "Price": 35873.0,
                            "Value": "FB"
                        }
                        ]
                    }
                }
            }
        },

    }
});
