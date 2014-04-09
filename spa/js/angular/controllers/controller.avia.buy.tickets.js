
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaBuyTicketsCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper',
        function AviaBuyTicketsCtrl($log, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            $scope.helloMsg = 'Привет из AviaBuyTicketsCtrl';

            //обрабатываем параметры из url'а
            var routeCriteria = new aviaCriteria(UrlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.criteria = routeCriteria;

            var storeItem = storageService.getAviaBuyItem();
            //log('storeItem: ' + angular.toJson(storeItem));
            if (storeItem != null) {
                if (storeItem.item.VariantId2 == null)
                    storeItem.item.VariantId2 = 0;
                //проверяем, что там наш итем
                if ($scope.criteria.QueryId == storeItem.searchId &&
                    $scope.criteria.VariantId1 == storeItem.item.VariantId1 && $scope.criteria.VariantId2 == storeItem.item.VariantId2)
                {
                    $scope.searchId = storeItem.searchId;
                    $scope.item = storeItem.item;
                }
            }
            else
            {
                //запрос в api
                //плюс нужна обработка, чтобы в item были доп. поля
            }

            $scope.getTransferCountText = aviaHelper.getTransferCountText;

            $scope.moreClick = function ($event) {
                aviaHelper.preventBubbling($event);
            };
        }]);
