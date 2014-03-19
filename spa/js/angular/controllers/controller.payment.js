
'use strict';

/* Controllers */

innaAppControllers.
    controller('PaymentPageCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService',
        function PaymentPageCtrl($log, $scope, $routeParams, $filter, dataService) {
            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //тут какая-нить фигня-крутилка пока грузятся данные

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //данные страницы платежа
            $scope.payment = null;

            //log('$routeParams: ' + angular.toJson($routeParams));
            if (angular.toJson($routeParams) != '{}') {
                $scope.isDataLoading = true;
                //запрос данных для отеля
                dataService.getPaymentPage(log, $routeParams, function (data) {
                    //обновляем данные
                    $scope.updatePaymentPage(data);
                }, function (data, status) {
                    //ошибка получения данных
                    log('getPaymentPage error: ' + status);
                    $scope.isDataLoading = false;
                });
            }

            //обновляем модель
            $scope.updatePaymentPage = function (data) {
                //log('updateTourDetail data: ' + angular.toJson(data));
                if (data != null) {
                    log('updatePaymentPage');
                    //log('updateTourDetail, data: ' + angular.toJson(data));

                    $scope.payment = new paymentPage(data);
                    //log('$scope.tour: ' + angular.toJson($scope.tour));
                } else {
                    $scope.payment = null;
                }
                $scope.isDataLoading = false;
            };

            //оплата
            $scope.doPay = function (payData) {
                log('pay: ' + angular.toJson(payData));

                // тестовые данные
                payData.DirectFlightId = payData.DirectFlight.Id;
                payData.ReturnFlightId = payData.ReturnFlight.Id;
                payData.Insurance = payData.TourInsuranceVariants[0].Id;
                payData.ServiceIds = [];
                

                //alert('Еще не реализовано');
                dataService.pay(log, payData, function (data) {
                    //обновляем данные
                    alert('Забронировано!');
                }, function (data, status) {
                    //ошибка получения данных
                    log('getHotelDetail error: ' + status);
                    $scope.isDataLoading = false;
                });
                
            };
        }]);