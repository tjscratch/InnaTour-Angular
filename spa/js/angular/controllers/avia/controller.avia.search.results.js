
/* Controllers */

innaAppControllers.
    controller('AviaSearchResultsCtrl', ['$log', '$scope', '$rootScope', '$timeout', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'eventsHelper', 'aviaHelper', 'urlHelper', 'innaApp.Urls',
        function AviaSearchResultsCtrl($log, $scope, $rootScope, $timeout, $routeParams, $filter, $location,
            dataService, paymentService, storageService, eventsHelper, aviaHelper, urlHelper, Urls) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams);

            $scope.baloon.showWithClose('Поиск рейсов', 'Подождите пожалуйста, это может занять несколько минут', function () {
                $location.path(Urls.URL_AVIA);
            });

            $scope.getSliderTimeFormat = aviaHelper.getSliderTimeFormat;
            $scope.getTransferCountText = aviaHelper.getTransferCountText;

            $scope.helper = aviaHelper;

            $scope.getLength = function () {
                var len = $scope.ticketsList != null ? $scope.ticketsList.length : 0;
                if ($scope.recomendedItem != null)
                    len++;
                return len;
            }
            $scope.getFilteredLength = function () {
                var len = $scope.filteredTicketsList != null ? $scope.filteredTicketsList.length : 0;
                if ($scope.recomendedItem != null)
                    len++;
                return len;
            }

            $scope.getNumSeatsText = function (countLeft) {
                countLeft = parseInt(countLeft);
                var ticketsCount = $scope.ticketsCount;

                switch (ticketsCount){
                    case 1:
                        {
                            if (countLeft == 1){
                                return 'Остался последний билет';
                            }
                            else if (countLeft <= 3){
                                return 'Последние ' + countLeft + ' ' + aviaHelper.pluralForm(countLeft, 'билет', 'билета', 'билетов');
                            }
                            break;
                        }
                    case 2:
                        {
                            if (countLeft <= 3) {
                                return 'Остались последние билеты';
                            }
                            else if (countLeft <= 6) {
                                return 'Последние ' + countLeft + ' ' + aviaHelper.pluralForm(countLeft, 'билет', 'билета', 'билетов');
                            }
                            break;
                        }
                    case 3:
                        {
                            if (countLeft <= 5) {
                                return 'Остались последние билеты';
                            }
                            else if (countLeft <= 9) {
                                return 'Последние ' + countLeft + ' ' + aviaHelper.pluralForm(countLeft, 'билет', 'билета', 'билетов');
                            }
                            break;
                        }
                    case 4:
                        {
                            if (countLeft <= 7) {
                                return 'Остались последние билеты';
                            }
                            else if (countLeft <= 9) {
                                return 'Последние ' + countLeft + ' ' + aviaHelper.pluralForm(countLeft, 'билет', 'билета', 'билетов');
                            }
                            break;
                        }
                    case 5:
                    case 6:
                        {
                            if (countLeft <= 9) {
                                return 'Остались последние билеты';
                            }
                            break;
                        }
                }

                return '';
            }

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

            //обрабатываем параметры из url'а
            var routeCriteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.criteria = routeCriteria;

            function getTicketsCount() {
                var infWithPlaces = parseInt($scope.criteria.InfantsCount) - parseInt($scope.criteria.AdultCount);
                if (infWithPlaces < 0) {
                    infWithPlaces = 0;
                }
                return parseInt($scope.criteria.AdultCount) + parseInt($scope.criteria.ChildCount) + infWithPlaces;
            }
            $scope.ticketsCount = getTicketsCount();

            //инициализация
            initValues();
            initFuctions();
            
            //log('routeCriteria: ' + angular.toJson($scope.criteria));

            //запрашиваем парамерты по их Url'ам
            setFromAndToFieldsFromUrl();

            function initValues() {
                //флаг индикатор загрузки
                $scope.isDataLoading = true;

                //фильтр
                $scope.filter = new aviaFilter();

                $scope.scrollControl = new scrollControl();

                //списки
                $scope.ticketsList = null;
                $scope.filteredTicketsList = null;
                $scope.visibleFilteredTicketsList = null;
                $scope.searchId = 0;

                $scope.popupItemInfo = new popupItemInfo();

                //сортировка - по-молчанию - по рекомендациям
                //$scope.sort = avia.sortType.ByRecommend;

                function sortFilter() {
                    var self = this;
                    
                    self.list = [
                    { name: "По рекомендованности", sort: avia.sortType.byRecommend },
                    { name: "По цене", sort: avia.sortType.byPrice },
                    { name: "По времени в пути", sort: avia.sortType.byTripTime },
                    { name: "По времени отправления ТУДА", sort: avia.sortType.byDepartureTime },
                    { name: "По времени отправления ОБРАТНО", sort: avia.sortType.byBackDepartureTime },
                    { name: "По времени прибытия ТУДА", sort: avia.sortType.byArrivalTime },
                    { name: "По времени прибытия ОБРАТНО", sort: avia.sortType.byBackArrivalTime }
                    ];

                    self.sortType = avia.sortType.byRecommend;
                    self.reverse = false;
                }
                $scope.SortFilter = new sortFilter();

                $scope.dateFormat = avia.dateFormat;
                $scope.timeFormat = avia.timeFormat;

                //флаг, когда нужно придержать обновление фильтра
                $scope.isSuspendFilterWatch = false;
            };

            //изменение модели фильтра
            $scope.$watch('filter', function (newValue, oldValue) {
                if ($scope.isDataLoading)
                    return;

                //if (newValue === oldValue) {
                //    return;
                //}
                //log('$scope.$watch filter, scope:' + $scope);
                applyFilterThrottled($scope);
            }, true);

            function initFuctions() {
                $scope.startSearch = function () {
                    //log('$scope.startSearch');
                    $scope.baloon.showWithClose('Поиск рейсов', 'Подождите пожалуйста, это может занять несколько минут', function () {
                        $location.path(Urls.URL_AVIA);
                    });

                    $scope.ticketsList = null;
                    $scope.filteredTicketsList = null;

                    var searchCriteria = angular.copy($scope.criteria);
                    if (searchCriteria.PathType == 1)//только туда
                    {
                        //нужно передать только дату туда
                        searchCriteria.EndDate = null;
                    }
                    dataService.startAviaSearch(searchCriteria, function (data) {
                        //обновляем данные
                        if (data != null) {
                            //log('data: ' + angular.toJson(data));
                            updateModel(data);
                        }
                        else {
                            $scope.baloon.showErr('Ничего не найдено', 'Попробуйте поискать на другие даты, направления', function () {
                                $location.path(Urls.URL_AVIA);
                            });
                        }
                    }, function (data, status) {
                        //ошибка получения данных
                        log('startSearchTours error; status:' + status);
                        $scope.baloon.showGlobalAviaErr();
                    });
                };

                $scope.getCurrentSortName = function () {
                    return _.find($scope.sortList, function (item) { return item.sort == $scope.sort }).name;
                };

                $scope.isSortVisible = function (sort) {
                    return sort != $scope.sort;
                };

                $scope.getCityFrom = function () {
                    if ($scope.ticketsList != null && $scope.ticketsList.length > 0) {
                        return $scope.ticketsList[0].CityFrom;
                    }
                    return "";
                };

                $scope.getCityTo = function () {
                    if ($scope.ticketsList != null && $scope.ticketsList.length > 0) {
                        return $scope.ticketsList[0].CityTo;
                    }
                    return "";
                };

                $scope.resetAll = function ($event) {
                    $scope.resetPrice($event);
                    $scope.resetTransfers($event);
                    //$scope.resetArrivalTime($event);
                    //$scope.resetDepartureTime($event);
                    $scope.resetTime($event);
                    $scope.resetCompanies($event);
                    $scope.resetPorts($event);
                };

                $scope.resetPrice = function ($event) {
                    eventsHelper.preventBubbling($event);
                    $scope.filter.minPrice = $scope.filter.minPriceInitial;
                    $scope.filter.maxPrice = $scope.filter.maxPriceInitial;
                };

                $scope.resetTransfers = function ($event) {
                    eventsHelper.preventBubbling($event);
                    _.each($scope.filter.TransferCountListAgg, function (item) { item.checked = false });
                };

                $scope.resetTime = function ($event) {
                    eventsHelper.preventBubbling($event);
                    _.each($scope.filter.time.list, function (item) { item.checked = false });
                }
                //$scope.resetDepartureTime = function ($event) {
                //    eventsHelper.preventBubbling($event);
                //    $scope.filter.minDepartureDate = $scope.filter.minDepartureDateInitial;
                //    $scope.filter.maxDepartureDate = $scope.filter.maxDepartureDateInitial;
                //    $scope.filter.minBackDepartureDate = $scope.filter.minBackDepartureDateInitial;
                //    $scope.filter.maxBackDepartureDate = $scope.filter.maxBackDepartureDateInitial;
                //};
                //$scope.resetArrivalTime = function ($event) {
                //    eventsHelper.preventBubbling($event);
                //    $scope.filter.minArrivalDate = $scope.filter.minArrivalDateInitial;
                //    $scope.filter.maxArrivalDate = $scope.filter.maxArrivalDateInitial;
                //    $scope.filter.minBackArrivalDate = $scope.filter.minBackArrivalDateInitial;
                //    $scope.filter.maxBackArrivalDate = $scope.filter.maxBackArrivalDateInitial;
                //};
                $scope.resetCompanies = function ($event) {
                    eventsHelper.preventBubbling($event);
                    _.each($scope.filter.TransporterList, function (item) { item.checked = false });
                };

                $scope.resetPorts = function ($event) {
                    eventsHelper.preventBubbling($event);
                    _.each($scope.filter.AirportFilter.fromPorts, function (item) { item.checked = false });
                    _.each($scope.filter.AirportFilter.toPorts, function (item) { item.checked = false });
                }

                $scope.anyChecked = function (list) {
                    return _.any(list, function (item) { return item.checked; });
                }

                $scope.goToPaymentClick = function ($event, item) {
                    eventsHelper.preventBubbling($event);

                    $scope.baloon.show('Проверка доступности билетов', 'Подождите пожалуйста, это может занять несколько минут');
                    //проверяем, что остались билеты для покупки
                    paymentService.checkAvailability({ variantTo: item.VariantId1, varianBack: item.VariantId2 },
                        function (data) {
                            //log('paymentService.checkAvailability, data: ' + angular.toJson(data));
                            if (data == "true")
                            {
                                //сохраняем в хранилище
                                storageService.setAviaBuyItem({ searchId: $scope.searchId, item: item });
                                var buyCriteria = angular.copy($scope.criteria);
                                buyCriteria.QueryId = $scope.searchId;
                                buyCriteria.VariantId1 = item.VariantId1;
                                buyCriteria.VariantId2 = item.VariantId2 != null ? item.VariantId2 : 0;

                                //log('buyCriteria: ' + angular.toJson(buyCriteria));
                                //все норм - отправляем на страницу покупки
                                var url = urlHelper.UrlToAviaTicketsReservation(buyCriteria);
                                //log('Url: ' + url);
                                $location.path(url);
                            }
                            else {
                                function noVariant() {
                                    $scope.baloon.hide();
                                    //выкидываем билет из выдачи
                                    $scope.ticketsList = _.without($scope.ticketsList, item);
                                    $scope.filteredTicketsList = _.without($scope.filteredTicketsList, item);
                                }

                                $scope.baloon.showErr('К сожалению, билеты не доступны', 'Попробуйте выбрать другие', function () {
                                    noVariant();
                                    $timeout.cancel(popupTimeout);
                                });
                                var popupTimeout = $timeout(function () {
                                    noVariant();
                                }, 3000);
                            }
                        },
                        function (data, status) {
                            //error
                            $scope.baloon.showGlobalAviaErr();
                        });
                };
            };

            function setFromAndToFieldsFromUrl() {
                if (routeCriteria.FromUrl != null && routeCriteria.FromUrl.length > 0) {
                    $scope.criteria.From = 'загружается...';
                    dataService.getDirectoryByUrl(routeCriteria.FromUrl, function (data) {
                        //обновляем данные
                        if (data != null) {
                            $scope.criteria.From = data.name;
                            $scope.criteria.FromId = data.id;
                            $scope.criteria.FromUrl = data.url;
                            //log('$scope.criteria.From: ' + angular.toJson($scope.criteria));
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
                    dataService.getDirectoryByUrl(routeCriteria.ToUrl, function (data) {
                        //обновляем данные
                        if (data != null) {
                            $scope.criteria.To = data.name;
                            $scope.criteria.ToId = data.id;
                            $scope.criteria.ToUrl = data.url;
                            //log('$scope.criteria.To: ' + angular.toJson($scope.criteria));
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
                //log('updateModel');

                if (data != null && data.Items != null && data.Items.length > 0) {
                    var list = [];
                    var recommendedList = [];
                    var recomendedItem = null;
                    
                    //id поиска
                    $scope.searchId = data.QueryId;
                    
                    //в этих полях дата будет в миллисекундах
                    for (var i = 0; i < data.Items.length; i++) {
                        var item = data.Items[i];
                        
                        //нужно добавить служебные поля для сортировки по датам и т.д.
                        aviaHelper.addCustomFields(item);

                        if (item.IsRecomendation) {
                            //recomendedItem = item;
                            recommendedList.push(item);
                        }
                        else {
                            list.push(item);
                        }
                    }

                    function getRecommended() {
                        //находим рекомендованный - первый из сортировки по рейтингу INNA.RU - по рекомендованности (по умолчанию), затем по дате/времени отправления ТУДА, затем по дате/времени отправления ОБРАТНО
                        var minDepDateTime = Number.MAX_VALUE;
                        var minBackDepDateTime = Number.MAX_VALUE;
                        var minItem = null;

                        //_.each(recommendedList, function (item) {
                        //    console.log(item);
                        //});

                        _.each(recommendedList, function (item) {
                            if (item.sort.DepartureDate < minDepDateTime && item.sort.BackDepartureDate < minBackDepDateTime) {
                                minDepDateTime = item.sort.DepartureDate;
                                minItem = item;
                            }
                        });

                        var minList = _.filter(recommendedList, function (item) { return item.sort.DepartureDate == minItem.sort.DepartureDate });
                        _.each(minList, function (item) {
                            if (item.sort.BackDepartureDate < minBackDepDateTime) {
                                minBackDepDateTime = item.sort.BackDepartureDate;
                                minItem = item;
                            }
                        });

                        //нашли минимальный
                        return minItem;
                    }
                    
                    recomendedItem = getRecommended();
                    //console.log('');
                    //console.log(recomendedItem);

                    //добавляем к списку остальные рекомендованные
                    _.each(recommendedList, function (item) {
                        if (item != recomendedItem) {
                            list.push(item);
                        }
                    });

                    //добавляем список
                    $scope.ticketsList = list;
                    $scope.recomendedItem = recomendedItem;

                    updateFilter(data.Items);
                }
                else
                {
                    $scope.ticketsList = [];
                    log('updateModel - nothing to update, data is empty');
                    $scope.isDataLoading = false;
                }
            };

            function updateFilter(items) {
                var filter = {};

                //мин / макс цена
                filter.minPrice = _.min(items, function (item) { return item.Price; }).Price;
                filter.maxPrice = _.max(items, function (item) { return item.Price; }).Price;

                //пересадки =============================================================================================

                //заполняем список фильтров по пересадкам
                var transferCountListAgg = [];
                var InTransferCount0Added = false;
                var InTransferCount1Added = false;
                var InTransferCount2Added = false;
                _.each(items, function (item) {
                    //в каждом элементе сразу вычисляем принадлежность к фильтру (для ускорения фильтрации)
                    item.InTransferCount0 = false;
                    item.InTransferCount1 = false;
                    item.InTransferCount2 = false;

                    if (item.ToTransferCount == 0 && item.BackTransferCount == 0)
                    {
                        //есть без пересадок
                        item.InTransferCount0 = true;
                        if (!InTransferCount0Added) {
                            InTransferCount0Added = true;
                            transferCountListAgg.push({ name: "Без пересадок", value: 0, checked: false, price: 0 });
                        }
                    }
                    else if (item.ToTransferCount >= 2 || item.BackTransferCount >= 2) {
                        //2 и более пересадок
                        item.InTransferCount2 = true;
                        if (!InTransferCount2Added) {
                            InTransferCount2Added = true;
                            transferCountListAgg.push({ name: "2 и более", value: 2, checked: false, price: 0 });
                        }
                    }
                    else if (item.ToTransferCount <= 1 && item.BackTransferCount <= 1 && item.InTransferCount0 == false)
                    {
                        //1 пересадка, но не включает в себя без пересадок
                        item.InTransferCount1 = true;
                        if (!InTransferCount1Added) {
                            InTransferCount1Added = true;
                            transferCountListAgg.push({ name: "1 пересадка", value: 1, checked: false, price: 0 });
                        }
                    }
                    else
                    {
                        log('Warning! item miss filter: ' + item.ToTransferCount + ' ' + item.BackTransferCount);
                    }
                    
                });

                //фильтр сразу сортируем
                filter.TransferCountListAgg = _.sortBy(transferCountListAgg, function (item) { return item.value; });

                function calcPrices(tcAgg, fnInTransferCount) {
                    //находим элементы с нужным кол-вом пересадок
                    var list = _.filter(items, function (item) {
                        return fnInTransferCount(item) == true;
                    });
                    tcAgg.price = _.min(list, function (item) { return item.Price; }).Price;
                }
                //вычисляем мин цену (рядом со значением фильтра)
                _.each(filter.TransferCountListAgg, function (tcAgg) {
                    switch(tcAgg.value)
                    {
                        case 0:
                            {
                                //находим элементы с нужным кол-вом пересадок
                                calcPrices(tcAgg, function (item) { return item.InTransferCount0; });
                                break;
                            }
                        case 1:
                            {
                                calcPrices(tcAgg, function (item) { return item.InTransferCount1; });
                                break;
                            }
                        case 2:
                            {
                                calcPrices(tcAgg, function (item) { return item.InTransferCount2; });
                                break;
                            }
                    }
                });

                //пересадки =============================================================================================

                //список авиа компаний
                filter.TransporterList = [];
                function addTransporterCodes(items) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];

                        item.transportersCodes = [];

                        for (var e = 0; e < item.EtapsTo.length; e++) {
                            var etap = item.EtapsTo[e];
                            filter.TransporterList.push(new transporter(etap.TransporterName, etap.TransporterCode, etap.TransporterLogo));
                            item.transportersCodes.push(etap.TransporterCode);
                        }

                        for (var e = 0; e < item.EtapsBack.length; e++) {
                            var etap = item.EtapsBack[e];
                            filter.TransporterList.push(new transporter(etap.TransporterName, etap.TransporterCode, etap.TransporterLogo));
                            item.transportersCodes.push(etap.TransporterCode);
                        }

                        item.transportersCodes = _.uniq(item.transportersCodes);
                    }
                }
                addTransporterCodes(items);

                //находим уникальные
                filter.TransporterList = _.uniq(filter.TransporterList, false, function (item) {
                    return item.TransporterCode;
                });

                //цены для компаний
                for (var i = 0; i < filter.TransporterList.length; i++) {
                    var tr = filter.TransporterList[i];
                    var fList = _.filter(items, function (item) { return (_.indexOf(item.transportersCodes, tr.TransporterCode) > -1) });
                    tr.price = _.min(fList, function (item) { return item.Price; }).Price;
                }

                //мин / макс время отправления туда обратно
                filter.minDepartureDate = _.min(items, function (item) { return item.sort.DepartureDate; }).sort.DepartureDate;
                filter.maxDepartureDate = _.max(items, function (item) { return item.sort.DepartureDate; }).sort.DepartureDate;
                filter.minArrivalDate = _.min(items, function (item) { return item.sort.ArrivalDate; }).sort.ArrivalDate;
                filter.maxArrivalDate = _.max(items, function (item) { return item.sort.ArrivalDate; }).sort.ArrivalDate;
                filter.minBackDepartureDate = _.min(items, function (item) { return item.sort.BackDepartureDate; }).sort.BackDepartureDate;
                filter.maxBackDepartureDate = _.max(items, function (item) { return item.sort.BackDepartureDate; }).sort.BackDepartureDate;
                filter.minBackArrivalDate = _.min(items, function (item) { return item.sort.BackArrivalDate; }).sort.BackArrivalDate;
                filter.maxBackArrivalDate = _.max(items, function (item) { return item.sort.BackArrivalDate; }).sort.BackArrivalDate;

                function timeFilter(direction, dayTime) {
                    var hoursMin = 0;
                    var hoursMax = 0;
                    var text = '';
                    switch (direction) {
                        case aviaHelper.directionType.departure: text = 'вылет туда '; break;
                        case aviaHelper.directionType.arrival: text = 'прилет туда '; break;
                        case aviaHelper.directionType.backDeparture: text = 'вылет обратно '; break;
                        case aviaHelper.directionType.backArrival: text = 'прилет обратно '; break;
                    }
                    switch (dayTime) {
                        case aviaHelper.dayTime.morning: hoursMin = 6; hoursMax = 12; text += 'утром'; break;
                        case aviaHelper.dayTime.day: hoursMin = 12; hoursMax = 18; text += 'днем'; break;
                        case aviaHelper.dayTime.evening: hoursMin = 18; hoursMax = 24; text += 'вечером'; break;
                        case aviaHelper.dayTime.night: hoursMin = 0; hoursMax = 6; text += 'ночью'; break;
                    }
                    return { direction: direction, dayTime: dayTime, hoursMin: hoursMin, hoursMax: hoursMax, name: text, checked: false };
                }

                //время
                function time() {
                    var self = this;
                    self.list = [];

                    self.list.push(new timeFilter(aviaHelper.directionType.departure, aviaHelper.dayTime.morning));
                    self.list.push(new timeFilter(aviaHelper.directionType.departure, aviaHelper.dayTime.day));
                    self.list.push(new timeFilter(aviaHelper.directionType.departure, aviaHelper.dayTime.evening));
                    self.list.push(new timeFilter(aviaHelper.directionType.departure, aviaHelper.dayTime.night));

                    self.list.push(new timeFilter(aviaHelper.directionType.arrival, aviaHelper.dayTime.morning));
                    self.list.push(new timeFilter(aviaHelper.directionType.arrival, aviaHelper.dayTime.day));
                    self.list.push(new timeFilter(aviaHelper.directionType.arrival, aviaHelper.dayTime.evening));
                    self.list.push(new timeFilter(aviaHelper.directionType.arrival, aviaHelper.dayTime.night));

                    self.list.push(new timeFilter(aviaHelper.directionType.backDeparture, aviaHelper.dayTime.morning));
                    self.list.push(new timeFilter(aviaHelper.directionType.backDeparture, aviaHelper.dayTime.day));
                    self.list.push(new timeFilter(aviaHelper.directionType.backDeparture, aviaHelper.dayTime.evening));
                    self.list.push(new timeFilter(aviaHelper.directionType.backDeparture, aviaHelper.dayTime.night));

                    self.list.push(new timeFilter(aviaHelper.directionType.backArrival, aviaHelper.dayTime.morning));
                    self.list.push(new timeFilter(aviaHelper.directionType.backArrival, aviaHelper.dayTime.day));
                    self.list.push(new timeFilter(aviaHelper.directionType.backArrival, aviaHelper.dayTime.evening));
                    self.list.push(new timeFilter(aviaHelper.directionType.backArrival, aviaHelper.dayTime.night));
                }

                filter.time = new time();

                //console.log($scope.criteria);
                //console.log(items[0]);

                //аэропорты
                function airportFilter(items) {
                    var self = this;

                    var fromPorts = [];
                    var toPorts = [];
                    _.each(items, function (item) {
                        fromPorts.push({ name: item.AirportFrom, code: item.OutCode, checked: false });
                        toPorts.push({ name: item.AirportTo, code: item.InCode, checked: false });
                    });
                    fromPorts = _.uniq(fromPorts, false, function (item) {
                        return item.code;
                    });
                    toPorts = _.uniq(toPorts, false, function (item) {
                        return item.code;
                    });
                    //цены
                    _.each(fromPorts, function (port) {
                        var fList = _.filter(items, function (item) { return item.OutCode == port.code; });
                        var price = _.min(fList, function (item) { return item.Price; }).Price;
                        port.price = price;
                    });
                    _.each(toPorts, function (port) {
                        var fList = _.filter(items, function (item) { return item.InCode == port.code; });
                        var price = _.min(fList, function (item) { return item.Price; }).Price;
                        port.price = price;
                    });

                    //заполняем фильтр
                    self.fromName = $scope.criteria.From;
                    self.toName = $scope.criteria.To;
                    self.fromPorts = fromPorts;
                    self.toPorts = toPorts;
                }

                filter.AirportFilter = new airportFilter(items);
                //console.log(filter.AirportFilter);

                //задаем фильтр
                $scope.filter = new aviaFilter(filter);
                //log('updateFilter ' + angular.toJson($scope.filter));
                //log('updateFilter');

                applyFilter($scope);
            };

            function applyFilter($scope) {
                var filteredList = [];
                //log('applyFilter ' + new Date());

                //список выбранных значений
                var transferCountCheckedList = _.filter($scope.filter.TransferCountListAgg, function (item) { return item.checked == true });
                //туда, флаг, что хоть что-то выбрано
                //var anyTransferCountChecked = (transferCountCheckedList != null && transferCountCheckedList.length > 0);
                var noTransfersCountChecked = _.all($scope.filter.TransferCountListAgg, function (item) { return item.checked == false });

                //выбрана хотя бы одна компания
                //var anyTransporterChecked = _.any($scope.filter.TransporterList, function (item) { return item.checked == true });
                var noTransporterChecked = _.all($scope.filter.TransporterList, function (item) { return item.checked == false });
                //список всех выбранных а/к
                var transporterListCheckedList = _.filter($scope.filter.TransporterList, function (item) { return item.checked == true });
                transporterListCheckedList = _.map(transporterListCheckedList, function (item) { return item.TransporterCode });

                var departureFilters = _.filter($scope.filter.time.list, function(item){ return item.checked && item.direction == aviaHelper.directionType.departure; });
                var arrivalFilters = _.filter($scope.filter.time.list, function (item) { return item.checked && item.direction == aviaHelper.directionType.arrival; });
                var backDepartureFilters = _.filter($scope.filter.time.list, function (item) { return item.checked && item.direction == aviaHelper.directionType.backDeparture; });
                var backArrivalFilters = _.filter($scope.filter.time.list, function (item) { return item.checked && item.direction == aviaHelper.directionType.backArrival; });

                function anyMatch(filtersList, hours) {
                    for (var i = 0; i < filtersList.length; i++) {
                        var filterItem = filtersList[i];
                        if (hours >= filterItem.hoursMin && hours < filterItem.hoursMax) {
                            return true;
                        }
                    }
                    return false;
                }

                function itemPassesFilterByTimeTo(item) {
                    if (anyMatch(departureFilters, item.sort.DepartureHours)) {
                        return true;
                    }
                    if (anyMatch(arrivalFilters, item.sort.ArrivalHours)) {
                        return true;
                    }
                    return false;
                }

                function itemPassesFilterByTimeBack(item) {
                    if (anyMatch(backDepartureFilters, item.sort.BackDepartureHours)) {
                        return true;
                    }
                    if (anyMatch(backArrivalFilters, item.sort.BackArrivalHours)) {
                        return true;
                    }
                    return false;
                }

                var noTimeFilterToSelected = !(_.any(departureFilters, function (item) { return item.checked; }) || _.any(arrivalFilters, function (item) { return item.checked; }));
                var noTimeFilterBackSelected = !(_.any(backDepartureFilters, function (item) { return item.checked; }) || _.any(backArrivalFilters, function (item) { return item.checked; }));

                var fromPortsFilters = _.filter($scope.filter.AirportFilter.fromPorts, function (item) { return item.checked; });
                var toPortsFilters = _.filter($scope.filter.AirportFilter.toPorts, function (item) { return item.checked; });
                var noFromPortsSelected = !(fromPortsFilters != null && fromPortsFilters.length > 0);
                var noToPortsSelected = !(toPortsFilters != null && toPortsFilters.length > 0);

                //заодно в цикле вычисляем признак самого дешевого билета
                var minPriceItem = { item: null, price: Number.MAX_VALUE };
                if ($scope.ticketsList != null) {
                    for (var i = 0; i < $scope.ticketsList.length; i++) {
                        var item = $scope.ticketsList[i];
                        //признак самого дешевого
                        item.isCheapest = false;

                        //итем в массиве выбранных значений туда  //не вычисляем, если ничего не выбрано
                        var itemInTransferCount = noTransfersCountChecked ? null : _.any(transferCountCheckedList, function (toCheck) {
                            switch (toCheck.value) {
                                case 0: return item.InTransferCount0 == true;
                                case 1: return item.InTransferCount1 == true;
                                case 2: return item.InTransferCount2 == true;
                            }
                        });

                        //а/к - авиакомпании item'а входят в разрешенный список
                        var itemInTransportTo = null;
                        var itemInTransportBack = null;
                        if (noTransporterChecked == false) {//н евыбисляем, если ничего не выбрано
                            itemInTransportTo = _.all(item.EtapsTo, function (etap) {
                                return (_.indexOf(transporterListCheckedList, etap.TransporterCode) > -1);
                            });
                            if (item.EtapsBack.length == 0) {
                                itemInTransportBack = false;
                            }
                            else {
                                itemInTransportBack = _.all(item.EtapsBack, function (etap) {
                                    return (_.indexOf(transporterListCheckedList, etap.TransporterCode) > -1);
                                });
                            }
                            
                        }
                        
                        var itemInTransport = (itemInTransportTo || itemInTransportBack);

                        var itemInFromPort = noFromPortsSelected ? null : _.any(fromPortsFilters, function (port) { return port.code == item.OutCode; });
                        var itemInToPort = noToPortsSelected ? null : _.any(toPortsFilters, function (port) { return port.code == item.InCode; });

                        //проверяем цену
                        if (item.Price >= $scope.filter.minPrice && item.Price <= $scope.filter.maxPrice
                            //пересадки
                            //&& (noTransfersCountChecked || (anyTransferCountChecked && itemInTransferCount))
                            && (noTransfersCountChecked || itemInTransferCount)
                            //а/к
                            //&& (noTransporterChecked || (anyTransporterChecked && itemInTransport))
                            && (noTransporterChecked || itemInTransport)
                            ////дата отправления / прибытия  туда / обратно
                            //&& (item.sort.DepartureDate >= $scope.filter.minDepartureDate && item.sort.DepartureDate <= $scope.filter.maxDepartureDate)
                            //&& (item.sort.ArrivalDate >= $scope.filter.minArrivalDate && item.sort.ArrivalDate <= $scope.filter.maxArrivalDate)
                            //&& (item.sort.BackDepartureDate >= $scope.filter.minBackDepartureDate && item.sort.BackDepartureDate <= $scope.filter.maxBackDepartureDate)
                            //&& (item.sort.BackArrivalDate >= $scope.filter.minBackArrivalDate && item.sort.BackArrivalDate <= $scope.filter.maxBackArrivalDate)

                            && (noTimeFilterToSelected || itemPassesFilterByTimeTo(item))
                            && (noTimeFilterBackSelected || itemPassesFilterByTimeBack(item))

                            && (noFromPortsSelected || itemInFromPort)
                            && (noToPortsSelected || itemInToPort)

                            )
                        {
                            //вычисляем самый дешевый
                            if (item.Price < minPriceItem.price)
                            {
                                minPriceItem.item = item;
                                minPriceItem.price = item.Price;
                            }

                            filteredList.push(item);
                        }
                    }

                    //присваиваем признак самого дешевого билета
                    if (minPriceItem.item != null)
                    {
                        minPriceItem.item.isCheapest = true;
                    }
                    $scope.filteredTicketsList = filteredList;

                    applySort();
                }

                $scope.isDataLoading = false;
                $scope.baloon.hide();
            };

            function applySort() {
                $scope.filteredTicketsList = $filter('orderBy')($scope.filteredTicketsList, $scope.SortFilter.sortType, $scope.SortFilter.reverse);
                $scope.scrollControl.init();
            }

            $scope.$watch('SortFilter', function () {
                applySort();
            }, true);

            function popupItemInfo() {
                var self = this;
                self.isShow = false;
                self.item = null;

                self.ticketsCount = $scope.ticketsCount

                var cabinClass = parseInt($scope.criteria.CabinClass);
                self.ticketsClass = aviaHelper.getCabinClassName(cabinClass).toLowerCase();

                self.show = function ($event, item) {
                    eventsHelper.preventBubbling($event);
                    self.isShow = true;
                    self.item = item;
                    console.log(item);
                }

                self.print = function ($event, item) {
                    eventsHelper.preventBubbling($event);
                    alert('Не реализовано');
                }
                self.getLink = function ($event, item) {
                    eventsHelper.preventBubbling($event);
                    alert('Не реализовано');
                }
                self.share = function ($event, item) {
                    eventsHelper.preventBubbling($event);
                    alert('Не реализовано');
                }
            }

            function scrollControl() {
                var self = this;
                self.MAX_VISIBLE_ITEMS = 5;
                self.lastScrollOffset = 0;

                self.init = function () {
                    self.lastScrollOffset = 0;
                    if ($scope.filteredTicketsList != null && $scope.filteredTicketsList.length >= self.MAX_VISIBLE_ITEMS) {
                        $scope.visibleFilteredTicketsList = $scope.filteredTicketsList.slice(0, self.MAX_VISIBLE_ITEMS);
                    }
                    else {
                        $scope.visibleFilteredTicketsList = $scope.filteredTicketsList;
                    }

                    //console.log('visible: ' + ($scope.visibleFilteredTicketsList != null ? $scope.visibleFilteredTicketsList.length : 'null'));
                }

                self.loadMore = function () {
                    $scope.$apply(function ($scope) {
                        var fromIndex = $scope.visibleFilteredTicketsList.length;
                        var toIndex = fromIndex + self.MAX_VISIBLE_ITEMS;
                        if (toIndex > $scope.filteredTicketsList.length) {
                            toIndex = $scope.filteredTicketsList.length;
                        }
                        if (fromIndex < toIndex) {
                            for (var i = fromIndex; i < toIndex; i++) {
                                $scope.visibleFilteredTicketsList.push($scope.filteredTicketsList[i]);
                            }
                        }

                    });

                    //console.log('visible: ' + ($scope.visibleFilteredTicketsList != null ? $scope.visibleFilteredTicketsList.length : 'null'));
                }

                $(window).scroll(function () {
                    var scrollTop = $(window).scrollTop();
                    if (scrollTop + $(window).height() > $(document).height() - 300 &&
                        scrollTop > $scope.scrollControl.lastScrollOffset) {
                        $scope.scrollControl.lastScrollOffset = scrollTop;
                        $scope.scrollControl.loadMore();
                    }
                });
            }
        }]);