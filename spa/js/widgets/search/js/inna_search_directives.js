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
                $('.input-daterange').datepicker({
                    format: "dd.mm.yyyy",
                    startDate: "-Infinity",
                    language: "ru",
                    keyboardNavigation: true,
                    autoclose: true,
                    todayHighlight: true,
                    beforeShowDay: function (date) {
                        console.log(date)
                        switch (date.getDate()) {
                            case 12:
                                return {
                                    tooltip: 'Example tooltip',
                                    classes: 'active'
                                };
                            case 8:
                                return false;
                        }
                    }
                })

//                $('.to_data').on('changeDate', function (selected) {
//                    var startDate = new Date();
//                    $('.from_data').datepicker('setDate', startDate);
//                });

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


    angular
        .module('innaSearchForm.directives')
        .directive('innaForm', innaForm)


})()