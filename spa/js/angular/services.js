
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
innaAppServices.
    value('version', '0.1');


innaAppServices.
    factory('dataService', ['$rootScope', '$http', '$q', '$log', 'cache', 'storageService',
        function ($rootScope, $http, $q, $log, cache, storageService)
        {
            function log(msg) {
            $log.log(msg);
        }

        return {
            getDirectoryByUrl: function (term, successCallback, errCallback) {
                //log('getDirectoryByUrl, term: ' + term);
                //запрос по критериям поиска
                $http({ method: 'GET', url: getDirectoryUrl, params: { term: term }, cache: true }).success(function (data, status) {
                    if (data != null && data.length > 0) {
                        //ищем запись с кодом IATA
                        var resItem = _.find(data, function (item) {
                            return item.CodeIata == term;
                        });
                        //если не нашли - берем первый
                        if (resItem == null)
                            resItem = data[0];

                        var urlKey = UrlHelper.getUrlFromData(resItem);
                        var cdata = new directoryCacheData(resItem.Id, resItem.Name, urlKey);
                        //присваиваем значение через функцию коллбэк
                        successCallback(cdata);
                    }
                    else {
                        errCallback(data, status);
                    }
                }).error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            
            getSletatDirectoryByTerm: function (term, successCallback, errCallback) {
                //log('getSletatDirectoryByTerm: ' + term);
                //принудительно энкодим
                term = encodeURIComponent(term);
                //запрос по критериям поиска
                $http.get(getSletatUrl + '?term=' + term, { cache: true }).success(function (data, status) {
                    //присваиваем значение через функцию коллбэк
                    successCallback(data);
                }).
                error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            getSletatCity: function (successCallback, errCallback) {
                //log('getSletatCity: ' + term);
                //запрос по критериям поиска
                $http.get(getSletatCityUrl, { cache: true }).success(function (data, status) {
                    //присваиваем значение через функцию коллбэк
                    successCallback(data);
                }).
                error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            getSletatById: function (id, successCallback, errCallback) {
                //log('getSletatById: ' + term);
                //запрос по критериям поиска
                $http.get(getSletatByIdUrl + '?id=' + id, { cache: true }).success(function (data, status) {
                    //присваиваем значение через функцию коллбэк
                    successCallback(data);
                }).
                error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            startAviaSearch: function (criteria, successCallback, errCallback) {
                //запрос по критериям поиска
                var apiCriteria = new aviaCriteriaToApiCriteria(criteria);
                //log('startAviaSearch, apiCriteria: ' + angular.toJson(apiCriteria));

                //debug
                if (avia.useAviaServiceStub) {
                    successCallback(angular.fromJson(apiSearchAviaDataJsonStub));
                }
                else {
                    //сначала проверяем в html5 storage
                    var res = storageService.getAviaSearchResults(apiCriteria);
                    if (res != null) {
                        successCallback(res);
                    }
                    else {
                        $http({ method: 'GET', url: beginAviaSearchUrl, params: apiCriteria }).success(function (data, status) {
                            //сохраняем в хранилище (сохраняем только последний результат)
                            storageService.setAviaSearchResults(apiCriteria, data);
                            //присваиваем значение через функцию коллбэк
                            successCallback(data);
                        }).
                        error(function (data, status) {
                            //вызываем err callback
                            errCallback(data, status);
                        });
                    }
                }
            },
            startSearchTours: function (criteria, successCallback, errCallback) {
                //запрос по критериям поиска
                $http.post(beginSearchUrl, angular.toJson(criteria)).success(function (data, status) {
                    //присваиваем значение через функцию коллбэк
                    successCallback(data);
                }).
                error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            checkSearchTours: function (searchIdObj, successCallback, errCallback) {
                $http.post(checkSearchUrl, angular.toJson(searchIdObj)).success(function (data, status) {
                    successCallback(data);
                }).
                error(function (data, status) {
                    errCallback(data, status);
                });
            },
            getLocationsByUrls: function (queryData, successCallback, errCallback) {
                $http.post(getLocationByUrls, angular.toJson(queryData)).success(function (data, status) {
                    successCallback(data);
                }).
                error(function (data, status) {
                    errCallback(data, status);
                });
            },
            getHotelDetail: function (queryData, successCallback, errCallback) {
                $http.post(hotelDetailUrl, angular.toJson(queryData)).success(function (data, status) {
                    successCallback(data);
                }).
                error(function (data, status) {
                    errCallback(data, status);
                });
            },
            getTourDetail: function (queryData, successCallback, errCallback) {
                $http.post(tourDetailUrl, angular.toJson(queryData)).success(function (data, status) {
                    successCallback(data);
                }).
                error(function (data, status) {
                    errCallback(data, status);
                });
            },
            getOrder: function (queryData, successCallback, errCallback) {
                //запрос по критериям поиска
                $http.post(getOrderUrl, angular.toJson(queryData)).success(function (data, status) {
                    //присваиваем значение через функцию коллбэк
                    successCallback(data);
                }).
                error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            getPaymentPage: function (queryData, successCallback, errCallback) {
                //запрос по критериям поиска
                $http.post(paymentPageUrl, angular.toJson(queryData)).success(function (data, status) {
                    //присваиваем значение через функцию коллбэк
                    successCallback(data);
                }).
                error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            pay: function(queryData, successCallback, errCallback) {
                $http.post(payUrl, angular.toJson(queryData)).success(function(data) {
                    successCallback(data);
                }).
                error(function(data, status) {
                        errCallback(data, status);
                });
            },
            getSectionTours: function (params, successCallback, errCallback) {
                $http({ method: 'GET', url: getSectionToursUrl, params: params, cache: true }).success(function (data, status) {
                    //присваиваем значение через функцию коллбэк
                    successCallback(data);
                }).
                error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            getSectionIndividualTours: function (params, successCallback, errCallback) {
                $http({ method: 'GET', url: getSectionIndividualToursUrl, params: params, cache: true }).success(function (data, status) {
                    //присваиваем значение через функцию коллбэк
                    successCallback(data);
                }).
                error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            getIndividualToursCategory: function (id, successCallback, errCallback) {
                $http({ method: 'GET', url: getIndividualToursCategoryUrl + '/' + id, cache: true }).success(function (data, status) {
                    //присваиваем значение через функцию коллбэк
                    successCallback(data);
                }).
                error(function (data, status) {
                    //вызываем err callback
                    errCallback(data, status);
                });
            },
            sendITCategoryRequest: function (queryData, successCallback, errCallback) {
                var apiData = new sendRequestData(queryData);
                $http.post(sendITCategoryRequestUrl, apiData).success(function (data) {
                    successCallback(data);
                }).
                error(function (data, status) {
                    errCallback(data, status);
                });
            }
        };
    }]);

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
    factory('aviaHelper', ['$rootScope', '$http', '$log', function ($rootScope, $http, $log) {
        function log(msg) {
            $log.log(msg);
        }

        return {
            getTransferCountText: function (count) {
                switch (count) {
                    case 0: return "пересадок";
                    case 1: return "пересадка";
                    case 2: return "пересадки";
                    case 3: return "пересадки";
                    case 4: return "пересадки";
                    case 5: return "пересадок";
                    case 6: return "пересадок";
                    case 7: return "пересадок";
                    case 8: return "пересадок";
                    case 9: return "пересадок";
                    case 10: return "пересадок";
                    default: return "пересадок";
                }
            },
            preventBubbling: function ($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
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