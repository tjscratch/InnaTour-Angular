'use strict';

innaAppControllers.
    controller('AviaFormCtrl', [
        '$log',
        '$scope',
        '$rootScope',
        '$filter',
        '$routeParams',
        '$location',
        'dataService',
        'cache',
        'innaApp.Urls',
        'urlHelper',
        'aviaHelper',
        'aviaService', 'Validators',
        function ($log, $scope, $rootScope, $filter, $routeParams, $location, dataService, cache, Urls, urlHelper, aviaHelper, aviaService, Validators) {

            var self = this;

            function log(msg) {
                //$log.log.apply($log, arguments);
            }

            $scope.criteria = {};

            //console.log('AviaFormCtrl');
            //console.log($routeParams);

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //значения по-умобчанию
            (function () {
                var def = getDefaultCriteria();
                var defClass = 0;
                if (def != null) {
                    defClass = def.CabinClass;
                }
                $scope.criteria = {
                    CabinClass: defClass
                }
            })();

            //$routeParams
            $scope.$on('avia.page.loaded', function (event, $routeParams, validateDate) {
                //console.log('avia.page.loaded');
                initCriteriaWatch();

                //console.log('avia.page.loaded $routeParams: ' + angular.toJson($routeParams) + ' validateDate: ' + validateDate);
                loadParamsFromRouteOrDefault($routeParams, validateDate);
            });

            var wasInited = false;

            function initCriteriaWatch() {
                if (!wasInited) {
                    wasInited = true;
                    $scope.$watch('criteria', function (newVal, oldVal) {
                        if (newVal != null) {
                            saveParamsToStorage();
                        }
                    }, true);
                }
            }
            // console.log('PARAMS', $routeParams);
            // $scope.ggg = '';
            // if($routeParams.BeginDate) {
            //     $scope.ggg = $routeParams.BeginDate;
            //     $scope.criteria.BeginDate = $routeParams.BeginDate;
            // }
            // if($routeParams.EndDate) {
            //     $scope.criteria.EndDate = $routeParams.EndDate;
            // }
            // console.log('SSSSSSS', $scope.criteria.BeginDate);
            // console.log('GGG', $scope.ggg);  

            $scope.$watch('datepickerButtons', function (newVal) {
                if(newVal) {
                    $scope.datepickerButtons.updateScopeValues();
                }
            }, true);

            $scope.$watch('criteria.AdultCount', function (newValue, oldValue) {
                if(newValue && oldValue && newValue != oldValue) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': 'Avia',
                            'Action': 'Adults',
                            'Label': newValue,
                            'Content': newValue + $scope.criteria.ChildCount + $scope.criteria.InfantsCount,
                            'Context': newValue > oldValue ? 'plus' : 'minus',
                            'Text': '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });

            $scope.$watch('criteria.InfantsCount', function (newValue, oldValue) {
                if((newValue || newValue == 0) && oldValue != undefined && newValue != oldValue) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': 'Avia',
                            'Action': 'Baby',
                            'Label': newValue,
                            'Content': newValue + $scope.criteria.AdultCount + $scope.criteria.ChildCount,
                            'Context': newValue > oldValue ? 'plus' : 'minus',
                            'Text': '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });

            $scope.$watch('criteria.ChildCount', function (newValue, oldValue) {
                if((newValue || newValue == 0) && oldValue != undefined && newValue != oldValue) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': 'Avia',
                            'Action': 'Childrens',
                            'Label': newValue,
                            'Content': newValue + $scope.criteria.AdultCount + $scope.criteria.InfantsCount,
                            'Context': newValue > oldValue ? 'plus' : 'minus',
                            'Text': '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });

            function loadParamsFromRouteOrDefault(routeParams, validateDate) {
                //console.log('loadParamsFromRouteOrDefault, routeParams:');
                //console.log(routeParams);

                var routeCriteria = null;
                //если пусто
                if (routeParams.FromUrl == null || routeParams.BeginDate == null) {
                    //console.log('avia.form: $routeParams is empty');
                    routeCriteria = getDefaultCriteria();

                    //URL для контекста по авиа
                    var urlCriteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy(routeParams)));
                    if (urlCriteria.FromUrl != null) {
                        routeCriteria.FromUrl = urlCriteria.FromUrl;
                    }
                    if (urlCriteria.ToUrl != null) {
                        routeCriteria.ToUrl = urlCriteria.ToUrl;
                    }
                }
                else {
                    //критерии из урла
                    routeCriteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy(routeParams)));
                    //console.log('avia.form: routeCriteria: ' + angular.toJson(routeCriteria));
                }

                var testRouteCriteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy(routeParams)));

                if (validateDate) {
                    validateDates(routeCriteria);
                }

                $scope.criteria = routeCriteria;
                //console.log('avia.page.loaded criteria');
                //console.log($scope.criteria);

                //если FromUrl пришли (из урла), а FromId - нет
                setFromAndToFieldsFromUrl(routeCriteria);

                $scope.datepickerButtons = new datepickerButtons();
                $scope.datepickerButtons.updateValues();
            }

            $rootScope.$broadcast("avia.form.loaded");

            function setFromAndToFieldsFromUrl(routeCriteria) {
                if (routeCriteria.FromUrl != null && routeCriteria.FromUrl.length > 0) {
                    //$scope.criteria.From = 'загружается...';

                    //console.log('setFromAndToFieldsFromUrl, routeCriteria.FromUrl: %s', routeCriteria.FromUrl);

                    dataService.getDirectoryByUrl(routeCriteria.FromUrl, function (data) {
                        $scope.safeApply(function () {
                            //обновляем данные
                            if (data != null) {
                                //$scope.fromInit = { Id: data.id, Name: data.name, Url: data.url };

                                $scope.criteria.FromId = data.id;
                                $rootScope.$broadcast("avia_form_from_update", data.id);

                                //$scope.criteria.From = data.name;
                                //$scope.criteria.FromUrl = data.url;
                                //logCriteriaData();
                                //console.log('loaded $scope.criteria.FromUrl: ' + $scope.criteria.FromUrl);
                            }
                        });
                    }, function (data, status) {
                        //ошибка получения данных
                        //console.log('avia.form: getDirectoryByUrl error: ' + $scope.criteria.FromUrl + ' status:' + status);
                    });
                }

                if (routeCriteria.ToUrl != null && routeCriteria.ToUrl.length > 0) {
                    //$scope.criteria.To = 'загружается...';
                    dataService.getDirectoryByUrl(routeCriteria.ToUrl, function (data) {
                        $scope.safeApply(function () {
                            //обновляем данные
                            if (data != null) {
                                //$scope.toInit = { Id: data.id, Name: data.name, Url: data.url };

                                //$scope.criteria.To = data.name;
                                $scope.criteria.ToId = data.id;
                                $rootScope.$broadcast("avia_form_to_update", data.id);
                                //$scope.criteria.ToUrl = data.url;

                                //console.log('loaded $scope.criteria.ToUrl: %s', $scope.criteria.ToUrl);
                                //logCriteriaData();
                                //console.log('avia.form: $scope.criteria.To: ' + angular.toJson($scope.criteria));
                            }
                        });
                    }, function (data, status) {
                        //ошибка получения данных
                        //console.log('avia.form: getDirectoryByUrl error: ' + $scope.criteria.ToUrl + ' status:' + status);
                    });
                }
            }

            function validateDates(crit) {
                //даты по-умолчанию: сегодня и +5 дней
                var now = dateHelper.getTodayDate();
                var nowAdd5days = dateHelper.getTodayDate();
                nowAdd5days = nowAdd5days.setDate(now.getDate() + 5);
                var f_now = $filter('date')(new Date(), 'dd.MM.yyyy');
                var f_nowAdd5days = $filter('date')(nowAdd5days, 'dd.MM.yyyy');

                //проверка актуальности дат
                if (crit.BeginDate != null && crit.BeginDate.length > 0) {
                    var critDateFrom = dateHelper.dateToJsDate(crit.BeginDate);
                    if (critDateFrom < now) {
                        log('cookie dates overriden by default dates: %s %s', f_now, f_nowAdd5days);
                        crit.BeginDate = f_now;
                        crit.EndDate = f_nowAdd5days;
                    }
                }
            }

            function datepickerButtons() {
                var self = this;
                self.isOneWaySelected = $scope.criteria.PathType == 1;
                self.isToRoamingSelected = $scope.criteria.IsToFlexible == 1;
                self.isBackRoamingSelected = $scope.criteria.IsBackFlexible == 1;
                self.updateScopeValues = function () {
                    $scope.criteria.PathType = self.isOneWaySelected ? 1 : 0;
                    $scope.criteria.IsToFlexible = self.isToRoamingSelected ? 1 : 0;
                    $scope.criteria.IsBackFlexible = self.isBackRoamingSelected ? 1 : 0;
                };
                self.updateValues = function () {
                    self.isOneWaySelected = $scope.criteria.PathType == 1 ? true : false;
                    self.isToRoamingSelected = $scope.criteria.IsToFlexible == 1 ? true : false;
                    self.isBackRoamingSelected = $scope.criteria.IsBackFlexible == 1 ? true : false;
                }
            }

            function getDefaultCriteria() {
                //даты по-умолчанию: сегодня и +5 дней
                //var now = dateHelper.getTodayDate();
                //var nowAdd5days = dateHelper.getTodayDate();
                //nowAdd5days = nowAdd5days.setDate(now.getDate() + 5);
                //var f_now = $filter('date')(new Date(), 'dd.MM.yyyy');
                //var f_nowAdd5days = $filter('date')(nowAdd5days, 'dd.MM.yyyy');

                var f_now = null;
                var f_nowAdd5days = null;

                var defaultCriteria = getParamsFromStorage();

                if (defaultCriteria == null) {
                    defaultCriteria = new aviaCriteria({
                        "BeginDate": f_now, "EndDate": f_nowAdd5days,
                        "AdultCount": 1, "ChildCount": 0, "InfantsCount": 0, "CabinClass": 0, "IsToFlexible": 0, "IsBackFlexible": 0,
                        "PathType": 0
                    });

                    aviaService.getGetCurrentCity(function (data) {
                        if (data != null) {
                            $scope.safeApply(function () {
                                $scope.criteria.FromId = data.Id;
                                $rootScope.$broadcast("avia_form_from_update", data.Id);
                            });
                        }
                    }, function (data, status) {
                        console.error('aviaService.getGetCurrentCity err');
                    });
                    //console.log('avia.form: getting default');
                }
                else {
                    //console.log('avia.form: getting from cookie');
                }

                //проверка актуальности дат
                //проверка актуальности дат
                validateDates(defaultCriteria);

                //установка дефолтных дат
                //if (defaultCriteria.BeginDate == null || defaultCriteria.BeginDate.length == 0)
                //{
                //    log('BeginDate, set default date');
                //    defaultCriteria.BeginDate = f_now;
                //}
                //if (defaultCriteria.EndDate == null || defaultCriteria.EndDate.length == 0) {
                //    log('EndDate, set default date');
                //    defaultCriteria.EndDate = f_nowAdd5days;
                //}

                return defaultCriteria;
            }

            function getParamsFromStorage() {
                var cookVal = aviaService.getForm();
                //console.log('get stored value: %s', cookVal);

                var resCriteria = null;
                if (cookVal != null) {
                    var formVal = angular.fromJson(cookVal);

                    resCriteria = {};
                    resCriteria.FromId = formVal.FromId;
                    resCriteria.FromUrl = formVal.FromUrl;
                    resCriteria.From = formVal.From;
                    resCriteria.ToId = formVal.ToId;
                    resCriteria.ToUrl = formVal.ToUrl;
                    resCriteria.To = formVal.To;
                    resCriteria.BeginDate = formVal.BeginDate;
                    resCriteria.EndDate = formVal.EndDate;
                    resCriteria.AdultCount = formVal.AdultCount;
                    resCriteria.ChildCount = formVal.ChildCount;
                    resCriteria.InfantsCount = formVal.InfantsCount;
                    resCriteria.CabinClass = formVal.CabinClass;
                    resCriteria.IsToFlexible = formVal.IsToFlexible;
                    resCriteria.IsBackFlexible = formVal.IsBackFlexible;
                    resCriteria.PathType = formVal.PathType;
                }
                return resCriteria;
            }

            function saveParamsToStorage() {
                var saveObj = {};
                saveObj.FromId = $scope.criteria.FromId;
                saveObj.FromUrl = $scope.criteria.FromUrl;
                saveObj.From = $scope.criteria.From;
                saveObj.ToId = $scope.criteria.ToId;
                saveObj.ToUrl = $scope.criteria.ToUrl;
                saveObj.To = $scope.criteria.To;
                saveObj.BeginDate = $scope.criteria.BeginDate;
                saveObj.EndDate = $scope.criteria.EndDate;
                saveObj.AdultCount = $scope.criteria.AdultCount;
                saveObj.ChildCount = $scope.criteria.ChildCount;
                saveObj.InfantsCount = $scope.criteria.InfantsCount;
                saveObj.CabinClass = $scope.criteria.CabinClass;
                saveObj.IsToFlexible = $scope.criteria.IsToFlexible;
                saveObj.IsBackFlexible = $scope.criteria.IsBackFlexible;
                saveObj.PathType = $scope.criteria.PathType;

                var cookVal = angular.toJson(saveObj);
                //console.log('saved value: %s', cookVal);

                aviaService.saveForm(cookVal);
            }

            function clearStorage() {
                //console.log('clearStorage');
                aviaService.clearForm();
            }

            //добавляем в кэш откуда, куда
            //addDefaultFromToDirectionsToCache(defaultCriteria);
            //списки по-умолчанию

            $scope.pathTypeList = [
                { name: 'Туда обратно', value: 0 },
                { name: 'Туда', value: 1 }
            ];

            //logCriteriaData();
            //log('AviaFormCtrl defaultCriteria: ' + angular.toJson($scope.criteria));

            //тут меняем урл для поиска
            $scope.searchStart = function ($event) {
                if ($event && $event.target) {
                    var el = $($event.target);
                    //если клик - пришел из фокуса
                    if (el.data('simulate')) {
                        return;
                    }
                }

                try {

                    //если не ввели дату обратно - то начинаем поиск в одну сторону, но если не стоит галка в одну сторону
                    if ($scope.criteria.PathType == 0 && $scope.criteria.BeginDate != null && $scope.criteria.BeginDate.length > 0 && ($scope.criteria.EndDate == null || $scope.criteria.EndDate.length == 0)) {
                        $scope.criteria.PathType = 1;//туда
                    }

                    validate();
                    //if ok

                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': 'Avia',
                            'Action': 'AviaSearch',
                            'Label': '[no data]',
                            'Content': '[no data]',
                            'Context': '[no data]',
                            'Text': '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }


                    if ($scope.criteria.FromId > 0 && $scope.criteria.ToId > 0 &&
                        $scope.criteria.FromUrl.length > 0 && $scope.criteria.ToUrl.length > 0) {

                        //аналитика
                        track.aviaSearch();

                        saveParamsToStorage();
                        //log('$scope.searchStart: ' + angular.toJson($scope.criteria));
                        var oldUrl = $location.path();
                        var url = urlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
                        $location.path(url);

                        if (oldUrl == url) {
                            //сброс запрета слежения аналитики
                            track.resetTrackSuccessResult(track.aviaKey);

                            $rootScope.$broadcast("avia.search.start");
                        }
                    }
                    else {
                        console.warn('Не заполнены поля Откуда, Куда');
                    }

                    //$rootScope.$emit('inna.DynamicPackages.Search', o);
                } catch (e) {
                    console.warn(e);
                    if ($scope.criteria.hasOwnProperty(e.message)) {
                        $scope.criteria[e.message] = e;

                        if (e.message == 'FromId') {
                            $rootScope.$broadcast("avia_form_from_update", e);
                        } else if (e.message == 'ToId') {
                            $rootScope.$broadcast("avia_form_to_update", e);
                        }
                    }
                }
            };

            $scope.preventBubbling = function ($event) {
                preventBubbling($event);
            };

            //отключаем бабблинг событий
            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            $scope.pathTypeClick = function (val) {
                $scope.criteria.PathType = val;
            };

            function validate() {
                Validators.defined($scope.criteria.FromId, Error('FromId'));
                Validators.defined($scope.criteria.ToId, Error('ToId'));
                Validators.notEqual($scope.criteria.FromId, $scope.criteria.ToId, Error('ToId'));

                //если запомнили город - то проверяем и его
                if ($scope.lastCityFromCode != null && $scope.lastCityToCode != null) {
                    Validators.notEqual($scope.lastCityFromCode, $scope.lastCityToCode, Error('ToId'));
                }
                else if ($scope.lastCityFromCode != null && $scope.lastCityToCode == null) {
                    Validators.notEqual($scope.lastCityFromCode, $scope.criteria.ToUrl, Error('ToId'));
                }
                else if ($scope.lastCityFromCode == null && $scope.lastCityToCode != null) {
                    Validators.notEqual($scope.criteria.FromUrl, $scope.lastCityToCode, Error('ToId'));
                }

                Validators.defined($scope.criteria.BeginDate, Error('BeginDate'));

                if ($scope.criteria.PathType == 0) {//туда обратно
                    Validators.defined($scope.criteria.EndDate, Error('EndDate'));
                    Validators.dateEndEmpty($scope.criteria.BeginDate, $scope.criteria.EndDate, Error('EndDate'));
                }
            }

            /* From field */
            $scope.fromList = [];

            $scope.provideSuggestToFromList = function (preparedText, rawText) {
                aviaService.getDirectoryByUrl(preparedText, function (data) {
                    $scope.safeApply(function () {
                        $scope.fromList = data;
                    });
                })
            };

            $scope.loadObjectById = function (id, callback) {
                //console.log('loadObjectById: %d', id);
                aviaService.getObjectById(id, callback, null);
            };

            /* To field */
            $scope.toList = [];

            $scope.provideSuggestToToField = function (preparedText, rawText) {
                aviaService.getDirectoryByUrl(preparedText, function (data) {
                    $scope.safeApply(function () {
                        $scope.toList = data;
                    });
                })
            };

            $scope.setResultCallbackFrom = function (item) {
                if (item != null) {
                    //console.log('$scope.setResultCallbackFrom:');
                    //console.log(item);
                    $scope.criteria.FromUrl = item.CodeIata;
                    $scope.criteria.From = item.Name;
                }
                if (item != null && item.CityCodeIata != null) {
                    $scope.lastCityFromCode = item.CityCodeIata;
                }
                else {
                    $scope.lastCityFromCode = null;
                }
            };

            $scope.setResultCallbackTo = function (item) {
                if (item != null) {
                    //console.log('$scope.setResultCallbackTo:');
                    //console.log(item);
                    $scope.criteria.ToUrl = item.CodeIata;
                    $scope.criteria.To = item.Name;
                }
                if (item != null && item.CityCodeIata != null) {
                    $scope.lastCityToCode = item.CityCodeIata;
                }
                else {
                    $scope.lastCityToCode = null;
                }
            };


            /*Klass*/
            $scope.klass = _.find(TripKlass.options, function (klass) {
                return (klass.value == $scope.criteria.CabinClass);
            });
            $scope.$watch('klass', function (newVal, oldVal) {
                $scope.criteria.CabinClass = newVal.value;
            });

            $scope.maxDate = new Date();
            $scope.maxDate.setFullYear($scope.maxDate.getFullYear() + 1);

            //unload
            $(window).on('unload beforeunload', function () {
                clearStorage();
            });
        }]);
