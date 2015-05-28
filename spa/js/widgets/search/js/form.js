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
            isWlPartnerMode: "="
        },
        controller: function ($element, $scope, $http, widgetValidators, WidgetPackages, WidgetAvia) {


            /**
             * templates url
             */
            $scope.typeaheadTemplateCustom = $templateCache.get('typeaheadTemplateCustom.html') ? 'typeaheadTemplateCustom.html' : 'widgets/search/templ/typeaheadTemplateCustom.html';


            /**
             * инициализация формы, если включены и ДП и авиа то по умолчанию активна форма ДП
             */
            $scope.formType = 1;
            $scope.forms = {};


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
             * поиск локили откуда для авиа и ДП одно и то же
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

            $element.find('.from_date').on('changeDate', function (selected) {
                //console.log('changeDate', selected, $scope.dontFocusToDate);
                $scope.setStartDate = selected.date;
                $element.find('.to_date').datepicker('setStartDate', new Date(selected.date.valueOf()));
                $element.find('.to_date').datepicker('setEndDate', new Date(selected.date.valueOf() + 86400000 * 28));

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
                beforeShowDay: highlightDates
            }).on('show', function () {
                if ($scope.formType == 2) {
                    setCheckboxesAviaCalendar();
                }
            });

            
            $scope.$watch('formType', function(data){
                if (data == 2) {
                    $scope.aviaCalendar = {};
                    $scope.aviaCalendar.oneWay = false;
                    $scope.aviaCalendar.roaming = false;
                } else {
                    $scope.aviaCalendar = null;
                } 
            });

            /**
             * установка чекбоксов для авиа в календарь
             */
            var setCheckboxesAviaCalendar = function () {
                if ($('.datepicker').find('.datepicker-checkboxes').length == 0) {
                    $(
                        '<div class="datepicker-checkboxes">' +
                        '<label class="widget-checkboxes-label js-datepicker-checkboxes-label_oneWay">' +
                        '<input type="checkbox" name="oneWay"/><i></i> в одну сторону' +
                        '</label>' +
                        '<label class="widget-checkboxes-label js-datepicker-checkboxes-label_roaming">' +
                        '<input type="checkbox" name="roaming"/><i></i> +/- 3 дня' +
                        '</label>' +
                        '</div>'
                    ).insertBefore(".datepicker-days");
                } else {
                    $('.datepicker').find('.datepicker-checkboxes').show();
                }
                $(".datepicker .js-datepicker-checkboxes-label_oneWay").on('click', function (e) {
                    e.stopPropagation();
                    $timeout(function () {
                        $scope.aviaCalendar.oneWay = e.target.checked;
                    }, 0);
                })
                $(".datepicker .js-datepicker-checkboxes-label_roaming").on('click', function (e) {
                    e.stopPropagation();
                    $timeout(function () {
                        $scope.aviaCalendar.roaming = e.target.checked;
                    }, 0);
                })
            }
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
            /**
             * END PEOPLE_COUNTER
             */


            $scope.$watch('locationFrom', function (data) {
                if (data && data.id) {
                    $scope.fromId = data.id;
                } else {
                    $scope.fromId = null;
                }
            });
            $scope.$watch('locationTo', function (data) {
                if (data && data.id) {
                    $scope.toId = data.id;
                } else {
                    $scope.toId = null;
                }
            });
            $scope.startDateError = null;
            $scope.endDateError = null;

            /**
             * Старт поиска
             * "6733-6623-13.11.2014-19.11.2014-1-2-5_0_11"
             * @param innaSearchForm
             */
            $scope.innaStartSearch = function (innaSearchForm) {

                try {
                    validate();

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

                    var partner = '';
                    if ($scope.partnerName) {
                        partner = "?&from=" + $scope.partnerName + "&utm_source=" + $scope.partnerName + "&utm_medium=affiliate&utm_campaign=" + $scope.toId;
                    }

                    if (!$scope.fromToEqual && innaSearchForm.$valid == true) {
                        //?&from=[идентификатор партнера]&utm_source=[идентификатор партнера]&utm_medium=affiliate&utm_campaign=[страна направления куда]"

                        if ($scope.isWlPartnerMode) {
                            //var openUrl = "/#/packages/search/" + params.join('-');
                            //openUrl = window.partners.getParentLocationWithUrl(openUrl);
                            //window.open(openUrl, '_blank');
                            var openUrl = "/packages/search/" + params.join('-');
                            $location.url(openUrl);
                        }
                        else {
                            window.open($scope.partnerSite + "/#/packages/search/" + params.join('-') + partner, '_blank');
                        }
                    }
                } catch (e) {
                    if ($scope.hasOwnProperty(e.message)) {
                        $scope[e.message] = e;
                    }
                }
            };


            /**
             * BEGIN validates
             */
            function validate() {
                widgetValidators.required($scope.fromId, Error('fromId'), "Введите город отправления");
                widgetValidators.required($scope.toId, Error('toId'), "Введите город или страну, куда планируете поехать");
                widgetValidators.noEqual($scope.fromId, $scope.toId, Error('toId'), "Города отправления и назначения должны отличаться");

                widgetValidators.required($scope.startDate, Error('startDateError'), "Выберите дату отправления туда");
                widgetValidators.required($scope.endDate, Error('endDateError'), "Выберите дату отправления обратно");

            }

            $scope.$watch('fromId', function (value) {
                if (value instanceof Error) {
                    $scope.fromIdError = value.text;
                }
            });
            $scope.$watch('toId', function (value) {
                if (value instanceof Error) {
                    $scope.toIdError = value.text;
                }
            });
            $scope.$watch('startDateError', function (value) {
                if (value instanceof Error) {
                    $scope.startDateError = value.text;
                }
            });
            $scope.$watch('endDateError', function (value) {
                if (value instanceof Error) {
                    $scope.endDateError = value.text;
                }
            });


            /**
             * END validates
             */

        }
    }
});