(function () {
    "use strict"

    angular.module('innaSearchForm.directives', [])


    function innaForm() {
        return{
            restrict: 'E',
            templateUrl: '/inna-frontend/spa/js/widgets/search/templ/form.html',
            controller: function ($scope, $http) {

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

            }
        }
    }


    function innaDropdown() {
        return{
            restrict: 'E',
            templateUrl: '/inna-frontend/spa/js/widgets/search/templ/dropdown.html',
            link: function ($scope, element, attrs) {
                $scope.peoples = 2
                $scope.children = 1
                $scope.personCount = $scope.peoples + $scope.children
                
                $scope.selectedPeoples = function(count){
                    $scope.peoples = count
                    $scope.personCount = $scope.children + count
                }
                $scope.selectedChildren = function(count){
                    $scope.children = count
                    $scope.personCount = $scope.peoples + count
                }

                $scope.status = {
                    isopen: false
                };
                
            }
        }
    }


    angular
        .module('innaSearchForm.directives')
        .directive('innaForm', innaForm)
        .directive('innaDropdown', innaDropdown)


})()