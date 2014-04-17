
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaReserveTicketsCtrl', ['$log', '$timeout', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper', 'urlHelper', 'Validators',
        function AviaReserveTicketsCtrl($log, $timeout, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Validators) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams);

            //критерии из урла
            $scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
            $scope.peopleCount = parseInt($scope.criteria.AdultCount) + parseInt($scope.criteria.ChildCount) + parseInt($scope.criteria.InfantsCount);
            $scope.searchId = $scope.criteria.QueryId;
            $scope.item = null;
            $scope.citizenshipList = null;
            $scope.bonusCardTransportersList = null;
            //$scope.model = getDefaultModel();

            function getDefaultModel() {

                var maxPassCount = parseInt($scope.criteria.AdultCount) + parseInt($scope.criteria.ChildCount) + parseInt($scope.criteria.InfantsCount);

                var model = {};
                model.name = '';
                model.secondName = '';
                model.email = '';
                model.phone = '';
                model.passengers = [];
                for (var i = 0; i < maxPassCount; i++) {
                    var pas = {};
                    pas.name = '';
                    pas.secondName = '';
                    pas.sex = null;
                    pas.birthday = '';
                    pas.citizenship = {};
                    pas.citizenship.id = 0;
                    pas.citizenship.name = '';
                    pas.document = {};
                    pas.document.series_and_number = '';
                    pas.document.expirationDate = '';
                    pas.bonuscard = {};
                    pas.bonuscard.haveBonusCard = null;
                    pas.bonuscard.airCompany = {};
                    pas.bonuscard.airCompany.id = 0;
                    pas.bonuscard.airCompany.name = '';
                    pas.bonuscard.number = '';
                    model.passengers.push(pas);
                }
                return model;
            }

            $scope.sexType = aviaHelper.sexType;
            $scope.helper = aviaHelper;

            $scope.login = {
                isOpened: false,
                isLogged: false,
                closeClick: function ($event) {
                    eventsHelper.preventBubbling($event);
                    $scope.login.isOpened = false;
                }
            };

            var validateType = {
                required: 'required',
                email: 'email',
                phone: 'phone'
            };
            $scope.validateType = validateType;

            function getValidationItem(key, value, type) {
                return {
                    id: _.uniqueId(),
                    key: key,
                    value: value,
                    isValid: true,
                    isInvalid: false,
                    validationType: null,
                    $element: null
                }
            };

            function updateValidationModel()
            {
                function tryValidate(model, fn) {
                    try {
                        fn();
                        model.isValid = true;
                        model.isInvalid = false;
                    }
                    catch (err) {
                        model.isValid = false;
                        model.isInvalid = true;
                    }
                    log('tryValidate, ' + model.key + ' = \'' + model.value + '\', isValid: ' + model.isValid + ', isInvalid: ' + model.isInvalid);
                };

                $scope.validate = function (item) {
                    if (item != null && item.model != null) {
                        var model = item.model;
                        var type = item.type;
                        //сохраняем тип валидации
                        model.validationType = type;
                        //сохраняем element
                        model.$element = item.$element;
                        //console.log('validate, key: %s, element: %s', model.key, model.$element.get(0));
                        //console.log('validate, key:\'%s\'; value:\'%s\'', model.key, model.value);
                        switch (type) {
                            case validateType.required:
                                {
                                    tryValidate(model, function () {
                                        Validators.defined(model.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.email:
                                {
                                    tryValidate(model, function () {
                                        Validators.email(model.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.phone:
                                {
                                    tryValidate(model, function () {
                                        Validators.phone(model.value, 'err');
                                    });
                                    break;
                                }
                        }

                        //прячем тултип, если показывали
                        if (model.haveTooltip == true)
                        {
                            var $to = item.$element;
                            $to.tooltip("disable");
                        }
                    }
                };

                //основная модель для валидации
                var validationModel = {
                    //pureModel: true,//модель не проверялась
                    getFields: function(){
                        var keys = _.keys(validationModel);
                        var validList = _.map(keys, function (key) {
                            return validationModel[key];
                        });
                        //отбрасываем лишние поля
                        validList = _.filter(validList, function (item) { return item.isValid != undefined });
                        return validList;
                    },
                    isModelValid: function () {
                        var list = validationModel.getFields();
                        var mValid = _.all(list, function (item) { return item.isValid; })
                        return mValid;
                    },
                    getFirstInvalidItem: function (conditionFn) {
                        var list = validationModel.getFields();
                        var firstItem = _.find(list, function (item) {
                            if (conditionFn == null) {
                                return item.isValid == false;
                            }
                            else
                            {
                                return (item.isValid == false) && conditionFn(item);
                            }
                        });
                        return firstItem;
                    },
                    validateAll: function () {
                        var list = validationModel.getFields();
                        _.each(list, function (item) {
                            $scope.validate({ item: item });
                        });
                    }
                };

                //создаем поля из модели данных
                var keys = _.keys($scope.model);
                _.each(keys, function (key) {
                    validationModel[key] = getValidationItem(key, $scope.model[key]);
                });

                $scope.validationModel = validationModel;
            }

            $scope.$watch('model', function (newVal, oldVal) {
                //console.log('updateValidationModel, val: %s\n', angular.toJson(newVal));
                updateValidationModel();
            }, true);


            //$timeout(function () {
            //    loadToCountryAndInit(routeCriteria);
            //}, 2000);

            var urlDataLoaded = { selectedItem: false, routeCriteriaTo: false, allCountries: false };

            function isAllDataLoaded() {
                return urlDataLoaded.selectedItem && urlDataLoaded.routeCriteriaTo && urlDataLoaded.allCountries;
            }
            function initIfDataLoaded() {
                //все данные были загружены
                if (isAllDataLoaded()) {
                    //инициализация
                    initPayModel();
                }
            };

            //data loading ===========================================================================
            (function loadToCountry()
            {
                //log('loadToCountryAndInit');
                if ($scope.criteria.ToUrl != null && $scope.criteria.ToUrl.length > 0) {

                    dataService.getDirectoryByUrl($scope.criteria.ToUrl, function (data) {
                        if (data != null) {
                            $scope.criteria.To = data.name;
                            $scope.criteria.ToId = data.id;
                            $scope.criteria.ToCountryName = data.CountryName;

                            urlDataLoaded.routeCriteriaTo = true;
                            initIfDataLoaded();
                        }
                    }, function (data, status) {
                        log('loadToCountry error: ' + $scope.criteria.ToUrl + ' status:' + status);
                    });
                }
            })();

            (function getStoreItem() {
                var storeItem = null;//storageService.getAviaBuyItem();
                //log('storeItem: ' + angular.toJson(storeItem));
                if (storeItem != null) {
                    if (storeItem.item.VariantId2 == null)
                        storeItem.item.VariantId2 = 0;
                    //проверяем, что там наш итем
                    if ($scope.criteria.QueryId == storeItem.searchId &&
                        $scope.criteria.VariantId1 == storeItem.item.VariantId1 && $scope.criteria.VariantId2 == storeItem.item.VariantId2) {
                        $scope.searchId = storeItem.searchId;
                        $scope.item = storeItem.item;

                        loadTransporters();
                    }
                }
                else {
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
                            //плюс нужна обработка, чтобы в item были доп. поля с форматами дат и прочее
                            loadTransporters();
                        }
                        else
                            $log.error('paymentService.getSelectedVariant error, data is null');
                    },
                    function (data, status) {
                        $log.error('paymentService.getSelectedVariant error');
                    });
                }
            })();

            (function loadAllCountries() {
                dataService.getAllCountries(function (data) {
                    if (data != null) {
                        $scope.citizenshipList = data;
                        urlDataLoaded.allCountries = true;
                        initIfDataLoaded();
                    }
                }, function (data, status) {
                    log('getAllCountries error: status:' + status);
                });
            })();

            function loadTransporters() {
                var transportersNames = [];

                if ($scope.item.EtapsTo.length > 0)
                {
                    _.each($scope.item.EtapsTo, function (item) {
                        transportersNames.push(item.TransporterCode);
                    });
                }
                if ($scope.item.EtapsBack != null && $scope.item.EtapsBack.length > 0) {
                    _.each($scope.item.EtapsBack, function (item) {
                        transportersNames.push(item.TransporterCode);
                    });
                }
                //берем уникальные
                transportersNames = _.uniq(transportersNames);

                paymentService.getTransportersInAlliances(transportersNames, function (data) {
                    if (data != null) {
                        $scope.bonusCardTransportersList = data;
                        if (data.length == 0)
                            log('bonusCardTransportersList empty');

                        urlDataLoaded.selectedItem = true;
                        initIfDataLoaded();
                    }
                }, function (data, status) {
                    log('getTransportersInAlliances error: ' + transportersNames + ' status:' + status);
                });
            };
            //data loading ===========================================================================

            function initPayModel() {
                //log('initPayModel');

                function passengerModel(index) {
                    var self = {
                        index: index,
                        sex: null,
                        name: '',
                        secondName: '',
                        birthday: '',
                        citizenship: {//Гражданство
                            id: 0,
                            name: ''
                        },
                        document: {//документ
                            series_and_number: '',
                            series: '',//серия
                            number: '',//номер
                            expirationDate: ''//дествителен до
                        },
                        bonuscard: {
                            haveBonusCard: false,//Есть бонусная карта
                            airCompany: {
                                id: 0,
                                name: ''
                            },
                            number: ''
                        },
                        dir: {
                            cit:{
                                isOpen: false
                            },
                            card: {
                                isOpen: false
                            }
                        },
                        showCitListClick: function ($event) {
                            eventsHelper.preventBubbling($event);
                            //открываем список в директиве
                            self.dir.cit.isOpen = !self.dir.cit.isOpen;
                        },
                        showCardListClick: function ($event) {
                            eventsHelper.preventBubbling($event);
                            //открываем список в директиве
                            self.dir.card.isOpen = !self.dir.card.isOpen;
                        },
                    };
                    //log('passengerModel showCitListClick: ' + passengerModel.showCitListClick)
                    return self;
                }

                var passengers = [];
                for (var i = 0; i < $scope.peopleCount; i++) {
                    var item = new passengerModel(i);
                    passengers.push(item);
                }

                $scope.model = {
                    price: $scope.item.Price,
                    name: '',
                    secondName: '',
                    email: '',
                    phone: '',
                    wannaNewsletter: false,//Я хочу получать рассылку спецпредложений
                    passengers: passengers

                };

                fillDefaultModelDelay();
            };

            $scope.getTransferCountText = aviaHelper.getTransferCountText;

            $scope.moreClick = function ($event) {
                eventsHelper.preventBubbling($event);
            };

            //бронируем
            function reserve(afterCompleteCallback) {
                function call() { if (afterCompleteCallback) afterCompleteCallback(); };

                function getPassenger(data) {
                    var m = {};
                    m.Sex = data.sex;
                    m.I = data.name;
                    m.F = data.secondName;
                    m.Birthday = data.birthday;
                    m.DocumentId = null;
                    var docsn = data.document.series_and_number.split(' ');
                    m.Series = docsn[0];
                    m.Number = docsn[1];
                    m.ExpirationDate = data.document.expirationDate;
                    m.Citizen = data.citizenship.id;
                    m.Index = data.index;
                    m.BonusCard = data.bonuscard.number;
                    return m;
                }
                function getApiModel(data) {
                    var m = {};
                    m.I = data.name;
                    m.F = data.secondName;
                    m.Email = data.email;
                    m.Phone = data.phone;

                    var pasList = [];
                    _.each(data.passengers, function (item) {
                        pasList.push(getPassenger(item));
                    });
                    m.Passengers = pasList;

                    m.SearchParams = {
                        SearchId: $scope.searchId,
                        VariantId1: $scope.item.VariantId1,
                        VariantId2: $scope.item.VariantId2
                    };
                    return m;
                };

                var apiModel = getApiModel($scope.model);
                log('');
                log('reservationModel: ' + angular.toJson($scope.model));
                log('');
                log('apiModel: ' + angular.toJson(apiModel));
                //
                paymentService.reserve(apiModel,
                    function (data) {
                        log('orderId: ' + data);
                        if (data != null)
                        {
                            //сохраняем orderId
                            //storageService.setAviaOrderId(data);
                            $scope.criteria.OrderId = data;

                            //сохраняем модель
                            storageService.setReservationModel($scope.model);
                        }
                        //успешно
                        call();
                    },
                    function (data, status) {
                        //ошибка
                        log('paymentService.reserve error');
                        call();
                    });
            };

            $scope.processToPayment = function ($event) {
                eventsHelper.preventBubbling($event);

                $scope.validationModel.validateAll();

                //ищем первый невалидный элемент, берем только непустые
                var invalidItem = $scope.validationModel.getFirstInvalidItem(function (item) {
                    return (item.value != null && item.value.length > 0);
                });
                if (invalidItem != null)
                {
                    //показываем тултип
                    var $to = invalidItem.$element;
                    //не навешивали тултип
                    if (!invalidItem.haveTooltip) {
                        $to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
                    }
                    invalidItem.haveTooltip = true;
                    $to.tooltip("enable");
                    $to.tooltip("open");
                     
                    return;
                }
                return;

                //бронируем
                reserve(function () {
                    if (isAllDataLoaded()) {
                        //переходим на страницу оплаты
                        var url = urlHelper.UrlToAviaTicketsBuy($scope.criteria);
                        //log('processToPayment, url: ' + url);
                        $location.path(url);
                    }
                });
            };

            var debugPassengersList = [
                { name: 'IVAN', secondName: 'IVANOV', sex: $scope.sexType.man, birthday: '18.07.1976', series_and_number: '4507 048200' },
                { name: 'TATIANA', secondName: 'IVANOVA', sex: $scope.sexType.woman, birthday: '25.09.1978', series_and_number: '4507 048232' },
                { name: 'SERGEY', secondName: 'IVANOV', sex: $scope.sexType.man, birthday: '12.07.2006', series_and_number: '4507 028530' },
                { name: 'ELENA', secondName: 'IVANOVA', sex: $scope.sexType.woman, birthday: '12.11.2013', series_and_number: '4507 018530' },
            ];

            //ToDo: debug
            function fillDefaultModelDelay() {
                $timeout(function () {
                    $scope.model.name = 'Иван';
                    $scope.model.secondName = 'Иванов';
                    $scope.model.email = 'ivan.ivanov@gmail.com';
                    $scope.model.phone = '+79101234567';
                    var index = 0;
                    _.each($scope.model.passengers, function (pas) {

                        if (index < debugPassengersList.length) {
                            var debugItem = debugPassengersList[index];
                            index++;

                            pas.name = debugItem.name;
                            pas.secondName = debugItem.secondName;
                            pas.sex = debugItem.sex;
                            pas.birthday = debugItem.birthday;
                            pas.citizenship.id = 189;
                            pas.citizenship.name = 'Россия';
                            pas.document.series_and_number = debugItem.series_and_number;
                            pas.document.expirationDate = '18.07.2015';
                            pas.bonuscard.haveBonusCard = (index % 2 == 0 ? true : false);
                            pas.bonuscard.airCompany.id = 2;
                            pas.bonuscard.airCompany.name = 'Aeroflot';
                            pas.bonuscard.number = '12134а3454';
                        }
                        else {
                            pas.name = 'IVAN';
                            pas.secondName = 'IVANOV';
                            pas.sex = $scope.sexType.man;
                            pas.birthday = '18.07.1976';
                            pas.citizenship.id = 189;
                            pas.citizenship.name = 'Россия';
                            pas.document.series_and_number = '4507 048200';
                            pas.document.expirationDate = '18.07.2015';
                            pas.bonuscard.haveBonusCard = true;
                            pas.bonuscard.airCompany.id = 2;
                            pas.bonuscard.airCompany.name = 'Aeroflot';
                            pas.bonuscard.number = '12134а3454';
                        }
                    });
                    
                    //$scope.login.isOpened = true;
                    //$scope.login.isLogged = true;
                }, 200000);
            };
        }]);
