
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaSearchMainCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$location', 'dataService', 'cache',
        function AviaSearchMainCtrl($log, $scope, $rootScope, $routeParams, $filter, $location, dataService, cache) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //пишем в лог раз в 300мс
            var logCriteriaData = _.debounce(function () {
                log('criteria: ' + angular.toJson($scope.criteria));
            }, 300);

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //значения по-умобчанию
            var defaultCriteria = getDefaultCriteria();
            //добавляем в кэш откуда, куда
            //addDefaultFromToDirectionsToCache(defaultCriteria);
            //списки по-умолчанию
            $scope.adultCountList = [1, 2, 3, 4, 5, 6];
            $scope.childCountList = [0, 1, 2, 3, 4, 5, 6];
            $scope.cabinClassList = [{ name: 'Эконом', value: 0 }, { name: 'Бизнес', value: 1 }];
            
            //критерии из урла
            var routeCriteria = new aviaCriteria(UrlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.criteria = routeCriteria;
            //начальные условия поиска, если из урла ничего не пришло
            _.defaults($scope.criteria, defaultCriteria);
            logCriteriaData();

            //по url вытягиваем Id и name для города, региона и т.д.
            setFromAndToFieldsFromUrl();

            //при изменении полей формы - обновляем url
            //сейчас есть баг - если урл #/avia/ и начинаем вводить что-нить в поле откуда - то ввод срывает
            //т.к. срабатывает смена модели и меняется урл, и происходит перезагрузка страницы
            //$scope.$watch('criteria', function (newValue, oldValue) {
            //    if (newValue === oldValue) {
            //        return;
            //    }
            //    //log('watch criteria From: ' + newValue.From);

            //    var url = UrlHelper.UrlToAviaMain(angular.copy($scope.criteria));
            //    $location.path(url);
            //}, true);

            //тут меняем урл для поиска
            $scope.searchStart = function () {
                //log('$scope.searchStart: ' + angular.toJson($scope.criteria));
                var url = UrlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
                $location.path(url);
            };

            function getDefaultCriteria() {
                //даты по-умолчанию: сегодня и +5 дней
                var now = new Date();
                var nowAdd5days = now.setDate(now.getDate() + 5);
                var f_now = $filter('date')(new Date(), 'dd.MM.yyyy');
                var f_nowAdd5days = $filter('date')(nowAdd5days, 'dd.MM.yyyy');

                return new aviaCriteria({
                    "From": "Москва", "FromId": 6733, "FromUrl": "MOW",
                    "To": "Мюнхен", "ToId": 1357, "ToUrl": "MUC",
                    "BeginDate": f_now, "EndDate": f_nowAdd5days,
                    "AdultCount": "2", "ChildCount": "0", "InfantsCount": "0", "CabinClass": "0", "IsFlexible": "0"
                });
                
            };

            //function addDefaultFromToDirectionsToCache(defaultCriteria) {
            //    //добавляем в кэш откуда
            //    var key = cacheKeys.getDirectoryByUrl(defaultCriteria.FromUrl);
            //    var cdata = new directoryCacheData(defaultCriteria.FromId, defaultCriteria.From, defaultCriteria.FromUrl);
            //    cache.put(key, cdata);

            //    //добавляем в кэш - куда
            //    key = cacheKeys.getDirectoryByUrl(defaultCriteria.ToUrl);
            //    cdata = new directoryCacheData(defaultCriteria.ToId, defaultCriteria.To, defaultCriteria.ToUrl);
            //    cache.put(key, cdata);
            //};

            function setFromAndToFieldsFromUrl() {
                if (routeCriteria.FromUrl != null && routeCriteria.FromUrl.length > 0) {
                    $scope.criteria.From = 'загружается...';
                    dataService.getDirectoryByUrl(routeCriteria.FromUrl, function (data) {
                        //обновляем данные
                        if (data != null) {
                            $scope.criteria.From = data.name;
                            $scope.criteria.FromId = data.id;
                            $scope.criteria.FromUrl = data.url;
                            logCriteriaData();
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
                            logCriteriaData();
                        }
                    }, function (data, status) {
                        //ошибка получения данных
                        log('getDirectoryByUrl error: ' + $scope.criteria.ToUrl + ' status:' + status);
                    });
                }
            };


            //поведение
            var skipCloseType = { from: 'from', to: 'to', dateFrom: 'dateFrom', dateTo: 'dateTo', people: 'people' };

            $scope.form = {};
            $scope.form.isPeopleOpened = false;

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
            }

            $scope.form.peoplePopupClick = function ($event) {
                preventBubbling($event);
                $scope.form.isPeopleOpened = !$scope.form.isPeopleOpened;
            }

            $scope.countPlus = function (value) {
                var v = parseInt(value, 10) + 1;
                if (v > 6)
                    v = 6;
                return ("" + v);
            }
            $scope.countMinus = function (value) {
                var v = parseInt(value, 10) - 1;
                if (v < 0)
                    v = 0;
                return ("" + v);
            }

            $scope.getAppPeopleCount = function () {
                return parseInt($scope.criteria.AdultCount, 10) + parseInt($scope.criteria.ChildCount, 10) + parseInt($scope.criteria.InfantsCount, 10);
            }
        }]);
