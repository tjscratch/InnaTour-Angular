/* Controllers */
innaAppControllers.controller('AviaSearchResultsCtrl', [
    '$log',
    '$scope',
    '$rootScope',
    '$templateCache',
    '$timeout',
    '$routeParams',
    '$filter',
    '$location',
    'dataService',
    'paymentService',
    'storageService',
    'eventsHelper',
    'aviaHelper',
    'urlHelper',
    'innaApp.Urls',
    'innaAppApiEvents',
    
    // components
    'PriceGeneric',
    function ($log, $scope, $rootScope, $templateCache, $timeout, $routeParams, $filter, $location, dataService, paymentService, storageService, eventsHelper, aviaHelper, urlHelper, Urls, Events, PriceGeneric) {
        
        var self = this;
        // var header = document.querySelector('.header');
        // var headerHeight = header.clientHeight;
        var filters__body = document.querySelector('.js-filter-scroll');
        $scope.location = document.location.href;
        
        $scope.usePricePerPerson = false;
        $scope.personsCount = parseInt($routeParams.AdultCount) + parseInt($routeParams.ChildCount) + parseInt($routeParams.InfantsCount);
        //$scope.ticketsCount - кол-во билетов
        
        function log(msg) {
            $log.log(msg);
        }
        
        $scope.isAgency = function () {
            return ($scope.$root.user != null && $scope.$root.user.isAgency());
        };
        
        if ($rootScope.$root.user) {
            $scope.AgencyType = $rootScope.$root.user.getAgencyType();
        }
        
        $scope.isShowShare = true;
        
        $scope.$on('avia.form.loaded', function (event) {
            //console.log('avia.form.loaded');
            $rootScope.$broadcast("avia.page.loaded", $routeParams);
        });
        
        $rootScope.$broadcast("avia.page.loaded", $routeParams);
        
        $scope.$on('avia.search.start', function (event) {
            //console.log('trigger avia.search.start');
            startLoadAndInit();
        });
        
        //$rootScope.$on(Events.AUTH_SIGN_IN, function (event, data) {
        //    console.log('Events.AUTH_SIGN_IN, type: %d', data.Type);
        //    if ($location.path().startsWith(Urls.URL_AVIA_SEARCH) && data != null && data.Type == 2) {
        //        $scope.safeApply(function () {
        //            //если залогинен и b2b (Type = 2)
        //            //запускаем поиск
        //            startLoadAndInit();
        //        });
        //    }
        //});
        
        //$rootScope.$on(Events.AUTH_SIGN_OUT, function (event, data) {
        //    console.log('Events.AUTH_SIGN_OUT, type: %d', data.raw.Type);
        //    if ($location.path().startsWith(Urls.URL_AVIA_SEARCH) && data != null && data.Type == 2) {
        //        $scope.safeApply(function () {
        //            //если залогинен и b2b (Type = 2)
        //            //запускаем поиск
        //            startLoadAndInit();
        
        //            //перерисовываем
        //            //$scope.ractiveControl.reset();
        //        });
        //    }
        //});
        
        $scope.getSliderTimeFormat = aviaHelper.getSliderTimeFormat;
        
        $scope.helper = aviaHelper;
        
        /**
         * begin
         * попап с описание тарифа
         */
        $scope.tarifs = new $scope.helper.tarifs();
        $scope.showTarif = function ($event, aviaInfo) {
            $scope.tarifs.fillInfo(aviaInfo);
            paymentService.getTarifs({
                    variantTo: aviaInfo.VariantId1,
                    varianBack: aviaInfo.VariantId2
                },
                function (data) {
                    $scope.tarifs.tarifsData = data;
                    $scope.tarifs.show($event);
                },
                function (data, status) {
                    log('paymentService.getTarifs error');
                });
        };
        /**
         * end
         * попап с описание тарифа
         */

        $scope.gtmDetailsAviaInSearch = function () {
            var dataLayerObj = {
                'event': 'UM.Event',
                'Data': {
                    'Category': 'Avia',
                    'Action': 'DetailsAviaInSearch',
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
        };

        $scope.gtmAviaBuySearch = function (type) {
            var dataLayerObj = {
                'event': 'UM.Event',
                'Data': {
                    'Category': 'Avia',
                    'Action': 'AviaBuySearch',
                    'Label': '[no data]',
                    'Content': type ? type : '[no data]',
                    'Context': '[no data]',
                    'Text': '[no data]'
                }
            };
            console.table(dataLayerObj);
            if (window.dataLayer) {
                window.dataLayer.push(dataLayerObj);
            }
        };
        
        $scope.recommendedClick = function () {
            $location.url(Urls.URL_DYNAMIC_PACKAGES);
        };
        
        $scope.getLength = function () {
            var len = $scope.ticketsList != null ? $scope.ticketsList.length : 0;
            //if ($scope.recomendedItem != null)
            //    len++;
            return len;
        };
        
        $scope.getFilteredLength = function () {
            var len = $scope.filteredTicketsList != null ? $scope.filteredTicketsList.length : 0;
            //if ($scope.recomendedItem != null)
            //    len++;
            return len;
        };
        
        //начинаем поиск, после того, как подтянули все данные
        function ifDataLoadedStartSearch() {
            $scope.startSearch();
        }
        
        //все обновления модели - будут раз в 100 мс, чтобы все бегало шустро
        var applyFilterThrottled = _.debounce(function ($scope) {
            //log('applyFilterThrottled');
            applyFilterDelayed($scope);
        }, 100);
        
        var applyFilterDelayed = function ($scope) {
            //log('applyFilterDelayed: scope' + scope);
            $scope.$apply(function () {
                applyFilter($scope);
            });
        };
        
        //обрабатываем параметры из url'а
        var routeCriteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
        $scope.criteria = routeCriteria;
        
        $scope.ticketsCount = aviaHelper.getTicketsCount($scope.criteria.AdultCount, $scope.criteria.ChildCount, $scope.criteria.InfantsCount);
        
        //инициализация
        initValues();
        initFuctions();
        
        //log('routeCriteria: ' + angular.toJson($scope.criteria));
        
        var loader = new utils.loader();
        //запрашиваем парамерты по их Url'ам
        function startLoadAndInit() {
            
            //console.log('startLoadAndInit');
            $scope.baloon.showWithCancel('Ищем варианты', 'Поиск займет не более 30 секунд', function () {
                dataService.cancelAviaSearch();
                
                //аналитика - прерывание поиска
                track.aviaSearchInterrupted();
                var dataLayerObj = {
                    'event': 'UM.Event',
                    'Data': {
                        'Category': 'Avia',
                        'Action': 'AbortSearch',
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
                $location.path(Urls.URL_AVIA);
            });
            
            var dataLayerObj = {
                'event': 'UI.PageView',
                'Data': {
                    'PageType': 'AviaSearchLoading',
                    'CityFrom': $scope.criteria.FromUrl,
                    'CityTo': $scope.criteria.ToUrl,
                    'DateFrom': dateHelper.ddmmyyyy2yyyymmdd($scope.criteria.BeginDate),
                    'DateTo': $scope.criteria.EndDate ? dateHelper.ddmmyyyy2yyyymmdd($scope.criteria.EndDate) : null,
                    'Travelers': $scope.criteria.AdultCount + '-' + $scope.criteria.ChildCount + '-' + $scope.criteria.InfantsCount,
                    'TotalTravelers': parseInt($scope.criteria.AdultCount) +
                    parseInt($scope.criteria.ChildCount) +
                    parseInt($scope.criteria.InfantsCount),
                    'ServiceClass': $scope.criteria.CabinClass == 0 ? 'Economy' : 'Business'
                }
            };
            console.table(dataLayerObj);
            if (window.dataLayer) {
                window.dataLayer.push(dataLayerObj);
            }
            
            loader.init([setFromFieldsFromUrl, setToFieldsFromUrl], ifDataLoadedStartSearch).run();
        }
        
        startLoadAndInit();
        
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
            
            $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $scope.criteria.CabinClass);
            
            //сортировка - по-молчанию - по рекомендациям
            //$scope.sort = avia.sortType.ByRecommend;
            
            function sortFilter() {
                var self = this;
                
                self.list = [
                    {name: "По цене", sort: avia.sortType.byPrice},
                    {name: "По рейтингу", sort: avia.sortType.byRecommend},
                    {name: "По времени в пути", sort: avia.sortType.byTripTime},
                    {name: "По времени отправления ТУДА", sort: avia.sortType.byDepartureTime},
                    {name: "По времени отправления ОБРАТНО", sort: avia.sortType.byBackDepartureTime},
                    {name: "По времени прибытия ТУДА", sort: avia.sortType.byArrivalTime},
                    {name: "По времени прибытия ОБРАТНО", sort: avia.sortType.byBackArrivalTime}
                ];
                
                if ($scope.isAgency()) {
                    if ($rootScope.$root.user) {
                        if ($rootScope.$root.user.getAgencyType() != 1) {
                            self.list.push({name: "По доходности", sort: avia.sortType.byAgencyProfit});
                            //self.sortType = avia.sortType.byAgencyProfit;
                        }
                    }
                    self.sortType = avia.sortType.byPrice;
                }
                else {
                    self.sortType = avia.sortType.byPrice;
                }
                self.reverse = false;
            }
            
            $scope.SortFilter = new sortFilter();
            
            $scope.dateFormat = avia.dateFormat;
            $scope.timeFormat = avia.timeFormat;
            
            //флаг, когда нужно придержать обновление фильтра
            $scope.isSuspendFilterWatch = false;
        }
        
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
                
                $scope.ticketsList = null;
                $scope.filteredTicketsList = null;
                
                var searchCriteria = angular.copy($scope.criteria);
                
                if (searchCriteria.PathType == 1) { //только туда
                    //нужно передать только дату туда
                    searchCriteria.EndDate = null;
                }
                
                dataService.startAviaSearch(searchCriteria, function (data) {
                    $scope.safeApply(function () {
                        //обновляем данные
                        updateModel(data);
                    });

                    var minPrice = Number.MAX_VALUE;

                    data.Items.forEach(function (item) {
                        if(item.Price < minPrice) {
                            minPrice = item.Price;
                        }
                    });

                    var dataLayerObj = {
                        'event': 'UM.PageView',
                        'Data': {
                            'PageType': 'AviaSearchLoad',
                            'CityFrom': $scope.criteria.FromUrl,
                            'CityTo': $scope.criteria.ToUrl,
                            'DateFrom': dateHelper.ddmmyyyy2yyyymmdd($scope.criteria.BeginDate),
                            'DateTo': $scope.criteria.EndDate ? dateHelper.ddmmyyyy2yyyymmdd($scope.criteria.EndDate) : null,
                            'Travelers': $scope.criteria.AdultCount + '-' + $scope.criteria.ChildCount + '-' + $scope.criteria.InfantsCount,
                            'TotalTravelers': parseInt($scope.criteria.AdultCount) +
                            parseInt($scope.criteria.ChildCount) +
                            parseInt($scope.criteria.InfantsCount),
                            'ServiceClass': $scope.criteria.CabinClass == 0 ? 'Economy' : 'Business',
                            'MinPrice': minPrice,
                            'AviaResultsQuantity': data.Items.length - 1
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }

                }, function (data, status) {
                    $scope.safeApply(function () {
                        //ошибка получения данных
                        log('startSearchTours error; status:' + status);
                        $scope.baloon.showGlobalAviaErr();
                    });
                });
            };
            
            $scope.getCurrentSortName = function () {
                return _.find($scope.sortList, function (item) {
                    return item.sort == $scope.sort
                }).name;
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
                $scope.resetBagages($event);
            };
            
            $scope.resetPrice = function ($event) {
                eventsHelper.preventBubbling($event);
                $scope.filter.minPrice = $scope.filter.minPriceInitial;
                $scope.filter.maxPrice = $scope.filter.maxPriceInitial;
            };
            
            $scope.resetTransfers = function ($event) {
                eventsHelper.preventBubbling($event);
                _.each($scope.filter.TransferCountListAgg, function (item) {
                    item.checked = false
                });
            };
            
            $scope.resetTime = function ($event) {
                eventsHelper.preventBubbling($event);
                _.each($scope.filter.time.list, function (item) {
                    item.checked = false
                });
            };
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
                _.each($scope.filter.TransporterList, function (item) {
                    item.checked = false
                });
            };
            
            $scope.resetPorts = function ($event) {
                eventsHelper.preventBubbling($event);
                _.each($scope.filter.AirportFilter.fromPorts, function (item) {
                    item.checked = false
                });
                _.each($scope.filter.AirportFilter.toPorts, function (item) {
                    item.checked = false
                });
            };
            
            $scope.resetBagages = function ($event) {
                eventsHelper.preventBubbling($event);
                _.each($scope.filter.BaggageFilter.list, function (item) {
                    item.checked = false
                });
            };
            
            $scope.anyChecked = function (list) {
                return _.any(list, function (item) {
                    return item.checked;
                });
            };
            
            $scope.goToPaymentClick = function ($event, item) {
                eventsHelper.preventBubbling($event);
                
                $scope.baloon.showExpireCheck();
                //проверяем, что остались билеты для покупки
                paymentService.checkAvailability({variantTo: item.VariantId1, varianBack: item.VariantId2},
                    function (data) {
                        $scope.safeApply(function () {
                            //log('paymentService.checkAvailability, data: ' + angular.toJson(data));
                            if (data == true) {
                                //сохраняем в хранилище
                                storageService.setAviaBuyItem({searchId: $scope.searchId, item: item});
                                var buyCriteria = angular.copy($scope.criteria);
                                buyCriteria.QueryId = $scope.searchId;
                                buyCriteria.VariantId1 = item.VariantId1;
                                buyCriteria.VariantId2 = item.VariantId2 != null ? item.VariantId2 : 0;
                                
                                //аналитика
                                track.aviaChooseVariant();
                                
                                //log('buyCriteria: ' + angular.toJson(buyCriteria));
                                //все норм - отправляем на страницу покупки
                                var url = urlHelper.UrlToAviaTicketsReservation(buyCriteria);
                                //log('Url: ' + url);
                                $location.url(url);
                            }
                            else {
                                function noVariant() {
                                    $scope.baloon.hide();
                                    //выкидываем билет из выдачи
                                    $scope.ticketsList = _.without($scope.ticketsList, item);
                                    $scope.filteredTicketsList = _.without($scope.filteredTicketsList, item);
                                }
                                
                                //аналитика - Ошибка проверки доступности
                                track.aviaIsAvailableError();
                                
                                $scope.baloon.showErr('К сожалению, билеты не доступны', 'Попробуйте выбрать другие', function () {
                                    noVariant();
                                    $timeout.cancel(popupTimeout);
                                });
                                var popupTimeout = $timeout(function () {
                                    noVariant();
                                }, 3000);
                            }
                        });
                    },
                    function (data, status) {
                        //аналитика - Ошибка проверки доступности
                        track.aviaIsAvailableError();
                        
                        $scope.safeApply(function () {
                            //error
                            $scope.baloon.showGlobalAviaErr();
                        });
                    });
            };
        }
        
        function setFromFieldsFromUrl() {
            var self = this;
            if (routeCriteria.FromUrl != null && routeCriteria.FromUrl.length > 0) {
                //$scope.criteria.From = 'загружается...';
                dataService.getDirectoryByUrl(routeCriteria.FromUrl, function (data) {
                    $scope.safeApply(function () {
                        //обновляем данные
                        if (data != null) {
                            $scope.criteria.From = data.name;
                            $scope.criteria.FromId = data.id;
                            $scope.criteria.FromUrl = data.url;
                            //log('$scope.criteria.From: ' + angular.toJson($scope.criteria));
                            loader.complete(self);
                        }
                    });
                }, function (data, status) {
                    //ошибка получения данных
                    log('getDirectoryByUrl error: ' + $scope.criteria.FromUrl + ' status:' + status);
                });
            }
        }
        
        function setToFieldsFromUrl() {
            var self = this;
            if (routeCriteria.ToUrl != null && routeCriteria.ToUrl.length > 0) {
                //$scope.criteria.To = 'загружается...';
                dataService.getDirectoryByUrl(routeCriteria.ToUrl, function (data) {
                    $scope.$apply(function ($scope) {
                        //обновляем данные
                        if (data != null) {
                            $scope.criteria.To = data.name;
                            $scope.criteria.ToId = data.id;
                            $scope.criteria.ToUrl = data.url;
                            //log('$scope.criteria.To: ' + angular.toJson($scope.criteria));
                            loader.complete(self);
                        }
                    });
                }, function (data, status) {
                    //ошибка получения данных
                    log('getDirectoryByUrl error: ' + $scope.criteria.ToUrl + ' status:' + status);
                });
            }
        }
        
        function updateModel(data) {
            //log('updateModel');
            //console.log(data, 'sdhfjsgdfj');
            
            var list = [];
            var recommendedList = [];
            var recomendedItem = null;
            
            if (data && data.Items && data.Items.length > 0) {
                //аналитика - успешные результаты
                var trackKey = $location.url();
                if (track.isTrackSuccessResultAllowed(track.aviaKey, trackKey)) {
                    track.successResultsAvia(track.aviaKey);
                    //console.log('analitics: success result');
                    track.denyTrackSuccessResult(track.aviaKey, trackKey);
                }
                
                //id поиска
                $scope.searchId = data.QueryId;
                
                //в этих полях дата будет в миллисекундах
                data.Items.forEach(function (item) {
                    //item.PriceDetails.Profit = profit++;
                    
                    //нужно добавить служебные поля для сортировки по датам и т.д.
                    aviaHelper.addCustomFields(item);
                    
                    function addTooltipData(item) {
                        item.PriceDetailsTooltipData = [];
                        //console.log(item.PriceDetails);
                        // объект PriceObject не приходит, пока обрал его из условия
                        //if (item.PriceObject != null && item.PriceDetails != null) {
                        if (item.PriceDetails != null) {
                            
                            //item.PriceDetailsTooltipData.push({ name: 'Сбор ИННА ТУР', price: item.PriceObject.TotalInnaProfit });
                            //item.PriceDetailsTooltipData.push({ name: 'Сбор агента', price: item.PriceObject.TotalAgentReward });
                            //item.PriceDetailsTooltipData.push({ name: 'Агентское вознаграждение', price: item.PriceObject.TotalAgentRate });
                            
                            item.PriceDetailsTooltipData.push({
                                name: 'Цена билета взр.',
                                price: item.PriceDetails.SysAdtPrice
                            });
                            item.PriceDetailsTooltipData.push({
                                name: 'Сервисный сбор взр.',
                                price: item.PriceDetails.AdultServiceCharge
                            });
                            
                            if ($scope.criteria.ChildCount > 0) {
                                item.PriceDetailsTooltipData.push({
                                    name: 'Цена билета дет.',
                                    price: item.PriceDetails.SysChdPrice
                                });
                                item.PriceDetailsTooltipData.push({
                                    name: 'Сервисный сбор дет.',
                                    price: item.PriceDetails.ChildServiceCharge
                                });
                            }
                            
                            if ($scope.criteria.InfantsCount > 0) {
                                item.PriceDetailsTooltipData.push({
                                    name: 'Цена билета инф.',
                                    price: item.PriceDetails.SysInfPrice
                                });
                                item.PriceDetailsTooltipData.push({
                                    name: 'Сервисный сбор инф.',
                                    price: item.PriceDetails.InfantServiceCharge
                                });
                            }
                            
                            item.PriceDetailsTooltipData.push({
                                name: 'Цена билетов',
                                price: item.PriceDetails.Price
                            });
                            item.PriceDetailsTooltipData.push({
                                name: 'Сервисный сбор',
                                price: item.PriceDetails.ServiceCharge
                            });
                            item.PriceDetailsTooltipData.push({name: 'Доход', price: item.PriceDetails.Profit});
                        }
                    }
                    
                    addTooltipData(item);
                    
                    //нормализуем пересадки
                    if (item.ToTransferCount < 0)
                        item.ToTransferCount = 0;
                    if (item.BackTransferCount < 0)
                        item.BackTransferCount = 0;
                    
                    if (item.IsRecomendation) {
                        //recomendedItem = item;
                        recommendedList.push(item);
                    }
                    else {
                        list.push(item);
                    }
                });
                
                function getRecommended() {
                    //находим рекомендованный - первый из сортировки по рейтингу INNA.RU - по рекомендованности (по умолчанию), затем по дате/времени отправления ТУДА, затем по дате/времени отправления ОБРАТНО
                    var min = {item: null, factor: Number.MAX_VALUE};
                    
                    
                    recommendedList.forEach(function (item) {
                        if (item.RecommendedFactor < min.factor) {
                            min.item = item;
                            min.factor = item.RecommendedFactor;
                        }
                    });
                    
                    //нашли минимальный
                    return min.item;
                }
                
                recomendedItem = getRecommended();
                //console.log('');
                //console.log(recomendedItem);
                
                //добавляем к списку остальные рекомендованные
                
                recommendedList.forEach(function (item) {
                    if (item != recomendedItem) {
                        list.push(item);
                    }
                });
                
                //ToDo: debug
                //размножаем данные для теста
                //for (var i = 0; i < 10; i++) {
                //    list = list.concat(list);
                //}
                //list = [list[0], list[1]];
                //list = [list[0]];
                //list = [];
                
                //добавляем список
                $scope.ticketsList = list;
                $scope.recomendedItem = recomendedItem;
                
                /* PriceGeneric */
                $timeout(function () {
                    $scope._priceGeneric = new PriceGeneric({
                        el: $('.js-results-list-recomended .js-price-generic-container'),
                        data: {
                            PriceDetailsTooltipData: $scope.recomendedItem.PriceDetailsTooltipData
                        }
                    })
                }, 0)
                
                updateFilter(data.Items);
                
                processSelectedVariant(data.Items);
            }
            else {
                $scope.ticketsList = [];
                log('updateModel - nothing to update, data is empty');
                //аналитика
                track.noResultsAvia();
                $scope.baloon.showNotFound(null, null, function () {
                    $location.path(Urls.URL_AVIA);
                });
                $scope.isDataLoading = false;
            }
        }
        
        function processSelectedVariant(items) {
            //Debug
            //items[0].isSelectedVariant = true;
            if ($scope.criteria && $scope.criteria.VariantId1 != null || $scope.criteria.VariantId2 != null) {
                var selectedItem = _.find(items, function (item) {
                    //флаг, отдается с сервера - выбранный вариант
                    if (item.isSelectedVariant == true) {
                        return true;
                    }
                });
                
                if (selectedItem) {
                    $scope.popupItemInfo_show(null, selectedItem, $scope.criteria, $scope.searchId);
                }
            }
        }
        
        function updateFilter(items) {
            var filter = {};
            
            //мин / макс цена
            filter.minPrice = _.min(items, function (item) {
                return item.Price;
            }).Price;
            filter.maxPrice = _.max(items, function (item) {
                return item.Price;
            }).Price;
            
            //цена за человека
            if ($scope.usePricePerPerson) {
                filter.minPrice = Math.round(filter.minPrice / $scope.personsCount);
                filter.maxPrice = Math.round(filter.maxPrice / $scope.personsCount);
            }
            
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
                
                //console.log('item.ToTransferCount', item.ToTransferCount, 'item.BackTransferCount', item.BackTransferCount);
                
                if (item.ToTransferCount == 0 && item.BackTransferCount == 0) {
                    //есть без пересадок
                    item.InTransferCount0 = true;
                    if (!InTransferCount0Added) {
                        InTransferCount0Added = true;
                        transferCountListAgg.push({name: "Без пересадок", value: 0, checked: false, price: 0});
                    }
                }
                else if (item.ToTransferCount >= 2 || item.BackTransferCount >= 2) {
                    //2 и более пересадок
                    item.InTransferCount2 = true;
                    if (!InTransferCount2Added) {
                        InTransferCount2Added = true;
                        transferCountListAgg.push({
                            name: "2 и более пересадки",
                            value: 2,
                            checked: false,
                            price: 0
                        });
                    }
                }
                else if (item.ToTransferCount <= 1 && item.BackTransferCount <= 1 && item.InTransferCount0 == false) {
                    //1 пересадка, но не включает в себя без пересадок
                    item.InTransferCount1 = true;
                    if (!InTransferCount1Added) {
                        InTransferCount1Added = true;
                        transferCountListAgg.push({name: "1 пересадка", value: 1, checked: false, price: 0});
                    }
                }
                else {
                    log('Warning! item miss filter: ' + item.ToTransferCount + ' ' + item.BackTransferCount);
                }
                
            });
            
            //фильтр сразу сортируем
            filter.TransferCountListAgg = _.sortBy(transferCountListAgg, function (item) {
                return item.value;
            });
            
            //console.log('here');
            
            function calcPrices(tcAgg, fnInTransferCount) {
                //находим элементы с нужным кол-вом пересадок
                var list = _.filter(items, function (item) {
                    return fnInTransferCount(item) == true;
                });
                tcAgg.price = _.min(list, function (item) {
                    return item.Price;
                }).Price;
                
                //цена за человека
                if ($scope.usePricePerPerson) {
                    tcAgg.price = Math.round(tcAgg.price / $scope.personsCount);
                }
            }
            
            //вычисляем мин цену (рядом со значением фильтра)
            _.each(filter.TransferCountListAgg, function (tcAgg) {
                switch (tcAgg.value) {
                    case 0: {
                        //находим элементы с нужным кол-вом пересадок
                        calcPrices(tcAgg, function (item) {
                            return item.InTransferCount0;
                        });
                        break;
                    }
                    case 1: {
                        calcPrices(tcAgg, function (item) {
                            return item.InTransferCount1;
                        });
                        break;
                    }
                    case 2: {
                        calcPrices(tcAgg, function (item) {
                            return item.InTransferCount2;
                        });
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
                var fList = _.filter(items, function (item) {
                    return (_.indexOf(item.transportersCodes, tr.TransporterCode) > -1)
                });
                tr.price = _.min(fList, function (item) {
                    return item.Price;
                }).Price;
                
                //цена за человека
                if ($scope.usePricePerPerson) {
                    tr.price = Math.round(tr.price / $scope.personsCount);
                }
            }
            
            //мин / макс время отправления туда обратно
            filter.minDepartureDate = _.min(items, function (item) {
                return item.sort.DepartureDate;
            }).sort.DepartureDate;
            filter.maxDepartureDate = _.max(items, function (item) {
                return item.sort.DepartureDate;
            }).sort.DepartureDate;
            filter.minArrivalDate = _.min(items, function (item) {
                return item.sort.ArrivalDate;
            }).sort.ArrivalDate;
            filter.maxArrivalDate = _.max(items, function (item) {
                return item.sort.ArrivalDate;
            }).sort.ArrivalDate;
            filter.minBackDepartureDate = _.min(items, function (item) {
                return item.sort.BackDepartureDate;
            }).sort.BackDepartureDate;
            filter.maxBackDepartureDate = _.max(items, function (item) {
                return item.sort.BackDepartureDate;
            }).sort.BackDepartureDate;
            filter.minBackArrivalDate = _.min(items, function (item) {
                return item.sort.BackArrivalDate;
            }).sort.BackArrivalDate;
            filter.maxBackArrivalDate = _.max(items, function (item) {
                return item.sort.BackArrivalDate;
            }).sort.BackArrivalDate;
            
            function timeFilter(direction, dayTime) {
                var hoursMin = 0;
                var hoursMax = 0;
                var text = '';
                switch (direction) {
                    case aviaHelper.directionType.departure:
                        text = 'вылет туда ';
                        break;
                    case aviaHelper.directionType.arrival:
                        text = 'прилет туда ';
                        break;
                    case aviaHelper.directionType.backDeparture:
                        text = 'вылет обратно ';
                        break;
                    case aviaHelper.directionType.backArrival:
                        text = 'прилет обратно ';
                        break;
                }
                switch (dayTime) {
                    case aviaHelper.dayTime.morning:
                        hoursMin = 6;
                        hoursMax = 12;
                        text += 'утром';
                        break;
                    case aviaHelper.dayTime.day:
                        hoursMin = 12;
                        hoursMax = 18;
                        text += 'днем';
                        break;
                    case aviaHelper.dayTime.evening:
                        hoursMin = 18;
                        hoursMax = 24;
                        text += 'вечером';
                        break;
                    case aviaHelper.dayTime.night:
                        hoursMin = 0;
                        hoursMax = 6;
                        text += 'ночью';
                        break;
                }
                return {
                    direction: direction,
                    dayTime: dayTime,
                    hoursMin: hoursMin,
                    hoursMax: hoursMax,
                    name: text,
                    checked: false
                };
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
                    fromPorts.push({name: item.AirportFrom, code: item.OutCode, checked: false});
                    toPorts.push({name: item.AirportTo, code: item.InCode, checked: false});
                });
                fromPorts = _.uniq(fromPorts, false, function (item) {
                    return item.code;
                });
                toPorts = _.uniq(toPorts, false, function (item) {
                    return item.code;
                });
                //цены
                _.each(fromPorts, function (port) {
                    var fList = _.filter(items, function (item) {
                        return item.OutCode == port.code;
                    });
                    var price = _.min(fList, function (item) {
                        return item.Price;
                    }).Price;
                    port.price = price;
                    
                    //цена за человека
                    if ($scope.usePricePerPerson) {
                        port.price = Math.round(port.price / $scope.personsCount);
                    }
                });
                _.each(toPorts, function (port) {
                    var fList = _.filter(items, function (item) {
                        return item.InCode == port.code;
                    });
                    var price = _.min(fList, function (item) {
                        return item.Price;
                    }).Price;
                    port.price = price;
                    
                    //цена за человека
                    if ($scope.usePricePerPerson) {
                        port.price = Math.round(port.price / $scope.personsCount);
                    }
                });
                
                //заполняем фильтр
                self.fromName = $scope.criteria.From;
                self.toName = $scope.criteria.To;
                self.fromPorts = fromPorts;
                self.toPorts = toPorts;
            }
            
            filter.AirportFilter = new airportFilter(items);
            //console.log(filter.AirportFilter);
            
            //багаж
            function baggageFilter(items) {
                var self = this;
                
                function addBaggage(list, luggageLimit) {
                    var luggageLimitObj = aviaHelper.getLuggageLimitFromValue(luggageLimit)
                    
                    if (luggageLimit) {
                        var item = {name: luggageLimitObj.baggage, value: luggageLimit, checked: false};
                    } else {
                        var item = {name: 'Нет информации', value: '', checked: false};
                    }
                    list.push(item);
                }
                
                var list = [];
                _.each(items, function (item) {
                    var itemBaggageList = [];
                    _.each(item.EtapsTo, function (etap) {
                        addBaggage(itemBaggageList, etap.LuggageLimit);
                    });
                    _.each(item.EtapsBack, function (etap) {
                        addBaggage(itemBaggageList, etap.LuggageLimit);
                    });
                    
                    itemBaggageList = _.uniq(itemBaggageList, false, function (item) {
                        return item.name;
                    });
                    //сохраняем в item все варианты багажа на этапах (понадобится дальше при расчете цен)
                    item.baggageList = itemBaggageList;
                    
                    //добавляем в общий список
                    list = list.concat(itemBaggageList);
                });
                
                //оставляем уникальные для фильтра
                list = _.uniq(list, false, function (item) {
                    return item.name;
                });
                //удаляем пустое значение из фильтра
                //list = _.filter(list, function (item) {
                //    return item.value != null && item.value.length > 0;
                //});
                
                //цены
                for (var i = 0; i < list.length; i++) {
                    var it = list[i];
                    var fList = _.filter(items, function (item) {
                        //смотрим есть ли данный фильтр в итеме
                        var itemBag = _.find(item.baggageList, function (item) {
                            return item.name == it.name;
                        });
                        return itemBag != null;
                    });
                    
                    //заполняем цену
                    it.price = _.min(fList, function (item) {
                        return item.Price;
                    }).Price;
                    
                    //цена за человека
                    if ($scope.usePricePerPerson) {
                        it.price = Math.round(it.price / $scope.personsCount);
                    }
                }
                
                //заполняем фильтр
                self.list = list;
                //console.log('baggage list', list);
            }
            
            filter.BaggageFilter = new baggageFilter(items);
            
            //задаем фильтр
            $scope.filter = new aviaFilter(filter);
            //log('updateFilter ' + angular.toJson($scope.filter));
            //log('updateFilter');
            
            //console.log('$scope.filter', $scope.filter);
            
            applyFilter($scope);
        }
        
        function applyFilter($scope) {
            var filteredList = [];
            //log('applyFilter ' + new Date());
            
            //список выбранных значений
            var transferCountCheckedList = _.filter($scope.filter.TransferCountListAgg, function (item) {
                return item.checked == true
            });
            //туда, флаг, что хоть что-то выбрано
            //var anyTransferCountChecked = (transferCountCheckedList != null && transferCountCheckedList.length > 0);
            var noTransfersCountChecked = _.all($scope.filter.TransferCountListAgg, function (item) {
                return item.checked == false
            });
            
            //выбрана хотя бы одна компания
            //var anyTransporterChecked = _.any($scope.filter.TransporterList, function (item) { return item.checked == true });
            var noTransporterChecked = _.all($scope.filter.TransporterList, function (item) {
                return item.checked == false
            });
            //список всех выбранных а/к
            var transporterListCheckedList = _.filter($scope.filter.TransporterList, function (item) {
                return item.checked == true
            });
            transporterListCheckedList = _.map(transporterListCheckedList, function (item) {
                return item.TransporterCode
            });
            
            var departureFilters = _.filter($scope.filter.time.list, function (item) {
                return item.checked && item.direction == aviaHelper.directionType.departure;
            });
            var arrivalFilters = _.filter($scope.filter.time.list, function (item) {
                return item.checked && item.direction == aviaHelper.directionType.arrival;
            });
            var backDepartureFilters = _.filter($scope.filter.time.list, function (item) {
                return item.checked && item.direction == aviaHelper.directionType.backDeparture;
            });
            var backArrivalFilters = _.filter($scope.filter.time.list, function (item) {
                return item.checked && item.direction == aviaHelper.directionType.backArrival;
            });
            
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
            
            var noTimeFilterToSelected = !(_.any(departureFilters, function (item) {
                return item.checked;
            }) || _.any(arrivalFilters, function (item) {
                return item.checked;
            }));
            var noTimeFilterBackSelected = !(_.any(backDepartureFilters, function (item) {
                return item.checked;
            }) || _.any(backArrivalFilters, function (item) {
                return item.checked;
            }));
            
            var fromPortsFilters = _.filter($scope.filter.AirportFilter.fromPorts, function (item) {
                return item.checked;
            });
            var toPortsFilters = _.filter($scope.filter.AirportFilter.toPorts, function (item) {
                return item.checked;
            });
            var noFromPortsSelected = !(fromPortsFilters != null && fromPortsFilters.length > 0);
            var noToPortsSelected = !(toPortsFilters != null && toPortsFilters.length > 0);
            
            //багаж - ниче не выбрано
            var noBaggagesSelected = _.all($scope.filter.BaggageFilter.list, function (item) {
                return item.checked == false
            });
            
            //выбранные фильтры багажа
            //var baggagesFilters = _.filter($scope.filter.BaggageFilter.list, function (item) {
            //    return item.checked;
            //});
            var baggagesFilters = [];
            var baggagesFiltersPre = _.filter($scope.filter.BaggageFilter.list, function (item) {
                return item.checked;
            });
            _(baggagesFiltersPre).forEach(function (filter) {
                baggagesFilters.push(filter.value);
            });
            
            //заодно в цикле вычисляем признак самого дешевого билета
            var minPriceItem = {item: null, price: Number.MAX_VALUE};
            if ($scope.ticketsList != null) {
                for (var i = 0; i < $scope.ticketsList.length; i++) {
                    var item = $scope.ticketsList[i];
                    //признак самого дешевого
                    item.isCheapest = false;
                    
                    //итем в массиве выбранных значений туда  //не вычисляем, если ничего не выбрано
                    var itemInTransferCount = noTransfersCountChecked ? null : _.any(transferCountCheckedList, function (toCheck) {
                        switch (toCheck.value) {
                            case 0:
                                return item.InTransferCount0 == true;
                            case 1:
                                return item.InTransferCount1 == true;
                            case 2:
                                return item.InTransferCount2 == true;
                        }
                    });
                    
                    //а/к - авиакомпании item'а входят в разрешенный список
                    var itemInTransportTo = null;
                    var itemInTransportBack = null;
                    if (noTransporterChecked == false) {//не вычисляем, если ничего не выбрано
                        itemInTransportTo = _.any(item.EtapsTo, function (etap) {
                            return (_.indexOf(transporterListCheckedList, etap.TransporterCode) > -1);
                        });
                        if (item.EtapsBack.length == 0) {
                            itemInTransportBack = false;
                        }
                        else {
                            itemInTransportBack = _.any(item.EtapsBack, function (etap) {
                                return (_.indexOf(transporterListCheckedList, etap.TransporterCode) > -1);
                            });
                        }
                    }
                    
                    var itemInTransport = (itemInTransportTo || itemInTransportBack);
                    
                    var itemInFromPort = noFromPortsSelected ? null : _.any(fromPortsFilters, function (port) {
                        return port.code == item.OutCode;
                    });
                    var itemInToPort = noToPortsSelected ? null : _.any(toPortsFilters, function (port) {
                        return port.code == item.InCode;
                    });
                    
                    //багаж: baggageList item'а входят в список выбранных фильтров
                    //_.all - проверяем, что на всех этапах выбранный фильтр
                    var ItemLuggageLimits = [];
                    var itemInBaggage = false;
                    _.each(item.EtapsTo, function (etap) {
                        ItemLuggageLimits.push(etap.LuggageLimit);
                    });
                    _.each(item.EtapsBack, function (etap) {
                        ItemLuggageLimits.push(etap.LuggageLimit);
                    });
                    //console.log(ItemLuggageLimits)
                    ItemLuggageLimits = _.uniq(ItemLuggageLimits);
                    
                    
                    if (noBaggagesSelected) {
                        itemInBaggage = true;
                    } else {
                        /**
                         * Если в фильтре выбран только платный багаж, показываем все
                         * билеты в которых есть хотя бы один сегмент с платным багажом
                         */
                            //if (baggagesFilters.length == 1 && baggagesFilters[0] == '0' && _.include(ItemLuggageLimits, '0')) {
                            //    itemInBaggage = true;
                            //} else {
                            //    var values = _.intersection(baggagesFilters, ItemLuggageLimits);
                            //    if (values.length == ItemLuggageLimits.length){
                            //        itemInBaggage = true;
                            //    }
                            //}
                            
                            //console.log(ItemLuggageLimits)
                        var values = _.intersection(baggagesFilters, ItemLuggageLimits);
                        if (values.length == ItemLuggageLimits.length) {
                            itemInBaggage = true;
                        }
                    }
                    
                    //var itemInBaggage = noBaggagesSelected ? null : _.any(baggagesFilters, function (bag) {
                    //    var bObj = _.find(item.baggageList, function (bi) {
                    //        return bi.value == bag.value;
                    //    });
                    //
                    //    //проверяем что во всех этапах туда есть заданный фильтр
                    //    var foundInEtapsTo = _.all(item.EtapsTo, function (etap) {
                    //        return etap.LuggageLimit == bag.value;
                    //    });
                    //    var foundInEtapsBack = _.all(item.EtapsBack, function (etap) {
                    //        return etap.LuggageLimit == bag.value;
                    //    });
                    //
                    //    //соответственно, итем попадает в набор если во всех
                    //    //этапах есть заданный фильтр
                    //    return foundInEtapsTo && foundInEtapsBack;
                    //});
                    
                    //по какому полю ведем сравнение
                    item.comparePrice = $scope.usePricePerPerson ? item.StandartCostPerPerson : item.Price;
                    
                    //проверяем цену
                    if (item.comparePrice >= $scope.filter.minPrice && item.comparePrice <= $scope.filter.maxPrice
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
                        
                        && (noBaggagesSelected || itemInBaggage)
                    
                    ) {
                        //вычисляем самый дешевый
                        if (item.comparePrice < minPriceItem.price) {
                            minPriceItem.item = item;
                            minPriceItem.price = item.comparePrice;
                        }
                        
                        filteredList.push(item);
                    }
                }
                
                //присваиваем признак самого дешевого билета
                if (minPriceItem.item != null) {
                    minPriceItem.item.isCheapest = true;
                }
                $scope.filteredTicketsList = filteredList;
                
                applySort();
            }
            
            $scope.isDataLoading = false;
            $scope.baloon.hide();
        }
        
        function applySort() {
            $scope.filteredTicketsList = $filter('orderBy')($scope.filteredTicketsList, $scope.SortFilter.sortType, $scope.SortFilter.reverse);
            
            //var debugList = _.map($scope.filteredTicketsList, function (item) { return { IsRecomendation: item.IsRecomendation, RecommendedFactor: item.RecommendedFactor } });
            //console.log(debugList);
            
            $scope.scrollControl.init();
        }
        
        $scope.$watch('SortFilter', function () {
            applySort();
        }, true);
        
        $scope.popupItemInfo_show = function ($event, item, criteria, searchId) {
            $scope.popupItemInfo.show($event, item, criteria, searchId);
            //console.log('item', item.VariantId1, item.VariantId2);
            
            updateShareLink(item);
        };
        
        function updateShareLink(item) {
            $scope.location = getPopupItemUrl(item);
        }
        
        function getPopupItemUrl(item) {
            var url = location.protocol + '//' + location.host + '/#' + urlHelper.UrlToAviaSearch($scope.criteria);
            if (item) {
                url += '-' + item.VariantId1 + '-';
                if (item.VariantId2) {
                    url += item.VariantId2;
                }
            }
            return url;
        }
        
        function ractiveControl() {
            var self = this;
            
            //reactive init
            self.ractive = new Ractive({
                el: 'avia_result_cont',
                template: $templateCache.get('avia/results_avia_item_template.html'),
                partials: {
                    ruble: $templateCache.get('components/ruble.html')
                },
                components: {
                    PriceGeneric: PriceGeneric
                },
                data: {
                    helper: aviaHelper,
                    limitFilter: function (text, maxLength) {
                        return $filter('limitFilter')(text, maxLength);
                    },
                    priceFilter: function (text) {
                        return $filter('price')(text);
                    },
                    console: function () {
                        //console.log.apply(console, arguments);
                    },
                    
                    usePricePerPerson: $scope.usePricePerPerson,
                    
                    isAgency: $scope.isAgency,
                    
                    ticketsCount: $scope.ticketsCount,
                    
                    items: $scope.visibleFilteredTicketsList,
                    
                    AgencyType: $scope.AgencyType,
                    
                    passengerCount: $scope.personsCount
                }
            });
            
            self.ractive.on({
                popupItemInfo_show: function (event, item) {
                    //console.log('item', item.VariantId1, item.VariantId2);
                    
                    $scope.safeApply(function () {
                        $scope.popupItemInfo.show(event.original, item, $scope.criteria, $scope.searchId);
                    });
                    
                    updateShareLink(item);
                },
                goToPaymentClick: function (event, item) {
                    $scope.safeApply(function () {
                        $scope.goToPaymentClick(event.original, item);
                    });
                }
            });
            
            self.update = function () {
                self.ractive.set('items', $scope.visibleFilteredTicketsList);
            };
            
            self.reset = function () {
                self.ractive.reset('items', $scope.visibleFilteredTicketsList);
            };
            
            //console.log('ractiveControl initted');
        }
        
        $scope.ractiveControl = new ractiveControl();
        
        function onWindowScroll() {
            var scrollTop = $(window).scrollTop();
            if (scrollTop + $(window).height() > $(document).height() - 300 &&
                scrollTop > $scope.scrollControl.lastScrollOffset) {
                $scope.scrollControl.lastScrollOffset = scrollTop;
                $scope.scrollControl.loadMore();
            }
            
            //var scrollTop = utils.getScrollTop();
            var filters = $('.filters__body');
            var aside = $('.js-aside');
            var FIXED_CLASS = 'filters__body_position_fixed';
            var FIXED_ASIDE_CLASS = 'results-aside_mod-fixed';
            
            if (scrollTop > 206) {
                filters.addClass(FIXED_CLASS);
                aside.addClass(FIXED_ASIDE_CLASS);
            } else {
                filters.removeClass(FIXED_CLASS);
                aside.removeClass(FIXED_ASIDE_CLASS);
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
                
                $scope.ractiveControl.update();
                //console.log('visible: ' + ($scope.visibleFilteredTicketsList != null ? $scope.visibleFilteredTicketsList.length : 'null'));
            };
            
            self.loadMore = function () {
                $scope.$apply(function ($scope) {
                    if ($scope.visibleFilteredTicketsList != null) {
                        var tmpAr = $scope.visibleFilteredTicketsList.concat();
                        
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
                    }
                });
                
                //console.log('visible: ' + ($scope.visibleFilteredTicketsList != null ? $scope.visibleFilteredTicketsList.length : 'null'));
            };
            
            $(window).on('scroll', onWindowScroll);
        }
        
        $scope.$on('$destroy', function () {
            $(window).off('scroll', onWindowScroll);
            if ($scope._priceGeneric) {
                $scope._priceGeneric.teardown();
                $scope._priceGeneric = null;
            }
            $scope.ractiveControl = null;
            
        });
    }

])
;