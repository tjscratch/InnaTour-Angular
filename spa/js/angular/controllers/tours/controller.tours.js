
'use strict';

/* Controllers */

innaAppControllers.
    controller('ToursCtrl', ['$log', '$scope', '$rootScope', '$routeParams', 'dataService', 'sharedProperties',
        function ToursCtrl($log, $scope, $rootScope, $routeParams, dataService, sharedProperties) {
            function log(msg) {
                $log.log(msg);
            }

            //карусель
            $scope.myInterval = 5000;

            $scope.hellomsg = "Привет из ToursCtrl";

            
            //log('$scope.getSectionTours');
            var params = {
                sectionLayoutId: QueryString.getFromUrlByName(location.href, 'sectionLayoutId'),
                sliderId: QueryString.getFromUrlByName(location.href, 'sliderId'),
                layoutOffersId: QueryString.getFromUrlByName(location.href, 'layoutOffersId')
            };
            dataService.getSectionTours(params, function (data) {
                //обновляем данные
                if (data != null) {
                    //log('data: ' + angular.toJson(data));
                    //log('$scope.getSectionTours success');
                    updateModel(data);
                    //$scope.blocks = angular.fromJson(data);
                }
            }, function (data, status) {
                //ошибка получения данных
                log('getSectionTours error; status:' + status);
            });


            function updateModel(data) {
                $scope.sections = data.SectionLayouts;

                //var desc = "23 февраля на 10 ночей Отель 5*";
                //desc = "";
                //var sections = angular.fromJson(data.SectionLayouts);
                //_.each(sections, function (sec) {
                //    _.each(sec.OfferLayouts, function (offer) {
                //        if (offer.Offer1 != null)
                //            offer.Offer1.Description = desc;
                //        if (offer.Offer2 != null)
                //            offer.Offer2.Description = desc;
                //        if (offer.Offer3 != null)
                //            offer.Offer3.Description = desc;
                //    });
                //});
                //$scope.sections = sections;

                //вместо картинок - заглушки (часто ломают картинки)
                //$scope.sections = stubber.fillStubImages(angular.fromJson(data.SectionLayouts));
                $scope.slides = data.Slider;

                //данные для слайдера - нужны другому контроллеру
                //log('sharedProperties.setProperty');
                sharedProperties.setSlider($scope.slides);

                //var test = sharedProperties.getProperty();
                //log('test: ' + angular.toJson(test));
            }
        }]);