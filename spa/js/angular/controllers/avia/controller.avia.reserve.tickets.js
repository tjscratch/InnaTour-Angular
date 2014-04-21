
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
            $scope.model = null;

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
                cit_required: 'cit_required',
                email: 'email',
                phone: 'phone',
                date: 'date',
                birthdate: 'birthdate',
                expire: 'expire',
                document: 'document'
            };
            $scope.validateType = validateType;

            function updateValidationModel()
            {
                //log('updateValidationModel');

                function getValidationItem(key, value, type) {
                    return {
                        id: null,
                        key: key,
                        value: value,
                        dependsOnField: null,//валидация зависит от поля
                        isValid: true,
                        isInvalid: false,
                        validationType: null
                    }
                };

                function tryValidate(model, fn) {
                    try {
                        fn();
                        $scope.setValid(model, true);
                    }
                    catch (err) {
                        $scope.setValid(model, false);
                    }
                    //log('tryValidate, ' + model.key + ' = \'' + model.value + '\', isValid: ' + model.isValid);
                };

                $scope.setValid = function (model, isValid) {
                    if (model == null) return;
                    if (isValid)
                    {
                        model.isValid = true;
                        model.isInvalid = false;
                    }
                    else
                    {
                        model.isValid = false;
                        model.isInvalid = true;
                    }
                }

                $scope.validate = function (item, type) {
                    if (item != null) {
                        //console.log('validate, key: %s, element: %s', model.key, model.$element.get(0));
                        //console.log('validate, key:\'%s\'; value:\'%s\'', model.key, model.value);
                        switch (item.validationType) {
                            case validateType.required:
                                {
                                    tryValidate(item, function () {
                                        Validators.defined(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.cit_required://для гражданства - проверяем, что id > 0 и name заполнен
                                {
                                    tryValidate(item, function () {
                                        Validators.gtZero(item.value.id, 'err');
                                        Validators.defined(item.value.name, 'err');
                                    });
                                    break;
                                }
                            case validateType.email:
                                {
                                    tryValidate(item, function () {
                                        Validators.email(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.phone:
                                {
                                    tryValidate(item, function () {
                                        Validators.phone(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.date:
                                {
                                    tryValidate(item, function () {
                                        Validators.date(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.birthdate:
                                {
                                    tryValidate(item, function () {
                                        Validators.birthdate(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.expire:
                                {
                                    tryValidate(item, function () {
                                        Validators.expire(item.value, 'err');
                                    });
                                    break;
                                }
                            case validateType.document:
                                {
                                    //гражданство
                                    var citizenship = item.dependsOnField;

                                    //логика описана тут https://innatec.atlassian.net/browse/IN-746
                                    tryValidate(item, function () {
                                        Validators.defined(item.value, 'err');

                                        //
                                        if (citizenship == null || citizenship.value == null)
                                            throw 'err';

                                        if (citizenship.value.id == 189)//Россия
                                        {

                                        }
                                        //нужно определить
                                        //для граждан РФ, летящих внутри стран РФ, Абхазия, Белоруссия, Казахстан, Нагорный Карабах, 
                                        //Приднестровье, Таджикистан, Украина, Южная Осетия
                                    });
                                    break;
                                }
                        }

                        //прячем тултип, если показывали
                        if (item.haveTooltip == true)
                        {
                            var $to = $('#' + item.id);
                            tooltipControl.close($to);
                        }
                    }

                    if ($scope.validationModel != null && type != null)
                    {
                        $scope.validationModel.formPure = false;
                    }
                };

                //сохраняем некоторые поля из старой модели
                function updateFields(validationModel) {
                    var ignoreKeys = ['dir'];

                    //создаем поля из модели данных
                    var keys = _.keys($scope.model);
                    _.each(keys, function (key) {
                        var oldItem = null;
                        if ($scope.validationModel != null) {
                            oldItem = validationModel[key];
                        }

                        var newItem = null;
                        //поля типа passengers - копируем в модель, и для них - на каждое поле создаем validation model
                        if (_.isArray($scope.model[key]))
                        {
                            newItem = [];
                            _.each($scope.model[key], function (item, index) {
                                var itemKeys = _.keys(item);
                                var newIntItem = {};
                                _.each(itemKeys, function (inKey) {
                                    if (_.isFunction(item[inKey]) || _.any(ignoreKeys, function (item) { return item == inKey; }))
                                    {
                                        newIntItem[inKey] = angular.copy(item[inKey]);
                                    }
                                    else
                                    {
                                        newIntItem[inKey] = getValidationItem(inKey, angular.copy(item[inKey]));
                                    }
                                });
                                
                                newItem.push(newIntItem);
                            });
                        }
                        else
                        {
                            newItem = getValidationItem(key, angular.copy($scope.model[key]));
                        }
                        
                        //сохраняем id и тип валидации
                        if (oldItem != null) {
                            newItem.id = oldItem.id;
                            newItem.validationType = oldItem.validationType;
                        }
                        validationModel[key] = newItem;
                    });
                };

                function getValidationModel()
                {
                    //основная модель для валидации
                    var validationModel = {
                        formPure: true,
                        getFields: function (model) {
                            var self = this;
                            var keys = _.keys(model);
                            var validList = _.map(keys, function (key) {
                                return model[key];
                            });
                            //отбрасываем лишние поля
                            validList = _.filter(validList, function (item) { return item.isValid != undefined });
                            return validList;
                        },
                        getArrayFileds: function() {
                            var self = this;
                            var keys = _.keys(this);
                            keys = _.filter(keys, function(k){
                                return _.isArray(self[k]);
                            });
                            var validList = _.map(keys, function (key) {
                                return self[key];
                            });
                            return validList;
                        },
                        isModelValid: function () {
                            var list = this.getFields(this);
                            var mValid = _.all(list, function (item) { return item.isValid; })
                            return mValid;
                        },
                        getFirstInvalidItem: function (conditionFn) {
                            var self = this;
                            function findInModel(model) {
                                var list = self.getFields(model);
                                var firstItem = _.find(list, function (item) {
                                    if (conditionFn == null) {
                                        return item.isValid == false;
                                    }
                                    else {
                                        return (item.isValid == false) && conditionFn(item);
                                    }
                                });
                                return firstItem;
                            };
                            var firstItem = findInModel(this);

                            //если не нашли в полях, смотрим во вложенных
                            if (firstItem == null) {
                                var arFields = this.getArrayFileds();
                                for (var i = 0; i < arFields.length; i++) {
                                    var field = arFields[i];
                                    for (var j = 0; j < field.length; j++) {
                                        var f = field[j];
                                        firstItem = findInModel(f);
                                        if (firstItem != null)
                                            return firstItem;
                                    }
                                }
                            }
                            return firstItem;
                        },
                        validateAll: function () {
                            var list = this.getFields(this);
                            _.each(list, function (item) {
                                $scope.validate(item);
                            });

                            //вложенные свойства
                            var arFields = this.getArrayFileds();
                            for (var i = 0; i < arFields.length; i++) {
                                var field = arFields[i];
                                for (var j = 0; j < field.length; j++) {
                                    var f = field[j];
                                    _.each(f, function (item) {
                                        $scope.validate(item);
                                    });
                                }
                            }

                            this.formPure = false;
                        }
                    };
                    return validationModel;
                }
                
                if ($scope.validationModel == null)
                {
                    var validationModel = getValidationModel();
                    $scope.validationModel = validationModel;
                }
                updateFields($scope.validationModel);

                //console.log($scope.validationModel);
            }

            $scope.$watch('model', function (newVal, oldVal) {
                if (newVal === oldVal)
                    return;

                updateValidationModel();
            }, true);

            //$scope.$watch('validationModel', function (newVal, oldVal) {
            //    if (newVal === oldVal)
            //        return;

            //}, true);

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
                    var model = {
                        index: index,
                        sex: null,
                        name: '',
                        secondName: '',
                        birthday: '',
                        citizenship: {//Гражданство
                            id: 0,
                            name: ''
                        },
                        doc_series_and_number: '',//серия номер
                        doc_expirationDate: '',//дествителен до
                        document: {//документ
                            series: '',//серия
                            number: ''//номер
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
                            this.dir.cit.isOpen = !this.dir.cit.isOpen;
                        },
                        showCardListClick: function ($event) {
                            eventsHelper.preventBubbling($event);
                            //открываем список в директиве
                            this.dir.card.isOpen = !this.dir.card.isOpen;
                        },
                    };
                    //log('passengerModel showCitListClick: ' + passengerModel.showCitListClick)
                    return model;
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

            var tooltipControl = {
                init: function ($to){
                    //$to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
                    $to.tooltipX({ autoShow: false, autoHide: false, position: { my: 'center top+22', at: 'center bottom' } });
                },
                open: function ($to) {
                    //$to.tooltip("enable");
                    //$to.tooltip("open");
                    setTimeout(function () {
                        $to.tooltipX("open");
                    }, 300);
                },
                close: function ($to) {
                    //$to.tooltip("disable");
                    $to.tooltipX("close");
                }
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
                    var $to = $("#" + invalidItem.id);
                    //не навешивали тултип
                    if (!invalidItem.haveTooltip) {
                        tooltipControl.init($to);
                        invalidItem.haveTooltip = true;
                    }
                    tooltipControl.open($to);
                     
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
                    $scope.model.secondName = '';
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
                            pas.doc_series_and_number = debugItem.series_and_number;
                            pas.doc_expirationDate = '18.07.2015';
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
                            pas.doc_series_and_number = '4507 048200';
                            pas.doc_expirationDate = '18.07.2015';
                            pas.bonuscard.haveBonusCard = true;
                            pas.bonuscard.airCompany.id = 2;
                            pas.bonuscard.airCompany.name = 'Aeroflot';
                            pas.bonuscard.number = '12134а3454';
                        }
                    });
                    
                    //$scope.login.isOpened = true;
                    //$scope.login.isLogged = true;
                }, 2000);
            };
        }]);
