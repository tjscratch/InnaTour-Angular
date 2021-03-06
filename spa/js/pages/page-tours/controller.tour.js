﻿'use strict';
innaAppControllers.
    controller('TourDetailsCtrl', [
        '$log',
        '$scope',
        '$routeParams',
        '$filter',
        'dataService',
        'urlHelper',
        function ($log, $scope, $routeParams, $filter, dataService, urlHelper) {
            var self = this;

            function log(msg) {
                $log.log(msg);
            }


            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //данные отеля
            $scope.tour = null;

            //log('$routeParams: ' + angular.toJson($routeParams));
            if (angular.toJson($routeParams) != '{}') {
                $scope.isDataLoading = true;
                //запрос данных для отеля
                dataService.getTourDetail($routeParams, function (data) {
                    //обновляем данные
                    $scope.updateTourDetail(data);
                }, function (data, status) {
                    //ошибка получения данных
                    log('getHotelDetail error: ' + status);
                    $scope.isDataLoading = false;
                });
            }

            //обновляем модель
            $scope.updateTourDetail = function (data) {
                //log('updateTourDetail data: ' + angular.toJson(data));
                if (data != null && data.TourDetailResult != null) {
                    log('updateTourDetail');
                    //log('updateTourDetail, data: ' + angular.toJson(data));

                    $scope.tour = new tourDetail(data);
                    //log('$scope.tour: ' + angular.toJson($scope.tour));
                } else {
                    $scope.tour = null;
                }
                $scope.isDataLoading = false;
            };

            //перейти к оплате
            $scope.goToPayDetails = function (payData) {
                log('pay: ' + angular.toJson(payData));

                // тестовые данные
                payData.DirectFlightId = payData.DirectFlight.Id;
                payData.ReturnFlightId = payData.ReturnFlight.Id;
                payData.ExtraCharges = payData.ExtraCharges;
                payData.ToAirportTransferId = payData.ToAirportTransfer.Id;
                payData.FromAirportTransferId = payData.FromAirportTransfer.Id;
                payData.Insurances = [payData.TourInsurance.Id];
                payData.Services = payData.Services;


                //alert('Еще не реализовано');
                dataService.getOrder(payData, function (orderId) {

                    var url = urlHelper.UrlToPaymentPage(orderId);
                    $location.path(url);

                }, function (data, status) {
                    //ошибка получения данных
                    log('getHotelDetail error: ' + status);
                    $scope.isDataLoading = false;
                });

            };
        }]);