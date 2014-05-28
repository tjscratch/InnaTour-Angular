
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
            //$rootScope.$broadcast("avia.page.loaded", $routeParams);

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
                cardMonth: '',
                cardYear: '',
                cardHolder: '',
                cvc2: '',
                agree: false
            };

            $scope.visaOrMastercard = null;
            function trackVisaOrMC() {
                if ($scope.payModel.num1 != null && $scope.payModel.num1.length > 0) {
                    $scope.visaOrMastercard = $scope.payModel.num1.startsWith('4');
                }
            }

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
            
            $scope.formPure = true;

            //модель, показывает невалидную подсветку
            $scope.indicator = {
                num1: false,
                num2: false,
                num3: false,
                num4: false,
                cardMonth: false,
                cardYear: false,
                cardHolder: false,
                cvc2: false,
                agree: false
            };

            //признаки, что поле валидно
            $scope.isValid = {
                num1: true,
                num2: true,
                num3: true,
                num4: true,
                cardMonth: true,
                cardYear: true,
                cardHolder: true,
                cvc2: true,
                agree: true
            };

            $scope.indicatorValidate = function () {
                var keys = _.keys($scope.payModel);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    $scope.indicator[key] = isFieldInvalid(key);
                }
            }

            $scope.indicatorValidateKey = function (key) {
                $scope.indicator[key] = isFieldInvalid(key);
            }

            function isFieldInvalid (key) {
                var itemValue = $scope.payModel[key];
                var isValid = $scope.isValid[key];

                if (itemValue != null && (!_.isString(itemValue) || itemValue.length > 0)) {
                    if ($scope.formPure) {
                        //console.log('isFieldInvalid1, key: %s, isInvalid: %s', key, (!isValid && itemValue != null && itemValue.length > 0));
                        return !isValid && itemValue != null && itemValue.length > 0;//подсвечиваем только если что-то введено в полях
                    }
                    else {
                        //console.log('isFieldInvalid2, key: %s, isInvalid: %s', key, (!isValid));
                        return !isValid;
                    }
                }
                else {
                    //console.log('isFieldInvalid3, key: %s, isInvalid: %s', key, (!$scope.formPure));
                    return !$scope.formPure;
                }
            }

            $scope.validateField = function (key, value) {
                //console.log('validateField, key: %s, value: %s', key, value);
                if (key == 'num1' || key == 'num2' || key == 'num3' || key == 'num4') {
                    $scope.validate['num1']();
                    $scope.validate['num2']();
                    $scope.validate['num3']();
                    $scope.validate['num4']();
                    $scope.indicatorValidateKey('num1');
                    $scope.indicatorValidateKey('num2');
                    $scope.indicatorValidateKey('num3');
                    $scope.indicatorValidateKey('num4');
                }
                else {
                    $scope.validate[key]();
                    $scope.indicatorValidateKey(key);
                }
            }

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

            function initValidateModel() {
                function validateNumPart(value) {
                    return (value != null && value.length == 4);
                }

                $scope.validate = {
                    num1: function () {
                        var v = validateNumPart($scope.payModel.num1);
                        $scope.isValid.num1 = v;
                        return v;
                    },
                    num2: function () {
                        var v = validateNumPart($scope.payModel.num2);
                        $scope.isValid.num2 = v;
                        return v;
                    },
                    num3: function () {
                        var v = validateNumPart($scope.payModel.num3);
                        $scope.isValid.num3 = v;
                        return v;
                    },
                    num4: function () {
                        var v = validateNumPart($scope.payModel.num4);
                        $scope.isValid.num4 = v;
                        return v;
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
                    cardHolder: function validateCardholder() {
                        if ($scope.payModel.cardHolder.length > 0) {
                            $scope.isValid.cardHolder = true;
                            return true;
                        }
                        $scope.isValid.cardHolder = false;
                        return false;
                    },
                    cvc2: function validateCvv() {
                        if ($scope.payModel.cvc2.length == 3) {
                            $scope.isValid.cvc2 = true;
                            return true;
                        }
                        $scope.isValid.cvc2 = false;
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
                url: function () {
                    var host = app_main.host.replace('api.', 's.');
                    return host + '/files/doc/offer.pdf';
                }
            }

            $scope.cancelReservation = {
                show: function ($event) {
                    //alert('Не реализовано');
                    //eventsHelper.preventBubbling($event);
                    $scope.tarifs.show($event);
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
                        //$to.tooltipX("close");
                        try {
                            $to.tooltipX("close");
                            //$to.tooltipX("destroy");
                        }
                        catch (e) { };
                    }
                });
            }

            $scope.$watch('payModel', function () {
                trackVisaOrMC();
                closeErrPopups();
                //validateKeys();
            }, true);

            function validateKeys() {
                //console.log('validateKeys');
                var keys = _.keys($scope.validate);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var fn = $scope.validate[key];
                    if (fn != null)
                        fn();
                }
            }

            function validateAll() {
                //console.log('validate');
                validateKeys();
                validateNum();
                $scope.indicatorValidate();

                //var isValid = _.all(_.keys($scope.isValid), function (key) {
                //    return $scope.isValid[key] == true;
                //});
                //return isValid;
            }

            function validateAndShowPopup() {
                $scope.formPure = false;
                //console.log('validateAndShowPopup');
                validateAll();

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

            //focus
            function focusControl() {
                var self = this;
                
                self.navList = [];
                self.navCurrent = null;

                self.cardNumCont = $('.js-cardnum-block');
                self.num1 = { item: $('input:eq(0)', self.cardNumCont), key: 'num1' };
                self.num2 = { item: $('input:eq(1)', self.cardNumCont), key: 'num2' };
                self.num3 = { item: $('input:eq(2)', self.cardNumCont), key: 'num3' };
                self.num4 = { item: $('input:eq(3)', self.cardNumCont), key: 'num4' };

                self.validCont = $('.js-card-valid');
                self.month = { item: $('input:eq(0)', self.validCont), key: 'cardMonth' };
                self.year = { item: $('input:eq(1)', self.validCont), key: 'cardYear' };
                
                self.holder = { item: $('input.js-card-holder:eq(0)'), key: 'cardHolder' };

                self.navList.push(self.num1);
                self.navList.push(self.num2);
                self.navList.push(self.num3);
                self.navList.push(self.num4);
                self.navList.push(self.month);
                self.navList.push(self.year);
                self.navList.push(self.holder);

                self.init = function () {
                    self.navCurrent = self.navList[0];
                    self.navCurrent.item.focus();
                }
                self.next = function (key) {
                    //console.log('goNext, key: %s', key);
                    self.navCurrent = _.find(self.navList, function (item) {
                        return item.key == key;
                    });
                    if (self.navCurrent != null) {
                        var index = self.navList.indexOf(self.navCurrent);
                        index++;
                        self.navCurrent = self.navList[index];
                        if (self.navCurrent != null) {
                            self.navCurrent.item.select();
                            self.navCurrent.item.focus();
                        }
                    }
                }
            }
            $scope.focusControl = new focusControl();
            
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

                            $scope.getExpTimeFormatted = function (time) {
                                if (time != null) {
                                    //вычисляем сколько полных часов
                                    var h = Math.floor(time / 60);
                                    var addMins = time - h * 60;

                                    var hPlural = aviaHelper.pluralForm(h, 'час', 'часа', 'часов');
                                    var mPlural = aviaHelper.pluralForm(addMins, 'минута', 'минуты', 'минут');

                                    if (addMins == 0) {
                                        return h + " " + hPlural;
                                    }
                                    else if (h == 0) {
                                        return addMins + " " + mPlural;
                                    }
                                    else {
                                        return h + " " + hPlural + ": " + addMins + " " + mPlural;
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
                                m.experationMinuteFormatted = $scope.getExpTimeFormatted(Math.abs(m.experationMinute));
                                m.filter = data.Filter;
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
                            log('\npaymentService.getTarifs, data: ' + angular.toJson(data));
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
                $scope.focusControl.init();
                $scope.paymentDeadline.setUpdate();
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

            //срок оплаты билета
            function paymentDeadline() {
                var self = this;
                self.id = null;
                self.setUpdate = function () {
                    if (self.ifExpires()) {
                        self.runExiresLogic();
                    }
                    else {//не заэкспайрилось
                        self.id = $interval(function () {
                            self.updateExiration();
                            if (self.ifExpires()) {
                                self.runExiresLogic();
                            }
                        }, 60000);
                    }
                }
                self.updateExiration = function () {
                    if ($scope.reservationModel != null) {
                        $scope.reservationModel.experationMinute = +$scope.reservationModel.experationMinute - 1;
                        $scope.reservationModel.experationMinuteFormatted = $scope.getExpTimeFormatted($scope.reservationModel.experationMinute);
                    }
                }
                self.ifExpires = function () {
                    if ($scope.reservationModel != null) {
                        if ($scope.reservationModel.experationMinute != null && $scope.reservationModel.experationMinute > 0) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    return false;
                }
                self.runExiresLogic = function () {
                    //заэкспайрилось - показываем попап, отключаем апдейт
                    self.destroy();
                    $scope.baloon.show('', '', aviaHelper.baloonType.payExpires, function () {
                        $location.path(Urls.URL_AVIA);
                    }, {
                        successFn: function () {
                            $scope.baloon.hide();
                            var criteria = angular.fromJson($scope.reservationModel.filter);
                            var url = urlHelper.UrlToAviaSearch(criteria);
                            //log('redirect to url: ' + url);
                            $location.path(url);
                        }
                    });
                }
                self.destroy = function () {
                    if (self.id != null) {
                        $interval.cancel(self.id);
                    }
                }
            }
            $scope.paymentDeadline = new paymentDeadline();
            

            $scope.$on('$destroy', function () {
                $scope.paymentDeadline.destroy();
            });
        }]);
