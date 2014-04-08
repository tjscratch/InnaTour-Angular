innaAppServices.
    factory('paymentService', ['$rootScope', '$http', '$q', '$log', 'cache', function ($rootScope, $http, $q, $log, cache) {
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
            }
        };
    }]);