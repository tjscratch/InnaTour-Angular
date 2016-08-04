'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaSearchMainCtrl', [
        '$scope', '$rootScope', '$routeParams', 'innaApp.services.PageContentLoader', 'innaApp.API.pageContent.AVIA',
        function ($scope, $rootScope, $routeParams, PageContentLoader, sectionID) {

            $scope.pageTitle = "Поиск дешевых авиабилетов";
            $scope.pageTitleSub = "Лучший способ купить авиабилеты онлайн";

            /*Data fetching*/
            //$('body').addClass('scrollVisible');
            PageContentLoader.getSectionById(sectionID, function (data) {
                //обновляем данные
                if (data != null) {
                    $scope.$apply(function($scope) {
                        $scope.sections = data.SectionLayouts;
                        //данные для слайдера
                        $scope.$broadcast('slider.set.content', data.Slider);
                    });
                }
            });


            //$rootScope.$broadcast("avia.page.loaded", $routeParams, true);
            $scope.$on('avia.form.loaded', function (event) {
                //console.log('avia.form.loaded');
                $rootScope.$broadcast("avia.page.loaded", $routeParams, true);
            });
            $rootScope.$broadcast("avia.page.loaded", $routeParams, true);

            /*$scope.$on('$destroy', function(){
                $('body').removeClass('scrollVisible');
            })*/
        }
    ]);
