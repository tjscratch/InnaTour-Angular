﻿
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaSearchMainCtrl', [
        '$scope', '$rootScope', '$routeParams', 'innaApp.services.PageContentLoader', 'innaApp.API.pageContent.AVIA',
        function ($scope, $rootScope, $routeParams, PageContentLoader, sectionID) {
            /*Data fetching*/
            PageContentLoader.getSectionById(sectionID, function (data) {
                //обновляем данные
                if (data != null) {
                    $scope.$apply(function($scope) {
                        $scope.sections = data.SectionLayouts;
                    });
                }
            });

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            //$rootScope.$broadcast("avia.page.loaded", $routeParams, true);
            $scope.$on('avia.form.loaded', function (event) {
                //console.log('avia.form.loaded');
                $rootScope.$broadcast("avia.page.loaded", $routeParams, true);
            });
            $rootScope.$broadcast("avia.page.loaded", $routeParams, true);
        }
    ]);
