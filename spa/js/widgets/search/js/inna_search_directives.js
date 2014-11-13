(function () {
    "use strict"

    angular.module('innaSearchForm.directives', [])


    function innaForm() {
        return{
            restrict: 'E',
            templateUrl: '/inna-frontend/spa/js/widgets/search/templ/form.html',
            controller: ['$scope', '$http', function ($scope, $http) {

                /**
                 * установка текущей локали
                 */
                $http.get('https://inna.ru/api/v1/Dictionary/GetCurrentLocation').success(function (response) {
                    var fullName = response.Name + ", " + response.CountryName
                    $scope.locationFrom = {id: response.Id, name: fullName, iata: response.CodeIata};
                });


                /**
                 * автокомплит выбора локации
                 * @param val
                 * @returns {*}
                 */
                $scope.getLocation = function (val) {
                    return $http.get('https://inna.ru/api/v1/Dictionary/Hotel', {
                        params: {
                            term: val
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
                });

                $('.input-daterange').datepicker({
                    format: "dd.mm.yyyy",
                    startDate: $scope.setStartDate,
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


                $scope.innaStartSearch = function () {
                    $scope.innaSearchUrl = "https://inna.ru/#/packages/search/" +
                    $scope.fromId +
                    "-" +
                    $scope.toId +
                    "-" +
                    $scope.startDate +
                    "-" +
                    $scope.endDate +
                    "-0-2-"
                    window.open($scope.innaSearchUrl, '_blank')
                }

            }]
        }
    }

    function counterPeople() {
        return {
            templateUrl: '/inna-frontend/spa/js/widgets/search/templ/counter_people.html',
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
                
                $scope.$watch('isOpen', function (newValue) {
                    if (newValue === true) try {
                        $scope.rootElement.tooltip('destroy');
                    } catch (e) {
                    }
                });
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
    }

    function counterPeopleChildAgeSelector() {
        return {
            templateUrl: '/inna-frontend/spa/js/widgets/search/templ/counter_people.subcomponent.html',
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
    }

    angular
        .module('innaSearchForm.directives')
        .directive('innaForm', innaForm)
        .directive('counterPeople', counterPeople)
        .directive('counterPeopleChildAgeSelector', counterPeopleChildAgeSelector)


})()