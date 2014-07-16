innaAppServices.
    factory('dataService', [
        '$rootScope',
        '$http',
        '$q',
        '$log',
        'cache',
        'storageService',
        'innaApp.API.const',
        'urlHelper',
        'AjaxHelper',
        function ($rootScope, $http, $q, $log, cache, storageService, apiUrls, urlHelper, AjaxHelper) {
            function log(msg) {
                $log.log(msg);
            }

            return {
                getAllCountries: function (successCallback, errCallback) {
                    $http.get(apiUrls.DICTIONARY_ALL_COUNTRIES, { cache: true }).success(function (data, status) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },
                getDirectoryByUrl: function (term, successCallback, errCallback) {
                    AjaxHelper.get(apiUrls.AVIA_FROM_SUGGEST, { term: term }, function (data) {
                        if (data != null && data.length > 0) {
                            //ищем запись с кодом IATA
                            var resItem = _.find(data, function (item) {
                                return item.CodeIata == term;
                            });
                            //если не нашли - берем первый
                            if (resItem == null)
                                resItem = data[0];

                            var urlKey = urlHelper.getUrlFromData(resItem);
                            //добавляем поле url
                            resItem.id = resItem.Id;
                            resItem.name = resItem.Name;
                            resItem.url = urlKey;

                            //присваиваем значение через функцию коллбэк
                            successCallback(resItem);
                        }
                        else {
                            errCallback(data, status);
                        }
                    }, errCallback);
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

                    //сначала проверяем в html5 storage
                    //var res = storageService.getAviaSearchResults(apiCriteria);
                    var res = null;
                    //проверяем что данные не старше минуты
                    if (res != null) {
                        successCallback(res);
                    }
                    else {
                        AjaxHelper.getCancelable(apiUrls.AVIA_BEGIN_SEARCH, apiCriteria, function (data, status) {
                            //сохраняем в хранилище (сохраняем только последний результат)
                            //storageService.setAviaSearchResults({ date: new Date().getTime(), criteria: apiCriteria, data: data });
                            //присваиваем значение через функцию коллбэк
                            successCallback(data);
                        }, function (data, status) {
                            //вызываем err callback
                            errCallback(data, status);
                        });
                    }
                },
                cancelAviaSearch: function() {
                    AjaxHelper.cancelRequest(apiUrls.AVIA_BEGIN_SEARCH);
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
                pay: function (queryData, successCallback, errCallback) {
                    $http.post(payUrl, angular.toJson(queryData)).success(function (data) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status);
                    });
                },
                getSectionTours: function (params, successCallback, errCallback) {
                    $http({
                        method: 'GET',
                        url: apiUrls.GET_SECTION_TOURS,
                        params: params,
                        cache: true
                    }).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                getSectionIndividualTours: function (params, successCallback, errCallback) {
                    $http({ method: 'GET', url: apiUrls.GET_SECTION_INDIVIDUAL_TOURS, params: params, cache: true }).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //вызываем err callback
                        errCallback(data, status);
                    });
                },
                getIndividualToursCategory: function (id, successCallback, errCallback) {
                    $http({ method: 'GET', url: apiUrls.GET_INDIVIDUAL_TOURS_CATEGORY + '/' + id, cache: true }).success(function (data, status) {
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
                    $http.post(apiUrls.SEND_IT_CATEGORY_REQUEST, apiData).success(function (data) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        errCallback(data, status); 
                    });
                },

                getPartnershipCookie: function(data){
                    AjaxHelper.post(apiUrls.PARTNERSHIP_GET_COOKIE, data, angular.noop, angular.noop, false);
                }
            };
        }]);