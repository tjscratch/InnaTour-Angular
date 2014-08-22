﻿/* Controllers */

innaAppControllers.
    controller('AviaReserveTicketsCtrl', [
        '$log',
        '$controller',
        '$timeout',
        '$scope',
        '$rootScope',
        '$routeParams',
        '$filter',
        '$location',
        'dataService',
        'paymentService',
        'storageService',
        'aviaHelper',
        'eventsHelper',
        'urlHelper',
        'Validators',
        'innaApp.Urls',
        function AviaReserveTicketsCtrl($log, $controller, $timeout, $scope, $rootScope, $routeParams, $filter, $location, dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Validators, Urls) {
            $controller('ReserveTicketsCtrl', { $scope: $scope });

            var self = this;

            function log(msg) {
                $log.log(msg);
            }


            $rootScope.$broadcast("avia.page.loaded", $routeParams);

            $scope.isAviaPage = true;

            //критерии из урла
            $scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.ticketsCount = aviaHelper.getTicketsCount($scope.criteria.AdultCount, $scope.criteria.ChildCount, $scope.criteria.InfantsCount);

            //====================================================
            //нужны в родителе
            $scope.fromDate = $scope.criteria.BeginDate;
            $scope.AdultCount = parseInt($scope.criteria.AdultCount);
            $scope.ChildCount = parseInt($scope.criteria.ChildCount);
            $scope.InfantsCount = parseInt($scope.criteria.InfantsCount);
            $scope.peopleCount = $scope.AdultCount + $scope.ChildCount + $scope.InfantsCount;
            //нужны в родителе
            //====================================================

            $scope.goBackUrl = function () {
                return '#' + urlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
            };

            $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $scope.criteria.CabinClass);

            $scope.goToPaymentClick = function ($event) {
                eventsHelper.preventBubbling($event);
                //просто закрываем
                $scope.popupItemInfo.isShow = false;
            }

            $scope.searchId = $scope.criteria.QueryId;

            $scope.objectToReserveTemplate = 'pages/avia/variant_partial.html';

            //для начала нужно проверить доступность билетов
            //var availableChecktimeout = $timeout(function () {
            //    $scope.baloon.show('Проверка доступности билетов', 'Подождите пожалуйста, это может занять несколько минут');
            //}, 300);

            $scope.baloon.showExpireCheck();

            //проверяем, что остались билеты для покупки
            paymentService.checkAvailability({ variantTo: $routeParams.VariantId1, varianBack: $routeParams.VariantId2 },
                function (data) {
                    $scope.safeApply(function () {
                        //data = false;
                        if (data == true) {
                            //если проверка из кэша - то отменяем попап
                            //$timeout.cancel(availableChecktimeout);

                            //загружаем все
                            loadDataAndInit();

                            //ToDo: debug
                            //$timeout(function () {
                            //    loadDataAndInit();
                            //}, 1000);
                        }
                        else {
                            //log('checkAvailability, false');
                            //$timeout.cancel(availableChecktimeout);

                            function goToSearch() {
                                var url = urlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
                                //log('redirect to url: ' + url);
                                $location.path(url);
                            }

                            $scope.baloon.showWithClose("Вариант больше недоступен", "Вы будете направлены на результаты поиска билетов",
                                function () {
                                    $timeout.cancel($scope.tmId);
                                    goToSearch();
                                });

                            $scope.tmId = $timeout(function () {
                                //очищаем хранилище для нового поиска
                                //storageService.clearAviaSearchResults();
                                $scope.baloon.hide();
                                //билеты не доступны - отправляем на поиск
                                goToSearch();
                            }, 3000);

                        }
                    });
                },
                function (data, status) {
                    //error
                    //$timeout.cancel(availableChecktimeout);
                    $scope.safeApply(function () {
                        //ошибка
                        log('paymentService.checkAvailability error');
                        $scope.showReserveError();
                    });
                });

            //$scope.$watch('validationModel', function (newVal, oldVal) {
            //    if (newVal === oldVal)
            //        return;

            //}, true);

            //$timeout(function () {
            //    loadToCountryAndInit(routeCriteria);
            //}, 2000);

            function loadDataAndInit() {
                var loader = new utils.loader();

                //data loading ===========================================================================
                function loadToCountry() {
                    var self = this;
                    //log('loadToCountryAndInit');
                    if ($scope.criteria.ToUrl != null && $scope.criteria.ToUrl.length > 0) {

                        dataService.getDirectoryByUrl($scope.criteria.ToUrl, function (data) {
                            $scope.$apply(function ($scope) {
                                if (data != null) {
                                    $scope.criteria.To = data.name;
                                    $scope.criteria.ToId = data.id;
                                    $scope.criteria.ToCountryName = data.CountryName;
                                    //оповещаем лоадер, что метод отработал
                                    loader.complete(self);
                                }
                            });
                        }, function (data, status) {
                            log('loadToCountry error: ' + $scope.criteria.ToUrl + ' status:' + status);
                        });
                    }
                };

                function getStoreItem() {
                    var self = this;
                    //var storeItem = null;//storageService.getAviaBuyItem();
                    ////log('storeItem: ' + angular.toJson(storeItem));
                    //if (storeItem != null) {
                    //    if (storeItem.item.VariantId2 == null)
                    //        storeItem.item.VariantId2 = 0;
                    //    //проверяем, что там наш итем
                    //    if ($scope.criteria.QueryId == storeItem.searchId &&
                    //        $scope.criteria.VariantId1 == storeItem.item.VariantId1 && $scope.criteria.VariantId2 == storeItem.item.VariantId2) {
                    //        $scope.searchId = storeItem.searchId;
                    //        $scope.item = storeItem.item;
                    //        //$scope.price = storeItem.item.price;

                    //        //оповещаем лоадер, что метод отработал
                    //        loader.complete(self);
                    //    }
                    //}
                    //else {
                    //запрос в api
                    paymentService.getSelectedVariant({
                            variantId1: $scope.criteria.VariantId1,
                            variantId2: $scope.criteria.VariantId2,
                            idQuery: $scope.criteria.QueryId
                        },
                        function (data) {
                            if (data != null && data != 'null') {
                                //дополняем полями
                                aviaHelper.addCustomFields(data);
                                //log('getSelectedVariant dataItem: ' + angular.toJson(data));
                                $scope.item = data;
                                $scope.price = data.Price;
                                //console.log('data:');
                                //console.log($scope.item);
                                //плюс нужна обработка, чтобы в item были доп. поля с форматами дат и прочее

                                //тарифы
                                $scope.loadTarifs($scope.criteria.VariantId1, $scope.criteria.VariantId2, $scope.item);

                                //оповещаем лоадер, что метод отработал
                                loader.complete(self);
                            }
                            else
                                $log.error('paymentService.getSelectedVariant error, data is null');
                        },
                        function (data, status) {
                            $log.error('paymentService.getSelectedVariant error');
                        });


                    //}
                };

                loader.init([loadToCountry, getStoreItem], init).run();
            };

            function init() {
                $scope.initPayModel();
                //console.log($scope.item);
            }

            $scope.afterPayModelInit = function () {
                //log('$scope.afterPayModelInit');
                $scope.baloon.hide();
                //$scope.fillDefaultModelDelay();
            };

            $scope.afterCompleteCallback = function () {
                //переходим на страницу оплаты
                var url = urlHelper.UrlToAviaTicketsBuy($scope.criteria.OrderNum);
                //log('processToPayment, url: ' + url);
                $location.path(url);
            }

            $scope.getApiModel = function (data) {
                var m = {};
                m.I = '';//data.name;
                m.F = '';//data.secondName;
                m.Email = data.email;
                m.Phone = data.phone;
                m.IsSubscribe = data.wannaNewsletter;

                var pasList = [];
                _.each(data.passengers, function (item) {
                    pasList.push($scope.getPassenger(item));
                });
                m.Passengers = pasList;

                m.SearchParams = {
                    SearchId: $scope.searchId,
                    VariantId1: $scope.item.VariantId1,
                    VariantId2: $scope.item.VariantId2
                };
                m.Filter = angular.toJson($scope.criteria);
                return m;
            }

            //бронируем
            $scope.reserve = function () {
                //console.log('$scope.reserve');
                var m = $scope.getApiModelForReserve();
                var model = m.model;
                var apiModel = m.apiModel;

                paymentService.reserve(apiModel,
                    function (data) {
                        $scope.$apply(function ($scope) {
                            log('order: ' + angular.toJson(data));
                            if (data != null && data.OrderNum != null && data.Status != null && data.Status == 1 && data.OrderNum.length > 0) {
                                //сохраняем orderId
                                //storageService.setAviaOrderNum(data.OrderNum);
                                $scope.criteria.OrderNum = data.OrderNum;

                                //аналитика
                                track.aviaGoBuy();

                                if ($scope.isAgency()) {
                                    $scope.goToB2bCabinet();
                                }
                                else {
                                    //сохраняем модель
                                    //storageService.setReservationModel(model);

                                    //успешно
                                    $scope.afterCompleteCallback();
                                }
                            }
                            else {
                                $scope.showReserveError();
                            }
                        });
                    },
                    function (data, status) {
                        $scope.$apply(function ($scope) {
                            //ошибка
                            log('paymentService.reserve error');
                            $scope.showReserveError();
                        });
                    });
            };

            $scope.showReserveError = function () {
                $scope.baloon.showGlobalAviaErr();
            }

            $scope.$on('$destroy', function () {
                $timeout.cancel($scope.tmId);
            });
        }]);
