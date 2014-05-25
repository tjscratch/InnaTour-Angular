
/* Controllers */

innaAppControllers.
    controller('AviaBuyTicketsCtrl', ['$log', '$timeout', '$interval', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper', 'urlHelper', 'innaApp.Urls',
        function AviaBuyTicketsCtrl($log, $timeout, $interval, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Urls) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams);

            //критерии из урла
            //$scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            //$scope.searchId = $scope.criteria.QueryId;

            $scope.orderNum = $routeParams.OrderNum;

            $scope.reservationModel = null;

            /*
CardNumber = "4012 0010 3714 1112";
Month = "12";
Year = "17";
Cvc = "486";
            */
            $scope.payModel = {
                num1: '',
                num2: '',
                num3: '',
                num4: '',
                cvc2: '',
                cardHolder: '',
                cardMonth: '',
                cardYear: '',
                agree: false
            };

            $scope.fillTestData = function ($event) {
                eventsHelper.preventBubbling($event);

                $scope.payModel = {
                    num1: '5469',
                    num2: '4000',
                    num3: '1273',
                    num4: '3023',
                    cvc2: '',
                    cardHolder: 'ILYA GERASIMENKO',
                    cardMonth: '07',
                    cardYear: '15',
                    agree: true
                };
            }

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

            function tarifs() {
                //log('tarifs');
                var self = this;

                self.isOpened = false;

                self.list = [];

                self.fillInfo = function () {
                    self.class = $scope.aviaInfo.CabineClass == 0 ? 'Эконом' : 'Бизнес';

                    _.each($scope.aviaInfo.EtapsTo, function (etap) {
                        self.list.push({
                            from: etap.OutPort, fromCode: etap.OutCode, to: etap.InPort, toCode: etap.InCode,
                            num: etap.TransporterCode + '-' + etap.Number
                        });
                    });

                    if ($scope.aviaInfo.EtapsBack != null) {
                        _.each($scope.aviaInfo.EtapsBack, function (etap) {
                            self.list.push({
                                from: etap.OutPort, fromCode: etap.OutCode, to: etap.InPort, toCode: etap.InCode,
                                num: etap.TransporterCode + '-' + etap.Number
                            });
                        });
                    }
                }

                self.selectedIndex = 0;
                self.setected = null;
                //self.class = $scope.criteria.CabinClass == 0 ? 'Эконом' : 'Бизнес';

                self.tarifsData = null;
                self.tarifItem = null;

                self.tarifClick = function ($event, item) {
                    eventsHelper.preventBubbling($event);
                    self.setected = item;
                    var index = self.list.indexOf(item);
                    self.tarifItem = self.tarifsData[index];
                }
                self.show = function ($event) {
                    eventsHelper.preventBubbling($event);
                    self.selectedIndex = 0;
                    self.setected = self.list[0];
                    self.tarifItem = self.tarifsData[0];
                    self.isOpened = true;
                }
                self.close = function ($event) {
                    eventsHelper.preventBubbling($event);
                    self.isOpened = false;
                }
            }
            $scope.tarifs = new tarifs();

            $scope.oferta = {
                show: function ($event) {
                    alert('Не реализовано');
                    eventsHelper.preventBubbling($event);
                }
            }

            $scope.cancelReservation = {
                show: function ($event) {
                    alert('Не реализовано');
                    eventsHelper.preventBubbling($event);
                }
            }

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
                        //console.log('closeErrPopups, id: ' + key);
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
                var self = this;
                var reservationModel = null;//storageService.getReservationModel();
                //log('\nReservationModel: ' + angular.toJson(reservationModel));

                if (reservationModel != null) {
                    $scope.reservationModel = reservationModel;
                    init();
                }
                else {
                    $scope.baloon.show('Проверка билетов', 'Подождите пожалуйста, это может занять несколько минут');
                    //запрос в api
                    paymentService.getPaymentData({
                        orderNum: $scope.orderNum
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

                            function getExpTimeFormatted(time) {
                                if (time != null) {
                                    //вычисляем сколько полных часов
                                    var h = Math.floor(time / 60);
                                    var addMins = time - h * 60;

                                    var hPlural = aviaHelper.pluralForm(h, 'час', 'часа', 'часов');

                                    if (addMins == 0) {
                                        return h + " " + hPlural;
                                    }
                                    else {
                                        return h + " " + hPlural + ": " + addMins + " минут";
                                    }
                                }
                                return "";
                            }

                            function bindApiModelToModel(data) {
                                var m = {};
                                var pasList = [];
                                _.each(data.Passengers, function (item) {
                                    pasList.push(getPassenger(item));
                                });
                                m.passengers = pasList;
                                m.price = data.Price;
                                m.expirationDate = dateHelper.apiDateToJsDate(data.ExperationDate);
                                m.expirationDateFormatted = aviaHelper.getDateFormat(m.expirationDate, 'dd MMM yyyy');
                                m.experationMinute = data.ExperationMinute;
                                m.experationMinuteFormatted = getExpTimeFormatted(Math.abs(data.ExperationMinute));
                                return m;
                            }

                            $scope.reservationModel = bindApiModelToModel(data);
                            $scope.aviaInfo = data.AviaInfo;
                            log('\nreservationModel: ' + angular.toJson($scope.reservationModel));

                            $scope.baloon.hide();

                            init();
                        }
                        else {
                            log('paymentService.getPaymentData error, data is null');
                            $scope.baloon.showGlobalAviaErr();
                        }
                    },
                    function (data, status) {
                        log('paymentService.getPaymentData error');
                        $scope.baloon.showGlobalAviaErr();
                    });
                }
            };
            initPayModel();

            function loadTarifs() {
                var self = this;
                getTarifs();

                function getTarifs() {
                    paymentService.getTarifs({ variantTo: $scope.aviaInfo.VariantId1, varianBack: $scope.aviaInfo.VariantId2 },
                        function (data) {
                            //log('paymentService.getTarifs, data: ' + angular.toJson(data));
                            $scope.tarifs.tarifsData = data;
                        },
                        function (data, status) {
                            log('paymentService.getTarifs error');
                        });
                }
            }

            function init() {
                loadTarifs();
                $scope.tarifs.fillInfo();
            };
            
            //data loading ===========================================================================
            
            $scope.processToBuy = function ($event) {
                eventsHelper.preventBubbling($event);

                if (validateAndShowPopup()) {

                    var cardNum = $scope.payModel.num1 + $scope.payModel.num2 + $scope.payModel.num3 + $scope.payModel.num4;

                    var apiPayModel = {
                        OrderNum: $scope.orderNum,
                        CardNumber: cardNum,
                        Cvc2: $scope.payModel.cvc2,
                        CardHolder: $scope.payModel.cardHolder,
                        CardMonth: $scope.payModel.cardMonth,
                        CardYear: $scope.payModel.cardYear
                    };

                    log('\napiPayModel: ' + angular.toJson(apiPayModel));

                    $scope.baloon.show('Подождите, идет оплата', 'Это может занять несколько минут');
                    paymentService.pay(apiPayModel,
                    function (data) {
                        log('\npaymentService.pay, data: ' + angular.toJson(data));
                        if (data != null && data.Status == 0) {
                            //успешно
                            if (data.PreauthStatus == 1) {
                                //3dSecure
                                processPay3d(data.Data);
                            }
                            else if (data.PreauthStatus == 2) {
                                $scope.is3dscheck = false;
                                //без 3dSecure
                                checkPayment();
                            }
                            else {
                                //ошибка
                                log('paymentService.pay error, data.PreauthStatus: ' + data.PreauthStatus);
                                $scope.baloon.showGlobalAviaErr();
                            }
                        }
                        else {
                            log('paymentService.pay error, data is null');
                            $scope.baloon.showGlobalAviaErr();
                        }
                    },
                    function (data, status) {
                        //ошибка
                        log('paymentService.pay error, data: ' + angular.toJson(data));
                        $scope.baloon.showGlobalAviaErr();
                    });
                }
            };

            function processPay3d(data) {
                var jData = angular.fromJson(data);
                console.log(angular.toJson(jData));
                var params = '';
                var keys = _.keys(jData);
                _.each(keys, function (key) {
                    if (keys.indexOf(key) > 0) {
                        params += '&';
                    }
                    params += key + '=' + encodeURIComponent(jData[key]);
                });

                $scope.baloon.hide();
                $scope.iframeUrl = ('/spa/templates/pages/avia/pay_form.html?' + params);

                $scope.is3dscheck = true;
                checkPayment();
            }

            function checkPayment() {
                $scope.isCkeckProcessing = false;
                check();

                var intCheck = $interval(function () {
                    check();
                }, 5000);

                function check() {
                    if (!$scope.isCkeckProcessing) {
                        $scope.isCkeckProcessing = true;
                        paymentService.payCheck($scope.orderNum, function (data) {
                            $scope.isCkeckProcessing = false;
                            log('paymentService.payCheck, data: ' + angular.toJson(data));
                            //data = true;
                            if (data != null) {
                                if (data == "true") {
                                    //прекращаем дергать
                                    $interval.cancel(intCheck);

                                    //скрываем попап с фреймом 3ds
                                    if ($scope.is3dscheck) {
                                        $scope.iframeUrl = null;
                                    }

                                    $scope.baloon.show('Билеты успешно выписаны', 'И отправены на электронную почту',
                                        aviaHelper.baloonType.success, function () {
                                            $location.path(Urls.URL_AVIA);
                                        }, {
                                            buttonCaption: 'Распечатать билеты', successFn: function () {
                                                //print
                                                log('print tickets');
                                                alert('Не реализовано');
                                            }
                                        });
                                }
                            }
                        }, function (data, status) {
                            $scope.isCkeckProcessing = false;
                            log('paymentService.payCheck error, data: ' + angular.toJson(data));
                        });
                    }
                }
                
            }
        }]);
