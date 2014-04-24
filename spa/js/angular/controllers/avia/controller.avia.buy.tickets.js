
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
                num1: '1345',
                num2: '2322',
                num3: '3456',
                num4: '4876',
                cvc2: '123',
                cardHolder: 'Ivan Ivanov',
                cardMonth: '02',
                cardYear: '15',
                agree: false
            };

            function initValidateModel() {
                $scope.isValid = {
                    num1: true,
                    num2: true,
                    num3: true,
                    num4: true,
                    cvc2: true,
                    cardHolder: true,
                    cardMonth: true,
                    cardYear: true,
                    agree: true
                };

                function validateNum() {
                    function setNums(isValid) {
                        $scope.isValid.num1 = isValid;
                        $scope.isValid.num2 = isValid;
                        $scope.isValid.num3 = isValid;
                        $scope.isValid.num4 = isValid;
                    }
                    var cardNum = $scope.payModel.num1 + $scope.payModel.num2 + $scope.payModel.num3 + $scope.payModel.num4;
                    if (cardNum.length == 16) {
                        setNums(true);
                        return true;
                    }
                    setNums(false);
                    return false;
                }

                $scope.validate = {
                    num1: function () {
                        return validateNum();
                    },
                    num2: function () {
                        return validateNum();
                    },
                    num3: function () {
                        return validateNum();
                    },
                    num4: function () {
                        return validateNum();
                    },
                    cvc2: function validateCvv() {
                        if ($scope.payModel.cvc2.length == 3) {
                            $scope.isValid.cvc2 = true;
                            return true;
                        }
                        $scope.isValid.cvc2 = false;
                        return false;
                    },
                    cardHolder: function validateCardholder() {
                        if ($scope.payModel.cardHolder.length > 0) {
                            $scope.isValid.cardHolder = true;
                            return true;
                        }
                        $scope.isValid.cardHolder = false;
                        return false;
                    },
                    cardMonth: function validateCardMonth() {
                        if ($scope.payModel.cardMonth.length > 0) {
                            var iMonth = parseInt($scope.payModel.cardMonth);
                            if (iMonth >= 1 && iMonth <= 12) {
                                $scope.isValid.cardMonth = true;
                                return true;
                            }
                        }
                        $scope.isValid.cardMonth = false;
                        return false;
                    },
                    cardYear: function validateCardYear() {
                        if ($scope.payModel.cardYear.length > 0) {
                            var iYear = parseInt($scope.payModel.cardYear);
                            if (iYear >= 14) {
                                $scope.isValid.cardYear = true;
                                return true;
                            }
                        }
                        $scope.isValid.cardYear = false;
                        return false;
                    },
                    agree: function () {
                        $scope.isValid.agree = $scope.payModel.agree;
                        return $scope.isValid.agree;
                    }
                };
            }
            initValidateModel();

            $scope.validateError = function () {
                this.field = '';
                this.isValid = false;
            }

            function showPopupErr(id) {
                var $to = $('#' + id);
                if ($to.attr('tt') != 'true') {
                    $to.attr('tt', 'true');
                    $to.tooltipX({ autoShow: false, autoHide: false, position: { my: 'center top+22', at: 'center bottom' } });
                }
                $to.tooltipX("open");
            }

            function closeErrPopups() {
                _.each(_.keys($scope.validate), function (key) {
                    var $to = $('#' + key);
                    if ($to.attr('tt') == 'true') {
                        console.log('closeErrPopups, id: ' + key);
                        $to.tooltipX("close");
                    }
                });
            }

            $scope.$watch('payModel', function () {
                closeErrPopups();
                validateKeys();
            }, true);

            function validateKeys() {
                _.each(_.keys($scope.validate), function (key) {
                    var fn = $scope.validate[key];
                    if (fn != null)
                        fn();
                });
            }

            function validate() {
                validateKeys();

                var isValid = _.all(_.keys($scope.isValid), function (key) {
                    return $scope.isValid[key] == true;
                });
                return isValid;
            }

            function validateAndShowPopup() {
                validate();

                var keys = _.keys($scope.isValid);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if ($scope.isValid[key] == false) {
                        showPopupErr(key);
                        return false;
                    }
                }

                return true;
            }

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

                if (validateAndShowPopup()) {

                    var cardNum = $scope.payModel.num1 + $scope.payModel.num2 + $scope.payModel.num3 + $scope.payModel.num4;

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
