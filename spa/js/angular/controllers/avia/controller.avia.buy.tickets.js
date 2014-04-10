
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaBuyTicketsCtrl', ['$log', '$timeout', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper',
        function AviaBuyTicketsCtrl($log, $timeout, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper, eventsHelper) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            $scope.helloMsg = 'Привет из AviaBuyTicketsCtrl';

            //критерии из урла
            $scope.criteria = new aviaCriteria(UrlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.searchId = null;
            $scope.item = null;
            $scope.citizenshipList = null;
            $scope.bonusCardTransportersList = null;

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
                if ($scope.item.EtapsBack.length > 0) {
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

                var sexType = { man: 'man', woman: 'woman' };
                $scope.sexType = sexType;

                function passengerModel(index) {
                    var passengerModel = {
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
                        haveBonusCard: false,//Есть бонусная карта
                        airCompany: {
                            id: 0,
                            name: ''
                        },
                        bonuscard: {
                            number: ''
                        }
                    };
                    return passengerModel;
                }


                var passengers = [];
                var peopleCount = $scope.criteria.AdultCount;
                for (var i = 0; i < peopleCount; i++) {
                    passengers.push(passengerModel(i));
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
            };

            $scope.getTransferCountText = aviaHelper.getTransferCountText;

            $scope.moreClick = function ($event) {
                eventsHelper.preventBubbling($event);
            };

            $scope.processToPayment = function ($event) {
                eventsHelper.preventBubbling($event);

                if (isAllDataLoaded()) {
                    var url = UrlHelper.UrlToAviaTicketsBuyReserved($scope.criteria);
                    //log('processToPayment, url: ' + url);
                    $location.path(url);
                }
            };
        }]);
