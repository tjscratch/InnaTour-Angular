innaAppDirectives.directive('innaForm', function ($templateCache, $timeout, $location) {
        return {
            restrict: 'E',
            template: function () {
                return $templateCache.get('form.html') ? $templateCache.get('form.html') : $templateCache.get('widgets/search/templ/form.html')
            },
            scope: {
                partnerSite: "@",
                partnerName: "@",
                partnerDefaultCity: "@",
                exportFieldsCallback: "&",
                exportFields: "=",
                updateFromOutside: "=",
                isWlPartnerMode: "=",
                enabledDpForm: "=",
                enabledAviaForm: "=",
                formTypeActive: "=" // активная по умолчанию форма, 1 - ДП, 2 - авиа
            },
            controller: function ($element, $scope, $http, $q, widgetValidators, WidgetPackages, WidgetAvia) {


                /**
                 * templates url
                 */
                $scope.typeaheadTemplateCustom = $templateCache.get('typeaheadTemplateCustom.html') ? 'typeaheadTemplateCustom.html' : 'widgets/search/templ/typeaheadTemplateCustom.html';

                /**
                 * инициализация формы, если включены и ДП и авиа то по умолчанию активна форма ДП
                 */
                $scope.$watch('enabledDpForm', function (data) {
                    if (data == true) {
                        $scope.widgetEnabledDpForm = true;
                    } else if (data == false) {
                        $scope.widgetEnabledDpForm = false;
                    } else if (data == undefined) {
                        $scope.widgetEnabledDpForm = true;
                    }
                });

                $scope.$watch('enabledAviaForm', function (data) {
                    if (data == true) {
                        $scope.widgetEnabledAviaForm = true;
                    } else if (data == false) {
                        $scope.widgetEnabledAviaForm = false;
                    } else if (data == undefined) {
                        $scope.widgetEnabledAviaForm = false;
                    }
                });


                if ($scope.formTypeActive) {
                    $scope.formType = $scope.formTypeActive;
                } else {
                    $scope.formType = 1;
                }

                $scope.$watch('formTypeActive', function (data) {
                    if (data) {
                        $scope.formType = data;
                    }
                })

                $scope.setFormType = function (type) {
                    $scope.formType = type;
                    $scope.aviaCalendarOneWay = false;
                    $scope.aviaCalendarRoaming = false;
                    $scope.startDateError = null;
                    $scope.endDateError = null;
                }

                $scope.forms = {};
                $scope.aviaCalendarOneWay = false;
                $scope.aviaCalendarRoaming = false;


                //passing parameters in and out
                if ($scope.exportFieldsCallback && $scope.exportFields && $scope.exportFields.length > 0) {
                    //console.log('$watchGroup', $scope.exportFields);
                    $scope.$watch(function () {
                        return $scope.exportFields.map(angular.bind($scope, $scope.$eval));
                    }, function (newValues) {
                        $scope.exportFieldsCallback({values: newValues});
                    }, true);
                }

                if ($scope.updateFromOutside) {
                    $scope.$watch('updateFromOutside', function (data) {
                        if (data.attr == 'submit') {
                            $scope.innaStartSearch($scope.forms.innaSearchForm);
                        }
                        else if (data.attr == 'setDates') {
                            $scope.dontFocusToDate = true;
                            var dFrom = dateHelper.dateToJsDate(data.value[0]);
                            $element.find('.from_date').datepicker('setDate', dFrom);
                            if (data.value[1]) {
                                var dTo = dateHelper.dateToJsDate(data.value[1]);
                                $element.find('.to_date').datepicker('setDate', dTo);
                            }
                        }
                        else {
                            $scope[data.attr] = data.value;
                        }
                    });
                }
                $scope.dontFocusToDate = false;


                /**
                 * установка текущей локали
                 */
                WidgetPackages.currentLocale($scope.partnerDefaultCity)
                    .then(function (data) {
                        $scope.locationFrom = data;
                    });

                /**
                 * поиск локали откуда для авиа и ДП одно и то же
                 */
                $scope.getLocationFrom = function (text) {
                    return WidgetAvia.getLocation(text)
                        .then(function (data) {
                            return data;
                        });
                };


                /**
                 * автокомплит выбора локации
                 */
                $scope.getLocation = function (text) {
                    if ($scope.formType == 1) {
                        return WidgetPackages.getLocation(text)
                            .then(function (data) {
                                return data;
                            });
                    }
                    if ($scope.formType == 2) {
                        return WidgetAvia.getLocation(text)
                            .then(function (data) {
                                return data;
                            });
                    }
                };


                /**
                 * BEGIN datapicker
                 */
                $scope.setStartDate = new Date();

                var highlightDates = function (date) {
                    var month = date.getMonth() + 1;
                    var dates = date.getDate() + "." + month + "." + date.getFullYear();
                    var oneDay;
                    if ($scope.startDate == $scope.endDate) {
                        oneDay = $scope.startDate;
                    }

                    if (dates == oneDay) {
                        return {
                            classes: 'one_date'
                        };
                    } else {
                        if (dates == $scope.startDate) {
                            return {
                                classes: 'from_date'
                            };
                        }
                        if (dates == $scope.endDate) {
                            return {
                                classes: 'to_date'
                            };
                        }
                    }
                };

                $element.find('.from_date')
                    .on('changeDate', function (selected) {
                        //console.log('changeDate', selected, $scope.dontFocusToDate);
                        if (selected.date) {
                            $scope.setStartDate = selected.date;
                        } else {
                            $scope.setStartDate = $scope.setStartDate;
                            $element.find('.from_date').datepicker('setStartDate', new Date());
                            $element.find('.from_date').datepicker('setEndDate', new Date($scope.setStartDate.valueOf() + 86400000 * 28))
                        }

                        if ($scope.formType == 1) {
                            $element.find('.to_date').datepicker('setStartDate', new Date(selected.date.valueOf() + 86400000));
                        } else {
                            $element.find('.to_date').datepicker('setStartDate', new Date(selected.date.valueOf()));
                        }
                        $element.find('.to_date').datepicker('setEndDate', new Date(selected.date.valueOf() + 86400000 * 28))

                        //fix открытия при програмном обновлении дат
                        if (!$scope.dontFocusToDate) {
                            $element.find('.to_date').focus();
                        }
                        $timeout(function () {
                            $scope.dontFocusToDate = false;
                        }, 100);
                    });


                $element.find('.input-daterange').datepicker({
                    //format: "d.m.yyyy",
                    format: "d M yyyy",
                    startDate: $scope.setStartDate,
                    endDate: new Date($scope.setStartDate.valueOf() + 86400000 * 365),
                    language: "ru",
                    autoclose: true,
                    todayHighlight: true,
                    toggleActive: true,
                    beforeShowDay: highlightDates
                })
                    .on('show', function () {
                        $timeout(function () {
                            if ($scope.formType == 2) {
                                setCheckboxesAviaCalendar();
                            }
                        }, 0);
                        /**
                         * fix
                         * https://innatec.atlassian.net/browse/IN-4644
                         */
                        $(".datepicker .datepicker-switch").on('click', function (e) {
                            e.stopPropagation();
                        })
                    })
                    .on('hide', function () {
                        $('.datepicker').find('.datepicker-checkboxes').remove();
                    })


                /**
                 * установка чекбоксов для авиа в календарь
                 */
                var setCheckboxesAviaCalendar = function () {
                    $('.datepicker').find('.datepicker-checkboxes').remove();
                    $(
                        '<div class="datepicker-checkboxes">' +
                        '<div class="datepicker-checkbox js-datepicker-checkboxes-label_oneWay">в одну сторону</div>' +
                        '<div class="datepicker-checkbox js-datepicker-checkboxes-label_roaming">+/- 3 дня</div>' +
                        '</div>'
                    ).insertBefore(".datepicker-days");
                    datepickerCheckboxesLogickOnewWay();
                    datepickerCheckboxesLogickRoaming();
                };

                /**
                 * логика работы чекбоксов в датапикере
                 */
                var datepickerCheckboxesLogickOnewWay = function () {
                    $(".datepicker .js-datepicker-checkboxes-label_oneWay").on('click', function (e) {
                        e.stopPropagation();
                        $timeout(function () {
                            $scope.aviaCalendarOneWay = !$scope.aviaCalendarOneWay;
                            if ($scope.aviaCalendarOneWay) {
                                $(".datepicker .js-datepicker-checkboxes-label_oneWay").addClass('checked');
                            } else {
                                $(".datepicker .js-datepicker-checkboxes-label_oneWay").removeClass('checked');
                            }
                        }, 0);
                    });
                    $scope.$watch('aviaCalendarOneWay', function (data) {
                        if (data) {
                            $(".datepicker .js-datepicker-checkboxes-label_oneWay").addClass('checked');
                            $element.find('.to_date').attr("disabled", true);
                            $element.find('.to_date').datepicker('setDate', null);
                            $element.find('.to_date').datepicker('hide');
                        } else {
                            $(".datepicker .js-datepicker-checkboxes-label_oneWay").removeClass('checked');
                            $element.find('.to_date').attr("disabled", false);
                        }
                    });
                };

                var datepickerCheckboxesLogickRoaming = function () {
                    $(".datepicker .js-datepicker-checkboxes-label_roaming").on('click', function (e) {
                        e.stopPropagation();
                        $timeout(function () {
                            $scope.aviaCalendarRoaming = !$scope.aviaCalendarRoaming;
                            if ($scope.aviaCalendarOneWay) {
                                $(".datepicker .js-datepicker-checkboxes-label_roaming").addClass('checked');
                            } else {
                                $(".datepicker .js-datepicker-checkboxes-label_roaming").removeClass('checked');
                            }
                        }, 0);
                    });
                    $scope.$watch('aviaCalendarRoaming', function (data) {
                        if (data) {
                            $(".datepicker .js-datepicker-checkboxes-label_roaming").addClass('checked');
                        } else {
                            $(".datepicker .js-datepicker-checkboxes-label_roaming").removeClass('checked');
                        }
                    });
                };
                /**
                 * END datapicker
                 */


                /**
                 * BEGIN TicketClass
                 */
                $scope.ticketClass = 0;//эконом
                /**
                 * END TicketClass
                 */


                /**
                 * BEGIN PEOPLE_COUNTER
                 */
                $scope.adultCount = 2;
                function changePeople() {
                }
                /**
                 * END PEOPLE_COUNTER
                 */


                /**
                 * установка fromId toId, если поиск в ДП то подставлем ID локации, если авиа поиск подставляем код iata
                 */
                $scope.$watch('formType', function (val) {
                    if (val == 1) {
                        $scope.fromId = $scope.locationFrom ? $scope.locationFrom.id : null;
                        $scope.toId = $scope.locationTo ? $scope.locationTo.id : null;
                    } else {
                        $scope.fromId = $scope.locationFrom ? $scope.locationFrom.iata : null;
                        $scope.toId = $scope.locationTo ? $scope.locationTo.iata : null;
                    }
                });
                $scope.$watch('locationFrom', function (data) {
                    if (data && data.id) {
                        if ($scope.formType == 1) {
                            $scope.fromId = data.id;
                        } else {
                            $scope.fromId = data.iata;
                        }
                    } else {
                        $scope.fromId = null;
                    }
                });
                $scope.$watch('locationTo', function (data) {
                    if (data && data.id) {
                        if ($scope.formType == 1) {
                            $scope.toId = data.id;
                        } else {
                            $scope.toId = data.iata;
                        }
                    } else {
                        $scope.toId = null;
                    }
                });


                /**
                 * если есть аттрибуты партнера присваиваем их $scope.partner
                 * ?&from=[идентификатор партнера]&utm_source=[идентификатор партнера]&utm_medium=affiliate&utm_campaign=[страна направления куда]"
                 */
                $scope.partner = ''
                if ($scope.partnerName) {
                    $scope.partner = "?&from=" + $scope.partnerName + "&utm_source=" + $scope.partnerName + "&utm_medium=affiliate&utm_campaign=" + $scope.toId;
                }


                $scope.startDateError = null;
                $scope.endDateError = null;


                /**
                 * BEGIN поиск ДП
                 * "6733-6623-13.11.2014-19.11.2014-1-2-5_0_11"
                 */
                var searchDP = function () {


                    var params = [];
                    params.push($scope.fromId);
                    params.push($scope.toId);
                    params.push($scope.startDate);
                    params.push($scope.endDate);
                    params.push($scope.ticketClass);
                    params.push($scope.adultCount);
                    params[6] = '';


                    if ($scope.childrensAge) {
                        var childs = [];
                        for (var i = 0; i < $scope.childrensAge.length; i++) {
                            childs.push($scope.childrensAge[i].value);
                        }
                        params[6] = childs.join('_');
                    }


                    if ($scope.isWlPartnerMode) {
                        //var openUrl = "/#/packages/search/" + params.join('-');
                        //openUrl = window.partners.getParentLocationWithUrl(openUrl);
                        //window.open(openUrl, '_blank');
                        var openUrl = "/packages/search/" + params.join('-');
                        $location.url(openUrl);
                    }
                    else {
                        window.open($scope.partnerSite + "/#/packages/search/" + params.join('-') + $scope.partner, '_blank');
                    }


                };
                /**
                 * END поиск ДП
                 */


                /**
                 * BEGIN поиск авиа
                 * Авиа - /#/avia/search/:FromUrl-:ToUrl-:BeginDate-:EndDate
                 *          -:AdultCount-:ChildCount-:InfantsCount
                 *          -:CabinClass-:IsToFlexible-:IsBackFlexible-:PathType
                 * FromUrl - iata места отправления
                 * ToUrl - iata места назначения
                 * BeginDate - дата вылета
                 * EndDate - дата обратного вылета
                 * AdultCount - кол-во взрослых пассажиров 12 и старше
                 * ChildCount - кол-во детей 2-11 лет
                 * InfantsCount - кол-во младенцев 0-2 года
                 * CabinClass - класс перелета
                 * IsToFlexible - плюс минус 3 дня
                 * IsBackFlexible - плюс минус 3 дня
                 * PathType - перелет в одну сторону
                 */
                $scope.aviaAdultCount = 1;
                $scope.aviaChildCount = 0;
                $scope.aviaInfantsCount = 0;
                $scope.PathType = 0;

                $scope.$watch('aviaCalendarOneWay', function (data) {
                    if (data) {
                        $scope.PathType = 1;
                        $scope.endDate = '';
                    }
                });


                var searchAvia = function () {


                    $scope.IsToFlexible = $scope.aviaCalendarRoaming ? 1 : 0;
                    $scope.IsBackFlexible = $scope.aviaCalendarRoaming ? 1 : 0;


                    var params = [
                        $scope.fromId,
                        $scope.toId,
                        $scope.startDate,
                        $scope.endDate,
                        $scope.aviaAdultCount,
                        $scope.aviaChildCount,
                        $scope.aviaInfantsCount,
                        $scope.ticketClass,
                        $scope.IsToFlexible,
                        $scope.IsBackFlexible,
                        $scope.PathType
                    ];


                    if ($scope.isWlPartnerMode) {
                        var openUrl = "/avia/search/" + params.join('-');
                        $location.url(openUrl);
                    }
                    else {
                        window.open($scope.partnerSite + "/#/avia/search/" + params.join('-') + $scope.partner, '_blank');
                    }

                }
                /**
                 * END поиск авиа
                 */

                /**
                 * Старт поиска
                 * @param innaSearchForm
                 */
                $scope.innaStartSearch = function (innaSearchForm) {
                    var validateFromId = widgetValidators.required($scope.fromId, 'fromId', 'Введите город отправления');
                    var validateToId = widgetValidators.required($scope.toId, 'toId', 'Введите город или страну, куда планируете поехать');
                    var validateFromIdNoEqualToId = widgetValidators.noEqual($scope.fromId, $scope.toId, 'toId', 'Города отправления и назначения должны отличаться');
                    var validateStartDate = widgetValidators.required($scope.startDate, 'startDate', 'Выберите дату отправления туда');
                    var validateEndDate = widgetValidators.required($scope.endDate, 'endDate', 'Выберите дату отправления обратно');


                    if ($scope.formType == 1) {

                        $q.all([validateFromId, validateToId, validateFromIdNoEqualToId, validateStartDate, validateEndDate])
                            .then(function (data) {
                                searchDP();
                            }, function (error) {
                                showError(error);
                            });

                    } else {
                        if (!$scope.aviaCalendarOneWay) {
                            $q.all([validateFromId, validateToId, validateFromIdNoEqualToId, validateStartDate, validateEndDate])
                                .then(function (data) {
                                    searchAvia();
                                }, function (error) {
                                    showError(error);
                                });
                        } else {
                            $q.all([validateFromId, validateToId, validateFromIdNoEqualToId, validateStartDate])
                                .then(function (data) {
                                    searchAvia();
                                }, function (error) {
                                    showError(error);
                                });
                        }
                    }
                };


                function showError(error) {
                    if (error.name == 'fromId') {
                        $scope.fromIdError = error.error;
                    }
                    if (error.name == 'toId') {
                        $scope.toIdError = error.error;
                    }
                    if (error.name == 'startDate') {
                        $scope.startDateError = error.error;
                    }
                    if (error.name == 'endDate') {
                        $scope.endDateError = error.error;
                    }
                };


                /**
                 * END validates
                 */

            }
        }
    }
)
;

function pushPeople() {
    // console.log(document.getElementById('adultCount').innerText)
    var adultCount = parseInt(document.getElementById('adultCount').lastChild.data);
    var childrenCount = parseInt(document.getElementById('childrenCount').lastChild.data);
    // document.getElementById('people-count').innerText = adultCount + childrenCount;
    console.log(document.getElementById('adultCount').innerHTML);
    console.log(document.getElementById('childrenCount').innerHTML);
};