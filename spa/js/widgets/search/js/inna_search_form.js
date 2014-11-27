(function () {
    "use strict"


    angular.module('searchForm', []).directive('innaForm', [
        '$templateCache',
        function ($templateCache) {
            return {
                restrict: 'E',
                template: $templateCache.get('form.html'),
                scope: {
                    partnerSite: "@",
                    partnerName: "@"
                },
                controller: ['$scope', '$http', 'Validators', function ($scope, $http, Validators) {

                    /**
                     * установка текущей локали
                     */
                    $http.get('https://inna.ru/api/v1/Dictionary/GetCurrentLocation').success(function (response) {
                        var fullName = response.Name + ", " + response.CountryName
                        $scope.locationFrom = {id: response.Id, name: fullName, iata: response.CodeIata};
                    });

                    /**
                     * https://inna.ru/api/v1/Dictionary/Directory
                     */
                    $scope.getLocationFrom = function (val) {
                        return $http.get('https://inna.ru/api/v1/Dictionary/Directory', {
                            params: {
                                term: val.split(', ')[0].trim()
                            }
                        }).then(function (response) {
                            var data = []
                            angular.forEach(response.data, function (item) {
                                var fullName = item.Name + ", " + item.CountryName;
                                var allArport = item.Airport ? " (все аэропорты)" : ""
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
                            var data = []
                            angular.forEach(response.data, function (item) {
                                var fullName = item.Name + ", " + item.CountryName
                                var fullNameHtml = "<span class='i-name'>" + item.Name + "</span>," + "<span class='i-country'>" + item.CountryName + "</span>"
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
                        var dates = date.getDate() + "." + month + "." + date.getFullYear()
                        var oneDay;
                        console.log(dates)
                        console.log($scope.startDate)

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

                    $('.from_date').on('changeDate', function (selected) {
                        $scope.setStartDate = selected.date;
                        $('.to_date').datepicker('setStartDate', new Date(selected.date.valueOf()));
                        $('.to_date').datepicker('setEndDate', new Date(selected.date.valueOf() + 86400000 * 28));
                        $('.to_date').focus();
                    });

                    $('.input-daterange').datepicker({
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
                    $scope.$watch('startDate', function (data) {
                        $scope.startDate = data;
                    });
                    $scope.$watch('endDate', function (data) {
                        $scope.endDate = data;
                    });

                    /**
                     * Старт поиска
                     * "6733-6623-13.11.2014-19.11.2014-1-2-5_0_11"
                     * @param innaSearchForm
                     */
                    $scope.innaStartSearch = function (innaSearchForm) {

                        try {
                            validate();

                            var params = [];
                            params.push($scope.fromId)
                            params.push($scope.toId)
                            params.push($scope.startDate)
                            params.push($scope.endDate)
                            params.push(0)
                            params.push($scope.adultCount)
                            params[6] = ''

                            if ($scope.childrensAge) {
                                var childs = [];
                                for (var i = 0; i < $scope.childrensAge.length; i++) {
                                    childs.push($scope.childrensAge[i].value)
                                }
                                params[6] = childs.join('_')
                            }

                            if ($scope.partnerName) {
                                var partner = "?&from=" + $scope.partnerName + "&utm_source=" + $scope.partnerName + "&utm_medium=affiliate&utm_campaign=" + $scope.toId
                            } else {
                                var partner = ''
                            }


                            if (!$scope.fromToEqual && innaSearchForm.$valid == true) {
                                //?&from=[идентификатор партнера]&utm_source=[идентификатор партнера]&utm_medium=affiliate&utm_campaign=[страна направления куда]"
                                window.open($scope.partnerSite + "/#/packages/search/" + params.join('-') + partner, '_blank')
                            }
                        } catch (e) {
                            if ($scope.hasOwnProperty(e.message)) {
                                $scope[e.message] = e;
                            }
                        }
                    }


                    /**
                     * BEGIN validates
                     */
                    function validate() {
                        Validators.required($scope.fromId, Error('fromId'), "Введите город отправления");
                        Validators.required($scope.toId, Error('toId'), "Введите город или страну, куда планируете поехать");
                        Validators.noEqual($scope.fromId, $scope.toId, Error('toId'), "Города отправления и назначения должны отличаться");

                        Validators.required($scope.startDate, Error('startDateError'), "Выберите дату отправления туда");
                        Validators.required($scope.endDate, Error('endDateError'), "Выберите дату отправления обратно");

                    };
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
        }])

}());