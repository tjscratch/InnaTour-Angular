
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
innaAppServices.
    value('version', '0.1');


innaAppServices.
    factory('storageService', ['$rootScope', '$http', '$log', function ($rootScope, $http, $log) {
        function log(msg) {
            $log.log(msg);
        }

        function isOlderTenSeconds(ms) {
            return !((ms + 1000 * 10) > (new Date()).getTime());
        }

        function isOlderMinute(ms) {
            return !((ms + 1000 * 60) > (new Date()).getTime());
        }

        function isOlderTenMinutes(ms) {
            return !((ms + 1000 * 60 * 10) > (new Date()).getTime());//ToDo: bedug 10min
        }

        function isOlderManyMinutes(ms) {
            return !((ms + 1000 * 60 * 10000) > (new Date()).getTime());//ToDo: bedug 10min
        }

        return {
            setAviaBuyItem: function (model) {
                sessionStorage.AviaBuyItem = angular.toJson(model);
            },
            getAviaBuyItem: function () {
                return angular.fromJson(sessionStorage.AviaBuyItem);
            },

            //setAviaOrderNum: function (model) {
            //    sessionStorage.OrderNum = angular.toJson(model);
            //},
            //getAviaOrderNum: function () {
            //    return angular.fromJson(sessionStorage.OrderNum);
            //},

            setReservationModel: function (model) {
                sessionStorage.ReservationModel = angular.toJson(model);
            },
            getReservationModel: function () {
                return angular.fromJson(sessionStorage.ReservationModel);
            },

            setPayModel: function (model) {
                sessionStorage.PayModel = angular.toJson(model);
            },
            getPayModel: function () {
                return angular.fromJson(sessionStorage.PayModel);
            },

            setAviaSearchResults: function (model) {
                sessionStorage.AviaSearchResults = angular.toJson(model);
            },
            getAviaSearchResults: function (criteria) {
                var res = angular.fromJson(sessionStorage.AviaSearchResults);
                //проверяем, что достаем данные для нужных критериев поиска
                if (res != null && angular.toJson(criteria) == angular.toJson(res.criteria) && !isOlderManyMinutes(res.date))
                {
                    return res.data;
                }
                return null;
            },
            clearAviaSearchResults: function () {
                sessionStorage.AviaSearchResults = null;
            },

            setAviaVariantCheck: function (model) {
                if (model != null) {
                    model.params = utils.normalize(model.params);
                }
                sessionStorage.AviaVariantCheck = angular.toJson(model);
            },
            getAviaVariantCheck: function (params) {
                params = utils.normalize(params);
                var res = angular.fromJson(sessionStorage.AviaVariantCheck);
                //проверяем, что достаем данные для нужных критериев поиска
                if (res != null && angular.toJson(params) == angular.toJson(res.params) && !isOlderTenSeconds(res.date)) {
                    return res.data;
                }
                return null;
            }
        }
    }]);

innaAppServices.
    factory('sharedProperties', ['$rootScope', '$http', '$q', 'cache', function ($rootScope, $http, $q, cache) {
        var slider = [];
        var updateCallBack = null;

        return {
            getSlider: function () {
                return slider;
            },
            setSlider: function (value) {
                //console.log('setSlider, len:' + value.length);
                slider = value;
                if (updateCallBack != null)
                    updateCallBack(slider);
            }
            ,
            sliderUpdateCallback: function (value) {
                updateCallBack = value;
            }
        };
    }]);