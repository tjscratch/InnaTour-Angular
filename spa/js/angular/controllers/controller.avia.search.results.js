
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaSearchResultsCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$location', 'dataService',
        function AviaSearchResultsCtrl($log, $scope, $rootScope, $routeParams, $filter, $location, dataService) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams);

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

            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            //инициализация
            initValues();
            initFuctions();
            initWatch();

            //обрабатываем параметры из url'а
            var routeCriteria = new aviaCriteria(UrlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.criteria = routeCriteria;
            //log('routeCriteria: ' + angular.toJson($scope.criteria));

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
                $scope.sortList = [
                    { name: "По рекомендованности", sort: avia.sortType.byRecommend },
                    { name: "По цене", sort: avia.sortType.byPrice },
                    { name: "По времени в пути", sort: avia.sortType.byTripTime },
                    { name: "По времени отправления ТУДА", sort: avia.sortType.byDepartureTime },
                    { name: "По времени отправления ОБРАТНО", sort: avia.sortType.byBackDepartureTime },
                    { name: "По времени прибытия ТУДА", sort: avia.sortType.byArrivalTime },
                    { name: "По времени прибытия ОБРАТНО", sort: avia.sortType.byBackArrivalTime }
                ];
                $scope.isSortListOpened = false;
                $scope.dateFormat = avia.dateFormat;
                $scope.timeFormat = avia.timeFormat;

                //флаг, когда нужно придержать обновление фильтра
                $scope.isSuspendFilterWatch = false;

            };

            function initWatch() {
                //изменение модели фильтра
                $scope.$watch('filter', function (newValue, oldValue) {
                    //if (newValue === oldValue) {
                    //    return;
                    //}
                    //log('$scope.$watch filter, scope:' + $scope);
                    applyFilterThrottled($scope);
                }, true);
            };

            function initFuctions() {
                $scope.startSearch = function () {
                    //log('$scope.startSearch');
                    dataService.startAviaSearch($scope.criteria, function (data) {
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

                $scope.applySort = function ($event, type) {
                    preventBubbling($event);
                    $scope.isSortListOpened = false;
                    //log('applySort: ' + type + ', $scope.sort:' + $scope.sort + ', $scope.reverse:' + $scope.reverse);

                    var reverse = false;
                    if ($scope.sort == type)
                        reverse = !$scope.reverse;
                    else
                        reverse = false;

                    $scope.sort = type;
                    $scope.reverse = reverse;
                };

                $scope.getCurrentSortName = function () {
                    return _.find($scope.sortList, function (item) { return item.sort == $scope.sort }).name;
                };

                $scope.isSortVisible = function (sort) {
                    return sort != $scope.sort;
                };

                $scope.getTransferCountText = function (count) {
                    switch (count) {
                        case 0: return "пересадок";
                        case 1: return "пересадка";
                        case 2: return "пересадки";
                        case 3: return "пересадки";
                        case 4: return "пересадки";
                        case 5: return "пересадок";
                        case 6: return "пересадок";
                        case 7: return "пересадок";
                        case 8: return "пересадок";
                        case 9: return "пересадок";
                        case 10: return "пересадок";
                        default: return "пересадок";
                    }
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
                    $scope.resetArrivalTime($event);
                    $scope.resetDepartureTime($event);
                    $scope.resetCompanies($event);
                };

                $scope.resetPrice = function ($event) {
                    preventBubbling($event);
                    $scope.filter.minPrice = $scope.filter.minPriceInitial;
                    $scope.filter.maxPrice = $scope.filter.maxPriceInitial;
                };

                $scope.resetTransfers = function ($event) {
                    preventBubbling($event);
                    _.each($scope.filter.TransferCountListAgg, function (item) { item.checked = true });
                };

                $scope.resetDepartureTime = function ($event) {
                    preventBubbling($event);
                    $scope.filter.minDepartureDate = $scope.filter.minDepartureDateInitial;
                    $scope.filter.maxDepartureDate = $scope.filter.maxDepartureDateInitial;
                    $scope.filter.minBackDepartureDate = $scope.filter.minBackDepartureDateInitial;
                    $scope.filter.maxBackDepartureDate = $scope.filter.maxBackDepartureDateInitial;
                };
                $scope.resetArrivalTime = function ($event) {
                    preventBubbling($event);
                    $scope.filter.minArrivalDate = $scope.filter.minArrivalDateInitial;
                    $scope.filter.maxArrivalDate = $scope.filter.maxArrivalDateInitial;
                    $scope.filter.minBackArrivalDate = $scope.filter.minBackArrivalDateInitial;
                    $scope.filter.maxBackArrivalDate = $scope.filter.maxBackArrivalDateInitial;
                };
                $scope.resetCompanies = function ($event) {
                    preventBubbling($event);
                    _.each($scope.filter.TransporterList, function (item) { item.checked = true });
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

                function dateToMillisecs(date) {
                    var res = dateHelper.apiDateToJsDate(date);
                    if (res != null)
                        return res.getTime();
                    else
                        return null;
                };

                //формат дат
                var monthEnToRus = [
                    { En: "Jan", Ru: "января" },
                    { En: "Feb", Ru: "февраля" },
                    { En: "Mar", Ru: "марта" },
                    { En: "Apr", Ru: "апреля" },
                    { En: "May", Ru: "мая" },
                    { En: "Jun", Ru: "июня" },
                    { En: "Jul", Ru: "июля" },
                    { En: "Aug", Ru: "августа" },
                    { En: "Sep", Ru: "сентября" },
                    { En: "Oct", Ru: "октября" },
                    { En: "Nov", Ru: "ноября" },
                    { En: "Dec", Ru: "декабря" }];

                var weekDaysEnToRus = [
                    { En: "Mon", Ru: "пн" },
                    { En: "Tue", Ru: "вт" },
                    { En: "Wed", Ru: "ср" },
                    { En: "Thu", Ru: "чт" },
                    { En: "Fri", Ru: "пт" },
                    { En: "Sat", Ru: "сб" },
                    { En: "Sun", Ru: "вс" }];

                function changeEnToRu(text) {
                    var dic = monthEnToRus;
                    for (var i = 0; i < dic.length; i++) {
                        var dicItem = dic[i];
                        if (text.indexOf(dicItem.En) > -1) {
                            text = text.replace(dicItem.En, dicItem.Ru);
                            break;
                        }
                    }
                    dic = weekDaysEnToRus;
                    for (var i = 0; i < dic.length; i++) {
                        var dicItem = dic[i];
                        if (text.indexOf(dicItem.En) > -1) {
                            text = text.replace(dicItem.En, dicItem.Ru);
                            break;
                        }
                    }
                    return text;
                }
                $scope.getSliderTimeFormat = function (text) {
                    text = $filter("date")(text, 'EEE HH:mm');
                    return changeEnToRu(text);
                }

                var timeFormat = "HH:mm";
                var dateFormat = "dd MMM yyyy, EEE";

                function getTimeFormat(dateText) {
                    return $filter("date")(dateText, timeFormat);
                }

                function getDateFormat(dateText) {
                    return changeEnToRu($filter("date")(dateText, dateFormat));
                }

                var manyCode = "any";
                var manyName = "any";
                //код компании
                function getTransporterCode(etapsTo) {
                    if (etapsTo != null)
                    {
                        if (etapsTo.length == 1){
                            return { name: etapsTo[0].TransporterName, code: etapsTo[0].TransporterCode };
                        }
                        else if (etapsTo.length > 1)
                        {
                            var firstCode = etapsTo[0].TransporterCode;
                            var firstName = etapsTo[0].TransporterName;
                            for (var i = 1; i < etapsTo.length; i++) {
                                if (etapsTo[i].TransporterCode != firstCode)
                                {
                                    //коды отличаются - возвращаем 
                                    return { name: manyName, code: manyCode };
                                }
                            }
                            //коды не отличаются - возвращаем код
                            return { name: firstName, code: firstCode };
                        }
                    }
                }

                //время в пути
                function getFlightTimeFormatted(time) {
                    if (time != null)
                    {
                        //вычисляем сколько полных часов
                        var h = Math.floor(time / 60);
                        var addMins = time - h * 60;
                        //return h + " ч " + addMins + " мин" + " (" + time + ")";//debug
                        if (addMins == 0)
                            return h + " ч";
                        else
                            return h + " ч " + addMins + " мин";
                    }
                    return "";
                }

                if (data != null && data.Items != null && data.Items.length > 0) {
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
                        //дополняем полями с форматированной датой и временем
                        item.DepartureTimeFormatted = getTimeFormat(item.DepartureDate);
                        item.DepartureDateFormatted = getDateFormat(item.DepartureDate);
                        item.ArrivalTimeFormatted = getTimeFormat(item.ArrivalDate);
                        item.ArrivalDateFormatted = getDateFormat(item.ArrivalDate);

                        item.BackDepartureTimeFormatted = getTimeFormat(item.BackDepartureDate);
                        item.BackDepartureDateFormatted = getDateFormat(item.BackDepartureDate);
                        item.BackArrivalTimeFormatted = getTimeFormat(item.BackArrivalDate);
                        item.BackArrivalDateFormatted = getDateFormat(item.BackArrivalDate);

                        //TransporterCode
                        var codeEtapsTo = getTransporterCode(item.EtapsTo);
                        var codeEtapsBack = getTransporterCode(item.EtapsBack);
                        item.EtapsToTransporterCodeUrl = "http://adioso.com/media/i/airlines/" + codeEtapsTo.code + ".png";
                        item.EtapsToTransporterName = codeEtapsTo.name;
                        item.EtapsBackTransporterCodeUrl = "http://adioso.com/media/i/airlines/" + codeEtapsBack.code + ".png";
                        item.EtapsBackTransporterName = codeEtapsBack.name;

                        //время в пути
                        item.TimeToFormatted = getFlightTimeFormatted(item.TimeTo);
                        item.TimeBackFormatted = getFlightTimeFormatted(item.TimeBack);

                        //авиакомпании
                        item.TransporterListText = "Разные авиакомпании";
                        if (codeEtapsTo.code != manyCode && codeEtapsBack.code != manyCode)
                        {
                            if (codeEtapsTo.code == codeEtapsBack.code)
                                item.TransporterListText = codeEtapsTo.name;
                            else
                                item.TransporterListText = codeEtapsTo.name + " / " + codeEtapsBack.name;
                        }

                        //этапы
                        if (item.EtapsTo.length > 1) {
                            item.EtapsToItems = [];
                            for (var k = 0; k < item.EtapsTo.length - 1; k++) {
                                var etap = item.EtapsTo[k];
                                var waitTime = getFlightTimeFormatted(etap.TransferWaitTime);
                                item.EtapsToItems.push({ code: etap.InCode, name: etap.InPort, waitTime: waitTime });
                            }
                        }
                        if (item.EtapsBack.length > 1) {
                            item.EtapsBackItems = [];
                            for (var k = 0; k < item.EtapsBack.length - 1; k++) {
                                var etap = item.EtapsBack[k];
                                var waitTime = getFlightTimeFormatted(etap.TransferWaitTime);
                                item.EtapsBackItems.push({ code: etap.InCode, name: etap.InPort, waitTime: waitTime });
                            }
                        }

                        list.push(item);
                    }
                    //добавляем список
                    $scope.ticketsList = list;

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
                            transferCountListAgg.push({ name: "Без пересадок", value: 0, checked: true, price: 0 });
                        }
                    }
                    else if (item.ToTransferCount >= 2 || item.BackTransferCount >= 2) {
                        //2 и более пересадок
                        item.InTransferCount2 = true;
                        if (!InTransferCount2Added) {
                            InTransferCount2Added = true;
                            transferCountListAgg.push({ name: "2 и более", value: 2, checked: true, price: 0 });
                        }
                    }
                    else if (item.ToTransferCount <= 1 && item.BackTransferCount <= 1 && item.InTransferCount0 == false)
                    {
                        //1 пересадка, но не включает в себя без пересадок
                        item.InTransferCount1 = true;
                        if (!InTransferCount1Added) {
                            InTransferCount1Added = true;
                            transferCountListAgg.push({ name: "1 пересадка", value: 1, checked: true, price: 0 });
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
                //log('updateFilter');
            };

            function applyFilter($scope) {
                var filteredList = [];
                //log('applyFilter ' + new Date());

                //список выбранных значений
                var transferCountCheckedList = _.filter($scope.filter.TransferCountListAgg, function (item) { return item.checked == true });
                //туда, флаг, что хоть что-то выбрано
                var anyTransferCountChecked = (transferCountCheckedList != null && transferCountCheckedList.length > 0);

                //выбрана хотя бы одна компания
                var anyTransporterChecked = _.any($scope.filter.TransporterList, function (item) { return item.checked == true });
                //список всех выбранных а/к
                var transporterListCheckedList = _.filter($scope.filter.TransporterList, function (item) { return item.checked == true });
                transporterListCheckedList = _.map(transporterListCheckedList, function (item) { return item.TransporterCode });

                //заодно в цикле вычисляем признак самого дешевого билета
                var minPriceItem = { item: null, price: 1000000000000000000 };
                if ($scope.ticketsList != null) {
                    for (var i = 0; i < $scope.ticketsList.length; i++) {
                        var item = $scope.ticketsList[i];
                        //признак самого дешевого
                        item.isCheapest = false;

                        //итем в массиве выбранных значений туда
                        var itemInTransferCount = _.any(transferCountCheckedList, function (toCheck) {
                            switch (toCheck.value) {
                                case 0: return item.InTransferCount0 == true;
                                case 1: return item.InTransferCount1 == true;
                                case 2: return item.InTransferCount2 == true;
                            }
                        });

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
                            //пересадки
                            && (anyTransferCountChecked && itemInTransferCount)
                            //а/к
                            && (anyTransporterChecked && itemInTransport)
                            //дата отправления / прибытия  туда / обратно
                            && (item.sort.DepartureDate >= $scope.filter.minDepartureDate && item.sort.DepartureDate <= $scope.filter.maxDepartureDate)
                            && (item.sort.ArrivalDate >= $scope.filter.minArrivalDate && item.sort.ArrivalDate <= $scope.filter.maxArrivalDate)
                            && (item.sort.BackDepartureDate >= $scope.filter.minBackDepartureDate && item.sort.BackDepartureDate <= $scope.filter.maxBackDepartureDate)
                            && (item.sort.BackArrivalDate >= $scope.filter.minBackArrivalDate && item.sort.BackArrivalDate <= $scope.filter.maxBackArrivalDate)
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
                }

                $scope.isDataLoading = false;
            };
        }]);
