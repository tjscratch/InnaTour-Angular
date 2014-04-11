
'use strict';

/* Controllers */

innaAppControllers.
    controller('OffersListCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$location', 'dataService', 'sharedProperties', 'urlHelper',
        function OffersListCtrl($log, $scope, $rootScope, $routeParams, $filter, $location, dataService, sharedProperties, urlHelper) {
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
                    !$scope.isNullOrEmpty(item.BackTitleRow1) ||
                    !$scope.isNullOrEmpty(item.BackTitleRow2) ||
                    !$scope.isNullOrEmpty(item.BackSubTitleRow1) ||
                    !$scope.isNullOrEmpty(item.BackSubTitleRow2) ||
                    !$scope.isNullOrEmpty(item.BackPrice))
                    return false;
                else
                    return true;
            };

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
                $scope.offerClickInternal(item, $event, position, block.OfferLayoutType, section.Name);
            };

            $scope.offerClickInternal = function (item, $event, position, blockType, sectionName) {
                preventBubbling($event);

                function click(item) {
                    //var url = $scope.getHref(item);
                    //url = '/tours/?sta=on&city=832&country=77&resorts=&hotels=&stars=&meals=&currency=RUB&adults=2&kids=0&kids_ages=0,0,0&priceMin=0&priceMax=0&nightsMin=10&nightsMax=14&date1=25%2F03%2F2014&date2=04%2F04%2F2014';
                    //url = '#/individualtours/category/12';
                    //url = 'http://beta.inna.ru/tours/?sta=on&city=832&country=125&resorts=&hotels=&stars=401&meals=114&currency=RUB&adults=1&kids=0&kid1=0&kid2=0&kid3=0&priceMin=0&priceMax=0&nightsMin=7&nightsMax=7&date1=03%2F05%2F2014&date2=03%2F05%2F2014';
                    //log('offerClick, sectionName: ' + section.Name + '; name: ' + item.Name + '; url: ' + item.Url + '; position: ' + position + '; type: ' + block.OfferLayoutType);
                    track.offerClick(sectionName, blockType, item.Name, position, function () {
                        location.href = item.Url;
                    });
                    //location.href = item.Url;
                }

                //если без хувера, просто картинка - то сразу кликаем
                var showImgOnly = $scope.showImgOnly(item);

                if (!showImgOnly && !!('ontouchstart' in window)) {//check for touch device
                    //первый клик пропускаем
                    if (item == $scope.lastClickedItem) {
                        click(item);
                    }
                    else
                    {
                        //кликаем на второй клик
                        $scope.lastClickedItem = item;
                    }
                }
                else
                {
                    //на компе - кликаем сразу
                    click(item);
                }
            };
        }]);