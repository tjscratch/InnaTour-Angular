/* Controllers */

innaAppControllers.
    controller('ReserveTicketsCtrl', ['$log', '$timeout', '$scope', '$rootScope', '$routeParams', '$filter', '$location',
        'dataService', 'paymentService', 'storageService', 'aviaHelper', 'eventsHelper', 'urlHelper', 'Validators', 'innaApp.API.events',
        function ReserveTicketsCtrl($log, $timeout, $scope, $rootScope, $routeParams, $filter, $location, dataService, paymentService, storageService, aviaHelper, eventsHelper, urlHelper, Validators, Events) {

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

            $scope.sexType = aviaHelper.sexType;
            $scope.helper = aviaHelper;

            $scope.tarifs = new $scope.helper.tarifs();

            $scope.hotelRules = new $scope.helper.hotelRules();

            $scope.loadTarifs = function (variantTo, varianBack, aviaInfo) {
                paymentService.getTarifs({ variantTo: variantTo, varianBack: varianBack },
                    function (data) {
                        //console.log('\npaymentService.getTarifs, data:');
                        //console.log(data);
                        $scope.tarifs.tarifsData = data;
                        $scope.tarifs.fillInfo(aviaInfo);
                    },
                    function (data, status) {
                        log('paymentService.getTarifs error');
                    });
            }

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

            function visaNeededCheck() {
                if ($scope.validationModel != null && $scope.validationModel.passengers != null && $scope.item != null) {
                    //Id-шники гражданств пассажиров
                    var passengersCitizenshipIds = _.map($scope.validationModel.passengers, function (pas) {
                        return pas.citizenship.value.id;
                    });
                    $scope.visaControl.check(passengersCitizenshipIds, $scope.item);
                }
            }

            $scope.visaControl = new aviaHelper.visaControl();

            $scope.lastPeopleValidation = null;

            $scope.validatePeopleCount = function () {
                closeAllTooltips();
                if ($scope.validationModel != null && $scope.validationModel.passengers != null && $scope.validationModel.passengers.length > 0) {
                    var availableAdultCount = $scope.AdultCount;
                    var availableChildCount = $scope.ChildCount;
                    var availableInfantsCount = $scope.InfantsCount;

                    var adultsFound = false;
                    var childsFound = false;
                    var infantsFound = false;

                    var peopleType = {
                        adult: 'adult',
                        child: 'child',
                        infant: 'infant'
                    };

                    var peopleFound = { adultsFoundCount: 0, childsFoundCount: 0, infantsFoundCount: 0 };

                    function getPeopleType(birthdate) {
                        var fromDate = dateHelper.dateToJsDate($scope.fromDate);
                        var bdate = dateHelper.dateToJsDate(birthdate);
                        var age = dateHelper.calculateAge(bdate, fromDate);
                        //console.log('age: %d', age);
                        if (age < 2)
                            return peopleType.infant;
                        else if (age >= 2 && age <= 11)
                            return peopleType.child;
                        else if (age >= 12)
                            return peopleType.adult;
                    };

                    function setNotValid(item) {
                        item.isValid = false;
                        item.isInvalid = !item.isValid;
                    }

                    for (var i = 0; i < $scope.validationModel.passengers.length; i++) {
                        var pas = $scope.validationModel.passengers[i];

                        if (pas.birthday.value != null && pas.birthday.value.length > 0) {
                            //определяем тип человек (взрослый, ребенок, младенец)
                            var type = getPeopleType(pas.birthday.value);
                            switch (type) {
                                case peopleType.adult:
                                {
                                    if (adultsFound) {
                                        setNotValid(pas.birthday);
                                    }
                                    else {
                                        availableAdultCount--;
                                        peopleFound.adultsFoundCount++;
                                        if (availableAdultCount == 0) {
                                            adultsFound = true;
                                        }
                                    }
                                    break;
                                }
                                case peopleType.child:
                                {
                                    if (childsFound) {
                                        setNotValid(pas.birthday);
                                    }
                                    else {
                                        availableChildCount--;
                                        peopleFound.childsFoundCount++;
                                        if (availableChildCount == 0) {
                                            childsFound = true;
                                        }
                                    }
                                    break;
                                }
                                case peopleType.infant:
                                {
                                    if (infantsFound) {
                                        setNotValid(pas.birthday);
                                    }
                                    else {
                                        availableInfantsCount--;
                                        peopleFound.infantsFoundCount++;
                                        if (availableInfantsCount == 0) {
                                            infantsFound = true;
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    //console.log('a: %d, c: %d, i: %d', availableAdultCount, availableChildCount, availableInfantsCount);
                    if (availableAdultCount < 0 || availableChildCount < 0 || availableInfantsCount < 0) {
                        setNotValid(pas.birthday);
                        updateBirthTooltip({ adultsCount: availableAdultCount, childsCount: availableChildCount, infantsCount: availableInfantsCount });
                        return false;
                    }
                }
                updateBirthTooltip({ adultsCount: availableAdultCount, childsCount: availableChildCount, infantsCount: availableInfantsCount });
                return true;
            };

            function getBirthTitle(lastPeopleValidation) {
                var res = 'Проверьте даты рождения, \nвы делали поиск на ' + $scope.AdultCount + ' ' + $scope.helper.pluralForm($scope.AdultCount, 'взрослого', 'взрослых', 'взрослых');
                if (parseInt($scope.ChildCount) > 0) {
                    res += ', \n' + $scope.ChildCount + ' ' + $scope.helper.pluralForm($scope.ChildCount, 'ребенка', 'детей', 'детей') + ' (от 2 до 12 лет)';
                }
                if (parseInt($scope.InfantsCount) > 0) {
                    res += ', \n' + $scope.InfantsCount + ' ' + $scope.helper.pluralForm($scope.InfantsCount, 'младенца', 'младенцев', 'младенцев') + ' (до 2-х лет)';
                }
                if (lastPeopleValidation != null) {

                    var awaitingList = [];
                    if (lastPeopleValidation.adultsCount > 0) {
                        awaitingList.push(lastPeopleValidation.adultsCount + ' ' + $scope.helper.pluralForm(lastPeopleValidation.adultsCount, 'взрослый', 'взрослых', 'взрослых'));
                    }
                    if (lastPeopleValidation.childsCount > 0) {
                        awaitingList.push(lastPeopleValidation.childsCount + ' ' + $scope.helper.pluralForm(lastPeopleValidation.childsCount, 'ребенок', 'ребенка', 'детей'));
                    }
                    if (lastPeopleValidation.infantsCount > 0) {
                        awaitingList.push(lastPeopleValidation.infantsCount + ' ' + $scope.helper.pluralForm(lastPeopleValidation.infantsCount, 'младенец', 'младенца', 'младенцев'));
                    }

                    if (awaitingList.length > 0) {
                        res += ', \n' + 'Ожидается: ';
                        res += awaitingList.join(', ');
                    }
                }
                res += '\nУчитывается возраст на дату вылета.';
                return res;
            }

            function updateBirthTooltip(lastPeopleValidation) {
                //console.log('updateBirthTooltip');
                $scope.birthTitle = getBirthTitle(lastPeopleValidation);
                //console.log('$scope.birthTitle: ' + $scope.birthTitle);
            }

            function updateValidationModel() {
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
                    if (isValid) {
                        model.isValid = true;
                        model.isInvalid = false;
                    }
                    else {
                        model.isValid = false;
                        model.isInvalid = true;
                    }
                }

                $scope.validate = function (item, type) {
                    if (item != null) {
                        //dirty hack
                        //из-за валидаторов дат, не проверяем, если пришло типа '__.__.____'
                        if ((item.validationType == validateType.birthdate || item.validationType == validateType.expire)
                            && item.value.indexOf('_') > -1) {
                            $scope.setValid(item, true);
                            return;
                        }

                        //console.log('validate, key: %s, element: %s', model.key, model.$element.get(0));
                        //console.log('validate, item: %s; validationType: %s, type:%s', item.value, item.validationType, type);
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
                                    //if (!$scope.validatePeopleCount())
                                    //    throw 'err';
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
                                                for (var i = 0; i < item.EtapsTo.length; i++) {
                                                    var etap = item.EtapsTo[i];
                                                    etapCountries.push(etap.InCountryId);
                                                    etapCountries.push(etap.OutCountryId);
                                                }
                                                //_.each(item.EtapsTo, function (etap) {
                                                //    etapCountries.push(etap.InCountryId);
                                                //    etapCountries.push(etap.OutCountryId);
                                                //});
                                            }
                                            if (item.EtapsBack != null) {
                                                for (var i = 0; i < item.EtapsBack.length; i++) {
                                                    var etap = item.EtapsBack[i];
                                                    etapCountries.push(etap.InCountryId);
                                                    etapCountries.push(etap.OutCountryId);
                                                }
                                                //_.each(item.EtapsBack, function (etap) {
                                                //    etapCountries.push(etap.InCountryId);
                                                //    etapCountries.push(etap.OutCountryId);
                                                //});
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
                                            try {
                                                fn();
                                                return true;
                                            }
                                            catch (err) {
                                                return false;
                                            }
                                        }

                                        var tripInsideRF = isTripInsideRF($scope.item);
                                        if (tripInsideRF) {
                                            //проверяем паспорт, загран, св. о рождении
                                            if (isCaseValid(function () {
                                                Validators.ruPassport(doc_num, 'err');
                                            }) ||
                                                isCaseValid(function () {
                                                    Validators.enPassport(doc_num, 'err');
                                                }) ||
                                                isCaseValid(function () {
                                                    Validators.birthPassport(doc_num, 'err');
                                                })) {
                                                //все норм - не выкидываем исключение
                                            }
                                            else {
                                                //одна или больше проверок сфейлиломсь - выкидываем исключение
                                                throw 'err';
                                            }
                                        }
                                        else {
                                            //загран
                                            Validators.enPassport(doc_num, 'err');
                                        }
                                    }
                                    else {
                                        //для граждан других стран
                                        //непустая строка
                                        //уже проверили в самом начале
                                    }
                                });
                                break;
                            }
                        }

                        //прячем тултип, если показывали
                        //if (item.haveTooltip == true)
                        //{
                        //    var $to = $('#' + item.id);
                        //    $scope.tooltipControl.close($to);
                        //}
                        var $to = $('#' + item.id);
                        $scope.tooltipControl.close($to);
                    }

                    //if ($scope.validationModel != null && type != null)
                    //{
                    //    $scope.validationModel.formPure = false;
                    //}
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
                        if (_.isArray($scope.model[key])) {
                            newItem = [];
                            _.each($scope.model[key], function (item, index) {
                                var itemKeys = _.keys(item);
                                var newIntItem = {};
                                _.each(itemKeys, function (inKey) {
                                    if (_.isFunction(item[inKey]) || _.any(ignoreKeys, function (item) {
                                        return item == inKey;
                                    })) {
                                        newIntItem[inKey] = angular.copy(item[inKey]);
                                    }
                                    else {
                                        newIntItem[inKey] = getValidationItem(inKey, angular.copy(item[inKey]));
                                        if (inKey == 'citizenship') {
                                            newIntItem[inKey].setValue = function (item) {
                                                var self = this;
                                                self.value = item;
                                                //console.log('setValue');
                                                //console.log(item);
                                                visaNeededCheck();
                                            }
                                        }
                                    }
                                });

                                newItem.push(newIntItem);
                            });
                        }
                        else {
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

                function getValidationModel() {
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
                            validList = _.filter(validList, function (item) {
                                return item.isValid != undefined
                            });
                            return validList;
                        },
                        getArrayFileds: function () {
                            var self = this;
                            var keys = _.keys(this);
                            keys = _.filter(keys, function (k) {
                                return _.isArray(self[k]);
                            });
                            var validList = _.map(keys, function (key) {
                                return self[key];
                            });
                            return validList;
                        },
                        isModelValid: function () {
                            var invalidItem = validationModel.getFirstInvalidItem();
                            return invalidItem == null;
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
                                    var passList = arFields[i];
                                    for (var j = 0; j < passList.length; j++) {
                                        var pass = passList[j];
                                        firstItem = findInModel(pass);
                                        if (firstItem != null)
                                            return firstItem;
                                    }
                                }
                            }
                            return firstItem;
                        },
                        enumAllKeys: function (fn) {
                            var list = this.getFields(this);
                            for (var vi = 0; vi < list.length; vi++) {
                                var item = list[vi];
                                fn(item);
                            }

                            //вложенные свойства
                            var arFields = this.getArrayFileds();
                            for (var i = 0; i < arFields.length; i++) {
                                var passList = arFields[i];
                                for (var j = 0; j < passList.length; j++) {
                                    var pass = passList[j];
                                    var passKeysList = this.getFields(pass);
                                    for (var zi = 0; zi < passKeysList.length; zi++) {
                                        var item = passKeysList[zi];
                                        fn(item);
                                    }
                                }
                            }
                        },
                        validateAll: function () {
                            validationModel.enumAllKeys($scope.validate);

                            this.formPure = false;
                        }
                    };
                    return validationModel;
                }

                if ($scope.validationModel == null) {
                    var validationModel = getValidationModel();
                    $scope.validationModel = validationModel;
                }
                updateFields($scope.validationModel);

                visaNeededCheck();

                //console.log('$scope.validationModel');
                //console.log($scope.validationModel);

                $scope.isFieldInvalid = function (item) {
                    //if (item != null && item.key == 'citizenship') {
                    //    console.log(item);
                    //}
                    if (item != null && item.value != null && (!_.isString(item.value) || item.value.length > 0)) {
                        if ($scope.validationModel.formPure) {
                            return item.isInvalid && item.value != null && item.value.length > 0;//подсвечиваем только если что-то введено в полях
                        }
                        else {
                            return item.isInvalid;
                        }
                    }
                    else {
                        return !$scope.validationModel.formPure;
                    }
                }
            }

            $scope.$watch('model', function (newVal, oldVal) {
//                if (newVal === oldVal)
//                    return;

                updateValidationModel();
            }, true);

            function loadHelpersDataAndInitModel() {
                var loader = new utils.loader();

                function loadAllCountries(onCompleteFnRun) {
                    var self = this;
                    dataService.getAllCountries(function (data) {
                        if (data != null) {
                            $scope.citizenshipList = data;
                            loader.complete(self);
                        }
                    }, function (data, status) {
                        log('getAllCountries error: status:' + status);
                    });
                };

                function loadTransporters(onCompleteFnRun) {
                    var self = this;
                    var transportersNames = [];

                    if ($scope.item.EtapsTo.length > 0) {
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

                            loader.complete(self);
                        }
                    }, function (data, status) {
                        log('getTransportersInAlliances error: ' + transportersNames + ' status:' + status);
                    });
                };

                loader.init([loadAllCountries, loadTransporters], initPayModel).run();
            }

            $scope.initPayModel = function () {
                //log('$scope.initPayModel');
                loadHelpersDataAndInitModel();
            }

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
                            cit: {
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
                        }
                    };
                    //log('passengerModel showCitListClick: ' + passengerModel.showCitListClick)
                    return model;
                }

                var passengers = [];
                for (var i = 0; i < $scope.peopleCount; i++) {
                    var item = new passengerModel(i);
                    passengers.push(item);
                }

                var userInfo = {
                    name: '',
                    secondName: '',
                    email: '',
                    phone: '+7'
                };

                if ($rootScope.user != null && $rootScope.user.raw != null) {
                    fillFromUserProfile(userInfo, $rootScope.user.raw);
                }

                $scope.model = {
                    price: $scope.item.Price,
                    name: userInfo.name,
                    secondName: userInfo.secondName,
                    email: userInfo.email,
                    phone: userInfo.phone,
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
                init: function ($to) {
                    //$to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
                    $to.tooltipX({
                        autoShow: false, autoHide: false, position: {at: 'center bottom' },
                        items: "[data-title]",
                        content: function () {
                            return $to.attr('data-title');
                            //return $to.data("title");
                        }
                    });
                },
                open: function ($to) {
                    //$to.tooltip("enable");
                    //$to.tooltip("open");
                    setTimeout(function () {
                        $to.tooltipX("open");
                    }, 50);
                },
                close: function ($to) {
                    //$to.tooltip("disable");
                    //$to.tooltipX("destroy");
                    try {
                        $to.tooltipX("destroy");
                    }
                    catch (e) {
                    }
                    ;
                }
            };

            //оплата
            $scope.processToPayment = function ($event) {
                eventsHelper.preventBubbling($event);

                $scope.validationModel.validateAll();
                $scope.validatePeopleCount();

                //console.log('$scope.validationModel');
                //console.log($scope.validationModel);

                //ищем первый невалидный элемент, берем только непустые
                var invalidItem = $scope.validationModel.getFirstInvalidItem(function (item) {
                    return (item.value != null && (!_.isString(item.value) || item.value.length > 0));
                });
                if (invalidItem != null) {

                    // скроллим страницу вверх
                    // показываем тултип
                    $("body, html").animate({"scrollTop":0},function(){
                        var $to = $("#" + invalidItem.id);

                        console.log('scrolltop');

                        $scope.tooltipControl.init($to);
                        $scope.tooltipControl.open($to);
                    });

                    return;
                }

                //если модель валидна - бронируем
                if ($scope.validationModel.isModelValid()) {

                    $scope.baloon.show("Бронирование авиабилетов", null);
                    //бронируем
                    $scope.reserve();
                }
            };

            $scope.goToB2bCabinet = function () {
                location.href = app_main.b2bHost;
            }

            $scope.isAgency = function () {
                return ($scope.$root.user != null && $scope.$root.user.isAgency());
            }

            $scope.isCaseValid = function (fn) {
                try {
                    fn();
                    return true;
                }
                catch (err) {
                    return false;
                }
            }

            $scope.getDocType = function (doc_num) {
                //var doc_num = number.replace(/\s+/g, '');

                if ($scope.isCaseValid(function () {
                    Validators.ruPassport(doc_num, 'err');
                })) {
                    return 0;//паспорт
                }

                if ($scope.isCaseValid(function () {
                    Validators.enPassport(doc_num, 'err');
                })) {
                    return 1;//загран
                }

                if ($scope.isCaseValid(function () {
                    Validators.birthPassport(doc_num, 'err');
                })) {
                    return 2;//свидетельство о рождении
                }

                if ($scope.isCaseValid(function () {
                    Validators.defined(doc_num, 'err');
                })) {
                    return 3;//Иностранный документ
                }

                return null;
            }

            $scope.getPassenger = function (data) {
                var doc_num = data.doc_series_and_number.replace(/\s+/g, '');

                var m = {};
                m.Sex = data.sex;
                m.I = data.name;
                m.F = data.secondName;
                m.Birthday = data.birthday;
                m.DocumentId = $scope.getDocType(doc_num);
                m.Number = doc_num;
                m.ExpirationDate = data.doc_expirationDate;
                m.Citizen = data.citizenship.id;
                m.Index = data.index;
                if (data.bonuscard.haveBonusCard) {
                    m.BonusCard = data.bonuscard.number;
                    m.TransporterId = data.bonuscard.airCompany.id;
                    m.TransporterName = data.bonuscard.airCompany.name;
                }
                return m;
            }

            $scope.getModelFromValidationModel = function (validationModel) {
                var keys = _.keys(validationModel);
                var model = {};
                _.each(keys, function (key) {
                    if (_.isArray(validationModel[key])) {
                        model[key] = [];
                        _.each(validationModel[key], function (item) {
                            var iKeys = _.keys(item);
                            var iItem = {};
                            _.each(iKeys, function (iKey) {
                                if (_.isArray(item[iKey])) {
                                    //пропускаем
                                }
                                else if (_.isFunction(item[iKey])) {
                                    //пропускаем
                                }
                                else {
                                    iItem[iKey] = angular.copy(item[iKey].value);
                                }
                            });
                            model[key].push(iItem);
                        });
                    }
                    else if (_.isFunction(validationModel[key])) {
                        //пропускаем
                    }
                    else {
                        model[key] = angular.copy(validationModel[key].value);
                    }
                });
                return model;
            }

            $scope.getApiModelForReserve = function () {
                //function call() { if (afterCompleteCallback) afterCompleteCallback(); };

                var model = $scope.getModelFromValidationModel($scope.validationModel);
                model.price = $scope.item.Price;

                var apiModel = $scope.getApiModel(model);
                log('');
                log('reservationModel: ' + angular.toJson(model));
                log('');
                log('apiModel: ' + angular.toJson(apiModel));
                return { apiModel: apiModel, model: model };
            }

            var debugPassengersList = [
                { name: 'IVAN', secondName: 'IVANOV', sex: $scope.sexType.man, birthday: '18.07.1976', series_and_number: '4507 04820' },
                { name: 'TATIANA', secondName: 'IVANOVA', sex: $scope.sexType.woman, birthday: '25.09.1978', series_and_number: '4507 04823' },
                { name: 'SERGEY', secondName: 'IVANOV', sex: $scope.sexType.man, birthday: '12.07.2006', series_and_number: '4507 02853' },
                { name: 'ELENA', secondName: 'IVANOVA', sex: $scope.sexType.woman, birthday: '12.11.2013', series_and_number: '4507 01853' },
            ];

            $scope.fillDefaultModel = function ($event) {
                eventsHelper.preventBubbling($event);

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
                        pas.doc_series_and_number = debugItem.series_and_number;
                        pas.doc_expirationDate = '18.07.2015';
                        pas.bonuscard.haveBonusCard = (index % 2 == 0 ? true : false);
                        pas.bonuscard.airCompany.id = 2;
                        pas.bonuscard.airCompany.name = 'Aeroflot';
                        pas.bonuscard.number = '1213473454';
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
                        pas.bonuscard.number = '1213463454';
                    }
                });
            };

            //заполнение из профиля при логине
            $rootScope.$on(Events.AUTH_SIGN_IN, function (event, data) {
                $scope.safeApply(function () {
                    fillFromUserProfile($scope.model, data);
                });
            });

            function fillFromUserProfile(object, user) {
                object.name = user.FirstName;
                object.secondName = user.LastName;
                object.email = user.Email;
                object.phone = user.Phone;
            }

            function closeAllTooltips() {
                if ($scope.validationModel != null) {
                    $scope.validationModel.enumAllKeys(function (item) {
                        var $to = $("#" + item.id);
                        $scope.tooltipControl.close($to);
                    });
                }
            }

            $scope.$on('$destroy', function () {
                closeAllTooltips();
            });
        }]);
