
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaBuyTicketsCtrl', ['$log', '$timeout', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper', 'urlHelper',
        function AviaBuyTicketsCtrl($log, $timeout, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            $scope.showCitListClick = function () {
                log('showCitListClick');
            };

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams);

            $scope.helloMsg = 'Привет из AviaBuyTicketsCtrl';

            //критерии из урла
            $scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.searchId = null;
            $scope.item = null;
            $scope.citizenshipList = null;
            $scope.bonusCardTransportersList = null;
            $scope.payModel = null;

            //$timeout(function () {
            //    loadToCountryAndInit(routeCriteria);
            //}, 2000);

            var urlDataLoaded = { selectedItem: false, routeCriteriaTo: false, allCountries: false };

            function isAllDataLoaded() {
                return urlDataLoaded.selectedItem && urlDataLoaded.routeCriteriaTo && urlDataLoaded.allCountries;
            }
            function initIfDataLoaded() {
                //все данные были загружены
                if (isAllDataLoaded()) {
                    //инициализация
                    initPayModel();
                }
            };

            //data loading ===========================================================================
            (function loadToCountry()
            {
                //log('loadToCountryAndInit');
                if ($scope.criteria.ToUrl != null && $scope.criteria.ToUrl.length > 0) {

                    dataService.getDirectoryByUrl($scope.criteria.ToUrl, function (data) {
                        if (data != null) {
                            $scope.criteria.To = data.name;
                            $scope.criteria.ToId = data.id;
                            $scope.criteria.ToCountryName = data.CountryName;

                            urlDataLoaded.routeCriteriaTo = true;
                            initIfDataLoaded();
                        }
                    }, function (data, status) {
                        log('loadToCountry error: ' + $scope.criteria.ToUrl + ' status:' + status);
                    });
                }
            })();

            (function getStoreItem() {
                var storeItem = storageService.getAviaBuyItem();
                //log('storeItem: ' + angular.toJson(storeItem));
                if (storeItem != null) {
                    if (storeItem.item.VariantId2 == null)
                        storeItem.item.VariantId2 = 0;
                    //проверяем, что там наш итем
                    if ($scope.criteria.QueryId == storeItem.searchId &&
                        $scope.criteria.VariantId1 == storeItem.item.VariantId1 && $scope.criteria.VariantId2 == storeItem.item.VariantId2) {
                        $scope.searchId = storeItem.searchId;
                        $scope.item = storeItem.item;

                        loadTransporters();
                    }
                }
                else {
                    //запрос в api
                    //плюс нужна обработка, чтобы в item были доп. поля с форматами дат и прочее
                    loadTransporters();
                }
            })();

            (function loadAllCountries() {
                dataService.getAllCountries(function (data) {
                    if (data != null) {
                        $scope.citizenshipList = data;
                        urlDataLoaded.allCountries = true;
                        initIfDataLoaded();
                    }
                }, function (data, status) {
                    log('getAllCountries error: status:' + status);
                });
            })();

            function loadTransporters() {
                var transportersNames = [];

                if ($scope.item.EtapsTo.length > 0)
                {
                    _.each($scope.item.EtapsTo, function (item) {
                        transportersNames.push(item.TransporterCode);
                    });
                }
                if ($scope.item.EtapsBack != null&& $scope.item.EtapsBack.length > 0) {
                    _.each($scope.item.EtapsBack, function (item) {
                        transportersNames.push(item.TransporterCode);
                    });
                }
                //берем уникальные
                transportersNames = _.uniq(transportersNames);

                paymentService.getTransportersInAlliances(transportersNames, function (data) {
                    if (data != null) {
                        $scope.bonusCardTransportersList = data;

                        urlDataLoaded.selectedItem = true;
                        initIfDataLoaded();
                    }
                }, function (data, status) {
                    log('getTransportersInAlliances error: ' + transportersNames + ' status:' + status);
                });
            };
            //data loading ===========================================================================

            function initPayModel() {

                var sexType = { man: 1, woman: 2 };
                $scope.sexType = sexType;

                function passengerModel(index) {
                    var self = this;
                    self = {
                        index: index,
                        sex: null,
                        name: '',
                        secondName: '',
                        birthday: '',
                        citizenship: {//Гражданство
                            id: 0,
                            name: ''
                        },
                        document: {//документ
                            series_and_number: '',
                            series: '',//серия
                            number: '',//номер
                            expirationDate: ''//дествителен до
                        },
                        bonuscard: {
                            haveBonusCard: false,//Есть бонусная карта
                            airCompany: {
                                id: 0,
                                name: ''
                            },
                            number: ''
                        },
                        dir: {
                            cit:{
                                callback: null, //колбэк директивы на открытие списка гражданств
                                saveDirCallback: function (cb) {
                                    //директива передала колбэк на открытие списка, сохраняем колбэк
                                    self.dir.cit.callback = cb;
                                },
                            },
                            card: {
                                callback: null, //колбэк директивы на открытие списка гражданств
                                saveDirCallback: function (cb) {
                                    //директива передала колбэк на открытие списка, сохраняем колбэк
                                    self.dir.card.callback = cb;
                                }
                            }
                        },
                        showCitListClick: function ($event) {
                            eventsHelper.preventBubbling($event);
                            //открываем список в директиве
                            if (self.dir.cit.callback)
                                self.dir.cit.callback();
                        },
                        showCardListClick: function ($event) {
                            eventsHelper.preventBubbling($event);
                            //открываем список в директиве
                            if (self.dir.card.callback)
                                self.dir.card.callback();
                        },
                    };
                    //log('passengerModel showCitListClick: ' + passengerModel.showCitListClick)
                    return self;
                }


                var passengers = [];
                var peopleCount = $scope.criteria.AdultCount;
                for (var i = 0; i < peopleCount; i++) {
                    var item = new passengerModel(i);
                    passengers.push(item);
                }

                $scope.payModel = {
                    price: 0,
                    name: '',
                    secondName: '',
                    email: '',
                    phone: '',
                    wannaNewsletter: false,//Я хочу получать рассылку спецпредложений
                    passengers: passengers

                };

                fillDefaultModelDelay();
            };

            $scope.getTransferCountText = aviaHelper.getTransferCountText;

            $scope.moreClick = function ($event) {
                eventsHelper.preventBubbling($event);
            };

            function reserve(afterCompleteCallback) {
                function call() { if (afterCompleteCallback) afterCompleteCallback(); };

                function getPassenger(data) {
                    var m = this;
                    m = m || {};
                    m.Sex = data.sex;
                    m.I = data.name;
                    m.F = data.secondName;
                    m.Birthday = data.birthday;
                    m.DocumentId = null;
                    var docsn = data.document.series_and_number.split(' ');
                    m.Series = docsn[0];
                    m.Number = docsn[1];
                    m.ExpirationDate = data.document.expirationDate;
                    m.Citizen = data.citizenship.id;
                    m.Index = data.index;
                    m.BonusCard = data.bonuscard.number;
                    return m;
                }
                function getApiModel(data) {
                    var m = this;
                    m = m || {};
                    m.I = data.name;
                    m.F = data.secondName;
                    m.Email = data.email;
                    m.Phone = data.phone;

                    var pasList = [];
                    _.each(data.passengers, function (item) {
                        pasList.push(getPassenger(item));
                    });
                    m.Passengers = pasList;

                    m.SearchParams = {
                        SearchId: $scope.searchId,
                        VariantId1: $scope.item.VariantId1,
                        VariantId2: $scope.item.VariantId2
                    };
                    return m;
                };
                var apiModel = getApiModel($scope.payModel);
                log('');
                log('payModel: ' + angular.toJson($scope.payModel));
                log('');
                log('apiModel: ' + angular.toJson(apiModel));
                //
                paymentService.reserve(apiModel,
                    function (data) {
                        //успешно
                        call();
                    },
                    function (data, status) {
                        //ошибка
                        log('paymentService.reserve error');
                        call();
                    });
            };

            $scope.processToPayment = function ($event) {
                eventsHelper.preventBubbling($event);

                //бронируем
                reserve(function () {
                    if (isAllDataLoaded()) {
                        //переходим на страницу оплаты
                        var url = urlHelper.UrlToAviaTicketsBuy($scope.criteria);
                        //log('processToPayment, url: ' + url);
                        $location.path(url);
                    }
                });
            };

            //ToDo: debug
            function fillDefaultModelDelay() {
                $timeout(function () {
                    $scope.payModel.name = 'Александр';
                    $scope.payModel.secondName = 'Константинопольский';
                    $scope.payModel.email = 'ratunkov@gmail.com';
                    $scope.payModel.phone = '+7 (910) 123-45-67';
                    _.each($scope.payModel.passengers, function (pas) {
                        pas.name = 'ALEXANDER';
                        pas.secondName = 'KONSTANTINOPLOLSKY';
                        pas.sex = $scope.sexType.man;
                        pas.birthday = '18.07.1976';
                        pas.citizenship.id = 189;
                        pas.citizenship.name = 'Россия';
                        pas.document.series_and_number = '7712 3456789';
                        pas.document.expirationDate = '18.07.1976';
                        pas.bonuscard.haveBonusCard = true;
                        pas.bonuscard.airCompany.id = 2;
                        pas.bonuscard.airCompany.name = 'Aeroflot';
                        pas.bonuscard.number = '12134а3454';
                    });
                    
                }, 1000);
            };
        }]);
