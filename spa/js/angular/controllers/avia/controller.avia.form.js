
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaFormCtrl', ['$log', '$scope', '$rootScope', '$filter', '$location', 'dataService', 'cache', 'urlHelper', 'aviaHelper',
        'aviaService', 'Validators',
        function AviaFormCtrl($log, $scope, $rootScope, $filter, $location, dataService, cache, urlHelper, aviaHelper,
            aviaService, Validators) {

            var self = this;
            function log(msg) {
                //$log.log.apply($log, arguments);
            }

            var AVIA_COOK_NAME = "form_avia_cook";

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //$routeParams
            $scope.$on('avia.page.loaded', function (event, $routeParams, validateDate) {
                log('avia.page.loaded $routeParams: ' + angular.toJson($routeParams) + ' validateDate: ' + validateDate);

                var routeCriteria = null;
                //если пусто
                if ($routeParams.FromUrl == null || $routeParams.BeginDate == null) {
                    log('$routeParams is empty');
                    routeCriteria = getDefaultCriteria();
                }
                else {
                    //критерии из урла
                    routeCriteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
                }

                log('AviaFormCtrl routeCriteria: ' + angular.toJson(routeCriteria));

                if (validateDate) {
                    validateDates(routeCriteria);
                }

                $scope.criteria = routeCriteria;
                //по url вытягиваем Id и name для города, региона и т.д.
                setFromAndToFieldsFromUrl(routeCriteria);

                $scope.datepickerButtons.updateValues();
            });

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

            //значения по-умобчанию
            $scope.criteria = getDefaultCriteria();

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

            $scope.datepickerButtons = new datepickerButtons();
            $scope.$watch('datepickerButtons', function (newVal) {
                $scope.datepickerButtons.updateScopeValues();
            }, true);

            //заполняем From To
            setFromAndToFieldsFromUrl($scope.criteria);

            function getDefaultCriteria() {
                //даты по-умолчанию: сегодня и +5 дней
                //var now = dateHelper.getTodayDate();
                //var nowAdd5days = dateHelper.getTodayDate();
                //nowAdd5days = nowAdd5days.setDate(now.getDate() + 5);
                //var f_now = $filter('date')(new Date(), 'dd.MM.yyyy');
                //var f_nowAdd5days = $filter('date')(nowAdd5days, 'dd.MM.yyyy');

                var f_now = null;
                var f_nowAdd5days = null;

                var defaultCriteria = getParamsFromCookie();

                if (defaultCriteria == null) {
                    defaultCriteria = new aviaCriteria({
                        "BeginDate": f_now, "EndDate": f_nowAdd5days,
                        "AdultCount": 1, "ChildCount": 0, "InfantsCount": 0, "CabinClass": 0, "IsToFlexible": 0, "IsBackFlexible": 0,
                        "PathType": 0
                    });
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
            };
            
            function getParamsFromCookie() {
                var cookVal = $.cookie(AVIA_COOK_NAME);
                var resCriteria = null;
                log('getParamsFromCookie, cookVal: ' + cookVal);
                if (cookVal != null) {
                    var formVal = angular.fromJson(cookVal);

                    resCriteria = {};
                    resCriteria.FromUrl = formVal.FromUrl;
                    resCriteria.ToUrl = formVal.ToUrl;
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
            };

            function saveParamsToCookie() {
                var saveObj = {};
                saveObj.FromUrl = $scope.criteria.FromUrl;
                saveObj.ToUrl = $scope.criteria.ToUrl;
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
                log('saveParamsToCookie, cookVal: ' + cookVal);
                //сохраняем сессионную куку
                $.cookie(AVIA_COOK_NAME, cookVal);

                var testVal = $.cookie(AVIA_COOK_NAME);
                log('saveParamsToCookie, testVal: ' + testVal);
            };

            //добавляем в кэш откуда, куда
            //addDefaultFromToDirectionsToCache(defaultCriteria);
            //списки по-умолчанию

            $scope.pathTypeList = [{ name: 'Туда обратно', value: 0 }, { name: 'Туда', value: 1 }];

            
            //logCriteriaData();
            log('AviaFormCtrl defaultCriteria: ' + angular.toJson($scope.criteria));

            //тут меняем урл для поиска
            $scope.searchStart = function () {
                try {
                    validate();
                    //if ok

                    if ($scope.criteria.FromId > 0 && $scope.criteria.ToId > 0) {
                        fillFromAndTo();
                        saveParamsToCookie();
                        //log('$scope.searchStart: ' + angular.toJson($scope.criteria));
                        var url = urlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
                        $location.path(url);
                    }
                    else {
                        alert('Не заполнены поля Откуда, Куда');
                    }

                    //$rootScope.$emit('inna.DynamicPackages.Search', o);
                } catch (e) {
                    console.warn(e);
                    if ($scope.criteria.hasOwnProperty(e.message)) {
                        $scope.criteria[e.message] = e;
                    }
                }   
            };

            function setFromAndToFieldsFromUrl(routeCriteria) {
                if (routeCriteria.FromUrl != null && routeCriteria.FromUrl.length > 0) {
                    $scope.criteria.From = 'загружается...';
                    dataService.getDirectoryByUrl(routeCriteria.FromUrl, function (data) {
                        //обновляем данные
                        if (data != null) {
                            $scope.criteria.From = data.name;
                            $scope.criteria.FromId = data.id;
                            $scope.criteria.FromUrl = data.url;
                            //logCriteriaData();
                            log('$scope.criteria.From: ' + angular.toJson($scope.criteria));
                        }
                    }, function (data, status) {
                        //ошибка получения данных
                        log('getDirectoryByUrl error: ' + $scope.criteria.FromUrl + ' status:' + status);
                    });
                }

                if (routeCriteria.ToUrl != null && routeCriteria.ToUrl.length > 0) {
                    $scope.criteria.To = 'загружается...';
                    dataService.getDirectoryByUrl(routeCriteria.ToUrl, function (data) {
                        //обновляем данные
                        if (data != null) {
                            $scope.criteria.To = data.name;
                            $scope.criteria.ToId = data.id;
                            $scope.criteria.ToUrl = data.url;
                            //logCriteriaData();
                            log('$scope.criteria.To: ' + angular.toJson($scope.criteria));
                        }
                    }, function (data, status) {
                        //ошибка получения данных
                        log('getDirectoryByUrl error: ' + $scope.criteria.ToUrl + ' status:' + status);
                    });
                }
            };


            $scope.preventBubbling = function ($event) {
                preventBubbling($event);
            }

            //отключаем бабблинг событий
            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            $scope.pathTypeClick = function (val) {
                $scope.criteria.PathType = val;
            }

            function fillFromAndTo() {
                $scope.loadObjectById($scope.criteria.FromId, function (data) {
                    if (data != null) {
                        $scope.criteria.FromUrl = data.CodeIata;
                    }
                }, false);
                
                $scope.loadObjectById($scope.criteria.ToId, function (data) {
                    if (data != null) {
                        $scope.criteria.ToUrl = data.CodeIata;
                    }
                }, false);
            }

            function validate() {
                Validators.defined($scope.criteria.FromId, Error('FromId'));
                Validators.defined($scope.criteria.ToId, Error('ToId'));
                Validators.notEqual($scope.criteria.FromId, $scope.criteria.ToId, Error('ToId'));

                Validators.defined($scope.criteria.BeginDate, Error('BeginDate'));
                if ($scope.criteria.PathType == 0) {//туда обратно
                    Validators.defined($scope.criteria.EndDate, Error('EndDate'));
                }
            }

            /* From field */
            $scope.fromList = [];

            $scope.provideSuggestToFromList = function (preparedText, rawText) {
                aviaService.getDirectoryByUrl(preparedText, function (data) {
                    $scope.$apply(function ($scope) {
                        $scope.fromList = data;
                    });
                })
            }

            $scope.loadObjectById = function (id, callback, async) {
                aviaService.getObjectById(id, callback, null, async);
            }

            /* To field */
            $scope.toList = [];

            $scope.provideSuggestToToField = function (preparedText, rawText) {
                aviaService.getDirectoryByUrl(preparedText, function (data) {
                    $scope.$apply(function ($scope) {
                        $scope.toList = data;
                    });
                })
            }

            /*Klass*/
            $scope.klass = _.find(TripKlass.options, function (klass) {
                return (klass.value == $scope.criteria.CabinClass);
            });
            $scope.$watch('klass', function (newVal, oldVal) {
                $scope.criteria.CabinClass = newVal.value;
            });
        }]);
