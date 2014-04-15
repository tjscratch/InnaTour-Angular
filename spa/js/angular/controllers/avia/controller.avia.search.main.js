
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaSearchMainCtrl', [
        '$scope', '$rootScope', '$routeParams', 'dataService', 'sharedProperties',
        function ($scope, $rootScope, $routeParams, dataService, sharedProperties) {

            //карусель
            $scope.myInterval = 5000;
            var params = {
                sectionLayoutId: QueryString.getFromUrlByName(location.href, 'sectionLayoutId'),
                sliderId: QueryString.getFromUrlByName(location.href, 'sliderId'),
                layoutOffersId: QueryString.getFromUrlByName(location.href, 'layoutOffersId')
            };
            dataService.getSectionTours(params, function (data) {
                //обновляем данные
                if (data != null) {
                    $scope.sections = data.SectionLayouts;
                    $scope.slides = data.Slider;
                    sharedProperties.setSlider($scope.slides);
                }
            });


            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams, true);
        }
    ]);
