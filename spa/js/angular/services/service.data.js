innaAppServices.
    factory('dataService', ['$rootScope', '$http', '$q', '$log', 'cache', 'storageService',
        function ($rootScope, $http, $q, $log, cache, storageService) {
            function log(msg) {
                $log.log(msg);
            }

            return {
                getDirectoryByUrl: function (term, successCallback, errCallback) {
                    //log('getDirectoryByUrl, term: ' + term);
                    //������ �� ��������� ������
                    $http({ method: 'GET', url: getDirectoryUrl, params: { term: term }, cache: true }).success(function (data, status) {
                        if (data != null && data.length > 0) {
                            //���� ������ � ����� IATA
                            var resItem = _.find(data, function (item) {
                                return item.CodeIata == term;
                            });
                            //���� �� ����� - ����� ������
                            if (resItem == null)
                                resItem = data[0];

                            var urlKey = UrlHelper.getUrlFromData(resItem);
                            var cdata = new directoryCacheData(resItem.Id, resItem.Name, urlKey);
                            //����������� �������� ����� ������� �������
                            successCallback(cdata);
                        }
                        else {
                            errCallback(data, status);
                        }
                    }).error(function (data, status) {
                        //�������� err callback
                        errCallback(data, status);
                    });
                },

                getSletatDirectoryByTerm: function (term, successCallback, errCallback) {
                    //log('getSletatDirectoryByTerm: ' + term);
                    //������������� �������
                    term = encodeURIComponent(term);
                    //������ �� ��������� ������
                    $http.get(getSletatUrl + '?term=' + term, { cache: true }).success(function (data, status) {
                        //����������� �������� ����� ������� �������
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //�������� err callback
                        errCallback(data, status);
                    });
                },
                getSletatCity: function (successCallback, errCallback) {
                    //log('getSletatCity: ' + term);
                    //������ �� ��������� ������
                    $http.get(getSletatCityUrl, { cache: true }).success(function (data, status) {
                        //����������� �������� ����� ������� �������
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //�������� err callback
                        errCallback(data, status);
                    });
                },
                getSletatById: function (id, successCallback, errCallback) {
                    //log('getSletatById: ' + term);
                    //������ �� ��������� ������
                    $http.get(getSletatByIdUrl + '?id=' + id, { cache: true }).success(function (data, status) {
                        //����������� �������� ����� ������� �������
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //�������� err callback
                        errCallback(data, status);
                    });
                },
                startAviaSearch: function (criteria, successCallback, errCallback) {
                    //������ �� ��������� ������
                    var apiCriteria = new aviaCriteriaToApiCriteria(criteria);
                    //log('startAviaSearch, apiCriteria: ' + angular.toJson(apiCriteria));

                    //debug
                    if (avia.useAviaServiceStub) {
                        successCallback(angular.fromJson(apiSearchAviaDataJsonStub));
                    }
                    else {
                        //������� ��������� � html5 storage
                        var res = storageService.getAviaSearchResults(apiCriteria);
                        if (res != null) {
                            successCallback(res);
                        }
                        else {
                            $http({ method: 'GET', url: beginAviaSearchUrl, params: apiCriteria }).success(function (data, status) {
                                //��������� � ��������� (��������� ������ ��������� ���������)
                                storageService.setAviaSearchResults(apiCriteria, data);
                                //����������� �������� ����� ������� �������
                                successCallback(data);
                            }).
                            error(function (data, status) {
                                //�������� err callback
                                errCallback(data, status);
                            });
                        }
                    }
                },
                startSearchTours: function (criteria, successCallback, errCallback) {
                    //������ �� ��������� ������
                    $http.post(beginSearchUrl, angular.toJson(criteria)).success(function (data, status) {
                        //����������� �������� ����� ������� �������
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //�������� err callback
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
                    //������ �� ��������� ������
                    $http.post(getOrderUrl, angular.toJson(queryData)).success(function (data, status) {
                        //����������� �������� ����� ������� �������
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //�������� err callback
                        errCallback(data, status);
                    });
                },
                getPaymentPage: function (queryData, successCallback, errCallback) {
                    //������ �� ��������� ������
                    $http.post(paymentPageUrl, angular.toJson(queryData)).success(function (data, status) {
                        //����������� �������� ����� ������� �������
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //�������� err callback
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
                        //����������� �������� ����� ������� �������
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //�������� err callback
                        errCallback(data, status);
                    });
                },
                getSectionIndividualTours: function (params, successCallback, errCallback) {
                    $http({ method: 'GET', url: getSectionIndividualToursUrl, params: params, cache: true }).success(function (data, status) {
                        //����������� �������� ����� ������� �������
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //�������� err callback
                        errCallback(data, status);
                    });
                },
                getIndividualToursCategory: function (id, successCallback, errCallback) {
                    $http({ method: 'GET', url: getIndividualToursCategoryUrl + '/' + id, cache: true }).success(function (data, status) {
                        //����������� �������� ����� ������� �������
                        successCallback(data);
                    }).
                    error(function (data, status) {
                        //�������� err callback
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