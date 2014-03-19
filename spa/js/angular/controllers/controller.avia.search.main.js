
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaSearchMainCtrl', ['$log', '$scope', '$routeParams', '$filter', '$location', 'dataService', 'cache',
        function AviaSearchMainCtrl($log, $scope, $routeParams, $filter, $location, dataService, cache) {

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
            addDefaultFromToDirectionsToCache(defaultCriteria);
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
            $scope.$watch('criteria', function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                var url = UrlHelper.UrlToAviaMain(angular.copy($scope.criteria));
                $location.path(url);
            }, true);

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

            function addDefaultFromToDirectionsToCache(defaultCriteria) {
                //добавляем в кэш откуда
                var key = cacheKeys.getDirectoryByUrl(defaultCriteria.FromUrl);
                var cdata = new directoryCacheData(defaultCriteria.FromId, defaultCriteria.From, defaultCriteria.FromUrl);
                cache.put(key, cdata);

                //добавляем в кэш - куда
                key = cacheKeys.getDirectoryByUrl(defaultCriteria.ToUrl);
                cdata = new directoryCacheData(defaultCriteria.ToId, defaultCriteria.To, defaultCriteria.ToUrl);
                cache.put(key, cdata);
            };

            function setFromAndToFieldsFromUrl() {
                if (routeCriteria.FromUrl != null && routeCriteria.FromUrl.length > 0) {
                    $scope.criteria.From = 'загружается...';
                    dataService.getDirectoryByUrl(log, routeCriteria.FromUrl, function (data) {
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
                    dataService.getDirectoryByUrl(log, routeCriteria.ToUrl, function (data) {
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
        }]);
