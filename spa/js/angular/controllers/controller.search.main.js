
'use strict';

/* Controllers */

innaAppControllers.
    controller('SearchMainCtrl', ['$log', '$scope', '$routeParams', '$filter', '$location', 'dataService',
        function SearchMainCtrl($log, $scope, $routeParams, $filter, $location, dataService) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //флаг индикатор загрузки
            $scope.isDataLoading = false;

            //обнуляем список
            var emptyArray = [];
            $scope.hotels = emptyArray;
            $scope.searchId = 0;

            //кол-во туров
            $scope.toursCount = 0;

            //начальные условия поиска
            //$scope.criteria = new criteria({ DurationMin: 7, HotelStarsMin: 3, HotelStarsMax: 5 });
            $scope.criteria = new criteria({ DurationMin: 7 });

            //тут меняем урл для поиска
            $scope.searchTours = function () {
                log('$scope.criteria: ' + angular.toJson($scope.criteria));
                var url = UrlHelper.UrlToSearch(angular.copy($scope.criteria));
                $location.path(url);
            };
        }]);
