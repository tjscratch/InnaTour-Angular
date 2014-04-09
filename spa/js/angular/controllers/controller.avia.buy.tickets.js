
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

            function initPayModel() {

                var sexType = { man: 'man', woman: 'woman' };
                $scope.sexType = sexType;

                var passengerModel = {
                    sex: sexType.name,
                    name: '',
                    secondName: '',
                    birthday: '',
                    document: {//документ
                        series: '',//серия
                        number: '',//номер
                        expirationDate: ''//дествителен до
                    },
                    citizenship: {//Гражданство
                        id: 0,
                        name: ''
                    },
                    haveBonusCard: false,//Есть бонусная карта
                    airCompany: {
                        id: 0,
                        name: ''
                    }
                };

                $scope.userModel = {
                    price: 0,
                    name: '',
                    secondName: '',
                    email: '',
                    phone: '',
                    wannaNewsletter: false,//Я хочу получать рассылку спецпредложений
                    passengers: []

                };
            };

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
