
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
            $scope.reservationModel = null;
            $scope.payModel = {
                num: {
                    num1: '1345',
                    num2: '2322',
                    num3: '3456',
                    num4: '4876'
                    
                },
                cvc2: '123',
                cardHolder: 'Ivan Ivanov',
                cardMonth: '02',
                cardYear: '15',
                agree: true
            };

            $scope.sexType = aviaHelper.sexType;

            var urlDataLoaded = { model: false };

            function isAllDataLoaded() {
                return urlDataLoaded.model;
            }
            function initIfDataLoaded() {
                //все данные были загружены
                if (isAllDataLoaded()) {
                    //инициализация
                    initPayModel();
                }
            };

            //data loading ===========================================================================
            (function getPayModel() {
                var reservationModel = storageService.getReservationModel();
                log('\nReservationModel: ' + angular.toJson(reservationModel));
                if (reservationModel != null) {
                    urlDataLoaded.model = true;
                    $scope.reservationModel = reservationModel;
                    initIfDataLoaded();
                }
                else {
                    //запрос в api
                    //paymentService.getPaymentData({
                    //    orderNum: $scope.criteria.orderNum
                    //},
                    //function (data) {
                    //    if (data != null) {
                    //        //log('getPaymentData data: ' + angular.toJson(data));
                    //        urlDataLoaded.model = true;
                    //        $scope.reservationModel = data;
                    //        //плюс нужна обработка, чтобы в item были доп. поля с форматами дат и прочее
                    //        $scope();
                    //    }
                    //},
                    //function (data, status) {
                    //    log('paymentService.getPaymentData error');
                    //});
                }
            })();

            function initPayModel() {

            };
            
            $scope.processToBuy = function ($event) {
                eventsHelper.preventBubbling($event);

                if ($scope.payModel.agree && isAllDataLoaded()) {
                    var cardNum = $scope.payModel.num.num1 + $scope.payModel.num.num2 + $scope.payModel.num.num3 + $scope.payModel.num.num4;

                    var apiPayModel = {
                        OrderNum: $scope.criteria.OrderNum,
                        CardNumber: cardNum,
                        Cvc2: $scope.payModel.cvc2,
                        CardHolder: $scope.payModel.cardHolder,
                        CardMonth: $scope.payModel.cardMonth,
                        CardYear: $scope.payModel.cardYear
                    };

                    log('\napiPayModel: ' + angular.toJson(apiPayModel));

                    paymentService.pay(apiPayModel,
                    function (data) {
                        log('\npaymentService.pay, data: ' + angular.toJson(data));
                        if (data != null) {
                            //успешно
                            alert('Успешно!!! \n' + angular.toJson(data));
                        }
                    },
                    function (data, status) {
                        //ошибка
                        log('paymentService.pay error');
                        alert('Ошибка!!! \n' + angular.toJson(data));
                    });
                }
            };

            
        }]);
