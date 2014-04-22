innaAppServices.
    factory('dataService', ['$rootScope', '$http', '$q', '$log', 'cache', 'storageService', 'innaApp.API.const', 'urlHelper',
        function ($rootScope, $http, $q, $log, cache, storageService, apiUrls, urlHelper) {
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
                        var res = null;
                        //var res = storageService.getAviaSearchResults(apiCriteria);
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
                pay: function (queryData, successCallback, errCallback) {
                    $http.post(payUrl, angular.toJson(queryData)).success(function (data) {
                        successCallback(data);
                    }).
                    error(function (data, status) {
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