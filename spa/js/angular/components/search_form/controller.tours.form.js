'use strict';

/* Controllers */

innaAppControllers.
    controller('ToursFormCtrl', [
        '$log',
        '$scope',
        '$rootScope',
        '$routeParams',
        '$filter',
        '$location',
        'dataService',
        'urlHelper',
        function ToursFormCtrl($log, $scope, $rootScope, $routeParams, $filter, $location, dataService, urlHelper) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.getFlagUrl = function (code) {
                var url = "background-image: url('/spa/img/flags/" + code + ".png')"
                return url;
            }

            //+- 5 дней
            var DATE_INTERVAL_DAYS = 5;
            var toItemType = { country: 'country', resort: 'resort', hotel: 'hotel' };
            $scope.toItemType = toItemType;
            var skipCloseType = { from: 'from', to: 'to', date: 'date', nights: 'nights', people: 'people', childAge1: 'childAge1', childAge2: 'childAge2', childAge3: 'childAge3' };

            //форма===============================================================
            $scope.form = {};

            //список откуда
            var fromList = [
                new fromItem(832, "Москва", "Москвы"),
                new fromItem(1264, "Санкт-Петербург", "Санкт-Петербурга"),
                new fromItem(886, "Новосибирск", "Новосибирска"),
                new fromItem(425, "Екатеринбург", "Екатеринбурга"),
                new fromItem(872, "Нижний Новгород", "Нижнего Новгорода")
            ];

            //запрашиваем список слетать
            dataService.getSletatCity(function (data) {
                    var list = [];
                    _.each(data, function (item) {
                        list.push(new fromItem(item.id, item.name, item.name));
                    });
                    $scope.form.fromList = list;
                    //восстанавливаем значения формы из урла
                    restoreFormParamsFromQueryString();
                },
                function (data, status) {
                });

            //откуда
            $scope.form.from = fromList[0];
            $scope.form.fromIsOpen = false;
            $scope.form.fromList = fromList;
            $scope.form.fromIsItemSelected = function (item) {
                if ($scope.form.from != null && $scope.form.from.id == item.id)
                    return true;
                else
                    return false;
            };

            //куда
            var defaultToText = "Куда? Укажите страну, курорт или отель";
            $scope.form.to = null;//new toItem(40, "Египет", "country");
            $scope.form.toList = null;
            $scope.form.toText = defaultToText;
            $scope.form.toTextGetText = function (item) {
                return item.name + $scope.getToItemDescription(item);
            };
            $scope.form.toListSelectedIndex = -1;
            $scope.form.toListIsNotEmpty = function () {
                if ($scope.form.toList != null && $scope.form.toList.length > 0)
                    return true;
                else
                    return false;
            };

            var startDate = new Date();
            startDate.setDate(startDate.getDate() + 14);
            //дата
            $scope.form.beginDate = dateHelper.jsDateToDate(startDate);
            //выбрано +-5 дней
            $scope.form.beginDateIntervalChecked = true;
            //$scope.$watch('form.beginDateIntervalChecked', function (newValue, oldValue) {
            //    if (newValue === oldValue) {
            //        return;
            //    }
            //    //применяем фильтрацию
            //    log('form.beginDateIntervalChecked: ' + $scope.form.beginDateIntervalChecked);
            //}, true);

            //дата клик
            $scope.dateClick = function ($event) {
                closeAllPopups(skipCloseType.date);
                //log('dateClick');

                if ($(".Calendar-input").datepicker("widget").is(":visible")) {
                    $(".Calendar-input").datepicker("hide");
                    $(".Calendar-input").blur();
                }
                else {
                    $(".Calendar-input").datepicker("show");
                    $(".Calendar-input").focus();
                }

                preventBubbling($event);
            };

            var nightsList = [
                new nightItem("до 5 ночей", 1, 5),
                new nightItem("5-7 ночей", "5", "7"),
                new nightItem("7-10 ночей", 7, 10),
                new nightItem("10-14 ночей", 10, 14), //(по умолчанию)
                new nightItem("14+ ночей", 14, 29),
                new nightItem("Все равно", 0, 0),
                new nightItem("14 ночей", 14, 14),
                new nightItem("13 ночей", 13, 13),
                new nightItem("12 ночей", 12, 12),
                new nightItem("11 ночей", 11, 11),
                new nightItem("10 ночей", 10, 10),
                new nightItem("9 ночей", 9, 9),
                new nightItem("8 ночей", 8, 8),
                new nightItem("7 ночей", 7, 7),
                new nightItem("6 ночей", 6, 6),
                new nightItem("5 ночей", 5, 5),
                new nightItem("4 ночи", 4, 4),
                new nightItem("3 ночи", 3, 3),
                new nightItem("2 ночи", 2, 2),
                new nightItem("1 ночь", 1, 1)
            ];
            //кол-во ночей
            $scope.form.nightsList = nightsList;
            //по-умолчанию - все равно
            $scope.form.nights = nightsList[3];//10-14 ночей (по умолчанию)
            $scope.form.nightsIsOpen = false;
            $scope.form.nightsIsItemSelected = function (item) {
                if ($scope.form.nights != null && item.name == $scope.form.nights.name)
                    return true;
                else
                    return false;
            };

            //взрослые / дети
            $scope.form.people = {
                isOpen: false,
                adultsCountList: [1, 2, 3, 4],
                adultsCount: 2,
                childsCountList: [0, 1, 2, 3],
                childsCount: 0,
                childsAgesList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                childAge1: 0,
                childAge2: 0,
                childAge3: 0,
                childAge1IsOpen: false,
                childAge2IsOpen: false,
                childAge3IsOpen: false
            };

            //подгружаем из куки
            getParamsFromCookie();

            //добавляем в список обработчиков наш контроллер (мы хотим ловить клик по body)
            $rootScope.addBodyClickListner('tours.form', bodyClick);

            //обработчик клика на body
            function bodyClick() {
                //log('tours.form bodyClick');
                closeAllPopups();
            }

            //закрывает все открытые попапы
            function closeAllPopups(skipClose) {
                if (skipClose != skipCloseType.from)
                    $scope.form.fromIsOpen = false;

                if (skipClose != skipCloseType.to)
                    $scope.form.toList = null;

                if (skipClose != skipCloseType.date) {
                    $(".Calendar-input").datepicker("hide");
                    $(".Calendar-input").blur();
                }

                if (skipClose != skipCloseType.nights)
                    $scope.form.nightsIsOpen = false;

                if (skipClose != skipCloseType.people
                    && skipClose != skipCloseType.childAge1
                    && skipClose != skipCloseType.childAge2
                    && skipClose != skipCloseType.childAge3)
                    $scope.form.people.isOpen = false;

                if (skipClose != skipCloseType.childAge1)
                    $scope.form.people.childAge1IsOpen = false;

                if (skipClose != skipCloseType.childAge2)
                    $scope.form.people.childAge2IsOpen = false;

                if (skipClose != skipCloseType.childAge3)
                    $scope.form.people.childAge3IsOpen = false;
            }

            //var cookieName = ".form_cook";
            //куки
            function getParamsFromCookie() {
                var sta = QueryString.getByName('sta');
                //проверяем, что нужно восстанавливать состояние
                //из куки восстанавливаем только на главной
                if ($location.path() == "/" && (sta == null || sta == '')) {
                    //log('getParamsFromCookie');
                    var cookVal = $.cookie("form_cook");
                    //log('getParamsFromCookie, cookVal: ' + cookVal);
                    if (cookVal != null) {
                        var formVal = angular.fromJson(cookVal);

                        $scope.form.from = formVal.from;
                        $scope.form.to = formVal.to;
                        $scope.form.toText = formVal.toText;
                        $scope.form.beginDate = formVal.beginDate;
                        $scope.form.beginDateIntervalChecked = formVal.beginDateIntervalChecked;
                        $scope.form.nights = formVal.nights;
                        $scope.form.people.adultsCount = formVal.people.adultsCount;
                        $scope.form.people.childsCount = formVal.people.childsCount;
                        $scope.form.people.childAge1 = formVal.people.childAge1;
                        $scope.form.people.childAge2 = formVal.people.childAge2;
                        $scope.form.people.childAge3 = formVal.people.childAge3;
                    }
                }
            };

            function saveParamsToCookie() {
                var saveObj = {};
                saveObj.from = {};
                saveObj.to = {};
                saveObj.toText = {};
                saveObj.beginDate = {};
                saveObj.nights = {};
                saveObj.people = {};
                saveObj.people.adultsCount = {};
                saveObj.people.childsCount = {};
                saveObj.people.childAge1 = {};
                saveObj.people.childAge2 = {};
                saveObj.people.childAge3 = {};

                saveObj.from = $scope.form.from;
                saveObj.to = $scope.form.to;
                saveObj.toText = $scope.form.toText;
                saveObj.beginDate = $scope.form.beginDate;
                saveObj.beginDateIntervalChecked = $scope.form.beginDateIntervalChecked;
                saveObj.nights = $scope.form.nights;
                saveObj.people.adultsCount = $scope.form.people.adultsCount;
                saveObj.people.childsCount = $scope.form.people.childsCount;
                saveObj.people.childAge1 = $scope.form.people.childAge1;
                saveObj.people.childAge2 = $scope.form.people.childAge2;
                saveObj.people.childAge3 = $scope.form.people.childAge3;

                var cookVal = angular.toJson(saveObj);
                //log('saveParamsToCookie, cookVal: ' + cookVal);
                //сохраняем сессионную куку
                $.cookie("form_cook", cookVal);

                //var testVal = $.cookie("form_cook");
                //log('saveParamsToCookie, testVal: ' + testVal);
            };

            function restoreFormParamsFromQueryString() {
                var sta = QueryString.getByName('sta');
                //проверяем, что нужно восстанавливать состояние
                if (sta == null || sta == '')
                    return;

                //log('restoreFormParamsFromQueryString');

                function getInt(val) {
                    if (val != null && val.length > 0)
                        return parseInt(val);
                    else
                        return 0;
                }

                //откуда
                var fromId = QueryString.getByName('city');
                if (fromId.length > 0) {
                    $scope.form.from.id = fromId;
                    //название
                    $scope.form.from = _.find($scope.form.fromList, function (item) {
                        return item.id == fromId;
                    });
                }

                //куда
                var toId = 0;
                var toType = 'hotel';
                toId = getInt(QueryString.getByName('hotels'));
                if (toId == 0) {
                    toType = 'resort';
                    toId = getInt(QueryString.getByName('resorts'));
                }
                if (toId == 0) {
                    toType = 'country';
                    toId = getInt(QueryString.getByName('country'));
                }

                if (toId > 0) {
                    //запрос по Id
                    dataService.getSletatById(toId,
                        function (data) {
                            //пришел ответ
                            var toList = [];
                            //маппим объекты
                            _.each(data, function (item) {
                                toList.push(new toItemData(item))
                            });
                            //ищем объект нужного типа
                            var toItem = _.find(toList, function (item) {
                                return item.type == toType;
                            });
                            $scope.form.to = toItem;
                            //$scope.form.toText = toItem.name;
                            $scope.form.toText = $scope.form.toTextGetText(toItem);
                        },
                        function (data, status) {
                        });
                }

                //дата
                var date = QueryString.getByName('date');
                if (date.length > 0) {
                    date = dateHelper.sletatDateToDate(date);
                    $scope.form.beginDate = date;
                    $scope.form.beginDateIntervalChecked = false;
                }
                else {//диапазон дат
                    var dateFrom = dateHelper.sletatDateToDate(QueryString.getByName('date1'));
                    var dateTo = dateHelper.sletatDateToDate(QueryString.getByName('date2'));

                    var jsDateFrom = dateHelper.dateToJsDate(dateFrom);
                    var jsDateTo = dateHelper.dateToJsDate(dateTo);
                    var jsDateFromMillis = dateHelper.dateToJsDate(dateFrom).getTime();
                    var jsDateToMillis = dateHelper.dateToJsDate(dateTo).getTime();
                    var diff = jsDateToMillis - jsDateFromMillis;

                    var jsDateMidMillis = jsDateFromMillis + (diff / 2);
                    var jsDateMid = new Date(jsDateMidMillis);

                    var date = jsDateMid;
                    if (diff == 0)
                        $scope.form.beginDateIntervalChecked = false;//снимаем +-5 дней
                    else
                        $scope.form.beginDateIntervalChecked = true;//ставим +-5 дней
                    //приводим к нашему формату
                    $scope.form.beginDate = dateHelper.jsDateToDate(date);
                }

                //ночи
                var nightsMin = QueryString.getByName('nightsMin');
                var nightsMax = QueryString.getByName('nightsMax');
                $scope.form.nights = _.find($scope.form.nightsList, function (item) {
                    return (item.min == nightsMin && item.max == nightsMax);
                });

                //взрослые / дети
                var adults = getInt(QueryString.getByName('adults'));
                $scope.form.people.adultsCount = adults;
                var kids = getInt(QueryString.getByName('kids'));
                $scope.form.people.childsCount = kids;
                var kids_ages = QueryString.getByName('kids_ages');
                var kidsAgesParts = kids_ages.split(',');
                $scope.form.people.childAge1 = getInt(kidsAgesParts[0]);
                $scope.form.people.childAge2 = getInt(kidsAgesParts[1]);
                $scope.form.people.childAge3 = getInt(kidsAgesParts[2]);
            };

            //логика====================================================================
            //отключаем бабблинг событий
            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            //дата - вывод выбора
            $scope.getBeginDateShort = function () {
                //log('date:' + $scope.form.beginDate);
                var date = $scope.form.beginDate;
                if (date != null) {
                    var parts = date.split('.');
                    var shortDate = parts[0] + '.' + parts[1];
                    return shortDate;
                }
                else
                    return "Когда";
            }

            $scope.getBeginDateLong = function () {
                //log('date:' + $scope.form.beginDate);
                var date = $scope.form.beginDate;
                if (date != null) {
                    var jsDate = dateHelper.dateToJsDate(date);
                    return $filter('date')(jsDate, 'd MMMM');
                }
                else
                    return "Когда";
            }

            function prepareToTerm(text) {
                var ind = text.indexOf(',');
                if (ind > -1) {
                    text = text.substring(0, ind);
                }
                return text;
            };

            //куда - запрос на сервер
            function getCountry() {
                if ($scope.form.toText != null && $scope.form.toText.length > 0) {
                    var term = prepareToTerm($scope.form.toText);
                    //console.log('getCountry:' + term);
                    dataService.getSletatDirectoryByTerm(term,
                        function (data) {
                            if (data != null && data.length > 0) {
                                var toList = [];
                                //маппим объекты
                                _.each(data, function (item) {
                                    toList.push(new toItemData(item))
                                });
                                $scope.form.toList = toList;

                                //устанавливаем первый - выбранным
                                if ($scope.form.toList.length > 0) {
                                    $scope.form.toListSelectedIndex = 0;
                                    $scope.form.to = $scope.form.toList[0];
                                }
                                else
                                    $scope.form.toListSelectedIndex = -1;

                                //прячем все формы, и дату
                                closeAllPopups(skipCloseType.to);
                                $("#ui-datepicker-div").hide();

                                //скроллим на первый элемент
                                scrollToFirstItem();
                            }
                            else
                                $scope.form.toList = null;
                        },
                        function (data, status) {
                            //ошибка
                        });
                }
            };

            $scope.getToItemDescription = function (item) {
                var country = "";
                if (item.countryName != null)
                    country = item.countryName;

                var resort = "";
                if (item.resortName != null)
                    resort = item.resortName;

                if (item.type == toItemType.country)
                    return ", по всей стране";
                else if (item.type == toItemType.resort)
                    return ", " + country;
                else if (item.type == toItemType.hotel)
                    return ", " + country + ", " + resort;
            };

            //чтобы ввод текста сразатывал раз в 300мс
            var getCountryThrottled = _.debounce(function ($scope) {
                getCountryDelayed($scope);
            }, 300);
            var getCountryDelayed = function ($scope) {
                $scope.$apply(function () {
                    getCountry($scope);
                });
            };

            //откуда
            $scope.fromFormClick = function ($event) {
                closeAllPopups(skipCloseType.from);
                $scope.form.fromIsOpen = !$scope.form.fromIsOpen;
                preventBubbling($event);
            };
            $scope.fromClick = function (item, $event) {
                $scope.form.from = item;
                $scope.form.fromIsOpen = false;
                preventBubbling($event);
            };

            //куда
            //поведение разделителя в списке куда
            $scope.isToHotelDelimiterSet = false;
            $scope.isNeedInsertDelimiter = function (item, $index) {
                //на первом элементе сбрасываем флаг
                if ($index == 0) {
                    $scope.isToHotelDelimiterSet = false;
                    return false;
                }

                //если уже вставили разделитель - то 
                if ($scope.isToHotelDelimiterSet)
                    return false;

                //нулевой - пропускаем
                var prevItem = $scope.form.toList[$index - 1];
                var prevIsHotel = prevItem.type == toItemType.hotel;
                var curIsHotel = item.type == toItemType.hotel;
                if (!prevIsHotel && curIsHotel) {
                    $scope.isToHotelDelimiterSet = true;
                    return true;
                }
            };
            $scope.isNeedToShowFlag = function (item) {
                return (item.codeIcao != null && item.codeIcao.length > 0 && item.type == toItemType.country);
            };

            //init tooltip
            var $to = $('.SearchTo');
            $to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
            $to.tooltip("disable");

            $scope.form.toTooltip = {
                show: function () {
                    var $to = $('.SearchTo');
                    $to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
                    $to.tooltip("enable");
                    $to.tooltip("open");
                },
                hide: function () {
                    var $to = $('.SearchTo');
                    $to.tooltip("disable");
                }
            };

            $scope.toIsEmpty = function () {
                return ($scope.form.toText == defaultToText);
            };
            $scope.toFocus = function ($event) {
                //выключаем тултип
                $scope.form.toTooltip.hide();
                preventBubbling($event);
            };

            $scope.toBlur = function ($event) {
                //log('toBlur');
                //logState();

                //если ничего не ввели - по ставим дефолтный текст
                //если не выбрали из выпадушки - то закрываем
                if ($scope.form.toText == "" || $scope.form.toText == defaultToText) {
                    //скрываем список
                    $scope.form.toList = null;
                    //ставим по-умолчанию
                    $scope.form.toText = defaultToText;
                }

                preventBubbling($event);
            };

            function scrollToItem(ind) {
                //скролим где-то в середину (во всю высоту влезает где-то 10 итемов)
                ind = ind - 5;
                if (ind >= 0) {
                    var container = $(".search-form-list-to");
                    var scrollTo = $(".search-form-list-item-country:eq(" + ind + ")");
                    if (scrollTo.length > 0) {
                        var scrollToVal = scrollTo.offset().top - container.offset().top + container.scrollTop();

                        container.animate({
                            scrollTop: scrollToVal
                        }, 50);
                    }
                    //log('scrollToItem: ' + ind);
                }
            };

            function scrollToFirstItem() {
                var container = $(".search-form-list-to");
                container.animate({
                    scrollTop: 0
                }, 50);
            };

            $scope.toKeyDown = function ($event) {
                //log('toKeyDown: ' + $event.keyCode);
                if ($event.keyCode == 27) {//esc
                    $scope.form.toList = null;
                }
                else if ($event.keyCode == 13) {//enter
                    var ind = $scope.form.toListSelectedIndex;
                    if ($scope.form.toList == null) {
                        //сразу ищем
                        if ($scope.form.toText != "" && $scope.form.toText.length > 0) {
                            $scope.goFindTours();
                        }
                    }
                    else if ($scope.form.toListIsNotEmpty() &&
                        ind >= 0 &&
                        ind < $scope.form.toList.length) {
                        var toItem = $scope.form.toList[ind];
                        $scope.form.to = toItem;
                        //$scope.form.toText = toItem.name;
                        $scope.form.toText = $scope.form.toTextGetText(toItem);
                        //очищаем список (и закрываем)
                        $scope.form.toList = null;
                    }
                    preventBubbling($event);
                }
                else if ($event.keyCode == 40) {//arrow down
                    var ind = $scope.form.toListSelectedIndex;
                    var lastInd = ind;
                    ind++;
                    if ($scope.form.toListIsNotEmpty() &&
                        ind > $scope.form.toList.length - 1)
                        ind = $scope.form.toList.length - 1;
                    $scope.form.toListSelectedIndex = ind;
                    //log('toListSelectedIndex: ' + ind);

                    if (lastInd != ind)
                        scrollToItem(ind);

                    preventBubbling($event);
                }
                else if ($event.keyCode == 38) {//arrow up
                    var ind = $scope.form.toListSelectedIndex;
                    var lastInd = ind;
                    ind--;
                    if (ind < 0)
                        ind = 0;
                    $scope.form.toListSelectedIndex = ind;
                    //log('toListSelectedIndex: ' + ind);

                    if (lastInd != ind)
                        scrollToItem(ind);

                    preventBubbling($event);
                }

            };

            $scope.toChange = function () {
                //console.log('toChange:' + $scope.form.toText);
                getCountryThrottled($scope);
            };
            $scope.toClick = function ($event) {
                //log('toClick');
                closeAllPopups(skipCloseType.to);

                //если был дефолтный текст
                if ($scope.toIsEmpty())
                    $scope.form.toText = "";//все стираем

                if ($scope.form.toText != "" && $scope.form.toText.length > 0) {
                    getCountry();
                }

                //select all
                $($event.target).select();

                preventBubbling($event);
            };

            $scope.toItemClick = function (item, $event) {
                //log('toItemClick');
                //очищаем список (и закрываем)
                $scope.form.toList = null;
                //$scope.form.toText = item.name;
                $scope.form.toText = $scope.form.toTextGetText(item);
                $scope.form.to = item;
                //logState();

                preventBubbling($event);
            };

            //ночи
            $scope.nightFormClick = function ($event) {
                closeAllPopups(skipCloseType.nights);
                $scope.form.nightsIsOpen = !$scope.form.nightsIsOpen;
                preventBubbling($event);
            };
            $scope.nightItemClick = function (item, $event) {
                $scope.form.nights = item;
                $scope.form.nightsIsOpen = false;
                preventBubbling($event);
            };

            //взрослые / дети
            $scope.peopleContClick = function ($event) {
                closeAllPopups(skipCloseType.people);
                preventBubbling($event);
            };
            $scope.peopleFormClick = function ($event) {
                closeAllPopups(skipCloseType.people);
                $scope.form.people.isOpen = !$scope.form.people.isOpen;
                preventBubbling($event);
            };
            $scope.adultsClick = function (count, $event) {
                $scope.form.people.adultsCount = count;
                preventBubbling($event);
            };
            $scope.childsClick = function (count, $event) {
                $scope.form.people.childsCount = count;
                preventBubbling($event);
            };
            //$scope.childsFormClick = function ($event) {
            //    preventBubbling($event);
            //};

            $scope.childsAge1Click = function ($event) {
                closeAllPopups(skipCloseType.childAge1);
                $scope.form.people.childAge1IsOpen = !$scope.form.people.childAge1IsOpen;
                preventBubbling($event);
            };
            $scope.childsAge1ItemClick = function (age, $event) {
                $scope.form.people.childAge1 = age;
                closeAllPopups(skipCloseType.people);
                preventBubbling($event);
            };

            $scope.childsAge2Click = function ($event) {
                closeAllPopups(skipCloseType.childAge2);
                $scope.form.people.childAge2IsOpen = !$scope.form.people.childAge2IsOpen;
                preventBubbling($event);
            };
            $scope.childsAge2ItemClick = function (age, $event) {
                $scope.form.people.childAge2 = age;
                closeAllPopups(skipCloseType.people);
                preventBubbling($event);
            };

            $scope.childsAge3Click = function ($event) {
                closeAllPopups(skipCloseType.childAge3);
                $scope.form.people.childAge3IsOpen = !$scope.form.people.childAge3IsOpen;
                preventBubbling($event);
            };
            $scope.childsAge3ItemClick = function (age, $event) {
                $scope.form.people.childAge3 = age;
                closeAllPopups(skipCloseType.people);
                preventBubbling($event);
            };

            //кнопка найти
            $scope.goFindTours = function () {
                //return false;

                if ($scope.form.to == null ||
                    $scope.form.nights == null) {
                    //показываем тултип
                    $scope.form.toTooltip.show();
                    return;
                }

                //устанавливаем выбранный текст (если не выбрали с выпадушки, а сразу нажали на найти)
                $scope.form.toText = $scope.form.toTextGetText($scope.form.to);

                saveParamsToCookie();


                ///tours/?STA=1&country=119&city=1271&resorts=&hotels=&stars=&meals=&adults=2&kids=0&kids_ages=&currency=RUB&price_min=&price_max=&date=24/02/2014&nights_min=7&nights_max=7&three_day=1

                var city = $scope.form.from.id;
                var country = '';
                var resort = '';
                var hotel = '';
                if ($scope.form.to.type == toItemType.hotel) {
                    hotel = $scope.form.to.id;
                    resort = $scope.form.to.resortId;
                    country = $scope.form.to.countryId;
                }
                else if ($scope.form.to.type == toItemType.resort) {
                    resort = $scope.form.to.id;
                    country = $scope.form.to.countryId;
                }
                else
                    country = $scope.form.to.id;

                //даты
                var date = $scope.form.beginDate;
                date = dateHelper.dateToSletatDate(date);//24.02.2014 => 24/02/2014

                var isDateIntervalChecked = $scope.form.beginDateIntervalChecked;
                var dateFrom = null;
                var dateTo = null;
                if (isDateIntervalChecked) {
                    var jsDateFrom = dateHelper.dateToJsDate(angular.copy($scope.form.beginDate));
                    var jsDateTo = dateHelper.dateToJsDate(angular.copy($scope.form.beginDate));
                    jsDateFrom.setDate(jsDateFrom.getDate() - DATE_INTERVAL_DAYS);
                    jsDateTo.setDate(jsDateTo.getDate() + DATE_INTERVAL_DAYS);
                    //ставим +- 5 дней
                    dateFrom = dateHelper.jsDateToDate(jsDateFrom);
                    dateTo = dateHelper.jsDateToDate(jsDateTo);
                    //приводим к формату dd.mm.yyyy
                    dateFrom = dateHelper.dateToSletatDate(dateFrom);
                    dateTo = dateHelper.dateToSletatDate(dateTo);
                }

                var nightsMin = $scope.form.nights.min;
                var nightsMax = $scope.form.nights.max;
                if (nightsMin == 0)
                    nightsMin = "";
                if (nightsMax == 0)
                    nightsMax = "";

                var adults = $scope.form.people.adultsCount;
                var kids = $scope.form.people.childsCount;
                var kids_ages = ""; //2,2,2
                kids_ages = "" + $scope.form.people.childAge1 + "," + $scope.form.people.childAge2 + "," + $scope.form.people.childAge3;

                var url = '';
                if (!isDateIntervalChecked)
                    url = urlHelper.UrlToSletatTours(city, country, resort, hotel, encodeURIComponent(date), nightsMin, nightsMax, adults, kids, kids_ages);
                else
                    url = urlHelper.UrlToSletatToursDatesInterval(city, country, resort, hotel, encodeURIComponent(dateFrom), encodeURIComponent(dateTo), nightsMin, nightsMax, adults, kids, kids_ages);

                //search_depth - как далеко вперед дата поиска в днях (дата отправления минус текущая дата)
                var departure_date = dateHelper.dateToJsDate($scope.form.beginDate);
                var search_depth = Math.abs(departure_date - dateHelper.getTodayDate());
                search_depth = dateHelper.getTimeSpanFromMilliseconds(search_depth);
                search_depth = dateHelper.getTimeSpanMaxDays(search_depth);

                //source - откуда вызван поиск (main/search_result)
                var source = "main";
                if ($location.absUrl().indexOf('/tours/?') > -1) {
                    source = "search_result";
                }

                //пишем статистику
                track.formSearch($scope.form.from.name, $scope.form.toText, $scope.form.beginDate, $scope.form.beginDateIntervalChecked,
                    search_depth, $scope.form.nights.name, $scope.form.people.adultsCount, $scope.form.people.childsCount, source,
                    function () {
                        //переходим на поиск туров
                        window.location.href = url;
                    });
            };

            function logState() {
                var len = 0;
                if ($scope.form.toList != null)
                    len = $scope.form.toList.length;
                log('toList: ' + len + ', toText: ' + $scope.form.toText);
            };
        }]);