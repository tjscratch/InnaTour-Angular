﻿/* Controllers */

innaAppControllers.
    controller('AviaBuyTicketsCtrl', [
        '$log',
        '$timeout',
        '$interval',
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
        'innaApp.Urls',

        // components
        '$templateCache',
        'Balloon',
        function AviaBuyTicketsCtrl($log, $timeout, $interval, $scope, $rootScope, $routeParams, $filter, $location, dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Urls
            , $templateCache, Balloon) {

            var self = this;

            var B2B_HOST = window.DEV && window.DEV_B2B_HOST || app_main.b2bHost;
            $scope.B2B_HOST_Order = B2B_HOST + '/Order/Edit/';

            function log(msg) {
                $log.log(msg);
            }


            //$rootScope.$broadcast("avia.page.loaded", $routeParams);

            //критерии из урла
            //$scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            //$scope.searchId = $scope.criteria.QueryId;

            $scope.orderNum = $routeParams.OrderNum;
            $scope.helper = aviaHelper;

            $scope.reservationModel = null;

            $scope.objectToReserveTemplate = 'pages/avia/variant_partial.html';
            function setPackageTemplate() {
                $scope.objectToReserveTemplate = 'pages/dynamic/inc/reserve.html';
            }

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
                    num1: '',
                    num2: '',
                    num3: '',
                    num4: '',
                    cvc2: '',
                    cardHolder: '',
                    cardMonth: '',
                    cardYear: '',
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

            function isFieldInvalid(key) {
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

            $scope.tarifs = new $scope.helper.tarifs();

            $scope.hotelRules = new $scope.helper.hotelRules();

            $scope.setOferta = function (isDp) {
                var url = app_main.staticHost + '/files/doc/offer.pdf';

                if (isDp) {
                    url = app_main.staticHost + '/files/doc/Oferta_packages.pdf';
                }

                $scope.oferta = {
                    url: function () {
                        return url;
                    }
                }
            }
            
            $scope.TKP = {
                url: function () {
                    return app_main.staticHost + '/files/doc/TCH.pdf';
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
                    $to.tooltipX({ autoShow: false, autoHide: false, position: { my: 'center top+22', at: 'center bottom' },
                        items: "[data-title]",
                        content: function () {
                            return $to.data("title");
                        }
                    });
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
                        catch (e) {
                        }
                        ;
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

            $scope.visaControl = new aviaHelper.visaControl();

            function visaNeededCheck() {
                if ($scope.reservationModel != null && $scope.reservationModel.passengers != null && $scope.aviaInfo != null) {
                    //Id-шники гражданств пассажиров
                    var passengersCitizenshipIds = _.map($scope.reservationModel.passengers, function (pas) {
                        return pas.citizenship.id;
                    });
                    $scope.visaControl.check(passengersCitizenshipIds, $scope.aviaInfo);
                }
            }

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

            function scrollControl() {
                var self = this;
                self.scrollToCards = function () {
                    $('html, body').animate({
                        scrollTop: $(".b-tickets-info-container").offset().top + 400
                    }, 200);
                }
            }

            $scope.scrollControl = new scrollControl();

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
                    $scope.baloon.show('Подождите пожалуйста', 'Это может занять несколько секунд');

                    //запрос в api
                    paymentService.getPaymentData({
                            orderNum: $scope.orderNum
                        },
                        function (data) {
                            if (data != null) {

                                //log('\ngetPaymentData data: ' + angular.toJson(data));
                                //console.log('getPaymentData:');
                                //console.log(data);

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

                                $scope.getExpTimeSecFormatted = function (time) {
                                    if (time != null) {
                                        //вычисляем сколько полных часов
                                        var h = Math.floor(time / 3600);
                                        time %= 3600;
                                        var m = Math.floor(time / 60);
                                        var s = time % 60;

                                        var hPlural = aviaHelper.pluralForm(h, 'час', 'часа', 'часов');
                                        var mPlural = 'мин'; //aviaHelper.pluralForm(addMins, 'минута', 'минуты', 'минут');
                                        var sPlural = 'сек';

                                        var res = [];
                                        if (h > 0) {
                                            res.push(h + " " + hPlural);
                                        }
                                        if (m > 0) {
                                            res.push(m + " " + mPlural);
                                        }
                                        if (s > 0) {
                                            res.push(s + " " + sPlural);
                                        }
                                        return res.join(': ');
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
                                    m.experationSeconds = data.ExperationMinute * 60 - 1; // делаем в секундах
                                    m.experationSecondsFormatted = $scope.getExpTimeSecFormatted(Math.abs(m.experationSeconds));
                                    m.filter = data.Filter;
                                    m.Name = data.Name;
                                    m.LastName = data.LastName;
                                    m.Email = data.Email;
                                    m.Phone = data.Phone;
                                    m.IsSubscribe = data.IsSubscribe;

                                    m.IsService = data.IsService;
                                    return m;
                                }

                                //проверяем не оплачен ли уже заказ
                                if (data.IsPayed == true) {
                                    //уже оплачен
                                    $scope.baloon.showAlert('Заказ уже оплачен', '', function () {
                                        $scope.baloon.hide();
                                        $location.url(Urls.URL_ROOT);
                                    });
                                }
                                else {
                                    $scope.reservationModel = bindApiModelToModel(data);
                                    if ($scope.reservationModel.IsService) {//сервисный сбор

                                    }
                                    else {
                                        if (data.Hotel != null) {
                                            setPackageTemplate();
                                            aviaHelper.addAggInfoFields(data.Hotel);
                                            $scope.hotel = data.Hotel;
                                            $scope.room = data.Hotel.Room;
                                            $scope.isBuyPage = true;

                                            //правила отмены отеля
                                            $scope.hotelRules.fillData(data.Hotel);
                                        }

                                        var isDp = (data.Hotel != null);
                                        $scope.setOferta(isDp);

                                        aviaHelper.addCustomFields(data.AviaInfo);
                                        $scope.aviaInfo = data.AviaInfo;
                                        $scope.ticketsCount = aviaHelper.getTicketsCount(data.AviaInfo.AdultCount, data.AviaInfo.ChildCount, data.AviaInfo.InfantsCount);

                                        function getIATACodes(info) {
                                            var res = { codeFrom: '', codeTo: '' };
                                            if (info.EtapsTo != null && info.EtapsTo.length > 0) {
                                                res.codeFrom = info.EtapsTo[0].OutCode;//первый
                                                res.codeTo = info.EtapsTo[info.EtapsTo.length - 1].InCode;//последний
                                            }
                                            return res;
                                        }
                                        //коды аэропортов
                                        $scope.ports = getIATACodes(data.AviaInfo);

                                        //нужна ли виза
                                        visaNeededCheck();
                                    }

                                    $scope.price = $scope.reservationModel.price;
                                    //признак, что b2b заказ
                                    $scope.isAgency = data.IsAgency;
                                    $scope.orderId = data.OrderId;

                                    //log('\nreservationModel: ' + angular.toJson($scope.reservationModel));
                                    //console.log('reservationModel:');
                                    //console.log($scope.reservationModel);

                                    $scope.baloon.hide();

                                    //aviaHelper.addCustomFields(data);
                                    //$scope.item = data;

                                    init();
                                }
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
                            //console.log('\npaymentService.getTarifs, data:');
                            //console.log(data);
                            $scope.tarifs.tarifsData = data;
                        },
                        function (data, status) {
                            log('paymentService.getTarifs error');
                        });
                }
            }

            function init() {
                if ($scope.reservationModel.IsService) {
                }
                else {
                    //if ($scope.hotel != null) {
                    //    loadTarifs();
                    //    $scope.tarifs.fillInfo($scope.aviaInfo);
                    //}
                    loadTarifs();
                    $scope.tarifs.fillInfo($scope.aviaInfo);
                }
                $scope.focusControl.init();
                $scope.paymentDeadline.setUpdate();
                $scope.scrollControl.scrollToCards();
            };

            //data loading ===========================================================================

            function showPaymentProcessing() {
                $scope.baloon.show('Подождите, идет оплата', 'Это может занять несколько минут');
            }

            $scope.processToBuy = function ($event) {
                eventsHelper.preventBubbling($event);

                if (!$scope.paymentDeadline.ifExpires() && validateAndShowPopup()) {

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

                    showPaymentProcessing();

                    //еще
                    var pageType = getActionType();
                    switch (pageType) {
                        case actionTypeEnum.service:
                            {
                                break;
                            }
                        case actionTypeEnum.dp:
                            {
                                track.dpPayBtnSubmit();
                                break;
                            }
                        case actionTypeEnum.avia:
                            {
                                track.aviaPayBtnSubmit();
                                break;
                            }
                    }

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
                                    //testPayComplete();
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

            function buyFrame() {
                var self = this;
                self.iframeUrl = null;
                self.isOpened = false;
                self.open = function () {
                    self.isOpened = true;
                }
                self.hide = function () {
                    self.isOpened = false;
                }

                self.listenCloseEvent = function () {
                    $('#buy-listener').on('inna.buy.close', function (event, data) {
                        //console.log('triggered inna.buy.close, isOrderPaid: ' + $scope.isOrderPaid);
                        $scope.safeApply(function () {
                            if ($scope.isOrderPaid == false) {
                                $scope.baloon.show('Подождите, идет оплата', 'Это может занять несколько минут');
                            }
                            self.hide();
                        })
                    });
                }
                self.listenCloseEvent();

                self.listenForFrameLoad = function () {
                    //слушаем событие с фрейма
                    $('#buy-listener').on('inna.buy.frame.init', function (event, data) {
                        $scope.safeApply(function () {
                            //console.log('controller received inna.buy.frame.init');
                            $('#buy_frame_main').on('load', function () {
                                //отписываемся
                                $('#buy_frame_main').off('load');
                                //console.log('buy_frame_main load');
                                //console.log($('#buy_frame_main'));

                                //закрываем попап ожидаем...
                                $scope.baloon.hide();
                                $scope.buyFrame.open();
                            });
                        })
                    });
                }

                return self;
            }

            $scope.buyFrame = new buyFrame();

            function processPay3d(data) {
                var jData = angular.fromJson(data);
                //console.log('jData: ' + angular.toJson(jData));
                jData.TermUrl = app_main.host + '/api/v1/Psb/PaymentRederect';
                //console.log('jData: ' + angular.toJson(jData));
                var params = '';
                var keys = _.keys(jData);
                _.each(keys, function (key) {
                    if (keys.indexOf(key) > 0) {
                        params += '&';
                    }
                    params += key + '=' + encodeURIComponent(jData[key]);
                });

                //дождемся пока фрейм с формой запостит и сработает load
                $scope.buyFrame.listenForFrameLoad();
                $scope.buyFrame.iframeUrl = ('/spa/templates/pages/avia/pay_form.html?' + params);

                $scope.is3dscheck = true;
                checkPayment();
            }

            //function testPayComplete() {
            //    $timeout(function () {
            //        var data = 1;
            //        $scope.isCkeckProcessing = false;
            //        log('paymentService.payCheck, data: ' + angular.toJson(data));
            //        //data = true;
            //        if (data != null) {
            //            if (data.Result == 1 || data.Result == 2) {
            //                //прекращаем дергать
            //                $interval.cancel(intCheck);

            //                //скрываем попап с фреймом 3ds
            //                if ($scope.is3dscheck) {
            //                    $scope.buyFrame.hide();
            //                }

            //                if (data.Result == 1) {
            //                    $scope.baloon.show('Билеты успешно выписаны', 'И отправены на электронную почту\n' + $scope.reservationModel.Email,
            //                    aviaHelper.baloonType.success, function () {
            //                        $location.path(Urls.URL_AVIA);
            //                    }, {
            //                        //buttonCaption: 'Распечатать билеты', successFn: function () {
            //                        //    //print
            //                        //    log('print tickets');
            //                        //    alert('Не реализовано');
            //                        //}
            //                        buttonCaption: 'Ok', successFn: function () {
            //                            $scope.baloon.hide();
            //                            $location.path(Urls.URL_AVIA);
            //                        }
            //                    });
            //                }
            //                else if (data.Result == 2) {
            //                    $scope.baloon.showGlobalAviaErr();
            //                }
            //            }
            //        }
            //    }, 5000);
            //}

            //var intCheck = null;
            function checkPayment() {
                $scope.isCkeckProcessing = false;
                $scope.isOrderPaid = false;
                check();

                var intCheck = $interval(function () {
                    check();
                }, 5000);

                function check() {
                    if (!$scope.isCkeckProcessing) {
                        $scope.isCkeckProcessing = true;

                        paymentService.payCheck($scope.orderNum, function (data) {
                            try {
                                log('paymentService.payCheck, data: ' + angular.toJson(data));
                                //data = { Result: 1 };
                                if (data != null) {

                                    /*------------*/
                                    //data.Result = 1;
                                    /*------------*/

                                    if (data.Result > 0) {
                                        //пришел ответ - или оплачено или ошибка
                                        $scope.isOrderPaid = true;

                                        //прекращаем дергать
                                        if (data.Result != 4) {
                                            $interval.cancel(intCheck);
                                        }

                                        //скрываем попап с фреймом 3ds
                                        if ($scope.is3dscheck) {
                                            $scope.buyFrame.hide();
                                        }

                                        if (data.Result == 1) {
                                            var pageType = getActionType();

                                            //если агентство - отправляем обратно в b2b интерфейс
                                            if ($scope.isAgency) {
                                                var b2bOrder = $scope.B2B_HOST_Order + $scope.orderId;
                                                console.log('redirecting to: ' + b2bOrder);
                                                window.location = b2bOrder;
                                            }
                                            else {
                                                if (!$scope.hotel) {
                                                    //аналитика - авиа - заказ выполнен
                                                    if (pageType == actionTypeEnum.avia) {
                                                        track.aivaPaymentSubmit($scope.orderNum, $scope.price, $scope.ports.codeFrom, $scope.ports.codeTo);
                                                    }

                                                    $scope.baloon.show('Заказ Выполнен', 'Документы отправлены на электронную почту\n' + $scope.reservationModel.Email,
                                                        aviaHelper.baloonType.success,
                                                        function () {
                                                            $location.path(Urls.URL_AVIA);
                                                        },
                                                        {
                                                            //buttonCaption: 'Распечатать билеты', successFn: function () {
                                                            //    //print
                                                            //    log('print tickets');
                                                            //    alert('Не реализовано');
                                                            //}
                                                            buttonCaption: 'Ok', successFn: function () {
                                                                $scope.baloon.hide();
                                                                $location.path(Urls.URL_AVIA);
                                                            }
                                                        });
                                                } else if ($scope.hotel != null) {
                                                    //аналитика - ДП - заказ выполнен
                                                    if (pageType == actionTypeEnum.dp) {
                                                        track.dpPaymentSubmit($scope.orderNum, $scope.price, $scope.ports.codeFrom, $scope.ports.codeTo, $scope.hotel.HotelName);
                                                    }

                                                    redirectSuccessBuyPackage();
                                                }
                                            }
                                        }
                                        else if (data.Result == 2) {//ошибка при бронировании
                                            $scope.baloon.showGlobalAviaErr();
                                        }
                                        else if(data.Result == 3){//ошибка оплаты
                                            $scope.baloon.hide();
                                            $scope._baloon = new Balloon({
                                                data : {
                                                    balloonClose : true
                                                },
                                                partials : {
                                                    balloonContent : $templateCache.get('components/balloon/templ/pay-error.html')
                                                }
                                            }).show();
                                        }
                                        else if (data.Result == 4) {//заказ оплачен, но не прошла выписка
                                            showPaymentProcessing();
                                        }
                                    }
                                }
                            }
                            catch (e) {
                            //    console.error(e);
                            }
                            finally {
                                $scope.isCkeckProcessing = false;
                            }
                        }, function (data, status) {
                            $scope.isCkeckProcessing = false;
                            log('paymentService.payCheck error, data: ' + angular.toJson(data));
                        });
                    }

                }
            }

            var actionTypeEnum = { avia: 'avia', dp: 'dp', service: 'service' };

            function getActionType() {
                //сервисный сбор
                if ($scope.reservationModel.IsService) {
                    return actionTypeEnum.service;
                }
                else {
                    //если ДП
                    if ($scope.hotel != null) {
                        return actionTypeEnum.dp
                    }
                    else {
                        //авиа
                        return actionTypeEnum.avia;
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
                        }, 1000);
                    }
                }
                self.updateExiration = function () {
                    if ($scope.reservationModel != null) {
                        $scope.reservationModel.experationSeconds = +$scope.reservationModel.experationSeconds - 1;
                        $scope.reservationModel.experationSecondsFormatted = $scope.getExpTimeSecFormatted($scope.reservationModel.experationSeconds);
                        //console.log('Осталось %s секунд', $scope.reservationModel.experationSecondsFormatted);
                    }
                }
                self.ifExpires = function () {
                    if ($scope.reservationModel != null) {
                        if ($scope.reservationModel.experationSeconds != null && $scope.reservationModel.experationSeconds > 0) {
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

                    var btCaption = null;
                    var successFn = null;
                    var closeUrl = null;

                    var pageType = getActionType();
                    switch (pageType) {
                        case actionTypeEnum.service:
                        {
                            closeUrl = Urls.URL_ROOT;

                            successFn = function () {
                                $scope.baloon.hide();
                                $location.path(Urls.URL_ROOT);
                            }

                            btCaption = 'На главную';
                            break;
                        }
                        case actionTypeEnum.dp:
                        {
                            closeUrl = Urls.URL_DYNAMIC_PACKAGES;

                            successFn = function () {
                                $scope.baloon.hide();
                                $location.path(Urls.URL_DYNAMIC_PACKAGES);
                            }
                            break;
                        }
                        case actionTypeEnum.avia:
                        {
                            closeUrl = Urls.URL_AVIA;

                            successFn = function () {
                                $scope.baloon.hide();
                                var url = Urls.URL_AVIA;
                                if ($scope.reservationModel.filter != null && $scope.reservationModel.filter.length > 0) {
                                    var criteria = angular.fromJson($scope.reservationModel.filter);
                                    url = urlHelper.UrlToAviaSearch(criteria);
                                }
                                //log('redirect to url: ' + url);
                                $location.path(url);
                            }
                            break;
                        }
                    }

                    $scope.baloon.show(null, null, aviaHelper.baloonType.payExpires, function () {
                        $location.path(closeUrl);
                    }, {
                        successFn: successFn,
                        buttonCaption: btCaption
                    });
                }
                self.destroy = function () {
                    if (self.id != null) {
                        $interval.cancel(self.id);
                    }
                }
            }

            $scope.paymentDeadline = new paymentDeadline();

            function destroyPopups() {
                _.each(_.keys($scope.validate), function (key) {
                    var $to = $('#' + key);
                    try {
                        $to.tooltipX("destroy");
                    }
                    catch (e) {
                    }
                    ;
                });
            }


            function redirectSuccessBuyPackage() {
                $location.search({});
                $location.path('packages/buy/success/' + $scope.orderNum);
            }

            $scope.$on('$destroy', function () {
                $scope.baloon.hide();
                if($scope._baloon) {
                    $scope._baloon.teardown();
                    $scope._baloon = null;
                }
                $scope.paymentDeadline.destroy();
                destroyPopups();
                $('#buy-listener').off();
                $scope = null;
            });
        }]);
