
/* Controllers */

innaAppControllers.
    controller('ReserveTicketsCtrl', ['$log', '$timeout', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper', 'urlHelper', 'Validators',
        function ReserveTicketsCtrl($log, $timeout, $scope, $rootScope, $routeParams, $filter, $location,
            dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Validators) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            $scope.peopleCount = 0;
            $scope.AdultCount = 0;
            $scope.ChildCount = 0;
            $scope.InfantsCount = 0;
            $scope.fromDate = null;

            $scope.item = null;
            $scope.citizenshipList = null;
            $scope.bonusCardTransportersList = null;
            $scope.model = null;

            $scope.visaNeeded = false;
            $scope.visaNeeded_rules = false;

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

            $scope.objectToReserveTemplate = '/spa/templates/pages/avia/variant_partial.html';

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

            function visaNeededCheck() {
                var isCitRussia = false;
                var visaEtapNeeded = false;
                var visaEtapRulesNeeded = false;

                if ($scope.validationModel != null && $scope.validationModel.passengers != null &&
                    $scope.item != null) {
                    for (var i = 0; i < $scope.validationModel.passengers.length; i++) {
                        var pas = $scope.validationModel.passengers[i];
                        if (pas.citizenship.value.id == 189)//Россия
                        {
                            isCitRussia = true;
                        }
                    }

                    var outVisaGroup = null;
                    //берем визовую группу
                    if ($scope.item.EtapsTo != null && $scope.item.EtapsTo.length > 0)
                    {
                        outVisaGroup = $scope.item.EtapsTo[0].OutVisaGroup;

                        if (outVisaGroup != null && outVisaGroup != 0) {
                            visaEtapNeeded = true;
                        }
                    }
                    

                    if ($scope.item.EtapsTo != null)
                    {
                        for (var i = 0; i < $scope.item.EtapsTo.length; i++) {
                            var etap = $scope.item.EtapsTo[i];
                            if (etap.InVisaGroup != outVisaGroup || etap.OutVisaGroup != outVisaGroup) {
                                visaEtapRulesNeeded = true;
                                break;
                            }
                        }
                    }
                    if (visaEtapNeeded == false && $scope.item.EtapsBack != null) {
                        for (var i = 0; i < $scope.item.EtapsBack.length; i++) {
                            var etap = $scope.item.EtapsBack[i];
                            if (etap.InVisaGroup != outVisaGroup || etap.OutVisaGroup != outVisaGroup) {
                                visaEtapRulesNeeded = true;
                                break;
                            }
                        }
                    }
                }

                if (isCitRussia && visaEtapNeeded) {
                    $scope.visaNeeded = true;
                }
                else
                {
                    $scope.visaNeeded = false;
                }

                if (isCitRussia && visaEtapRulesNeeded) {
                    $scope.visaNeeded_rules = true;
                }
                else {
                    $scope.visaNeeded_rules = false;
                }
            };

            function validatePeopleCount() {
                if ($scope.validationModel != null && $scope.validationModel.passengers != null && $scope.validationModel.passengers.length > 0) {
                    var availableAdultCount = $scope.AdultCount;
                    var availableChildCount = $scope.ChildCount;
                    var availableInfantsCount = $scope.InfantsCount;

                    var peopleType = {
                        adult: 'adult',
                        child: 'child',
                        infant: 'infant'
                    };


                    function getPeopleType(birthdate) {
                        var fromDate = dateHelper.dateToJsDate($scope.fromDate);
                        var bdate = dateHelper.dateToJsDate(birthdate);
                        var age = dateHelper.calculateAge(bdate, fromDate);
                        //console.log('age: %d', age);
                        if (age < 2)
                            return peopleType.infant;
                        else if (age >= 2 && age <= 11)
                            return peopleType.child;
                        else
                            return peopleType.adult;
                    };

                    for (var i = 0; i < $scope.validationModel.passengers.length; i++) {
                        var pas = $scope.validationModel.passengers[i];

                        if (pas.birthday.value != null && pas.birthday.value.length > 0) {
                            //определяем тип человек (взрослый, ребенок, младенец)
                            var type = getPeopleType(pas.birthday.value);
                            switch (type) {
                                case peopleType.adult: availableAdultCount--; break;
                                case peopleType.child: availableChildCount--; break;
                                case peopleType.infant: availableInfantsCount--; break;
                            }
                        }
                        else {
                            return false;
                        }
                    }

                    //console.log('a: %d, c: %d, i: %d', availableAdultCount, availableChildCount, availableInfantsCount);
                    if (availableAdultCount < 0 || availableChildCount < 0 || availableInfantsCount < 0) {
                        return false;
                    }
                }
                return true;
            };

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
                                        if (!validatePeopleCount())
                                            throw 'err';
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
                                    var doc_num = item.value.replace(/\s+/g, '');

                                    //гражданство
                                    var citizenship = item.dependsOnField;

                                    //логика описана тут https://innatec.atlassian.net/browse/IN-746
                                    tryValidate(item, function () {
                                        Validators.defined(doc_num, 'err');

                                        //
                                        if (citizenship == null || citizenship.value == null || !(citizenship.value.id > 0))
                                            throw 'err';

                                        if (citizenship.value.id == 189)//Россия
                                        {
                                            //нужно определить
                                            //для граждан РФ, летящих внутри стран РФ, Абхазия, Белоруссия, Казахстан, Нагорный Карабах, 
                                            //Приднестровье, Таджикистан, Украина, Южная Осетия
                                            function isTripInsideRF(item) {
                                                                                        //Нагорный Карабах, Приднестровье
                                                //var insideRFcase = [189, 69829, 35, 124, 0, 0, 215, 226, 0];
                                                                                                        //Южная Осетия
                                                var insideRFcase = [189, 69829, 35, 124, 215, 226];

                                                var etapCountries = [];
                                                if (item.EtapsTo != null) {
                                                    _.each(item.EtapsTo, function (etap) {
                                                        etapCountries.push(etap.InCountryId);
                                                        etapCountries.push(etap.OutCountryId);
                                                    });
                                                }
                                                if (item.EtapsBack != null) {
                                                    _.each(item.EtapsTo, function (etap) {
                                                        etapCountries.push(etap.InCountryId);
                                                        etapCountries.push(etap.OutCountryId);
                                                    });
                                                }
                                                etapCountries = _.uniq(etapCountries);
                                                //проверяем все страны в этапах
                                                for (var i = 0; i < etapCountries.length; i++) {
                                                    var etapCountry = etapCountries[i];
                                                    if (_.indexOf(insideRFcase, etapCountry) < 0) //на каком-то этапе мы не попали в этот кейс
                                                    {
                                                        return false;
                                                    }
                                                }

                                                //прошлись по всем этапам, везде мы в нужном списке стран
                                                return true;
                                            }

                                            function isCaseValid(fn) {
                                                try
                                                {
                                                    fn();
                                                    return true;
                                                }
                                                catch(err)
                                                {
                                                    return false;
                                                }
                                            }

                                            var tripInsideRF = isTripInsideRF($scope.item);
                                            if (tripInsideRF)
                                            {
                                                //проверяем паспорт, загран, св. о рождении
                                                if (isCaseValid(function () {
                                                    Validators.ruPassport(doc_num, 'err');
                                                }) ||
                                                    isCaseValid(function () {
                                                    Validators.enPassport(doc_num, 'err');
                                                }) ||
                                                    isCaseValid(function () {
                                                    Validators.birthPassport(doc_num, 'err');
                                                }))
                                                {
                                                    //все норм - не выкидываем исключение
                                                }
                                                else
                                                {
                                                    //одна или больше проверок сфейлиломсь - выкидываем исключение
                                                    throw 'err';
                                                }
                                            }
                                            else
                                            {
                                                //загран
                                                Validators.enPassport(doc_num, 'err');
                                            }
                                        }
                                        else
                                        {
                                            //для граждан других стран
                                            //непустая строка
                                            //уже проверили в самом начале
                                        }
                                    });
                                    break;
                                }
                        }

                        //прячем тултип, если показывали
                        if (item.haveTooltip == true)
                        {
                            var $to = $('#' + item.id);
                            $scope.tooltipControl.close($to);
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

                visaNeededCheck();

                //console.log($scope.validationModel);
            }

            $scope.$watch('model', function (newVal, oldVal) {
//                if (newVal === oldVal)
//                    return;

                updateValidationModel();
            }, true);

            $scope.afterPayModelInit = null;
            $scope.initPayModel = function() {
                //log('initPayModel');

                function passengerModel(index) {
                    var model = {
                        index: index,
                        sex: null,
                        name: '',
                        secondName: '',
                        birthday: '',
                        citizenship: {//Гражданство
                            id: 189,
                            name: 'Россия'
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

                if ($scope.afterPayModelInit != null)
                    $scope.afterPayModelInit();
            };

            $scope.getTransferCountText = aviaHelper.getTransferCountText;

            $scope.moreClick = function ($event) {
                eventsHelper.preventBubbling($event);
            };

            $scope.tooltipControl = {
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
        }]);
