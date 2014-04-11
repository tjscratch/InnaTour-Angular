
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
            $scope.searchId = $scope.criteria.QueryId;
            $scope.payModel = null;

            var urlDataLoaded = { selectedItem: false, routeCriteriaTo: false };

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
            (function getStoreItem() {

            })();

            function initPayModel() {

            };
            
            $scope.processToBuy = function ($event) {

            };

            
        }]);
