﻿
'use strict';

/* Directives */

innaAppDirectives.directive('popupForm', function () {
    return {
        controller: ['$scope', 'dataService', function ($scope, dataService) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.isOpened = false;

            $scope.popupForm_Show = function (offer) {
                if (offer == null) {
                    $scope.request.init_main();
                }
                else {
                    $scope.request.init_ITCategory(offer);
                }
                $scope.isOpened = true;
            };
            $scope.popupForm_Close = function () {
                $scope.isOpened = false;
            };

            $scope.requestType = { main: "main", cat_it: "cat_it" };//тип заявки: главная(main), или на категории ИТ(cat_it)

            $scope.request = {};
            $scope.request.type = $scope.requestType.main;
            $scope.request.offersCategoriesId = null;
            $scope.request.isValid = true;
            $scope.request.offer = null;
            $scope.request.isSubscribe = true;
            $scope.request.name = "";
            $scope.request.phone = "";
            $scope.request.email = "";
            $scope.request.comments = "";

            $scope.request.subscribeClick = function () {
                $scope.request.isSubscribe = !$scope.request.isSubscribe;
            };

            $scope.request.init_main = function () {
                //log('request.init_main');
                $scope.request.type = $scope.requestType.main;
                $scope.request.offersCategoriesId = null;
                $scope.request.offer = null;
                $scope.request.name = "";
                $scope.request.phone = "";
                $scope.request.email = "";
                $scope.request.comments = "\
Откуда: (Город вылета)\n\
Куда: (Страна, курорт или отель)\n\
Кто едет: (Сколько взрослых и детей, возраст детей)\n\
Дата вылета и продолжительность:\n\
Примерный бюджет: (руб.)";
                $scope.request.isSubscribe = true;
                $scope.request.isValid = true;
                $scope.isOpened = true;
            };

            $scope.request.init_ITCategory = function (offer) {
                //log('request.init_ITCategory');
                $scope.request.type = $scope.requestType.cat_it;
                $scope.request.offersCategoriesId = app.constants.offersCategoriesProgramm;//тип заявки
                $scope.request.offer = offer;
                $scope.request.name = "";
                $scope.request.phone = "";
                $scope.request.email = "";
                $scope.request.comments = "";
                $scope.request.isSubscribe = null;
                $scope.request.isValid = true;
                $scope.isOpened = true;
            };

            $scope.request.send = function () {
                function validate() {
                    if ($scope.request.phone.length > 0)
                        $scope.request.isValid = true;
                    else
                        $scope.request.isValid = false;

                    return $scope.request.isValid;
                }

                if (validate()) {
                    //alert($scope.request.comments);
                    //return;
                    $scope.popupForm_Close();

                    //send
                    dataService.sendITCategoryRequest($scope.request, function (data) {
                        //log('send request success');
                        //success
                        //alert('Заявка отправлена');
                    }, function (data, status) {
                        //log('send request error');
                        //error
                        //alert('Ошибка при отправке заявки');
                    });

                }
            };

        }]
    };
});
