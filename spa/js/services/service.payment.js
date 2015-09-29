innaAppServices.
    factory('paymentService', [
        '$rootScope',
        '$timeout',
        '$http',
        '$q',
        '$log',
        'cache',
        'storageService',
        'innaApp.API.const',
        'AjaxHelper',
        function ($rootScope, $timeout, $http, $q, $log, cache, storageService, apiUrls, AjaxHelper) {
            function log(msg) {
                $log.log(msg);
            }

            return {
                checkAvailability: function (queryData, successCallback, errCallback) {
                    //проверяем что данные не старше минуты
                    var res = storageService.getAviaVariantCheck(queryData);
                    if (res != null) {
                        successCallback(res);
                    }
                    else {
                        AjaxHelper.getNoCache(apiUrls.AVIA_CHECK_AVAILABILITY, queryData, function (data) {
                            storageService.setAviaVariantCheck({
                                date: new Date().getTime(),
                                params: queryData,
                                data: data
                            });
                            successCallback(data);
                        }, function (data, status) {
                            errCallback(data, status);
                        });
                    }
                },

                packageCheckAvailability: function (params) {
                    return AjaxHelper.getNoCache(
                        apiUrls.PACKAGE_CHECK_AVAILABILITY,
                        params.data,
                        params.success,
                        params.error
                    );
                },

                getTransportersInAlliances: function (queryData, successCallback, errCallback) {
                    $http.get(apiUrls.PURCHASE_TRANSPORTER_GET_ALLIANCE, {
                        cache: false,
                        params: {names: queryData}
                    }).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },

                reserve: function (queryData, successCallback, errCallback) {
                    var qData = angular.toParam(queryData);

                    AjaxHelper.post({
                        url: apiUrls.AVIA_RESERVATION,
                        data: qData,
                        success: function (data) {
                            successCallback(data);
                        },
                        error: function (data, status) {
                            errCallback(data, status);
                        }
                    });
                },

                packageReserve: function (params) {
                    //queryData, successCallback, errCallback
                    var qData = angular.toParam(params.data);
                    AjaxHelper.post({
                        url: apiUrls.PACKAGE_RESERVATION,
                        data: qData,
                        success: params.success,
                        error: params.error
                    });
                },

                createDPRequest: function (params, successCallback, errCallback) {
                    $http.post(apiUrls.RESERVATION_DP_REQUEST, params)
                        .success(function (data, status) {
                            successCallback(data);
                        })
                        .error(function (data, status) {
                            errCallback(data, status);
                        });
                },

                createBuyComment: function (params, successCallback, errCallback) {
                    $http.post(apiUrls.BUY_COMMENT, params)
                        .success(function (data, status) {
                            successCallback(data);
                        })
                        .error(function (data, status) {
                            errCallback(data, status);
                        });
                },

                getSelectedVariant: function (queryData, successCallback, errCallback) {
                    AjaxHelper.getNoCache(apiUrls.AVIA_RESERVATION_GET_VARIANT, queryData, function (data, status) {
                        successCallback(data);
                    }, function (data, status) {
                        errCallback(data, status);
                    });
                },

                getRepricing: function (orderNumber, successCallback, errCallback) {
                    $http.get(apiUrls.BUY_REPRICING, {
                        cache: false,
                        params: {OrderNumber: orderNumber, ReturnType: 1}
                    }).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },

                getPaymentData: function (queryData, successCallback, errCallback) {
                    $http.get(apiUrls.AVIA_RESERVATION_GET_PAY_DATA, {
                        cache: false,
                        params: queryData
                    }).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },

                pay: function (queryData, successCallback, errCallback) {
                    $http.post(apiUrls.AVIA_PAY, queryData).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },

                payCheck: function (payParam) {
                    $http.post(apiUrls.AVIA_PAY_CHECK, {value: payParam.orderNum})
                        .success(payParam.success)
                        .error(payParam.error);
                },

                getTarifs: function (queryData, successCallback, errCallback) {
                    $http.get(apiUrls.AVIA_TARIFS, {cache: true, params: queryData}).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },

                qiwiMakeBill: function (orderNum, successCallback, errCallback) {
                    $http.post(apiUrls.QIWI_MAKE_BILL, {orderNum: orderNum})
                        .success(successCallback)
                        .error(errCallback);
                },

                eof: null
            };
        }]);