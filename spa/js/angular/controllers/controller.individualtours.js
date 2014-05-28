
'use strict';

/* Controllers */

innaAppControllers.
    controller('IndividualToursCtrl', ['$log', '$scope', '$routeParams', '$filter', '$location', 'dataService', 'sharedProperties',
        function IndividualToursCtrl($log, $scope, $routeParams, $filter, $location, dataService, sharedProperties) {
            function log(msg) {
                $log.log(msg);
            }

            //карусель
            $scope.myInterval = 5000;

            $scope.hellomsg = "Привет из IndividualToursCtrl";

            //log('$scope.getSectionIndividualTours');
            var params = {
                sectionLayoutId: QueryString.getFromUrlByName(location.href, 'sectionLayoutId'),
                sliderId: QueryString.getFromUrlByName(location.href, 'sliderId'),
                layoutOffersId: QueryString.getFromUrlByName(location.href, 'layoutOffersId')
            };
            dataService.getSectionIndividualTours(params, function (data) {
                //обновляем данные
                if (data != null) {
                    //log('data: ' + angular.toJson(data));
                    //log('$scope.getSectionIndividualTours success');
                    updateModel(data);
                    //$scope.blocks = angular.fromJson(data);
                }
            }, function (data, status) {
                //ошибка получения данных
                log('getSectionIndividualTours error; status:' + status);
            });

            function updateModel(data) {
                $scope.sections = data.SectionLayouts;
                $scope.slides = data.Slider;
                //данные для слайдера - нужны другому контроллеру
                sharedProperties.setSlider($scope.slides);
            }
        }]);