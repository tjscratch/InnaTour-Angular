
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaFormCtrl', ['$log', '$scope', '$rootScope', '$filter', '$location', 'dataService', 'cache', 'urlHelper',
        function AviaFormCtrl($log, $scope, $rootScope, $filter, $location, dataService, cache, urlHelper) {

            var self = this;
            function log(msg) {
                //$log.log.apply($log, arguments);
            }

            var AVIA_COOK_NAME = "form_avia_cook";

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //$routeParams
            $scope.$on('avia.page.loaded', function (event, $routeParams) {
                log('avia.page.loaded $routeParams: ' + angular.toJson($routeParams));

                //если пусто
                if ($routeParams.FromUrl == null || $routeParams.BeginDate == null) {
                    log('$routeParams is empty');
                    return;
                }

                //критерии из урла
                var routeCriteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));

                log('AviaFormCtrl routeCriteria: ' + angular.toJson(routeCriteria));
                $scope.criteria = routeCriteria;

                //по url вытягиваем Id и name для города, региона и т.д.
                setFromAndToFieldsFromUrl(routeCriteria);
            });

            //значения по-умобчанию
            (function getDefaultCriteria() {
                //даты по-умолчанию: сегодня и +5 дней
                var now = dateHelper.getTodayDate();
                var nowAdd5days = dateHelper.getTodayDate();
                nowAdd5days = nowAdd5days.setDate(now.getDate() + 5);
                var f_now = $filter('date')(new Date(), 'dd.MM.yyyy');
                var f_nowAdd5days = $filter('date')(nowAdd5days, 'dd.MM.yyyy');
                //f_now = null;
                //f_nowAdd5days = null;

                //return new aviaCriteria({
                //    "From": "Москва", "FromId": 6733, "FromUrl": "MOW",
                //    "To": "Мюнхен", "ToId": 1357, "ToUrl": "MUC",
                //    "BeginDate": f_now, "EndDate": f_nowAdd5days,
                //    "AdultCount": 2, "ChildCount": 0, "InfantsCount": 0, "CabinClass": 0, "IsToFlexible": 0, "IsBackFlexible": 0,
                //    "PathType": 0
                //});

                var defaultCriteria = getParamsFromCookie();

                if (defaultCriteria == null) {
                    defaultCriteria = new aviaCriteria({
                        "BeginDate": f_now, "EndDate": f_nowAdd5days,
                        "AdultCount": 2, "ChildCount": 0, "InfantsCount": 0, "CabinClass": 0, "IsToFlexible": 0, "IsBackFlexible": 0,
                        "PathType": 0
                    });
                }

                //проверка актуальности дат
                if (defaultCriteria.BeginDate != null && defaultCriteria.BeginDate.length > 0) {
                    var critDateFrom = dateHelper.dateToJsDate(defaultCriteria.BeginDate);
                    if (critDateFrom < now) {
                        log('cookie dates overriden by default dates: %s %s', f_now, f_nowAdd5days);
                        defaultCriteria.BeginDate = f_now;
                        defaultCriteria.EndDate = f_nowAdd5days;
                    }
                }

                //установка дефолтных дат
                if (defaultCriteria.BeginDate == null || defaultCriteria.BeginDate.length == 0)
                {
                    log('BeginDate, set default date');
                    defaultCriteria.BeginDate = f_now;
                }
                if (defaultCriteria.EndDate == null || defaultCriteria.EndDate.length == 0) {
                    log('EndDate, set default date');
                    defaultCriteria.EndDate = f_nowAdd5days;
                }

                $scope.criteria = defaultCriteria;

                //заполняем From To
                setFromAndToFieldsFromUrl(defaultCriteria);
            })();
            
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
            $scope.adultCountList = [1, 2, 3, 4, 5, 6];
            $scope.childCountList = [0, 1, 2, 3, 4, 5, 6];
            $scope.cabinClassList = [{ name: 'Эконом', value: 0 }, { name: 'Бизнес', value: 1 }];

            $scope.pathTypeList = [{ name: 'Туда обратно', value: 0 }, { name: 'Туда', value: 1 }];

            
            //logCriteriaData();
            log('AviaFormCtrl defaultCriteria: ' + angular.toJson($scope.criteria));

            //тут меняем урл для поиска
            $scope.searchStart = function () {
                if ($scope.criteria.FromId > 0 && $scope.criteria.ToId > 0) {
                    saveParamsToCookie();
                    //log('$scope.searchStart: ' + angular.toJson($scope.criteria));
                    var url = urlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
                    $location.path(url);
                }
                else {
                    alert('Не заполнены поля Откуда, Куда');
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


            //поведение
            var skipCloseType = { from: 'from', to: 'to', dateFrom: 'dateFrom', dateTo: 'dateTo', people: 'people', cabinClass: 'cabinClass' };

            $scope.form = {};
            $scope.form.isPeopleOpened = false;
            $scope.form.isCabinClassOpened = false;

            //добавляем в список обработчиков наш контроллер (мы хотим ловить клик по body)
            $rootScope.addBodyClickListner('avia.form', bodyClick);

            //обработчик клика на body
            function bodyClick() {
                //log('avia.form bodyClick');
                closeAllPopups();
            }

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

            //закрывает все открытые попапы
            function closeAllPopups(skipClose) {
                if (skipClose != skipCloseType.people)
                    $scope.form.isPeopleOpened = false;
                if (skipClose != skipCloseType.cabinClass)
                    $scope.form.isCabinClassOpened = false;
            }

            $scope.form.peoplePopupClick = function ($event) {
                preventBubbling($event);
                $scope.form.isPeopleOpened = !$scope.form.isPeopleOpened;
            }

            $scope.countPlus = function (value) {
                value = parseInt(value, 10);
                var value = value + 1;
                if (value > 6)
                    value = 6;
                return value;
            }
            $scope.countMinus = function (value) {
                value = parseInt(value, 10);
                var value = value - 1;
                if (value < 0)
                    value = 0;
                return value;
            }

            $scope.getAppPeopleCount = function () {
                return parseInt($scope.criteria.AdultCount, 10) + parseInt($scope.criteria.ChildCount, 10) + parseInt($scope.criteria.InfantsCount, 10);
            }

            $scope.getSelectedCabinClassName = function () {
                var res = _.find($scope.cabinClassList, function (item) { return item.value == $scope.criteria.CabinClass; });
                if (res != null)
                    return res.name;
                return '';
            }

            $scope.cabinClassListClick = function ($event) {
                preventBubbling($event);
                $scope.form.isCabinClassOpened = !$scope.form.isCabinClassOpened;
            }

            $scope.cabinClassClick = function (item, $event) {
                preventBubbling($event);
                $scope.criteria.CabinClass = item.value;
                closeAllPopups();
            }

            $scope.pathTypeClick = function (val) {
                $scope.criteria.PathType = val;
            }
        }]);
