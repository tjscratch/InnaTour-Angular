
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaFormCtrl', ['$log', '$scope', '$rootScope', '$filter', '$location', 'dataService', 'cache', 'urlHelper',
        function AviaFormCtrl($log, $scope, $rootScope, $filter, $location, dataService, cache, urlHelper) {

            var self = this;
            function log(msg) {
                //$log.log(msg);
            }

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
            var defaultCriteria = getDefaultCriteria();
            function getDefaultCriteria() {
                //даты по-умолчанию: сегодня и +5 дней
                var now = new Date();
                var nowAdd5days = now.setDate(now.getDate() + 5);
                var f_now = $filter('date')(new Date(), 'dd.MM.yyyy');
                var f_nowAdd5days = $filter('date')(nowAdd5days, 'dd.MM.yyyy');
                //f_now = null;
                //f_nowAdd5days = null;

                return new aviaCriteria({
                    "From": "Москва", "FromId": 6733, "FromUrl": "MOW",
                    "To": "Мюнхен", "ToId": 1357, "ToUrl": "MUC",
                    "BeginDate": f_now, "EndDate": f_nowAdd5days,
                    "AdultCount": 2, "ChildCount": 0, "InfantsCount": 0, "CabinClass": 0, "IsToFlexible": 0, "IsBackFlexible": 0,
                    "PathType": 0
                });

                //return new aviaCriteria({
                //    "BeginDate": f_now, "EndDate": f_nowAdd5days,
                //    "AdultCount": 2, "ChildCount": 0, "InfantsCount": 0, "CabinClass": 0, "IsToFlexible": 0, "IsBackFlexible": 0,
                //    "PathType": 0
                //});

            };

            //добавляем в кэш откуда, куда
            //addDefaultFromToDirectionsToCache(defaultCriteria);
            //списки по-умолчанию
            $scope.adultCountList = [1, 2, 3, 4, 5, 6];
            $scope.childCountList = [0, 1, 2, 3, 4, 5, 6];
            $scope.cabinClassList = [{ name: 'Эконом', value: 0 }, { name: 'Бизнес', value: 1 }];

            $scope.pathTypeList = [{ name: 'Туда обратно', value: 0 }, { name: 'Туда', value: 1 }];

            
            //критерии из урла
            $scope.criteria = defaultCriteria;
            //logCriteriaData();
            log('AviaFormCtrl defaultCriteria: ' + angular.toJson($scope.criteria));

            //тут меняем урл для поиска
            $scope.searchStart = function () {
                if ($scope.criteria.FromId > 0 && $scope.criteria.ToId > 0) {
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
                return _.find($scope.cabinClassList, function (item) { return item.value == $scope.criteria.CabinClass; }).name;
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
