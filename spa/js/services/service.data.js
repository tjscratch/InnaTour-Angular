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
                    $http.get(apiUrls.DICTIONARY_ALL_COUNTRIES, {cache: true}).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },
                getDirectoryByUrl: function (term, successCallback, errCallback) {
                    AjaxHelper.get({
                        url: apiUrls.AVIA_FROM_SUGGEST,
                        data: {term: term},
                        success: function (data) {
                            //console.log('getDirectoryByUrl', data);
                            if (data != null && data.length > 0) {
                                //ищем запись с кодом IATA
                                var resItem = _.find(data, function (item) {
                                    return item.CodeIata == term && item.Basic == 1;
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
                        },
                        error: errCallback
                    });
                },

                getSletatDirectoryByTerm: function (term, successCallback, errCallback) {
                    //log('getSletatDirectoryByTerm: ' + term);
                    //принудительно энкодим
                    term = encodeURIComponent(term);
                    //запрос по критериям поиска
                    $http.get(apiUrls.GET_SLETAT + '?term=' + term, {cache: true}).success(function (data, status) {
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
                    $http.get(apiUrls.GET_SLETAT_CITY, {cache: true}).success(function (data, status) {
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
                    $http.get(apiUrls.GET_SLETAT_BY_ID + '?id=' + id, {cache: true}).success(function (data, status) {
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
                cancelAviaSearch: function () {
                    AjaxHelper.cancelRequest(apiUrls.AVIA_BEGIN_SEARCH);
                },
                startSearchTours: function (criteria, successCallback, errCallback) {
                    //запрос по критериям поиска
                    $http.post(apiUrls.BEGIN_SEARCH, angular.toJson(criteria)).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            //вызываем err callback
                            errCallback(data, status);
                        });
                },
                checkSearchTours: function (searchIdObj, successCallback, errCallback) {
                    $http.post(apiUrls.CHECK_SEARCH, angular.toJson(searchIdObj)).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },
                getLocationsByUrls: function (queryData, successCallback, errCallback) {
                    $http.post(apiUrls.GET_LOCATION_BY_URLS, angular.toJson(queryData)).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },
                getHotelDetail: function (queryData, successCallback, errCallback) {
                    $http.post(apiUrls.HOTEL_DETAIL, angular.toJson(queryData)).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },
                getTourDetail: function (queryData, successCallback, errCallback) {
                    $http.post(apiUrls.TOUR_DETAIL, angular.toJson(queryData)).success(function (data, status) {
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            errCallback(data, status);
                        });
                },
                getOrder: function (queryData, successCallback, errCallback) {
                    //запрос по критериям поиска
                    $http.post(apiUrls.GET_ORDER, angular.toJson(queryData)).success(function (data, status) {
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
                    $http.post(apiUrls.PAYMENT_PAGE, angular.toJson(queryData)).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            //вызываем err callback
                            errCallback(data, status);
                        });
                },
                pay: function (queryData, successCallback, errCallback) {
                    $http.post(apiUrls.PAY, angular.toJson(queryData)).success(function (data) {
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
                    $http({method: 'GET', url: apiUrls.GET_SECTION_INDIVIDUAL_TOURS, params: params, cache: true}).success(function (data, status) {
                        //присваиваем значение через функцию коллбэк
                        successCallback(data);
                    }).
                        error(function (data, status) {
                            //вызываем err callback
                            errCallback(data, status);
                        });
                },
                getIndividualToursCategory: function (id, successCallback, errCallback) {
                    $http({method: 'GET', url: apiUrls.GET_INDIVIDUAL_TOURS_CATEGORY + '/' + id, cache: true}).success(function (data, status) {
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

                getPartnershipCookie: function (data) {
                    $http({
                        url: apiUrls.PARTNERSHIP_GET_COOKIE,
                        method: "GET",
                        params: data
                    });
//                    AjaxHelper.get({
//                        url    : apiUrls.PARTNERSHIP_GET_COOKIE,
//                        data   : data,
//                        success: angular.noop,
//                        error  : angular.noop,
//                        cache  : false
//                    });
                },

                /**
                 * получение ID текущей локации
                 * @param callbackSuccess
                 * @param callbackError
                 */
                getCurrentLocation: function (callbackSuccess, callbackError) {
                    return AjaxHelper.get({
                        url: apiUrls.GET_CURRENT_LOCATION_BY_IP,
                        data: null,
                        success: callbackSuccess,
                        error: callbackError
                    });
                },

                /**
                 * автокомплит
                 * получение списка локация отправления для ДП
                 * @param term
                 * @param callback
                 * @returns {*}
                 */
                getDPFromListByTerm: function (term, callback) {
                    return AjaxHelper.getDebounced({
                        url: apiUrls.DYNAMIC_FROM_SUGGEST,
                        data: {term: term},
                        success: callback
                    });
                },

                /**
                 * автокомплит
                 * получение списка локация прибытия для ДП
                 * @param term
                 * @param callback
                 * @returns {*}
                 */
                getDPToListByTerm: function (term, callback) {
                    return AjaxHelper.getDebounced({
                        url: apiUrls.DYNAMIC_TO_SUGGEST,
                        data: {term: term},
                        success: callback
                    });
                },


                getDPLocationById: function (id, callback) {
                    return AjaxHelper.get({
                        url: apiUrls.DYNAMIC_GET_OBJECT_BY_ID,
                        data: {id: id},
                        success: callback
                    });
                },


                /**
                 * Registration Agency
                 */
                agencyCreate: function (data) {
                    return $http.post(apiUrls.PARTNER_CREATE, data);
                },

                // getCountryListByTerm: function (term, callback) {
                //     return AjaxHelper.getDebounced({
                //         url: apiUrls.GET_COUNTRY_BY_TERM,
                //         data: {term: term},
                //         success: callback
                //     });
                // },

                getCityByIp: function (callbackSuccess, callbackError) {
                    return AjaxHelper.get({
                        url: apiUrls.GET_CURRENT_CITY_BY_IP,
                        data: null,
                        success: callbackSuccess,
                        error: callbackError
                    });
                },

                getCountryListByTerm: function (text) {
                    var deferred = $q.defer();

                    function prepareData (response) {
                        var data = [];
                        angular.forEach(response, function (item) {
                            var fullName = item.Name;
                            console.log('ITEM', item);
                            var fullNameHtml = "<span class='b-search-form-hotels-typeahead-list-item__country'>" + item.Name + "</span>";
                            data.push({ id: item.Id, nameHtml: fullNameHtml, name: fullName });
                        });
                        return data;
                    }

                    $http({
                        url: apiUrls.GET_COUNTRY_BY_TERM,
                        method: "GET",
                        params: {
                            term: text
                        }
                    }).success(function (data) {
                        deferred.resolve(prepareData(data));
                    });

                    return deferred.promise;
                }

            };
        }]);