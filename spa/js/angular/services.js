
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

        return {
            setAviaBuyItem: function (model) {
                sessionStorage.AviaBuyItem = angular.toJson(model);
            },
            getAviaBuyItem: function () {
                return angular.fromJson(sessionStorage.AviaBuyItem);
            },
            setAviaSearchResults: function (criteria, data) {
                sessionStorage.AviaSearchResults = angular.toJson({ criteria: criteria, data: data });
            },
            getAviaSearchResults: function (criteria) {
                var res = angular.fromJson(sessionStorage.AviaSearchResults);
                //проверяем, что достаем данные для нужных критериев поиска
                if (res != null && angular.toJson(criteria) == angular.toJson(res.criteria))
                {
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