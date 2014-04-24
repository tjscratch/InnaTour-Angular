
/* Controllers */

innaAppControllers.
    controller('AviaBuyTicketsCtrl', ['$log', '$timeout', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper', 'urlHelper',
        function AviaBuyTicketsCtrl($log, $timeout, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams);

            //критерии из урла
            $scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.searchId = $scope.criteria.QueryId;
            $scope.reservationModel = null;
            $scope.payModel = {
                num: {
                    num1: '1345',
                    num2: '2322',
                    num3: '3456',
                    num4: '4876'
                    
                },
                cvc2: '123',
                cardHolder: 'Ivan Ivanov',
                cardMonth: '02',
                cardYear: '15',
                agree: true
            };

            $scope.sexType = aviaHelper.sexType;

            //data loading ===========================================================================
            function initPayModel() {
                var loader = new utils.loader();

                function getPayModel() {
                    var self = this;
                    var reservationModel = storageService.getReservationModel();
                    log('\nReservationModel: ' + angular.toJson(reservationModel));

                    //reservationModel = null;
                    if (reservationModel != null) {
                        $scope.reservationModel = reservationModel;
                        //оповещаем лоадер, что метод отработал
                        loader.complete(self);
                    }
                    else {
                        //запрос в api
                        paymentService.getPaymentData({
                            orderNum: $scope.criteria.OrderNum
                        },
                        function (data) {
                            if (data != null) {
                                log('\ngetPaymentData data: ' + angular.toJson(data));

                                function cutZero(val) {
                                    return val.replace(' 0:00:00', '');
                                }
                                function getPassenger(data) {
                                    var m = {};
                                    m.sex = data.Sex;
                                    m.name = data.I;
                                    m.secondName = data.F;
                                    m.birthday = cutZero(data.Birthday);
                                    m.doc_series_and_number = data.Number;
                                    m.doc_expirationDate = cutZero(data.ExpirationDate);
                                    m.citizenship = {};
                                    m.citizenship.id = data.Citizen;
                                    m.citizenship.name = data.CitizenName;
                                    m.index = data.Index;

                                    m.bonuscard = {};
                                    m.bonuscard.airCompany = {};
                                    m.bonuscard.haveBonusCard = false;
                                    if (data.BonusCard != null && data.BonusCard.length > 0 &&
                                        data.TransporterName != null && data.TransporterName.length > 0) {
                                        m.bonuscard.haveBonusCard = true;
                                        m.bonuscard.number = data.BonusCard;
                                        m.bonuscard.airCompany.id = data.TransporterId;
                                        m.bonuscard.airCompany.name = data.TransporterName;
                                    }

                                    return m;
                                }

                                function bindApiModelToModel(data) {
                                    var m = {};
                                    //m.name = data.I;
                                    //m.secondName = data.F;
                                    //m.email = data.Email;
                                    //m.phone = data.Phone;

                                    var pasList = [];
                                    _.each(data.Passengers, function (item) {
                                        pasList.push(getPassenger(item));
                                    });
                                    m.passengers = pasList;

                                    m.price = data.Price;

                                    //m.SearchParams = {
                                    //    SearchId: $scope.searchId,
                                    //    VariantId1: $scope.item.VariantId1,
                                    //    VariantId2: $scope.item.VariantId2
                                    //};
                                    return m;
                                }

                                $scope.reservationModel = bindApiModelToModel(data);
                                log('\nreservationModel: ' + angular.toJson($scope.reservationModel));

                                //оповещаем лоадер, что метод отработал
                                loader.complete(self);
                            }
                        },
                        function (data, status) {
                            log('paymentService.getPaymentData error');
                        });
                    }
                };

                loader.init([getPayModel], init).run();
            };
            initPayModel();

            function init() {

            };
            //data loading ===========================================================================
            
            $scope.processToBuy = function ($event) {
                eventsHelper.preventBubbling($event);

                if ($scope.payModel.agree && isAllDataLoaded()) {
                    var cardNum = $scope.payModel.num.num1 + $scope.payModel.num.num2 + $scope.payModel.num.num3 + $scope.payModel.num.num4;

                    var apiPayModel = {
                        OrderNum: $scope.criteria.OrderNum,
                        CardNumber: cardNum,
                        Cvc2: $scope.payModel.cvc2,
                        CardHolder: $scope.payModel.cardHolder,
                        CardMonth: $scope.payModel.cardMonth,
                        CardYear: $scope.payModel.cardYear
                    };

                    log('\napiPayModel: ' + angular.toJson(apiPayModel));

                    paymentService.pay(apiPayModel,
                    function (data) {
                        log('\npaymentService.pay, data: ' + angular.toJson(data));
                        if (data != null) {
                            //успешно
                            alert('Успешно!!! \n' + angular.toJson(data));
                        }
                    },
                    function (data, status) {
                        //ошибка
                        log('paymentService.pay error');
                        alert('Ошибка!!! \n' + angular.toJson(data));
                    });
                }
            };
        }]);
