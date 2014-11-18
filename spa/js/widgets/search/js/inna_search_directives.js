(function () {
    "use strict"


    var directives = angular.module('innaDirectives', []);

    directives.directive('innaForm', [
        '$templateCache',
        function ($templateCache) {
            return {
                restrict: 'E',
                template: $templateCache.get('form.html'),
                scope: {
                    partnerSite: "@",
                    partnerName: "@"
                },
                controller: ['$scope', '$http', function ($scope, $http) {

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

                    $('.from_date').on('changeDate', function (selected) {
                        $scope.setStartDate = selected.date;
                        $('.to_date').datepicker('setStartDate', new Date(selected.date.valueOf()));
                        $('.to_date').datepicker('setEndDate', new Date(selected.date.valueOf() + 86400000 * 28));
                        //$('.to_date').datepicker('setEndDate', new Date(2014,10,25));
                    });

                    $('.input-daterange').datepicker({
                        format: "dd.mm.yyyy",
                        startDate: $scope.setStartDate,
                        endDate: false,
                        language: "ru",
                        keyboardNavigation: true,
                        autoclose: true,
                        todayHighlight: true,
                        beforeShowDay: function (date) {
                            var month = date.getMonth() + 1;
                            var dates = date.getDate() + "." + month + "." + date.getFullYear()
                            switch (dates) {
                                case $scope.startDate:
                                    return {
                                        tooltip: '',
                                        classes: 'from_date'
                                    };
                                case $scope.endDate:
                                    return {
                                        tooltip: '',
                                        classes: 'to_date'
                                    };
                            }
                        }
                    })
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
                        }
                    });
                    $scope.$watch('locationTo', function (data) {
                        if (data && data.id) {
                            $scope.toId = data.id;
                        }
                    });
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

                        var params = [];
                        params.push($scope.fromId)
                        params.push($scope.toId)
                        params.push($scope.startDate)
                        params.push($scope.endDate)
                        params.push(0)
                        params.push($scope.adultCount)
                        params[6] = ''

                        $scope.fromToEqual = false;
                        $scope.$watch('toId', function (data) {
                            $scope.fromToEqual = $scope.fromId == data;
                        })

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
                    }

                }]
            }
        }])

    directives.directive('counterPeople', [
        '$templateCache',
        function ($templateCache) {
            return {
                template: $templateCache.get('counter_people.html'),
                scope: {
                    adultCount: '=',
                    childrenCount: '=',
                    childrensAge: '='
                },
                controller: ['$scope', function ($scope) {
                    /*Properties*/
                    $scope.isOpen = false;

                    /*Events*/
                    $scope.onCounterClick = function (model, count) {
                        $scope[model] = count;
                        if (model == 'childrenCount') {
                            $scope.childrensAge = [];
                            for (var i = 0; i < $scope.childrenCount; i++) {
                                $scope.childrensAge.push({value: 0});
                            }
                        }
                    }

                    $scope.onAgeSelectorClick = function (num) {
                        var selector = $scope.childrensAge[num];
                        selector.isOpen = !selector.isOpen;
                    }

                    $scope.sum = function (a, b) {
                        return +a + +b;
                    }
                }],
                link: function (scope, element, attrs) {
                    scope.rootElement = $('.search-form-item-current', element);

                    $(document).click(function bodyClick(event) {
                        var isInsideComponent = !!$(event.target).closest(element).length;
                        var isOnComponentTitle = event.target == element || event.target == scope.rootElement[0];

                        scope.$apply(function ($scope) {
                            if (isOnComponentTitle) {
                                $scope.isOpen = !$scope.isOpen;
                            } else {
                                $scope.isOpen = isInsideComponent;
                            }
                        });
                    });
                }
            }
        }])

    directives.directive('counterPeopleChildAgeSelector', [
        '$templateCache',
        function ($templateCache) {
            return {
                template: $templateCache.get('counter_people.subcomponent.html'),
                replace: true,
                scope: {
                    'selector': '='
                },
                controller: ['$scope', function ($scope) {
                    $scope.onChoose = function (age) {
                        $scope.selector.value = age;
                    }
                }],
                requires: '^counterPeople'
            }
        }]);

}());