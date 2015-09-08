/* Controllers */

innaAppControllers.
    controller('AviaBuyTicketsCtrl', [
        'RavenWrapper',
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
        function AviaBuyTicketsCtrl(RavenWrapper, $log, $timeout, $interval, $scope, $rootScope, $routeParams, $filter, $location, dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Urls, $templateCache, Balloon) {

            Raven.setExtraContext({key: "__BUY_TICKETS_CONTEXT__"});

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


            //логика для оплаты у связного
            function svyaznoyPayControl(){
                var self = this;

                self.isSvyaznoyPay = true;
                var partner = window.partners ? window.partners.getPartner() : null;
                if (partner!= null && partner.name == 'euroset'){
                    self.isSvyaznoyPay = false;
                }

                self.blockViewTypeEnum = {
                    all: 'all',
                    svyaznoy: 'svyaznoy',
                    euroset: 'euroset'
                };

                self.payType = 0;
                self.orderNum;
                self.orderNumPrefix = '467';
                //заголовок в чекбоксе выбора
                self.checkListTitle = 'наличными в Связном или Евросети';
                //тип блока в описании
                self.blockViewType = self.blockViewTypeEnum.all;

                self.init = function () {
                    if (window.partners) {
                        //согласно задаче
                        //https://innatec.atlassian.net/browse/IN-4927
                        var pageType = window.partners.getSvyaznoyPageType();
                        switch (pageType) {
                            case window.partners.SvyaznoyPageType.OperatorPage: {
                        self.orderNumPrefix = '466';
                                break;
                            }
                            case window.partners.SvyaznoyPageType.ToursPage: {
                                self.orderNumPrefix = '468';
                                break;
                            }
                            case window.partners.SvyaznoyPageType.NotSvyaznoyPage: {
                                self.orderNumPrefix = '467';
                                break;
                            }
                        }

                        var partner = window.partners.getPartner();
                        if (partner){
                            if (partner.name == 'svyaznoy'){
                                self.checkListTitle = 'наличными в Связном';
                                self.blockViewType = self.blockViewTypeEnum.svyaznoy;
                            }
                            else if (partner.name == 'euroset') {
                                self.checkListTitle = 'наличными в Евросети';
                                self.blockViewType = self.blockViewTypeEnum.euroset;
                            }
                        }

                    }

                    $scope.$watch('orderNum', function (num) {
                        self.setOrderNum(num);
                    });

                    self.setOrderNum($scope.orderNum);
                };

                self.setTime = function () {
                    if ($scope.reservationModel && $scope.reservationModel.experationSeconds != null && $scope.reservationModel.experationSeconds > 0) {
                        var t = new Date();
                        t.setSeconds(t.getSeconds() + $scope.reservationModel.experationSeconds);
                        self.time = '&time=' + +t;
                    }
                };

                self.setOrderNum = function (num) {
                    self.orderNum = self.orderNumPrefix + '-' + num;
                };

                self.print = function ($event) {
                    $event.preventDefault();
                    //svyaznoy_print_block
                };

                self.openAdress = function ($event) {
                    $event.preventDefault();
                };
            }

            $scope.svyaznoyPayControl = new svyaznoyPayControl();

            $scope.isCkeckProcessing = false;
            $scope.orderNum = $routeParams.OrderNum;
            $scope.helper = aviaHelper;

            $scope.reservationModel = null;

            $scope.objectToReserveTemplate = 'pages/avia/variant_partial.html';
            function setPackageTemplate() {
                $scope.objectToReserveTemplate = 'pages/page-reservation/templ/reserve-include.html';
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
                cvc2: ''
                //agree: false
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
                    cardYear: ''
                    //agree: true
                };
            };

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
                cvc2: false
                //agree: false
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
                cvc2: true
                //agree: true
            };

            $scope.indicatorValidate = function () {
                var keys = _.keys($scope.payModel);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    $scope.indicator[key] = isFieldInvalid(key);
                }
            };

            $scope.indicatorValidateKey = function (key) {
                $scope.indicator[key] = isFieldInvalid(key);
            };

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
                    }
                    //agree: function () {
                    //    $scope.isValid.agree = $scope.payModel.agree;
                    //    return $scope.isValid.agree;
                    //}
                };
            }

            initValidateModel();

            $scope.tarifs = new $scope.helper.tarifs();

            $scope.hotelRules = new $scope.helper.hotelRules();

            $scope.insuranceRules = new $scope.helper.insuranceRules();

            $scope.setOferta = function (isDp) {
                var url = app_main.staticHost + '/files/doc/offer.pdf';

                if (window.partners && window.partners.isFullWLOrB2bWl()) {
                    url = normalizeUrl(window.partners.getPartner().offertaContractLink);
                }
                else {
                    url = app_main.staticHost + '/files/doc/Oferta_packages.pdf';
                }

                function normalizeUrl(url){
                    //если путь относительный
                    //"/Files/Doc/150715155346/150723141900/offer_premiertur76.pdf"
                    if (url && url.indexOf('/') == 0) {
                        //то дописываем до полного на статик
                        url = app_main.staticHost + url;
                    }
                    return url;
                }

                $scope.oferta = {
                    url: function () {
                        return url;
                    }
                };


                //TCH
                var TCH_url = app_main.staticHost + '/files/doc/TCH.pdf';
                if (window.partners && window.partners.isFullWLOrB2bWl()
                    && window.partners.getPartner().TCHLink != null
                    && window.partners.getPartner().TCHLink.length > 0) {
                    TCH_url = normalizeUrl(window.partners.getPartner().TCHLink);
                }
                else {
                    TCH_url = app_main.staticHost + '/files/doc/TCH.pdf';
                }

                $scope.TKP = {
                    url: function () {
                        return TCH_url;
                    }
                };
            };

            $scope.cancelReservation = {
                show: function ($event) {
                    //alert('Не реализовано');
                    //eventsHelper.preventBubbling($event);
                    $scope.tarifs.show($event);
                }
            };

            $scope.validateError = function () {
                this.field = '';
                this.isValid = false;
            };

            function showPopupErr(id) {
                var $to = $('#' + id);
                if ($to.attr('tt') != 'true') {
                    $to.attr('tt', 'true');
                    $to.tooltipX({
                        autoShow: false, autoHide: false, position: {my: 'center top+22', at: 'center bottom'},
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
                self.num1 = {item: $('input:eq(0)', self.cardNumCont), key: 'num1'};
                self.num2 = {item: $('input:eq(1)', self.cardNumCont), key: 'num2'};
                self.num3 = {item: $('input:eq(2)', self.cardNumCont), key: 'num3'};
                self.num4 = {item: $('input:eq(3)', self.cardNumCont), key: 'num4'};

                self.validCont = $('.js-card-valid');
                self.month = {item: $('input:eq(0)', self.validCont), key: 'cardMonth'};
                self.year = {item: $('input:eq(1)', self.validCont), key: 'cardYear'};

                self.holder = {item: $('input.js-card-holder:eq(0)'), key: 'cardHolder'};

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
                    $timeout(function () {
                        var elem = document.querySelector(".b-tickets-info-container")
                        if (window.partners) {
                            if (window.partners.isFullWL() === true) {
                                window.partners.setScrollPage(utils.getCoords(elem).top);
                            }
                        }
                    }, 300)
                };
                self.next = function (key) {
                    self.navCurrent = _.find(self.navList, function (item) {
                        return item.key == key;
                    });
                    if (self.navCurrent != null) {
                        var index = self.navList.indexOf(self.navCurrent);
                        index++;
                        self.navCurrent = self.navList[index];
                        if (self.navCurrent != null) {
                            setTimeout(function () {
                                $(self.navCurrent.item.selector).select();
                                $(self.navCurrent.item.selector).focus();
                            }, 0);
                        }
                    }
                }
            }

            $scope.focusControl = new focusControl();

            function scrollControl() {
                var self = this;
                self.scrollToCards = function () {
                    //console.log('scroll to cards');
                    $('html, body').animate({
                        scrollTop: $(".b-tickets-info-container").offset().top + 300
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
                    $scope.baloon.show('Подготовка к оплате', 'Это может занять несколько секунд');

                    $scope.newSearchUrl = null;

                    //нужны данные для нового поиска
                    function getOrderDataForUrls() {
                        //если данные не загрузятся
                        if ($location.url().indexOf('packages') > -1) {//ДП
                            $scope.newSearchUrl = Urls.URL_DYNAMIC_PACKAGES_SEARCH;
                        }
                        else {//Авиа
                            $scope.newSearchUrl = Urls.URL_AVIA_SEARCH;
                        }

                        //запрос в api
                        paymentService.getPaymentData({
                                orderNum: $scope.orderNum
                            },
                            function (data) {
                                //console.log('order data:', data);
                                if (data != null) {
                                    try {
                                        var filter = angular.fromJson(data.Filter);
                                        //console.log('order data.filter:', filter);

                                        if (data.Hotel) {
                                            $scope.newSearchUrl = Urls.URL_DYNAMIC_PACKAGES_SEARCH + [
                                                filter.DepartureId,
                                                filter.ArrivalId,
                                                filter.StartVoyageDateString,
                                                filter.EndVoyageDateString,
                                                filter.TicketClass,
                                                filter.Adult,
                                                filter.Children
                                            ].join('-');
                                        }
                                        else {
                                            $scope.newSearchUrl = Urls.URL_AVIA_SEARCH + [
                                                filter.FromUrl,
                                                filter.ToUrl,
                                                filter.BeginDate,
                                                filter.EndDate,
                                                filter.AdultCount,
                                                filter.ChildCount,
                                                filter.InfantsCount,
                                                filter.CabinClass,
                                                filter.IsToFlexible,
                                                filter.IsBackFlexible,
                                                filter.PathType
                                            ].join('-');
                                        }
                                    }
                                    catch (e) {
                                        console.error('order data parse filter error', e);
                                    }
                                }
                            },
                            function (data, status) {
                                log('paymentService.getPaymentData error');
                            });
                    }

                    paymentService.getRepricing($scope.orderNum, function (data) {
                            //console.log(data);
                            switch (data.Type) {
                                case 1:
                                {
                                    //все норм - получаем данные и продолжаем заполнять
                                    getPaymenyData();
                                    break;
                                }
                                case 2:
                                {
                                    //цена изменилась
                                    var oldPrice = data.OldPrice;
                                    var newPrice = data.NewPrice;
                                    var msg = 'Изменилась стоимость заказа c <b>' + $filter('price')(oldPrice) + '<span class="b-rub">q</span></b> на <b>' + $filter('price')(newPrice) + '<span class="b-rub">q</span></b>';
                                    $scope.baloon.showPriceChanged("Изменилась цена", msg, function () {

                                        setTimeout(function () {
                                            $scope.safeApply(function () {
                                                //уведомили - дальше грузим
                                                $scope.baloon.show('Подождите', 'Это может занять несколько секунд');
                                            });
                                        }, 0);

                                        //все норм - получаем данные и продолжаем заполнять
                                        getPaymenyData();
                                    });
                                    break;
                                }
                                case 3:
                                {
                                    //данные для нового поиска
                                    getOrderDataForUrls();
                                    //вариант перелета больше недоступен (например бронь была снята а/к)
                                    $scope.baloon.showNotFound("Перелет недоступен", "К сожалению, вариант перелета больше недоступен",
                                        function () {
                                            //если есть данные
                                            $location.url($scope.newSearchUrl);
                                        });
                                    break;
                                }
                                case 4:
                                {
                                    //данные для нового поиска
                                    getOrderDataForUrls();
                                    //вариант проживания больше недоступен (например уже нет выбранного номера)
                                    $scope.baloon.showNotFound("Отель недоступен", "К сожалению, вариант проживания больше недоступен",
                                        function () {
                                            //если есть данные
                                            $location.url($scope.newSearchUrl);
                                        });
                                    break;
                                }
                            }
                        },
                        function (data, status) {
                            log('paymentService.getRepricing error');
                            $scope.baloon.showGlobalAviaErr();
                            //$scope.baloon.hide();
                        });
                }
            }

            function getPaymenyData() {
                //запрос в api
                paymentService.getPaymentData({
                        orderNum: $scope.orderNum
                    },
                    function (data) {
                        if (data != null) {
                            $scope.svyaznoyPayControl.init();

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
                            };

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
                            else if (data.OrderStatus == 2) {//[Description("Аннулирован")]
                                //уже оплачен
                                $scope.baloon.showAlert('Заказ аннулирован', '', function () {
                                    $scope.baloon.hide();
                                    $location.url(Urls.URL_ROOT);
                                });
                            }
                            else {
                                $scope.reservationModel = bindApiModelToModel(data);
                                $scope.svyaznoyPayControl.setTime();
                                if ($scope.reservationModel.IsService) {//сервисный сбор
                                    var isDp = (data.Hotel != null);
                                    $scope.setOferta(isDp);
                                }
                                else {
                                    if (data.Hotel != null) {
                                        setPackageTemplate();
                                        aviaHelper.addAggInfoFields(data.Hotel);
                                        $scope.hotel = data.Hotel;
                                        $scope.room = data.Hotel.Room;
                                        $scope.isBuyPage = true;

                                        //ищем страховку
                                        $scope.isInsuranceIncluded = false;
                                        (function getInsurance(included){
                                            if (included){
                                                var re = /Страховка/ig;
                                                for(var i=0; i<included.length; i++){
                                                    var item = included[i];
                                                    if (re.test(item.Name)){
                                                        $scope.isInsuranceIncluded = true;
                                                        break;
                                                    }
                                                }
                                            }
                                        })(data.Included);

                                        //правила отмены отеля
                                        $scope.hotelRules.fillData(data.Hotel);
                                    }

                                    var isDp = (data.Hotel != null);
                                    $scope.setOferta(isDp);

                                    aviaHelper.addCustomFields(data.AviaInfo);
                                    $scope.aviaInfo = data.AviaInfo;
                                    $scope.ticketsCount = aviaHelper.getTicketsCount(data.AviaInfo.AdultCount, data.AviaInfo.ChildCount, data.AviaInfo.InfantsCount);

                                    function getIATACodes(info) {
                                        var res = {codeFrom: '', codeTo: ''};
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

            initPayModel();

            function loadTarifs() {
                var self = this;
                getTarifs();

                function getTarifs() {
                    paymentService.getTarifs({
                            variantTo: $scope.aviaInfo.VariantId1,
                            varianBack: $scope.aviaInfo.VariantId2
                        },
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
                    $scope.tarifs.fillInfo($scope.aviaInfo);
                    loadTarifs();
                }
                $scope.focusControl.init();
                $scope.paymentDeadline.setUpdate();
                $scope.scrollControl.scrollToCards();
            }

            //data loading ===========================================================================

            function showPaymentProcessing() {
                $scope.baloon.show('Оплата заказа', 'Пожалуйста, не закрывайте браузер');
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
                            track.dpPayBtnSubmitStart();
                            break;
                        }
                        case actionTypeEnum.avia:
                        {
                            track.aviaPayBtnSubmitStart();
                            break;
                        }
                    }

                    function trackError(pageType, err_code) {
                        if (!err_code) {
                            err_code = 'err';
                        }
                        switch (pageType) {
                            case actionTypeEnum.dp:
                            {
                                track.dpPayBtnSubmitContinueErr(err_code);
                                break;
                            }
                            case actionTypeEnum.avia:
                            {
                                track.aviaPayBtnSubmitContinueErr(err_code);
                                break;
                            }
                        }
                    }

                    function trackContinueSuccess(pageType) {
                        switch (pageType) {
                            case actionTypeEnum.dp:
                            {
                                track.dpPayBtnSubmitContinue();
                                break;
                            }
                            case actionTypeEnum.avia:
                            {
                                track.aviaPayBtnSubmitContinue();
                                break;
                            }
                        }
                    }

                    try {
                        paymentService.pay(apiPayModel,
                            function (data) {

                                log('\npaymentService.pay, data: ' + angular.toJson(data));

                                /*
                                 [Description("Завершено успешно")]
                                 Success = 1,
                                 [Description("Завершено не успешно")]
                                 Failed = 2,
                                 [Description("Произошла ошибка")]
                                 Error = 3,
                                 [Description("Истекло время")]
                                 TimeOut = 4,
                                 [Description("Изменилась цена")]
                                 PriceChanged = 5
                                 */
                                if (data != null && data.Status == 1) {//теперь успешно - статус 1

                                    //ToDo: для теста
                                    if (location.href.indexOf("debug_status=1") > -1) {
                                        data.PreauthStatus = 1;
                                    }
                                    else if (location.href.indexOf("debug_status=2") > -1) {
                                        data.PreauthStatus = 2;
                                    }

                                    //успешно
                                    if (data.PreauthStatus == 1) {
                                        trackContinueSuccess(pageType);

                                        //3dSecure
                                        processPay3d(data.Data);
                                    }
                                    else if (data.PreauthStatus == 2) {
                                        trackContinueSuccess(pageType);

                                        $scope.is3dscheck = false;
                                        //без 3dSecure
                                        //checkPayment();
                                        setSuccessBuyResult(data.Type);
                                        //testPayComplete();
                                    }
                                    else {
                                        trackError(pageType);

                                        //ошибка
                                        log('paymentService.pay error, data.PreauthStatus: ' + data.PreauthStatus);
                                        $scope.baloon.showGlobalAviaErr();
                                    }
                                }
                                else {
                                    trackError(pageType);

                                    log('paymentService.pay error, data is null');
                                    $scope.baloon.showGlobalAviaErr();
                                }
                            },
                            function (data, status) {
                                trackError(pageType);

                                //ошибка
                                log('paymentService.pay error, data: ' + angular.toJson(data));
                                $scope.baloon.showGlobalAviaErr();
                            });
                    }
                    catch (e) {
                        trackError(pageType, 'js_err');
                        throw e;
                    }
                }
            };

            function setSuccessBuyResult(resultType) {
                console.log('setSuccessBuyResult');
                //пришел ответ - или оплачено или ошибка
                $scope.isOrderPaid = true;

                //скрываем попап с фреймом 3ds
                //if ($scope.is3dscheck) {
                //    $scope.buyFrame.hide();
                //}

                //останавливаем проверку времени оплаты
                $scope.paymentDeadline.destroy();

                var pageType = getActionType();

                //аналитика - авиа - заказ выполнен
                if (pageType == actionTypeEnum.avia) {
                    track.aivaPaymentSubmit($scope.orderNum, $scope.price, $scope.ports.codeFrom, $scope.ports.codeTo);
                    track.aviaPayBtnSubmit();
                }
                else if (pageType == actionTypeEnum.dp) {//аналитика - ДП - заказ выполнен
                    track.dpPaymentSubmit($scope.orderNum, $scope.price, $scope.ports.codeFrom, $scope.ports.codeTo, $scope.hotel.HotelName);
                    track.dpPayBtnSubmit();
                }

                switch (resultType) {
                    case 0://b2c
                    {
                        $scope.baloon.show('Спасибо за покупку!', 'В ближайшие 10 минут ожидайте на <b>' + $scope.reservationModel.Email + '</b> письмо с подтверждением выполнения заказа и документами (билеты/ваучеры)',
                            aviaHelper.baloonType.email,
                            function () {
                                $location.path(Urls.URL_ROOT);
                            },
                            {
                                buttonCaption: 'Ok', successFn: function () {
                                $scope.baloon.hide();
                                $location.path(Urls.URL_ROOT);
                            }
                            });
                        break;
                    }
                    case 1://b2b
                    {
                        var tmId;

                        function redirectToCabinet() {
                            if (tmId) {
                                $timeout.cancel(tmId);
                            }

                            var b2bOrder = $scope.B2B_HOST_Order + $scope.orderId;
                            console.log('redirecting to: ' + b2bOrder);
                            window.location = b2bOrder;
                        }

                        tmId = $timeout(function () {
                            $scope.baloon.hide();
                            redirectToCabinet();
                        }, 5000);

                        $scope.baloon.show('Спасибо за покупку!', 'В ближайшие 10 минут ожидайте в личном кабинете изменение статуса заказа на Выполнен и </br>появления документов (билетов/ваучеров)',
                            aviaHelper.baloonType.email,
                            function () {
                                redirectToCabinet();
                            },
                            {
                                buttonCaption: 'Ok', successFn: function () {
                                $scope.baloon.hide();
                                redirectToCabinet();
                            }
                            });
                        break;
                    }
                    case 2://сервисный сбор
                    {
                        $scope.baloon.show('Спасибо за покупку!', 'Оплата счета успешна',
                            aviaHelper.baloonType.email,
                            function () {
                                $location.path(Urls.URL_ROOT);
                            },
                            {
                                buttonCaption: 'Ok', successFn: function () {
                                $scope.baloon.hide();
                                $location.path(Urls.URL_ROOT);
                            }
                            });
                        break;
                    }
                }
            }

            function buyFrame() {
                var self = this;
                self.iframeUrl = null;
                self.isOpened = false;
                self.open = function () {
                    self.isOpened = true;
                };
                self.hide = function () {
                    self.isOpened = false;
                };

                self.listenCloseEvent = function () {
                    $('#buy-listener').on('inna.buy.close', function (event, data) {
                        console.log('triggered inna.buy.close, isOrderPaid:', $scope.isOrderPaid, data);
                        $scope.safeApply(function () {
                            if (data && data.result == 0) {//все ок
                                setSuccessBuyResult(data.type);
                            }
                            else {
                                //error
                                //аналитика
                                //ошибка оплаты
                                writeAnalyticsError(3);

                                $scope.baloon.hide();

                                $scope._baloon = new Balloon({
                                    data: {
                                        balloonClose: true,
                                        balloonPart: 'pay-error.html'
                                    }
                                }).show();
                            }

                            //if ($scope.isOrderPaid == false) {
                            //    showPaymentProcessing();
                            //}
                            self.hide();
                        })
                    });
                };
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
                };

                return self;
            }

            $scope.buyFrame = new buyFrame();

            function processPay3d(data) {
                var params = '';
                var jData = angular.fromJson(data);
                if (jData) {
                    //console.log('jData: ' + angular.toJson(jData));
                    //jData.TermUrl = app_main.apiHost + '/api/v1/Psb/PaymentRederect';
                    jData.TermUrl = location.protocol + '//' + location.hostname + '/api/v1/Psb/PaymentRederect';
                    //console.log('jData: ' + angular.toJson(jData));

                    var keys = _.keys(jData);
                    _.each(keys, function (key) {
                        if (keys.indexOf(key) > 0) {
                            params += '&';
                        }
                        params += key + '=' + encodeURIComponent(jData[key]);
                    });
                }

                //дождемся пока фрейм с формой запостит и сработает load
                $scope.buyFrame.listenForFrameLoad();
                $scope.buyFrame.iframeUrl = ('/spa/templates/pages/avia/pay_form.html?' + params);

                $scope.is3dscheck = true;
                //checkPayment();
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

            function writeAnalyticsError(code) {
                var pageType = getActionType();

                //аналитика
                if (pageType == actionTypeEnum.avia) {
                    track.aviaPaymentError(code);
                }
                else if (pageType == actionTypeEnum.dp) {
                    track.dpPaymentError(code);
                }
            }

            //var intCheck = null;
            //function checkPayment() {
            //    $scope.isOrderPaid = false;
            //    check();
            //
            //    var intCheck = $interval(function () {
            //        check();
            //    }, 5000);
            //
            //    function check() {
            //        if (!$scope.isCkeckProcessing) {
            //            $scope.isCkeckProcessing = true;
            //
            //            paymentService.payCheck({
            //                orderNum : $scope.orderNum,
            //                success: function(data){
            //                try {
            //                    log('paymentService.payCheck, data: ' + angular.toJson(data));
            //                    //data = { Result: 1 };
            //                    if (data != null) {
            //
            //                        /*------------*/
            //                        //data.Result = 1;
            //                        /*------------*/
            //                        if (data.Result > 0) {
            //                            //пришел ответ - или оплачено или ошибка
            //                            $scope.isOrderPaid = true;
            //
            //                            //прекращаем дергать
            //                            if (data.Result != 4) {
            //                                $interval.cancel(intCheck);
            //                            }
            //
            //                            //скрываем попап с фреймом 3ds
            //                            if ($scope.is3dscheck) {
            //                                $scope.buyFrame.hide();
            //                            }
            //
            //                            var pageType = getActionType();
            //                            if (data.Result == 1) {
            //                                    //аналитика - авиа - заказ выполнен
            //                                    if (pageType == actionTypeEnum.avia) {
            //                                        track.aivaPaymentSubmit($scope.orderNum, $scope.price, $scope.ports.codeFrom, $scope.ports.codeTo);
            //                                        track.aviaPayBtnSubmit();
            //                                    }
            //                                    else if (pageType == actionTypeEnum.dp) {//аналитика - ДП - заказ выполнен
            //                                        track.dpPaymentSubmit($scope.orderNum, $scope.price, $scope.ports.codeFrom, $scope.ports.codeTo, $scope.hotel.HotelName);
            //                                        track.dpPayBtnSubmit();
            //                                    }
            //
            //                                //если агентство - отправляем обратно в b2b интерфейс
            //                                if ($scope.isAgency) {
            //                                    var b2bOrder = $scope.B2B_HOST_Order + $scope.orderId;
            //                                    console.log('redirecting to: ' + b2bOrder);
            //                                    window.location = b2bOrder;
            //                                }
            //                                else {
            //                                    if (!$scope.hotel) {
            //                                        ////аналитика - авиа - заказ выполнен
            //                                        //if (pageType == actionTypeEnum.avia) {
            //                                        //    track.aivaPaymentSubmit($scope.orderNum, $scope.price, $scope.ports.codeFrom, $scope.ports.codeTo);
            //                                        //    track.aviaPayBtnSubmit();
            //                                        //}
            //
            //                                        //останавливаем проверку времени оплаты
            //                                        $scope.paymentDeadline.destroy();
            //
            //                                        $scope.baloon.show('Заказ выполнен', 'Документы отправлены на электронную почту',
            //                                            aviaHelper.baloonType.email,
            //                                            function () {
            //                                                $location.path(Urls.URL_AVIA);
            //                                            },
            //                                            {
            //                                                //buttonCaption: 'Распечатать билеты', successFn: function () {
            //                                                //    //print
            //                                                //    log('print tickets');
            //                                                //    alert('Не реализовано');
            //                                                //}
            //                                                buttonCaption: 'Ok', successFn: function () {
            //                                                $scope.baloon.hide();
            //                                                $location.path(Urls.URL_AVIA);
            //                                            },
            //                                                email: $scope.reservationModel.Email
            //                                            });
            //                                    } else if ($scope.hotel != null) {
            //                                        //аналитика - ДП - заказ выполнен
            //                                        //if (pageType == actionTypeEnum.dp) {
            //                                        //    track.dpPaymentSubmit($scope.orderNum, $scope.price, $scope.ports.codeFrom, $scope.ports.codeTo, $scope.hotel.HotelName);
            //                                        //    track.dpPayBtnSubmit();
            //                                        //}
            //
            //                                        redirectSuccessBuyPackage();
            //                                    }
            //                                }
            //                            }
            //                            else if (data.Result == 2) {//ошибка при бронировании
            //                                //аналитика
            //                                writeAnalyticsError(2);
            //
            //                                $scope.baloon.showGlobalAviaErr();
            //                            }
            //                            else if (data.Result == 3) {//ошибка оплаты
            //                                //аналитика
            //                                writeAnalyticsError(3);
            //
            //                                $scope.baloon.hide();
            //
            //                                $scope._baloon = new Balloon({
            //                                    data: {
            //                                        balloonClose: true,
            //                                        balloonPart: 'pay-error.html'
            //                                    }
            //                                }).show();
            //                            }
            //                            else if (data.Result == 4) {//заказ оплачен, но не прошла выписка
            //                                //аналитика
            //                                //writeAnalyticsError(4);
            //
            //                                //аналитика
            //                                if (pageType == actionTypeEnum.avia) {
            //                                    track.aviaIssueError();
            //                                }
            //                                else if (pageType == actionTypeEnum.dp) {
            //                                    track.dpIssueError();
            //                                }
            //
            //                                $scope.baloon.show('Оформляем заказ', 'Операция может длиться до 5 минут - не обновляйте страницу и не закрывайте браузер в течении этого времени!');
            //                            }
            //                        }
            //                    }
            //                }
            //                catch (e) {
            //                        RavenWrapper.raven({
            //                            captureMessage : 'BUY TICKET PayCheck : ERROR',
            //                            dataResponse: angular.toJson(data),
            //                            dataRequest: $scope.orderNum
            //                        });
            //                        RavenWrapper.captureException(e);
            //                    //аналитика
            //                    writeAnalyticsError(0);
            //                }
            //                finally {
            //                    $scope.isCkeckProcessing = false;
            //                }
            //                },
            //                error : function(data){
            //                    $interval.cancel(intCheck);
            //                    RavenWrapper.raven({
            //                        captureMessage : 'BUY TICKET : SERVER ERROR',
            //                        dataResponse: data.responseJSON,
            //                        dataRequest: $scope.orderNum
            //                    });
            //                //аналитика
            //                writeAnalyticsError();
            //
            //                $scope.isCkeckProcessing = false;
            //                log('paymentService.payCheck error, data: ' + angular.toJson(data));
            //                }
            //            })
            //        }
            //
            //    }
            //}

            var actionTypeEnum = {avia: 'avia', dp: 'dp', service: 'service'};

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
                };
                self.updateExiration = function () {
                    if ($scope.reservationModel != null) {
                        $scope.reservationModel.experationSeconds = +$scope.reservationModel.experationSeconds - 1;
                        $scope.reservationModel.experationSecondsFormatted = $scope.getExpTimeSecFormatted($scope.reservationModel.experationSeconds);
                        //console.log('Осталось %s секунд', $scope.reservationModel.experationSecondsFormatted);
                    }
                };
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
                };
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
                            };

                            btCaption = 'На главную';
                            break;
                        }
                        case actionTypeEnum.dp:
                        {
                            closeUrl = Urls.URL_DYNAMIC_PACKAGES;

                            successFn = function () {
                                $scope.baloon.hide();
                                $location.path(Urls.URL_DYNAMIC_PACKAGES);
                            };
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
                            };
                            break;
                        }
                    }

                    $scope.baloon.show(null, null, aviaHelper.baloonType.payExpires, function () {
                        $location.path(closeUrl);
                    }, {
                        successFn: successFn,
                        buttonCaption: btCaption
                    });
                };
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
                });
            }


            function redirectSuccessBuyPackage() {
                $location.search({});
                $location.path('packages/buy/success/' + $scope.orderNum);
            }

            //отправка сообщения к заказу


            $scope.buyCommentsForm = new buyCommentsForm();
            function buyCommentsForm() {
                var self = this;

                self.form = {};
                self.isOpened = false;
                self.comments = '';

                self.isEnabled = !($scope.$root.user != null && $scope.$root.user.isAgency());

                //задаем top - если попап открывается внутри фрейма
                self.style = {};

                self.close = function ($event) {
                    $event.preventDefault();
                    self.isOpened = false;
                };

                self.openPopup = function ($event) {
                    $event.preventDefault();
                    self.comments = '';

                    //поддержка работы внутри фрейма
                    if (window.partners && window.partners.parentScrollTop > 0) {
                        self.style = {'top': window.partners.parentScrollTop + 50};
                    }

                    self.isOpened = true;
                };

                self.send = function ($event) {
                    $event.preventDefault();
                    self.form.$dirty = true;

                    function showError() {
                        console.log('send buy comment error', status);

                        $scope.baloon.show(null, null,
                            aviaHelper.baloonType.err, function () {
                            });
                    }

                    if (!self.comments || self.comments.length == 0){
                        self.form.reqComments.$setValidity('required', false);
                    }
                    else {
                        self.form.reqComments.$setValidity('required', true);
                        self.isOpened = false;
                    }

                    if (self.form.$valid){
                        console.log('form valid');
                        paymentService.createBuyComment({orderNum:$scope.orderNum, orderMessage: self.comments},
                            function (data, status) {
                                if (data && data.Status == 1){
                                    console.log('send buy comment success', data, status);
                                    //показываем попап
                                    $scope.baloon.show("Сообщение отправлено", "В ближайшее время наш менеджер свяжется с Вами", aviaHelper.baloonType.success);
                                }
                                else {
                                    showError();
                                }
                            }, function (status) {
                                showError();
                            });
                    }
                    else {
                        console.log('form not valid');
                    }
                }
            }

            $scope.$on('$destroy', function () {
                $scope.baloon.hide();
                if ($scope._baloon) {
                    $scope._baloon.teardown();
                    $scope._baloon = null;
                }
                $scope.paymentDeadline.destroy();
                destroyPopups();
                $('#buy-listener').off();
            });
        }]);
