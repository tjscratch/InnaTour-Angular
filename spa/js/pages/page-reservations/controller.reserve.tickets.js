innaAppControllers.controller('ReserveTicketsCtrl',
    function ($log,
              $timeout,
              $interval,
              $scope,
              $rootScope,
              $routeParams,
              $filter,
              $location,
              $cookieStore,
              dataService,
              paymentService,
              storageService,
              CheckSmsService,
              aviaHelper,
              eventsHelper,
              urlHelper,
              Validators,
              innaAppApiEvents,
              serviceCache,
              gtm) {
        
        var self = this;
        
        var pageType = serviceCache.getObject('PageType');
        
        function log(msg) {
            $log.log(msg);
        }
        
        //кастомный текст в валидаторах
        $scope.birthTitle;
        
        $scope.peopleCount = 0;
        $scope.AdultCount = 0;
        $scope.ChildCount = 0;
        $scope.InfantsCount = 0;
        $scope.Child = [];
        $scope.fromDate = null;
        
        $scope.item = null;
        $scope.citizenshipList = null;
        $scope.bonusCardTransportersList = null;
        $scope.model = null;
        
        $scope.documentTypeList = [
            {Id: 1, Name: 'Паспорт РФ'},
            {Id: 2, Name: 'Загранпаспорт'},
            {Id: 3, Name: 'Св-во о рождении'},
            {Id: 4, Name: 'Иностранный документ'}
        ];
        
        $scope.passengerCount = parseInt($routeParams.Adult) + ($routeParams.Children ? $routeParams.Children.split('_').length : 0);
        
        
        if ($scope.user) {
            var currentPageUrl = $location.absUrl().replace(/\#\w+/, '');
            $scope.currentPageUrl = currentPageUrl + "&b2b_operator=" + $scope.user.raw.UserId + '#' + $location.$$hash;
        } else {
            $scope.currentPageUrl = $location.absUrl();
        }
        
        //$scope.documentTypeListFiltered = null;
        
        function filterDocType() {
            //console.log('$scope.validationModel', $scope.validationModel);
            if ($scope.validationModel && $scope.validationModel.passengers) {
                _.each($scope.validationModel.passengers, function (pas) {
                    //Россия
                    if (pas.citizenship.value.id == 189) {
                        if ($scope.tripInsideRFFlag) {
                            pas.documentTypeList = [
                                {Id: 1, Name: 'Паспорт РФ'},
                                {Id: 2, Name: 'Загранпаспорт'},
                                {Id: 3, Name: 'Св-во о рождении'}
                            ];
                        }
                        else {
                            pas.documentTypeList = [
                                {Id: 2, Name: 'Загранпаспорт'}
                            ];
                        }
                    }
                    else {
                        pas.documentTypeList = [
                            {Id: 4, Name: 'Иностранный документ'}
                        ];
                    }
                    
                    //проставляем первое значение
                    var firstVal = pas.documentTypeList[0];
                    pas.doc_type.value = {id: firstVal.Id, name: firstVal.Name};
                });
                
                //console.log('$scope.validationModel.passengers', $scope.validationModel.passengers);
            }
        }
        
        filterDocType();
        
        $scope.phoneCodesList = null;
        
        (function fillPhoneCodes() {
            var codesArray = [
                '93|Афганистан +93',
                '355|Албания +355',
                '21|Алжир +21',
                '684|Американское Самоа +684',
                '376|Андорра +376',
                '244|Ангола +244',
                '1-264|Ангуилла +1-264',
                '1-268|Антигуа и Барбуда +1-268',
                '54|Аргентина +54',
                '374|Армения +374',
                '297|Аруба +297',
                '247|Асеньон +247',
                '61|Австралия +61',
                '672|Австралийские внеш. террит-и +672',
                '43|Австрия +43',
                '994|Азербайджан +994',
                '351|Азорские о-ва +351',
                '1-242|Багамы +1-242',
                '973|Бахрейн +973',
                '880|Бангладеш +880',
                '1-246|Барбадос +1-246',
                '375|Белоруссия +375',
                '32|Бельгия +32',
                '501|Белиз +501',
                '229|Бенин +229',
                '1-441|Бермудские о-ва +1-441',
                '975|Бутан +975',
                '591|Боливия +591',
                '387|Босния и Герцеговина +387',
                '267|Ботсвана +267',
                '55|Бразилия +55',
                '1-284|Британские Вирджинские о-ва +1-284',
                '673|Бруней +673',
                '359|Болгария +359',
                '226|Буркина Фасо +226',
                '257|Бурунди +257',
                '7|Россия +7',
                '855|Камбоджа +855',
                '237|Камерун +237',
                '238|Капе Верде +238',
                '1-345|Каймановы о-ва +1-345',
                '236|ЦАР +236',
                '235|Чад +235',
                '56|Чили +56',
                '86|Китай +86',
                '672|Рождественсткие о-ва +672',
                '672|Кокосовые о-ва +672',
                '57|Колумбия +57',
                '1-670|Содружество северных Марианских о-вов +1-670',
                '269|Коморские о-ва +269',
                '242|Конго +242',
                '243|Дем. респ. Конго (бывш. Заир) +243',
                '682|О-ва Кука +682',
                '506|Коста Рика +506',
                '385|Хорватия +385',
                '53|Куба +53',
                '357|Кипр +357',
                '420|Чехия +420',
                '45|Дания +45',
                '246|Диего Гарсиа +246',
                '253|Джибути +253',
                '1-767|Доминика +1-767',
                '1-809|Доминиканская республика +1-809',
                '62|Восточный Тимор +62',
                '593|Эквадор +593',
                '20|Египет +20',
                '503|Сальвадор +503',
                '240|Экваториальная Гвинея +240',
                '291|Эритрия +291',
                '372|Эстония +372',
                '251|Эфиопия +251',
                '298|Фарерские о-ва +298',
                '500|Фолклендские о-ва +500',
                '679|Фиджи +679',
                '358|Финляндия +358',
                '33|Франция +33',
                '590|Французские Антиллы +590',
                '594|Французская Гвиана +594',
                '689|Французская полинезия +689',
                '241|Габон +241',
                '220|Гамбия +220',
                '995|Грузия +995',
                '49|Германия +49',
                '233|Гана +233',
                '350|Гибралтар +350',
                '30|Греция +30',
                '299|Гренландия +299',
                '1-473|Гренада +1-473',
                '671|Гуам +671',
                '502|Гватемала +502',
                '224|Гвинея +224',
                '245|Гвинея Биссау +245',
                '592|Гайана +592',
                '509|Гаити +509',
                '504|Гондурас +504',
                '852|Гонконг +852',
                '36|Венгрия +36',
                '354|Исландия +354',
                '91|Индия +91',
                '62|Индонезия +62',
                '98|Иран +98',
                '964|Ирак +964',
                '353|Ирландия +353',
                '972|Израиль +972',
                '39|Италия +39',
                '225|Берег слоновой кости +225',
                '1-876|Ямайка +1-876',
                '81|Япония +81',
                '962|Иордания +962',
                '7|Казахстан +7',
                '254|Кения +254',
                '686|Кирибати +686',
                '850|Северная Корея +850',
                '82|Южная Корея +82',
                '965|Кувейт +965',
                '996|Киргизстан +996',
                '856|Лаос +856',
                '371|Латвия +371',
                '961|Ливан +961',
                '266|Лессото +266',
                '231|Либерия +231',
                '21|Ливия +21',
                '41|Лихтенштейн +41',
                '370|Литва +370',
                '352|Люксембург +352',
                '853|Макао +853',
                '389|Македония +389',
                '261|Мадагаскар +261',
                '265|Малави +265',
                '60|Малайзия +60',
                '960|Мальдивские о-ва +960',
                '223|Мали +223',
                '356|Мальта +356',
                '692|Маршалловы о-ва +692',
                '596|Мартиника +596',
                '222|Мавритания +222',
                '230|Маврикий +230',
                '52|Мексика +52',
                '691|Микронезия +691',
                '377|Монако +377',
                '976|Монголия +976',
                '1-664|Монсеррат +1-664',
                '373|Молдавия +373',
                '212|Марокко +212',
                '258|Мозамбик +258',
                '95|Мьянма +95',
                '264|Намибия +264',
                '674|Науру +674',
                '977|Непал +977',
                '31|Нидерланды +31',
                '599|Нидерландские Антиллы +599',
                '687|Новая Каледония +687',
                '64|Новая Зеландия +64',
                '505|Никарагуа +505',
                '227|Нигер +227',
                '234|Нигерия +234',
                '683|Ниуэ +683',
                '672|Норфолкские о-ва +672',
                '670|Северо-Марианские о-ва +670',
                '47|Норвегия +47',
                '968|Оман +968',
                '92|Пакистан +92',
                '680|Палау +680',
                '507|Панама +507',
                '675|Папуа Новая Гвинея +675',
                '595|Парагвай +595',
                '51|Перу +51',
                '63|Филипины +63',
                '48|Польша +48',
                '351|Португалия +351',
                '1-787|Пуэрто Рико +1-787',
                '974|Катар +974',
                '378|Сан Марино +378',
                '262|Реюнион +262',
                '40|Румыния +40',
                '250|Руанда +250',
                '247|О-ва Святой Елены +247',
                '508|Сент Пьер +508',
                '39|Сан Марино +39',
                '239|Сент Том и Принцип +239',
                '966|Саудовская Аравия +966',
                '221|Сенегал +221',
                '248|Сейшельские о-ва +248',
                '232|Сьерра Леоне +232',
                '65|Сингапур +65',
                '421|Словакия +421',
                '386|Словения +386',
                '677|Соломоновы о-ва +677',
                '252|Сомали +252',
                '27|ЮАР +27',
                '34|Испания +34',
                '94|Шри Ланка +94',
                '1-869|Сент-Китс и Невис +1-869',
                '1-758|Санта Лючия +1-758',
                '1-784|Сент Винцент и Гренадины +1-784',
                '249|Судан +249',
                '597|Суринам +597',
                '47|Свалбард +47',
                '268|Свазиленд +268',
                '46|Швеция +46',
                '41|Швейцария +41',
                '963|Сирия +963',
                '886|Тайвань +886',
                '992|Таджикистан +992',
                '255|Танзания +255',
                '66|Тайланд +66',
                '228|Тоголезе +228',
                '690|Токелау +690',
                '676|Тонго +676',
                '1-868|Тринидад и Тобаго +1-868',
                '21|Тунис +21',
                '90|Турция +90',
                '993|Туркменистан +993',
                '1-649|Теркс и Кайкос +1-649',
                '688|Тувалу +688',
                '256|Уганда +256',
                '380|Украина +380',
                '971|ОАЭ +971',
                '44|Великобритания +44',
                '598|Уругвай +598',
                '1-340|Вирджинские о-ва +1-340',
                '1|США +1',
                '998|Узбекистан +998',
                '678|Вануату +678',
                '39|Ватикан +39',
                '58|Венесуэла +58',
                '84|Вьетнам +84',
                '681|Уоллис и Футуна +681',
                '21|Западная Сахара +21',
                '685|Западное Самоа +685',
                '967|Северный Йемен +967',
                '969|Южный Йемен +969',
                '381|Югославия +381',
                '243|Заир +243',
                '260|Замбия +260',
                '259|Занзибар +259',
                '263|Зимбабве +263'
            ];
            
            var phoneCodesList = [];
            
            for (var i = 0; i < codesArray.length; i++) {
                var split = codesArray[i].split('|');
                var id = '+' + split[0];
                var name = split[1];
                phoneCodesList.push({Id: id, Name: name});
            }
            
            phoneCodesList.sort(function (a, b) {
                if (a.Name < b.Name) {
                    return -1;
                }
                else if (a.Name > b.Name) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            
            //for (var i = 0; i < phoneCodesList.length; i++) {
            //    var item = phoneCodesList[i];
            //    console.log(item.Name);
            //}
            
            $scope.phoneCodesList = phoneCodesList;
        })();
        
        $scope.sexType = aviaHelper.sexType;
        $scope.helper = aviaHelper;
        
        $scope.tarifs = new $scope.helper.tarifs();
        
        $scope.hotelRules = new $scope.helper.hotelRules();
        
        $scope.insuranceRules = new $scope.helper.insuranceRules();
        
        $scope.checkReserveSms = new $scope.helper.checkReserveSms();
        
        $scope.loadTarifs = function (variantTo, varianBack, aviaInfo) {
            $scope.tarifs.fillInfo(aviaInfo);
            
            paymentService.getTarifs({variantTo: variantTo, varianBack: varianBack},
                function (data) {
                    //console.log('\npaymentService.getTarifs, data:');
                    //console.log(data);
                    $scope.tarifs.tarifsData = data;
                },
                function (data, status) {
                    log('paymentService.getTarifs error');
                });
        };
        
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
            phonePrefix: 'phonePrefix',
            phoneNum: 'phoneNum',
            phone: 'phone',
            date: 'date',
            birthdate: 'birthdate',
            expire: 'expire',
            doc_type: 'doc_type',
            document: 'document',
            sex: 'sex'
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
        
        function getPeopleType(birthdate) {
            
            var peopleType = {
                adult: 'adult',
                child: 'child',
                infant: 'infant'
            };
            
            
            var fromDate = dateHelper.dateToJsDate($scope.fromDate);
            var bdate = dateHelper.dateToJsDate(birthdate);
            var age = dateHelper.calculateAge(bdate, fromDate);
            
            /**
             * TODO : на странице бронирования ДП
             * в отеле дели считаются до 16 лет
             * в авиа до 11
             * @type {number}
             */
            
            
            var infant = 2;
            var child = (!$scope.isAviaPage) ? 17 : 11;
            var adult = (!$scope.isAviaPage) ? 17 : 12;
            
            
            if (age < infant) {
                return peopleType.infant;
            }
            else if (age >= 2 && age <= child) {
                return peopleType.child;
            }
            else if (age >= adult) {
                return peopleType.adult;
            }
        }
        
        $scope.validatePeopleCount = function () {
            closeAllTooltips();
            
            var availableAdultCount = $scope.AdultCount;
            var availableChildCount = $scope.ChildCount;
            var availableInfantsCount = $scope.InfantsCount;
            
            var adultsFound = false;
            var childsFound = false;
            var infantsFound = false;
            
            var peopleFound = {
                adultsFoundCount: 0,
                childsFoundCount: 0,
                infantsFoundCount: 0
            };
            
            var peopleType = {
                adult: 'adult',
                child: 'child',
                infant: 'infant'
            };
            
            if ($scope.validationModel != null && $scope.validationModel.passengers != null && $scope.validationModel.passengers.length > 0) {
                
                
                function setNotValid(item) {
                    item.isValid = false;
                    item.isInvalid = !item.isValid;
                }
                
                var firstErrorPass = null;
                for (var i = 0; i < $scope.validationModel.passengers.length; i++) {
                    var pas = $scope.validationModel.passengers[i];
                    
                    if (pas.birthday.value != null && pas.birthday.value.length > 0) {
                        
                        // TODO : определяем тип человек (взрослый, ребенок, младенец)
                        var type = getPeopleType(pas.birthday.value);
                        switch (type) {
                            case peopleType.adult: {
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
                            case peopleType.child: {
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
                            case peopleType.infant: {
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
                    
                    //запоминаем первого неправильного пассажира
                    if (availableAdultCount < 0 || availableChildCount < 0 || availableInfantsCount < 0) {
                        if (!firstErrorPass) {
                            firstErrorPass = pas;
                        }
                    }
                }
                
                //console.log('a: %d, c: %d, i: %d', availableAdultCount, availableChildCount, availableInfantsCount);
                if (availableAdultCount < 0 || availableChildCount < 0 || availableInfantsCount < 0) {
                    if (firstErrorPass) {
                        setNotValid(firstErrorPass.birthday);
                    }
                    updateBirthTooltip({
                        adultsCount: availableAdultCount,
                        childsCount: availableChildCount,
                        infantsCount: availableInfantsCount
                    });
                    return false;
                }
            }
            updateBirthTooltip({
                adultsCount: availableAdultCount,
                childsCount: availableChildCount,
                infantsCount: availableInfantsCount
            });
            return true;
        };
        
        function getBirthTitle(lastPeopleValidation) {
            
            // TODO: адский костыль
            var sex = ($scope.isAviaPage) ? '(от 2 до 12 лет)' : '(от 2 до 17 лет)';
            
            var res = 'Проверьте даты рождения, \nвы делали поиск на ' + $scope.AdultCount + ' ' + $scope.helper.pluralForm($scope.AdultCount, 'взрослого', 'взрослых', 'взрослых');
            if (parseInt($scope.ChildCount) > 0) {
                res += ', \n' + $scope.ChildCount + ' ' + $scope.helper.pluralForm($scope.ChildCount, 'ребенка', 'детей', 'детей') + ' ' + sex;
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
                    dependsOnField2: null,//валидация зависит от поля
                    isValid: true,
                    isInvalid: false,
                    validationType: null,
                    alwaysValid: false//поле не участвует в валидации
                }
            }
            
            function tryValidate(model, fn) {
                try {
                    fn();
                    $scope.setValid(model, true);
                    return null;
                }
                catch (err) {
                    $scope.setValid(model, false);
                    return err;
                }
                //log('tryValidate, ' + model.key + ' = \'' + model.value + '\', isValid: ' + model.isValid);
            }
            
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
                
                if (model.key == 'sex') {
                    var $to = $('#' + model.id);
                    $scope.tooltipControl.close($to);
                }
            };
            
            $scope.setAlwaysValid = function (model, isValid) {
                if (model == null) return;
                if (isValid) {
                    model.alwaysValid = true;
                }
                else {
                    model.alwaysValid = false;
                }
            };
            
            $scope.isInside = function (item, arrayCountryIds, useAnyIn) {
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
                    
                    if (useAnyIn) {
                        if (_.any(arrayCountryIds, function (countryId) {
                                return countryId == etapCountry;
                            })) //нашли хоть одну в массиве (для Украины)
                        {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        if (_.indexOf(arrayCountryIds, etapCountry) < 0) //на каком-то этапе мы не попали в этот кейс
                        {
                            return false;
                        }
                    }
                }
                
                //прошлись по всем этапам, везде мы в нужном списке стран
                return true;
            };
            
            //нужно определить
            //для граждан РФ, летящих внутри стран РФ, Абхазия, Белоруссия, Казахстан, Нагорный Карабах,
            //Приднестровье, Таджикистан, Украина, Южная Осетия
            $scope.isTripInsideRF = function (item) {
                //Нагорный Карабах, Приднестровье
                //var arrayCountryIds = [189, 69829, 35, 124, 0, 0, 215, 226, 0];
                //Южная Осетия
                // хохолов 226 удаляем из этого списка
                //115 - Киргизия
                var arrayCountryIds = [189, 69829, 35, 124, 215, 115];
                return $scope.isInside(item, arrayCountryIds);
            };
            
            $scope.validate = function (item, type, $index) {
                
                if (item != null) {
                    //dirty hack
                    //из-за валидаторов дат, не проверяем, если пришло типа '__.__.____'
                    if ((item.validationType == validateType.birthdate || item.validationType == validateType.expire
                        || item.validationType == validateType.phoneNum)
                        && item.value.indexOf('_') > -1) {
                        $scope.setValid(item, true);
                        return;
                    }
                    
                    //console.log('validate, key: %s, element: %s', model.key, model.$element.get(0));
                    //console.log('validate, item: %s; validationType: %s, type:%s', item.value, item.validationType, type);
                    switch (item.validationType) {
                        case validateType.required: {
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
                        case validateType.email: {
                            tryValidate(item, function () {
                                Validators.email(item.value, 'err');
                            });
                            break;
                        }
                        case validateType.phonePrefix: {
                            tryValidate(item, function () {
                                Validators.defined(item.value.name, 'err');
                            });
                            break;
                        }
                        case validateType.phoneNum: {
                            var phoneCode = item.dependsOnField ? item.dependsOnField.value.id : null;
                            //console.log('validateType.phoneNum', item.value, 'phoneCode', phoneCode);
                            
                            tryValidate(item, function () {
                                if (phoneCode == '+7') { //для России
                                    Validators.phoneNum(item.value, 'err');
                                }
                                else {
                                    Validators.phoneNumWoFormat(item.value, 'err');
                                }
                            });
                            break;
                        }
                        case validateType.phone: {
                            tryValidate(item, function () {
                                Validators.phone(item.value, 'err');
                            });
                            break;
                        }
                        case validateType.date: {
                            tryValidate(item, function () {
                                Validators.date(item.value, 'err');
                            });
                            break;
                        }
                        
                        // TODO : валидация дня рождения
                        case validateType.birthdate: {
                            tryValidate(item, function () {
                                item.$index = $index;
                                
                                Validators.birthdate(item.value, 'err');
                                
                                //item.isChildAgeFind = false;
                                
                                
                                var peopleType = getPeopleType(item.value);
                                var fromDate = dateHelper.dateToJsDate($scope.fromDate);
                                var bdate = dateHelper.dateToJsDate(item.value);
                                var age = parseInt(dateHelper.calculateAge(bdate, fromDate));
                                //console.log('bdate:', bdate, 'age:', age);
                                
                                //этот кал больше не нужен
                                //function childAgeFind(){
                                //    var result = $scope.validationModel.passengers.filter(function(passenger, i){
                                //        if(i != item.$index) {
                                //            return passenger['birthday'] && (passenger['birthday'].isChildAgeFind == age);
                                //        }
                                //    })
                                //    return result;
                                //}
                                //
                                //
                                //if (peopleType == 'child' && ($scope.Child && $scope.Child.length)) {
                                //
                                //    var result = $scope.Child.filter(function (child) {
                                //        return (parseInt(child) == age);
                                //    });
                                //
                                //
                                //    if (!result.length || childAgeFind().length) {
                                //        //ToDo: разобраться что тут за херня
                                //        //а именно в childAgeFind
                                //        throw new Error('err');
                                //    } else {
                                //        item.isChildAgeFind = parseInt(result[0]);
                                //    }
                                //
                                //}
                            });
                            break;
                        }
                        case validateType.expire: {
                            var documentField = item.dependsOnField;
                            
                            function customErrHandle(item) {
                                $scope.setAlwaysValid(item, false);
                                var err = tryValidate(item, function () {
                                    //проверяем expire на дату вылета
                                    Validators.expire(item.value, $scope.expireDateTo, 'err', 'err_expire');
                                });
                                if (err == 'err_expire') {
                                    item.validationErrTitle = 'Срок действия документа истек';
                                }
                                else {
                                    item.validationErrTitle = 'Неправильно введена дата';
                                }
                                //console.log('err', err);
                            }
                            
                            if (documentField.isRuPassportOrBirthAndInsideRF == true) {
                                //если что-то ввели - то проверяем даты
                                if (item.value != null && item.value.length > 0) {
                                    customErrHandle(item);
                                }
                                else {
                                    //не проводим валидацию
                                    //паспорт РФ и перелет внутри РФ
                                    $scope.setValid(item, true);
                                    $scope.setAlwaysValid(item, true);
                                }
                            }
                            else {
                                customErrHandle(item);
                            }
                            
                            break;
                        }
                        case validateType.document: {
                            var doc_num = item.value.replace(/\s+/g, '');
                            
                            //гражданство
                            var citizenship = item.dependsOnField;
                            //тип документа
                            var docType = item.dependsOnField2;
                            
                            //console.log('validate document', citizenship.value, docType.value);
                            
                            //логика описана тут https://innatec.atlassian.net/browse/IN-746
                            tryValidate(item, function () {
                                Validators.defined(doc_num, 'err');
                                
                                //
                                if (citizenship == null || citizenship.value == null || !(citizenship.value.id > 0)
                                    || !docType)
                                    throw 'err';
                                
                                if (citizenship.value.id == 189)//Россия
                                {
                                    var tripInsideRF = $scope.isTripInsideRF($scope.item);
                                    if (tripInsideRF) {
                                        //проставляем флаг, что это российский паспорт
                                        //флаг понадобится при валидации Действителен до
                                        //это не сама проверка - она ниже!
                                        if ($scope.isCaseValid(function () {
                                                Validators.ruPassport(doc_num, 'err');
                                            }) ||
                                            $scope.isCaseValid(function () {
                                                Validators.birthPassport(doc_num, 'err');
                                            })) {
                                            item.isRuPassportOrBirthAndInsideRF = true;
                                        }
                                        else {
                                            item.isRuPassportOrBirthAndInsideRF = false;
                                        }
                                    }
                                }
                                
                                //валидация
                                switch (docType.value.id) {
                                    case 1:
                                        Validators.ruPassport(doc_num, 'err');
                                        break;
                                    case 2:
                                        Validators.enPassport(doc_num, 'err');
                                        break;
                                    case 3:
                                        Validators.birthPassport(doc_num, 'err');
                                        break;
                                    case 4:
                                        Validators.defined(doc_num, 'err');
                                        break;
                                    default:
                                        throw 'err';
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
                                            //console.log('citizenship setValue', item);
                                            //console.log(item);
                                            visaNeededCheck();
                                            filterDocType();
                                        }
                                    }
                                    else if (inKey == 'doc_type') {
                                        newIntItem[inKey].setValue = function (item) {
                                            var self = this;
                                            //console.log('doc_type res set', item);
                                            self.value = item;
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
                    
                    //console.log('updateFields', newItem);
                    if (newItem.key == 'phonePrefix') {
                        newItem.setValue = function (item) {
                            var self = this;
                            self.value = item;
                        }
                    }
                    
                    //сохраняем id и тип валидации
                    if (oldItem != null) {
                        newItem.id = oldItem.id;
                        newItem.validationType = oldItem.validationType;
                    }
                    
                    validationModel[key] = newItem;
                });
            }
            
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
                        }
                        
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
                        //console.log('here');
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
            filterDocType();
            
            //console.log('$scope.validationModel');
            //console.log($scope.validationModel);
            
            $scope.isFieldInvalid = function (item) {
                //if (item != null && item.key == 'doc_series_and_number') {
                //    console.log(item.isValid);
                //}
                if (item != null && item.value != null && (!_.isString(item.value) || item.value.length > 0 || item.alwaysValid)) {
                    if ($scope.validationModel.formPure) {
                        return item.isInvalid && ((item.value != null && item.value.length > 0) || item.alwaysValid);//подсвечиваем только если что-то введено в полях
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
        
        //$scope.$watch('validationModel', function (newVal, oldVal) {
        //    if ($scope.validationModel && newVal.passengers && newVal.passengers.length > 0) {
        //        console.log('validationModel', newVal.passengers[0].doc_type.value);
        //        console.log('validationModel', newVal.passengers[0].doc_series_and_number.value);
        //    }
        //}, true);
        
        //обновляем номер телефона
        $scope.$watchGroup(['validationModel.phonePrefix.value', 'validationModel.phoneNum.value'], function (newVal, oldVal) {
            if ($scope.validationModel && $scope.validationModel.phonePrefix) {
                $scope.validationModel.phone.value =
                    $scope.validationModel.phonePrefix.value.id +
                    //' ' +
                    normalizePhoneNum($scope.validationModel.phoneNum.value);
                //console.log('$scope.validationModel.phone.value', $scope.validationModel.phone.value);
            }
        });
        
        //удаляем из списка гражданств страну назначения
        function filterCitizenshipList(data) {
            console.log('filterCitizenshipList Is_it_tarif:', $scope.Is_it_tarif);
            if ($scope.Is_it_tarif == true) {
                //находим страну назначения
                //AviaInfo
                if ($scope.item && $scope.item.EtapsTo && $scope.item.EtapsTo.length > 0) {
                    //берем последний
                    var lastEtap = $scope.item.EtapsTo[$scope.item.EtapsTo.length - 1];
                    var countryId = lastEtap.InCountryId;
                    
                    //https://innatec.atlassian.net/browse/IN-5637
                    //если страна назначения РФ - то выводим все страны - не фильтруем
                    if (countryId && countryId != 189) {
                        //фильтруем
                        data = _.filter(data, function (cit) {
                            if (cit.Id == countryId) {
                                console.log('removed Id: ' + cit.Id + ' name: ' + cit.Name);
                            }
                            return cit.Id != countryId;
                        });
                    }
                }
            }
            
            //console.log('data.length:', data.length);
            return data;
        }
        
        function loadHelpersDataAndInitModel() {
            var loader = new utils.loader();
            
            function loadAllCountries(onCompleteFnRun) {
                var self = this;
                dataService.getAllCountries(function (data) {
                    if (data != null) {
                        $scope.citizenshipList = filterCitizenshipList(data);
                        loader.complete(self);
                    }
                }, function (data, status) {
                    log('getAllCountries error: status:' + status);
                });
            }
            
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
            }
            
            loader.init([loadAllCountries, loadTransporters], initPayModel).run();
        }
        
        $scope.initPayModel = function () {
            //log('$scope.initPayModel');
            loadHelpersDataAndInitModel();
        };
        
        function initPayModel() {
            //log('initPayModel');
            
            function passengerModel(index) {
                var model = {
                    index: index,
                    sex: null,
                    secondName: '',
                    name: '',
                    oName: '',
                    birthday: '',
                    citizenship: {//Гражданство
                        id: 189,
                        name: 'Россия'
                    },
                    doc_type: {
                        id: 1,
                        name: 'Паспорт РФ'
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
            
            function checkForExistingCitizenship(pas) {
                var citExists = _.find($scope.citizenshipList, function (item) {
                    return item.Id == pas.citizenship.id;
                });
                //если не нашли такое гражданство - то ставим по-умолчанию - страну вылета
                if (!citExists) {
                    var outCountryId = $scope.item.EtapsTo[0].OutCountryId;
                    var outCountryExists = _.find($scope.citizenshipList, function (item) {
                        return item.Id == outCountryId;
                    });
                    if (outCountryExists) {
                        pas.citizenship.id = outCountryExists.Id;
                        pas.citizenship.name = outCountryExists.Name;
                    }
                    else {//если не нашли - то первое в списке
                        pas.citizenship.id = $scope.citizenshipList[0].Id;
                        pas.citizenship.name = $scope.citizenshipList[0].Name;
                    }
                }
                //console.log('pas:', pas);
            }
            
            var passengers = [];
            for (var i = 0; i < $scope.peopleCount; i++) {
                var item = new passengerModel(i);
                checkForExistingCitizenship(item);
                passengers.push(item);
            }
            
            var userInfo = {
                name: '',
                secondName: '',
                oName: '',
                email: '',
                phone: '',
                phonePrefix: {id: '+7', name: 'Россия +7'},
                phoneNum: ''
            };
            
            //console.log($rootScope.user);
            //console.log($rootScope.user.raw);
            //console.log(!$rootScope.user.isAgency());
            
            //if ($rootScope.user != null && $rootScope.user.raw != null && !$rootScope.user.isAgency()) {
            //console.log('fillFromUserProfile', $rootScope.user.raw);
            //fillFromUserProfile(userInfo, $rootScope.user.raw);
            //}
            
            $scope.model = {
                price: $scope.item.Price,
                name: userInfo.name,
                secondName: userInfo.secondName,
                oName: '',
                email: userInfo.email,
                phonePrefix: userInfo.phonePrefix,
                phoneNum: userInfo.phoneNum,
                phone: userInfo.phone,
                wannaNewsletter: false,//Я хочу получать рассылку спецпредложений
                passengers: passengers
                
            };
            
            $scope.tripInsideRFFlag = $scope.isTripInsideRF($scope.item);
            console.log('$scope.tripInsideRFFlag', $scope.tripInsideRFFlag);
            
            //$scope.fillDefaultModel();
            $scope.fillStoredModel();
            
            if ($scope.afterPayModelInit != null)
                $scope.afterPayModelInit();
        }
        
        $scope.moreClick = function ($event) {
            eventsHelper.preventBubbling($event);
        };
        
        $scope.tooltipControl = {
            init: function ($to, customText) {
                console.log('reserve tooltipControl init');
                $to.tooltipX({
                    autoShow: false,
                    autoHide: false,
                    position: {
                        my: 'center top+12',
                        at: 'center bottom',
                        collision: "none"
                    },
                    items: "[data-title]",
                    content: function () {
                        if (customText) {
                            return customText;
                        }
                        else {
                            return $to.attr('data-title');
                        }
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
            }
        };
        
        
        $scope.$watch('agree', function (data) {
            if (data && $scope.agreeError == true) {
                $scope.agreeError = false;
            }
        });
        
        $scope.setOferta = function (isDp) {
            var url = app_main.staticHost + '/files/doc/offer.pdf';
            
            if (window.partners && window.partners.isFullWLOrB2bWl()) {
                url = normalizeUrl(window.partners.getPartner().offertaContractLink);
            }
            else {
                url = app_main.staticHost + '/files/doc/innatour_offerta.pdf';
            }
            
            function normalizeUrl(url) {
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
        $scope.setOferta();
        
        
        /**
         * begin
         * sms check
         * @type {string}
         */
        $scope.sms_code = '';
        $scope.sms_code_error = false;
        $scope.timer = 60000;
        
        $scope.submitSms = function () {
                if (pageType != 'Avia') {
                var dataLayerObj = {
                    'event': 'UM.Event',
                    'Data': {
                        'Category': 'Packages',
                        'Action': 'AskAgain',
                        'Label': '[no data]',
                        'Content': '[no data]',
                        'Context': '[no data]',
                        'Text': '[no data]'
                    }
                };
                console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
            }
            $scope.fight();
            $scope.timer = 60000;
            CheckSmsService.getSmsCode({Phone: $scope.validationModel.phone.value})
                .success(function (data) {
                    console.log(data)
                })
        }
        
        //console.log($scope.validationModel.phone.value)
        
        $scope.submitSmsCode = function ($event, code) {
            CheckSmsService.checkSmsCode({Phone: $scope.validationModel.phone.value, Code: code})
                .then(function successCallback(response) {
                    if (response.data == 0) {
                        $scope.sms_code_error = true;
                    } else {
                        if(pageType != 'Avia') {
                            var dataLayerObj = {
                                'event': 'UM.Event',
                                'Data': {
                                    'Category': 'Packages',
                                    'Action': 'SendConfirm',
                                    'Label': '[no data]',
                                    'Content': '[no data]',
                                    'Context': '[no data]',
                                    'Text': '[no data]'
                                }
                            };
                            console.table(dataLayerObj);
                            if (window.dataLayer) {
                                window.dataLayer.push(dataLayerObj);
                            }
                        }
                        $scope.checkReserveSms.close($event);
                        $scope.baloon.show("Бронирование авиабилетов", "Это займет не более 30 секунд");
                        $scope.reserve();
                    }
                }, function errorCallback(response) {
                    $scope.sms_code_error = true;
                });
        };
        
        var stop;
        $scope.fight = function () {
            if (angular.isDefined(stop)) return;
            stop = $interval(function () {
                if ($scope.timer > 0) {
                    $scope.timer = $scope.timer - 1000;
                } else {
                    $scope.stopFight();
                }
            }, 1000);
        };
        $scope.stopFight = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        };
        
        /**
         * end
         * sms check
         * @type {string}
         */
        
        
        $scope.processToPayment = function ($event) {
            eventsHelper.preventBubbling($event);
            
            //для отладки, если есть параметр debug
            $scope.saveFilledModel();
            
            $scope.validationModel.validateAll();
            $scope.validatePeopleCount();
            
            //console.log('$scope.validationModel');
            //console.log($scope.validationModel);
            
            //ищем первый невалидный элемент, берем только непустые
            var invalidItem = $scope.validationModel.getFirstInvalidItem(function (item) {
                //алерт будет показываться даже при пустом значении
                switch (item.key) {
                    case 'sex': {
                        return (!_.isString(item.value) || item.value.length > 0 || (item.value == null && item.key == 'sex'));
                    }
                    case 'phonePrefix':
                    case 'phoneNum':
                    case 'phone': {
                        return true;// item.value != null && (!_.isString(item.value) || item.value.length > 0) && item.value != '+7';
                    }
                    default: {
                        return true;// item.value != null && (!_.isString(item.value) || item.value.length > 0)
                    }
                }
            });
            
            
            if (invalidItem != null) {
                
                // скроллим страницу вверх
                // показываем тултип
                $("body, html").animate({"scrollTop": 400}, function () {
                    var $to = $("#" + invalidItem.id);
                    $scope.tooltipControl.init($to);
                    $scope.tooltipControl.open($to);
                });
                
                return;
            }
            
            
            if (!$scope.agree) {
                $scope.agreeError = true;
            }
            
            
            //если модель валидна - бронируем
            if ($scope.validationModel.isModelValid() && $scope.agree) {
                var category = pageType == 'Avia' ? 'Avia' : 'Packages';
                var dataLayerObj = {
                    'event': 'UM.Event',
                    'Data': {
                        'Category': category,
                        'Action': category + 'GotoPay',
                        'Label': '[no data]',
                        'Content': '[no data]',
                        'Context': '[no data]',
                        'Text': '[no data]'
                    }
                };
                console.table(dataLayerObj);
                if (window.dataLayer) {
                    window.dataLayer.push(dataLayerObj);
                }
                if ($scope.NeedSmsValidation) {
                    //$scope.checkReserveSms();
                    $scope.submitSms();
                    $scope.checkReserveSms.show($event);
                    
                    /**
                     * Трекаем события для GTM
                     * https://innatec.atlassian.net/browse/IN-7071
                     */
                    if (pageType == 'Avia') {
                        gtm.GtmTrack(
                            {
                                'PageType': 'AviaConfirm',
                                'Price': serviceCache.getObject('Price'),
                                'AirLineName': serviceCache.getObject('AirLineName')
                            }
                        );
                    } else {
                        gtm.GtmTrack(
                            {
                                'PageType': 'PackagesConfirm',
                                'Price': serviceCache.getObject('Price'),
                                'HotelName': serviceCache.getObject('HotelName')
                            }
                        );
                    }
                    
                } else {
                    $scope.baloon.show("Бронирование авиабилетов", "Это займет не более 30 секунд");
                    //бронируем
                    $scope.reserve();
                    
                    /**
                     * Трекаем события для GTM
                     * https://innatec.atlassian.net/browse/IN-7071
                     */
                    console.log(pageType)
                    if (pageType == 'Avia') {
                        gtm.GtmTrack(
                            {
                                'PageType': 'AviaBooking',
                                'Price': serviceCache.getObject('Price'),
                                'AirLineName': serviceCache.getObject('AirLineName')
                            }
                        );
                    } else {
                        gtm.GtmTrack(
                            {
                                'PageType': 'PackagesBooking',
                                'Price': serviceCache.getObject('Price'),
                                'HotelName': serviceCache.getObject('HotelName')
                            }
                        );
                    }
                }
            }
            
            
        };
        
        $scope.goToB2bCabinet = function () {
            var locationHref = app_main.b2bHost;
            
            var partner = window.partners ? window.partners.getPartner() : null;
            if (partner != null && partner.realType == window.partners.WLType.b2b) {
                if (partner.name == 'sputnik') {
                    locationHref = window.partners.getB2b_LK(partner);
                }
            }
            
            location.href = locationHref;
        };
        
        $scope.isAgency = function () {
            return ($scope.$root.user != null && $scope.$root.user.isAgency());
        };
        
        $scope.isCaseValid = function (fn) {
            try {
                fn();
                return true;
            }
            catch (err) {
                return false;
            }
        };
        
        $scope.getDocType = function (citizenshipId, doc_num) {
            //var doc_num = number.replace(/\s+/g, '');
            
            if (citizenshipId == 189)//если гражданин РФ
            {
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
            }
            else {//гражданин другого гос-ва
                if ($scope.isCaseValid(function () {
                        Validators.defined(doc_num, 'err');
                    })) {
                    return 3;//Иностранный документ
                }
            }
            
            return null;
        };
        
        $scope.getPassenger = function (data) {
            var doc_num = data.doc_series_and_number.replace(/\s+/g, '');
            
            var m = {};
            m.Sex = data.sex;
            m.I = data.name;
            m.F = data.secondName;
            m.O = data.oName;
            m.Birthday = data.birthday;
            m.DocumentId = $scope.getDocType(data.citizenship.id, doc_num);
            m.Number = doc_num;
            m.ExpirationDate = data.doc_expirationDate;
            m.Citizen = data.citizenship.id;
            m.Index = data.index;
            if (data.bonuscard.haveBonusCard) {
                m.BonusCard = data.bonuscard.number;
                m.TransporterId = data.bonuscard.airCompany.id;
                m.TransporterName = data.bonuscard.airCompany.name;
            }
            
            //console.log('getPassenger:');
            //console.log(m);
            return m;
        };
        
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
        };
        
        $scope.getApiModelForReserve = function () {
            //function call() { if (afterCompleteCallback) afterCompleteCallback(); };
            
            var model = $scope.getModelFromValidationModel($scope.validationModel);
            model.price = $scope.item.Price;
            
            var apiModel = $scope.getApiModel(model);
            log('');
            log('reservationModel: ' + angular.toJson(model));
            log('');
            log('apiModel: ' + angular.toJson(apiModel));
            return {apiModel: apiModel, model: model};
        };
        
        var debugPassengersList = [
            {
                name: 'IVAN',
                secondName: 'IVANOV',
                sex: $scope.sexType.man,
                birthday: '18.07.1976',
                series_and_number: '4507 04820'
            },
            {
                name: 'TATIANA',
                secondName: 'IVANOVA',
                sex: $scope.sexType.woman,
                birthday: '25.09.1978',
                series_and_number: '4507 04823'
            },
            {
                name: 'SERGEY',
                secondName: 'IVANOV',
                sex: $scope.sexType.man,
                birthday: '12.07.2006',
                series_and_number: '4507 02853'
            },
            {
                name: 'ELENA',
                secondName: 'IVANOVA',
                sex: $scope.sexType.woman,
                birthday: '12.11.2013',
                series_and_number: '4507 01853'
            }
        ];
        
        function isDebug() {
            if (location.hash && location.hash.indexOf('debug') > -1) {
                return true;
            }
            return false;
        }
        
        var reserve_debug_key = 'reserve_debug';
        
        $scope.fillStoredModel = function () {
            if (isDebug()) {
                var res = localStorage.getItem(reserve_debug_key);
                if (res != null) {
                    var model = JSON.parse(res);
                    $scope.model = model;
                }
            }
        };
        
        $scope.saveFilledModel = function () {
            if (isDebug()) {
                var model = $scope.getModelFromValidationModel($scope.validationModel);
                localStorage.setItem(reserve_debug_key, JSON.stringify(model));
            }
        };
        
        //$scope.fillDefaultModel = function ($event) {
        //    if ($event) {
        //        eventsHelper.preventBubbling($event);
        //    }
        
        //    $scope.model.name = 'Иван';
        //    $scope.model.secondName = 'Иванов';
        //    $scope.model.email = 'ivan.ivanov@gmail.com';
        //    $scope.model.phone = '+79101234567';
        //    var index = 0;
        //    _.each($scope.model.passengers, function (pas) {
        
        //        if (index < debugPassengersList.length) {
        //            var debugItem = debugPassengersList[index];
        //            index++;
        
        //            pas.name = debugItem.name;
        //            pas.secondName = debugItem.secondName;
        //            pas.sex = debugItem.sex;
        //            pas.birthday = debugItem.birthday;
        //            pas.citizenship.id = 189;
        //            pas.citizenship.name = 'Россия';
        //            pas.doc_series_and_number = debugItem.series_and_number;
        //            pas.doc_expirationDate = '18.07.2015';
        //            pas.bonuscard.haveBonusCard = (index % 2 == 0 ? true : false);
        //            pas.bonuscard.airCompany.id = 2;
        //            pas.bonuscard.airCompany.name = 'Aeroflot';
        //            pas.bonuscard.number = '1213473454';
        //        }
        //        else {
        //            pas.name = 'IVAN';
        //            pas.secondName = 'IVANOV';
        //            pas.sex = $scope.sexType.man;
        //            pas.birthday = '18.07.1976';
        //            pas.citizenship.id = 189;
        //            pas.citizenship.name = 'Россия';
        //            pas.doc_series_and_number = '4507 048200';
        //            pas.doc_expirationDate = '18.07.2015';
        //            pas.bonuscard.haveBonusCard = true;
        //            pas.bonuscard.airCompany.id = 2;
        //            pas.bonuscard.airCompany.name = 'Aeroflot';
        //            pas.bonuscard.number = '1213463454';
        //        }
        //    });
        //};
        
        //заполнение из профиля при логине
        $rootScope.$on(innaAppApiEvents.AUTH_SIGN_IN, function (event, data) {
            $scope.safeApply(function () {
                //fillFromUserProfile($scope.model, data);
            });
        });
        
        function fillFromUserProfile(object, user) {
            object.name = setEmptyIfUndefined(user.FirstName);
            object.secondName = setEmptyIfUndefined(user.LastName);
            object.email = setEmptyIfUndefined(user.Email);
            object.phone = setEmptyIfUndefined(correctPhone(user.Phone));
            
            var codeItem = findPhoneCodeItemByPhone(object.phone);
            if (codeItem && object.phone && object.phone.length > 0) {
                object.phonePrefix = {id: codeItem.Id, name: codeItem.Name};
                //отрезаем префикс
                object.phoneNum = object.phone.replace(codeItem.Id, '');
            }
            else {
                object.phonePrefix = {id: '+7', name: 'Россия +7'};
                object.phoneNum = '';
            }
        }
        
        function findPhoneCodeItemByPhone(phone) {
            if (phone) {
                for (var i = 0; i < $scope.phoneCodesList.length; i++) {
                    var id = $scope.phoneCodesList[i].Id;
                    if (phone.indexOf(id) > -1) {
                        return $scope.phoneCodesList[i]
                    }
                }
            }
            
            return null;
        }
        
        function setEmptyIfUndefined(value) {
            if (value != null) {
                if (value.length > 0) {
                    return value;
                }
            }
            return '';
        }
        
        function correctPhone(phone) {
            if (phone != null) {
                if (phone.length > 0) {
                    if (phone[0] != '+') {
                        phone = '+' + phone;
                    }
                }
            }
            return phone;
        }
        
        function closeAllTooltips() {
            if ($scope.validationModel != null) {
                $scope.validationModel.enumAllKeys(function (item) {
                    var $to = $("#" + item.id);
                    $scope.tooltipControl.close($to);
                });
            }
        }
        
        function normalizePhoneNum(phone) {
            if (phone) {
                //phone = phone.replace(/\(/, '');
                //phone = phone.replace(/\)/, '');
                //phone = phone.replace(/-/g, '');
                //phone = phone.replace(/\s/g, '');
                //phone = phone.replace(/_/g, '');
                phone = phone.replace(/[\(\)\s\-\_]/g, '');//убираем '(', ')', 'пробелы', '-', '_'
            }
            return phone;
        }
        
        //заявка на ДП
        $scope.sendRequest = function ($event) {
            $event.preventDefault();
            //console.log('sendRequest click');
            
            function showAlert(invalidItem) {
                $("body, html").animate({"scrollTop": 400}, function () {
                    var $to = $("#" + invalidItem.id);
                    $scope.tooltipControl.init($to);
                    $scope.tooltipControl.open($to);
                });
            }
            
            $scope.validate($scope.validationModel.email);
            if (!$scope.validationModel.email.isValid) {
                showAlert($scope.validationModel.email);
            }
            else {
                $scope.validate($scope.validationModel.phone);
                if (!$scope.validationModel.phone.isValid) {
                    showAlert($scope.validationModel.phone);
                }
                else {
                    //все норм - отправляем заявку
                    console.log('sendRequest send', $scope.validationModel.email.value, $scope.validationModel.phone.value);
                    
                    var m = $scope.getApiModelForReserve();
                    var apiModel = angular.copy(m.apiModel);
                    
                    paymentService.createDPRequest(apiModel,
                        function (data, status) {
                            if (data && data.Status == 1) {
                                console.log('sendRequest success', data, status);
                                var dataLayerObj = {
                                    'event': 'UM.Event',
                                    'Data': {
                                        'Category': 'Packages',
                                        'Action': 'SendRequest',
                                        'Label': '[no data]',
                                        'Content': '[no data]',
                                        'Context': '[no data]',
                                        'Text': '[no data]'
                                    }
                                };
                                console.table(dataLayerObj);
                                if (window.dataLayer) {
                                    window.dataLayer.push(dataLayerObj);
                                }
                                //показываем попап
                                $scope.baloon.show("Заявка отправлена", "В ближайшее время наш менеджер свяжется с Вами", aviaHelper.baloonType.success);
                            }
                            else {
                                $scope.baloon.showGlobalErr();
                            }
                        }, function (status) {
                            console.log('sendRequest error', status);
                            
                            $scope.baloon.showGlobalErr();
                        });
                }
            }
        };
        
        $scope.$on('$destroy', function () {
            closeAllTooltips();
        });
    });
