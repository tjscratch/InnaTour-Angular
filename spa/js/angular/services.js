
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
innaAppServices.
    value('version', '0.1');


innaAppServices.
    factory('dataService', ['$rootScope', '$http', '$q', '$log', 'cache', function ($rootScope, $http, $q, $log, cache) {
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
                    $http({ method: 'GET', url: beginAviaSearchUrl, params: apiCriteria }).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
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
                //console.log('sendITCategoryRequest, apiData: ' + angular.toJson(apiData));
                $http.post(sendITCategoryRequestUrl, angular.toJson(apiData)).success(function (data) {
                    successCallback(data);
                }).
                error(function(data, status) {
                    errCallback(data, status);
                });
            }
        };
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