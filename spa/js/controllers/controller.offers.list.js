'use strict';

/* Controllers */

innaAppControllers.
    controller('OffersListCtrl', [
        '$log',
        '$scope',
        '$rootScope',
        '$routeParams',
        '$filter',
        '$location',
        'dataService',
        'sharedProperties',
        'urlHelper',
        function ($log, $scope, $rootScope, $routeParams, $filter, $location, dataService, sharedProperties, urlHelper) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.getInnerTemplate = function () {
                return urlHelper.getInnerTemplate();
            };

            $scope.getTemplateUrlByBlockType = function (type) {
                return urlHelper.getTemplateUrlByBlockType(type);
            };

            $scope.isNullOrEmpty = function (item) {
                if (item == null || item.length == 0)
                    return true;
                else
                    return false;
            };

            $scope.showImgOnly = function (item) {
                if (
                    //!$scope.isNullOrEmpty(item.FrontPrice) ||
                //!$scope.isNullOrEmpty(item.FrontTitleRow1) ||
                //!$scope.isNullOrEmpty(item.FrontTitleRow2) ||
                //!$scope.isNullOrEmpty(item.FrontSubTitleRow1) ||
                //!$scope.isNullOrEmpty(item.FrontSubTitleRow2) ||
                !$scope.isNullOrEmpty(item.BackTitleRow1) || !$scope.isNullOrEmpty(item.BackTitleRow2) || !$scope.isNullOrEmpty(item.BackSubTitleRow1) || !$scope.isNullOrEmpty(item.BackSubTitleRow2) || !$scope.isNullOrEmpty(item.BackPrice))
                    return false;
                else
                    return true;
            };

            $scope.hasImgBack = function (item) {
                return !$scope.isNullOrEmpty(item.BackTitleRow1) || !$scope.isNullOrEmpty(item.BackTitleRow2) || !$scope.isNullOrEmpty(item.BackSubTitleRow1) || !$scope.isNullOrEmpty(item.BackSubTitleRow2) || !$scope.isNullOrEmpty(item.BackPrice);
            }

            $scope.hasImgFront = function (item) {
                return !$scope.isNullOrEmpty(item.FrontTitleRow1) || !$scope.isNullOrEmpty(item.FrontTitleRow2) || !$scope.isNullOrEmpty(item.FrontSubTitleRow1) || !$scope.isNullOrEmpty(item.FrontSubTitleRow2) || !$scope.isNullOrEmpty(item.FrontPrice)
            }


            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            $scope.getHref = function (item) {
                var url = item.Url;
                //Url : "http://test.inna.ru/#/individualtours/category/12"
                //отрезаем нежнужное (нужен урл типа /individualtours/category/12)
                var ind = url.indexOf("/#");
                if (ind > -1) {
                    url = url.substring(ind + 2, url.length);
                }
                //url = '/#' + url;
                //log('getHref, url: ' + url);
                return url;
            };

            //нужно, чтобы кликалось со второго раза на планшетах
            $scope.lastClickedItem = null;

            $scope.offerClick = function (item, $event, position, block, section) {
                console.log('SECTION', section);
                console.log('BLOCK', block);
                console.log('POSITION', position);
                console.log('ITEM', item);
                $scope.offerClickInternal(item, $event, position, block.OfferLayoutType, section.Name);
            };

            $scope.clickOnShadow = function (item, $event, position, blockType, sectionName) {
                $event && preventBubbling($event);

                track.offerClick(sectionName, blockType, item.Name, position, function () {
                    location.href = item.Url;
                    $scope.lastClickedItem = null;
                });
            };

            $scope.offerClickInternal = function (item, $event, position, blockType, sectionName) {
                preventBubbling($event);

                //если без ховера, просто картинка - то сразу кликаем
                var showImgOnly = $scope.showImgOnly(item);

                if (!showImgOnly && !!('ontouchstart' in window)) {//check for touch device

                    //первый клик пропускаем
                    if (item == $scope.lastClickedItem) {
                        $scope.clickOnShadow(item, position, blockType, sectionName);
                    }
                    else {
                        //кликаем на второй клик
                        $scope.lastClickedItem = item;
                    }
                }
                else {
                    //на компе - кликаем сразу
                    $scope.clickOnShadow(item, position, blockType, sectionName);
                }
            };
        }]);