innaAppDirectives.directive('innaForm', [
    '$templateCache', '$timeout',
    function ($templateCache, $timeout) {
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
            controller: ['$element', '$scope', '$http', 'widgetValidators', function ($element, $scope, $http, widgetValidators) {
                //console.log('inna form init');
                $scope.typeaheadTemplateCustom = $templateCache.get('typeaheadTemplateCustom.html') ? $templateCache.get('typeaheadTemplateCustom.html') : $templateCache.get('widgets/search/templ/typeaheadTemplateCustom.html');


                //passing parameters in and out
                if ($scope.exportFieldsCallback && $scope.exportFields && $scope.exportFields.length > 0) {
                    //console.log('$watchGroup', $scope.exportFields);
                    $scope.$watch(function(){
                        return $scope.exportFields.map(angular.bind($scope, $scope.$eval));
                    }, function(newValues){
                        $scope.exportFieldsCallback({ values: newValues });
                    }, true);
                }

                if ($scope.updateFromOutside){
                    $scope.$watch('updateFromOutside', function (data) {
                        if (data.attr == 'submit'){
                            $scope.innaStartSearch($scope.forms.innaSearchForm);
                        }
                        else if (data.attr == 'setDateFrom') {
                            $scope.dontFocusToDate = true;
                            var dFrom = dateHelper.dateToJsDate(data.value);
                            $element.find('.from_date').datepicker('setDate', dFrom);
                        }
                        else if (data.attr == 'setDateTo') {
                            var dTo = dateHelper.dateToJsDate(data.value);
                            $element.find('.to_date').datepicker('setDate', dTo);
                        }
                        else {
                            $scope[data.attr] = data.value;
                        }
                    });
                }
                $scope.dontFocusToDate = false;

                //debug

                //forms
                $scope.forms = {};
                
                /**
                 * установка текущей локали
                 */
                if ($scope.partnerDefaultCity) {
                    $http.get('https://inna.ru/api/v1/Dictionary/Directory', {
                        params: {
                            term: $scope.partnerDefaultCity.trim()
                        }
                    }).then(function (response) {
                        var fullName = response.data[0].Name + ", " + response.data[0].CountryName;
                        $scope.locationFrom = {id: response.data[0].Id, name: fullName, iata: response.data[0].CodeIata};
                    });
                } else {
                    $http.get('https://inna.ru/api/v1/Dictionary/GetCurrentLocation').success(function (response) {
                        var fullName = response.Name + ", " + response.CountryName;
                        $scope.locationFrom = {id: response.Id, name: fullName, iata: response.CodeIata};
                    });
                }

                /**
                 * https://inna.ru/api/v1/Dictionary/Directory
                 */
                $scope.getLocationFrom = function (val) {
                    return $http.get('https://inna.ru/api/v1/Dictionary/Directory', {
                        params: {
                            term: val.split(', ')[0].trim()
                        }
                    }).then(function (response) {
                        var data = [];
                        angular.forEach(response.data, function (item) {
                            var fullName = item.Name + ", " + item.CountryName;
                            var allArport = item.Airport ? " (все аэропорты)" : "";
                            var fullNameHtml = "<span class='i-name'>" + item.Name + "</span>," + "<span class='i-country'>" + item.CountryName + allArport + "</span>";
                            data.push({id: item.Id, nameHtml: fullNameHtml, name: fullName, iata: item.CodeIata});
                            if (item.Airport) {
                                angular.forEach(item.Airport, function (item) {
                                    var fullName = item.Name + ", " + item.CountryName;
                                    var fullNameHtml = "<span class='i-name i-name-airport'>" + item.Name + "</span>";
                                    data.push({id: item.Id, nameHtml: fullNameHtml, name: fullName, iata: item.CodeIata});
                                });
                            }
                        });
                        return data;
                    });
                };


                /**
                 * автокомплит выбора локации
                 * @param val
                 * @returns {*}
                 */
                $scope.getLocation = function (val) {
                    return $http.get('https://inna.ru/api/v1/Dictionary/Hotel', {
                        params: {
                            term: val.split(', ')[0].trim()
                        }
                    }).then(function (response) {
                        var data = [];
                        angular.forEach(response.data, function (item) {
                            var fullName = item.Name + ", " + item.CountryName;
                            var fullNameHtml = "<span class='i-name'>" + item.Name + "</span>," + "<span class='i-country'>" + item.CountryName + "</span>";
                            data.push({id: item.Id, nameHtml: fullNameHtml, name: fullName, iata: item.CodeIata});
                        });
                        return data;
                    });
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
                    if (!$scope.dontFocusToDate){
                        $element.find('.to_date').focus();
                    }
                    $timeout(function () {
                        $scope.dontFocusToDate = false;
                    }, 100);
                });

                $element.find('.input-daterange').datepicker({
                    format: "d.m.yyyy",
                    startDate: $scope.setStartDate,
                    endDate: new Date($scope.setStartDate.valueOf() + 86400000 * 365),
                    language: "ru",
                    autoclose: true,
                    todayHighlight: true,
                    beforeShowDay: highlightDates
                });
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
                //$scope.$watch('startDate', function (data) {
                //    $scope.startDate = data;
                //});
                //$scope.$watch('endDate', function (data) {
                //    $scope.endDate = data;
                //});

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

                            if ($scope.isWlPartnerMode){
                                var openUrl = "/#/packages/search/" + params.join('-');
                                openUrl = window.partners.getParentLocationWithUrl(openUrl);
                                window.open(openUrl, '_blank');
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

            }]
        }
    }]);