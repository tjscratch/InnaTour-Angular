
'use strict';

/* Controllers */

//такой синтаксис['$log', '$scope', '$http', '$filter', 'dataService',
//нужен чтобы работали внедрения зависимостей после минификации
innaAppControllers.
    controller('HotelsDetailsCtrl', ['$log', '$scope', '$routeParams', '$filter', '$location', 'dataService', 'urlHelper',
        function HotelsDetailsCtrl($log, $scope, $routeParams, $filter, $location, dataService, urlHelper) {
            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //тут какая-нить фигня-крутилка пока грузятся данные

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //данные отеля
            $scope.hotelDetail = null;

            log('$routeParams: ' + angular.toJson($routeParams));
            if (angular.toJson($routeParams) != '{}') {
                $scope.isDataLoading = true;
                //запрос данных для отеля
                dataService.getHotelDetail({ hotelId: $routeParams.hotelId, searchId: $routeParams.searchId }, function (data) {
                    //обновляем данные
                    $scope.updateHotelDetail(data);
                }, function (data, status) {
                    //ошибка получения данных
                    log('getHotelDetail error: ' + status);
                    $scope.isDataLoading = false;
                });
            }

            //обновляем модель
            $scope.updateHotelDetail = function (data) {
                if (data != null) {
                    log('updateHotelDetail');
                    //log('updateHotelDetail, data: ' + angular.toJson(data));

                    $.each(data.Tours, function (index, item) {
                        item.Price = item.Price != null ? item.Price.Value : null;
                        item.Currency = item.Price != null && item.Price.Currency != null ? item.Price.Currency : null;
                        item.SearchId = data.SearchId;
                    });

                    $scope.hotelDetail = new hotelDetail(data);
                } else {
                    $scope.hotelDetail = null;
                }
                $scope.isDataLoading = false;
            };

            $scope.goToTourDetail = function (tour) {
                //log('tour: ' + angular.toJson(tour));
                //alert('Еще не реализовано');
                var url = urlHelper.UrlToTourDetails($routeParams.hotelId, $routeParams.searchId, tour.UID);
                $location.path(url);
            };
        }]);