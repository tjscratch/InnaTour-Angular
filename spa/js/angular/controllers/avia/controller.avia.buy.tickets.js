
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

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams);

            //критерии из урла
            $scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.searchId = null;
            $scope.item = null;
            $scope.citizenshipList = null;
            $scope.bonusCardTransportersList = null;
            $scope.payModel = null;

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
            (function loadToCountry() {
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

                        urlDataLoaded.selectedItem = true;
                        initIfDataLoaded();
                    }
                }
                else {
                    //запрос в api
                    //плюс нужна обработка, чтобы в item были доп. поля с форматами дат и прочее
                    urlDataLoaded.selectedItem = true;
                    initIfDataLoaded();
                }
            })();

            function initPayModel() {

            };
            
            $scope.processToBuy = function ($event) {

            };

            
        }]);
