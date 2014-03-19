
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaSearchResultsCtrl', ['$log', '$scope', '$routeParams', '$filter', '$location', 'dataService',
        function AviaSearchResultsCtrl($log, $scope, $routeParams, $filter, $location, dataService) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //пишем в лог раз в 300мс
            var logCriteriaData = _.debounce(function () {
                log('criteria: ' + angular.toJson($scope.criteria));
            }, 300);

            var urlDataLoaded = { fromLoaded: false, toLoaded: false };
            //начинаем поиск, после того, как подтянули все данные
            function ifDataLoadedStartSearch() {
                if (urlDataLoaded.fromLoaded == true && urlDataLoaded.toLoaded == true) {
                    //log('ifDataLoadedStartSearch start search');
                    $scope.startSearch();
                }
                else {
                    //log('ifDataLoadedStartSearch waiting');
                }
            }

            //все обновления модели - будут раз в 100 мс, чтобы все бегало шустро
            var applyFilterThrottled = _.debounce(function ($scope) {
                //log('applyFilterThrottled');
                applyFilterDelayed($scope);
            }, 100);
            var applyFilterDelayed = function ($scope) {
                //log('applyFilterDelayed: scope' + scope);
                $scope.$apply(function () { applyFilter($scope); });
            };

            //инициализация
            initValues();
            initFuctions();
            initWatch();

            //обрабатываем параметры из url'а
            var routeCriteria = new aviaCriteria(UrlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.criteria = routeCriteria;

            //запрашиваем парамерты по их Url'ам
            setFromAndToFieldsFromUrl();

            function initValues() {
                //флаг индикатор загрузки
                $scope.isDataLoading = true;

                //фильтр
                $scope.filter = new aviaFilter();

                //списки
                $scope.ticketsList = null;
                $scope.filteredTicketsList = null;
                $scope.searchId = 0;

                //сортировка - по-молчанию - по рекомендациям
                //$scope.sort = avia.sortType.ByRecommend;

                $scope.sort = avia.sortType.byRecommend;
                $scope.reverse = false;
                $scope.sortType = avia.sortType;
                $scope.dateFormat = avia.dateFormat;
                $scope.timeFormat = avia.timeFormat;

                //флаг, когда нужно придержать обновление фильтра
                $scope.isSuspendFilterWatch = false;

            };

            function initWatch() {
                //изменение модели фильтра
                $scope.$watch('filter', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    //log('$scope.$watch filter, scope:' + $scope);
                    applyFilterThrottled($scope);
                }, true);
            };

            function initFuctions() {
                $scope.startSearch = function () {
                    log('$scope.startSearch');
                    dataService.startAviaSearch(log, $scope.criteria, function (data) {
                        //обновляем данные
                        if (data != null) {
                            //log('data: ' + angular.toJson(data));
                            updateModel(data);
                        }
                    }, function (data, status) {
                        //ошибка получения данных
                        log('startSearchTours error; status:' + status);
                    });
                };

                $scope.applySort = function(type){
                    log('applySort: ' + type + ', $scope.sort:' + $scope.sort + ', $scope.reverse:' + $scope.reverse);

                    var reverse = false;
                    if ($scope.sort == type)
                        reverse = !$scope.reverse;
                    else
                        reverse = false;

                    $scope.sort = type;
                    $scope.reverse = reverse;
                };
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
                            urlDataLoaded.fromLoaded = true;
                            ifDataLoadedStartSearch();
                        }
                    }, function (data, status) {
                        //ошибка получения данных
                        log('getDirectoryByUrl error: ' + $scope.criteria.FromUrl + ' status:' + status);
                    });
                }
                else
                    urlDataLoaded.fromLoaded = true;

                if (routeCriteria.ToUrl != null && routeCriteria.ToUrl.length > 0) {
                    $scope.criteria.To = 'загружается...';
                    dataService.getDirectoryByUrl(log, routeCriteria.ToUrl, function (data) {
                        //обновляем данные
                        if (data != null) {
                            $scope.criteria.To = data.name;
                            $scope.criteria.ToId = data.id;
                            $scope.criteria.ToUrl = data.url;
                            logCriteriaData();
                            urlDataLoaded.toLoaded = true;
                            ifDataLoadedStartSearch();
                        }
                    }, function (data, status) {
                        //ошибка получения данных
                        log('getDirectoryByUrl error: ' + $scope.criteria.ToUrl + ' status:' + status);
                    });
                }
                else
                    urlDataLoaded.toLoaded = true;
            };

            function updateModel(data) {
                $scope.isDataLoading = false;
                log('updateModel');

                function dateToMillisecs(date) {
                    var res = dateHelper.apiDateToJsDate(date);
                    if (res != null)
                        return res.getTime();
                    else
                        return null;
                };

                if (data != null && data.Items != null) {
                    var list = [];
                    //нужно добавить служебные поля для сортировки по датам
                    //в этих полях дата будет в миллисекундах
                    for (var i = 0; i < data.Items.length; i++) {
                        var item = data.Items[i];
                        item.sort = {
                            DepartureDate: dateToMillisecs(item.DepartureDate),
                            ArrivalDate: dateToMillisecs(item.ArrivalDate),
                            BackDepartureDate: dateToMillisecs(item.BackDepartureDate),
                            BackArrivalDate: dateToMillisecs(item.BackArrivalDate)
                        };
                        list.push(item);
                    }
                    //добавляем список
                    $scope.ticketsList = list;

                    updateFilter(data.Items);
                }
                else
                {
                    log('updateModel - nothing to update, data is empty');
                }
            };

            function updateFilter(items) {
                var filter = {};

                //мин / макс цена
                filter.minPrice = _.min(items, function (item) { return item.Price; }).Price;
                filter.maxPrice = _.max(items, function (item) { return item.Price; }).Price;

                //получаем список кол-ва пересадок [{count:0, checked: false}, {count:1, checked: false}]
                var toList = _.map(items, function (item) { return item.ToTransferCount; });
                toList = _.uniq(toList);
                filter.ToTransferCountList = _.map(toList, function (item) {
                    return {
                        value: item,
                        checked: true
                    }
                });
                filter.ToTransferCountList = _.sortBy(filter.ToTransferCountList,
                    function (item) { return item.value; });

                //пересадки обратно
                var backList = _.map(items, function (item) { return item.BackTransferCount; });
                backList = _.uniq(backList);
                filter.BackTransferCountList = _.map(backList, function (item) {
                    return {
                        value: item,
                        checked: true
                    }
                });
                filter.BackTransferCountList = _.sortBy(filter.BackTransferCountList,
                    function (item) { return item.value; });

                //список авиа компаний
                filter.TransporterList = [];
                _.each(items, function (item) {
                    _.each(item.EtapsTo, function (etap) {
                        filter.TransporterList.push(
                            new transporter(etap.TransporterName, etap.TransporterCode, etap.TransporterLogo))
                    });
                    _.each(item.EtapsBack, function (etap) {
                        filter.TransporterList.push(
                            new transporter(etap.TransporterName, etap.TransporterCode, etap.TransporterLogo))
                    });
                });
                //находим уникальные
                filter.TransporterList = _.uniq(filter.TransporterList, false, function (item) {
                    return item.TransporterCode;
                });


                //мин / макс время отправления туда обратно
                filter.minDepartureDate = _.min(items, function (item) { return item.sort.DepartureDate; }).sort.DepartureDate;
                filter.maxDepartureDate = _.max(items, function (item) { return item.sort.DepartureDate; }).sort.DepartureDate;
                filter.minArrivalDate = _.min(items, function (item) { return item.sort.ArrivalDate; }).sort.ArrivalDate;
                filter.maxArrivalDate = _.max(items, function (item) { return item.sort.ArrivalDate; }).sort.ArrivalDate;
                filter.minBackDepartureDate = _.min(items, function (item) { return item.sort.BackDepartureDate; }).sort.BackDepartureDate;
                filter.maxBackDepartureDate = _.max(items, function (item) { return item.sort.BackDepartureDate; }).sort.BackDepartureDate;
                filter.minBackArrivalDate = _.min(items, function (item) { return item.sort.BackArrivalDate; }).sort.BackArrivalDate;
                filter.maxBackArrivalDate = _.max(items, function (item) { return item.sort.BackArrivalDate; }).sort.BackArrivalDate;

                //задаем фильтр
                $scope.filter = new aviaFilter(filter);
                //log('updateFilter ' + angular.toJson($scope.filter));
                log('updateFilter');
            };

            function applyFilter($scope) {
                var filteredList = [];

                //туда, флаг, что хоть что-то выбрано
                var anyToTransferCountChecked = _.any($scope.filter.ToTransferCountList, function (item) { return item.checked == true });
                //список выбранных значений
                var toTransferCountCheckedList = _.filter($scope.filter.ToTransferCountList, function (item) { return item.checked == true });
                toTransferCountCheckedList = _.map(toTransferCountCheckedList, function (item) { return item.value });

                //обратно
                var anyBackTransferCountChecked = _.any($scope.filter.BackTransferCountList, function (item) { return item.checked == true });
                var backTransferCountCheckedList = _.filter($scope.filter.BackTransferCountList, function (item) { return item.checked == true });
                backTransferCountCheckedList = _.map(backTransferCountCheckedList, function (item) { return item.value });

                //выбрана хотя бы одна компания
                var anyTransporterChecked = _.any($scope.filter.TransporterList, function (item) { return item.checked == true });
                //список всех выбранных а/к
                var transporterListCheckedList = _.filter($scope.filter.TransporterList, function (item) { return item.checked == true });
                transporterListCheckedList = _.map(transporterListCheckedList, function (item) { return item.TransporterCode });

                if ($scope.ticketsList != null) {
                    for (var i = 0; i < $scope.ticketsList.length; i++) {
                        var item = $scope.ticketsList[i];

                        //итем в массиве выбранных значений туда
                        var itemInToCount = (_.indexOf(toTransferCountCheckedList, item.ToTransferCount) > -1);
                        //обратно
                        var itemInBackCount = (_.indexOf(backTransferCountCheckedList, item.BackTransferCount) > -1);

                        //а/к - авиакомпании item'а входят в разрешенный список
                        var itemInTransportTo = _.all(item.EtapsTo, function (etap) {
                            return (_.indexOf(transporterListCheckedList, etap.TransporterCode) > -1);
                        });
                        var itemInTransportBack = _.all(item.EtapsBack, function (etap) {
                            return (_.indexOf(transporterListCheckedList, etap.TransporterCode) > -1);
                        });
                        var itemInTransport = (itemInTransportTo && itemInTransportBack);

                        //проверяем цену
                        if (item.Price >= $scope.filter.minPrice && item.Price <= $scope.filter.maxPrice
                            //пересадки туда
                            && (anyToTransferCountChecked && itemInToCount)
                            //пересадки обратно
                            && (anyBackTransferCountChecked && itemInBackCount)
                            //а/к
                            && (anyTransporterChecked && itemInTransport)
                            //дата отправления / прибытия  туда / обратно
                            && (item.sort.DepartureDate >= $scope.filter.minDepartureDate && item.sort.DepartureDate <= $scope.filter.maxDepartureDate)
                            && (item.sort.ArrivalDate >= $scope.filter.minArrivalDate && item.sort.ArrivalDate <= $scope.filter.maxArrivalDate)
                            && (item.sort.BackDepartureDate >= $scope.filter.minBackDepartureDate && item.sort.BackDepartureDate <= $scope.filter.maxBackDepartureDate)
                            && (item.sort.BackArrivalDate >= $scope.filter.minBackArrivalDate && item.sort.BackArrivalDate <= $scope.filter.maxBackArrivalDate)
                            )
                        {
                            filteredList.push(item);
                        }
                    }

                    $scope.filteredTicketsList = filteredList;
                }
            };
        }]);
