innaAppServices.
    factory('paymentService', ['$rootScope', '$http', '$q', '$log', 'cache', 'innaApp.API.const',
        function ($rootScope, $http, $q, $log, cache, apiUrls) {
            function log(msg) {
                $log.log(msg);
            }

            return {
                checkAvailability: function (queryData, successCallback, errCallback) {
                    $http.get(paymentCheckAvailabilityUrl, { params: queryData }).success(function (data) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },

                getTransportersInAlliances: function (queryData, successCallback, errCallback) {
                    $http.get(apiUrls.PURCHASE_TRANSPORTER_GET_ALLIANCE, { cache: false, params: { names: queryData } }).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },

                reserve: function (queryData, successCallback, errCallback) {
                    $http.post(apiUrls.AVIA_RESERVATION, queryData).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },

                getSelectedVariant: function (queryData, successCallback, errCallback) {
                    $http.get(apiUrls.AVIA_RESERVATION_GET_VARIANT, { cache: true, params: queryData }).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },

                eof: null
            };
        }]);