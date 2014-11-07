(function () {
    "use strict"

    angular.module('innaSearchForm.directives', [])


    function searchForm() {
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
                // Disable weekend selection
                $scope.disabled = function (date, mode) {
                    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                };

                $scope.toggleMin = function () {
                    $scope.minDate = $scope.minDate ? null : new Date();
                };
                $scope.toggleMin();

                $scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened = true;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                $scope.format = 'dd-MMMM'

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
                        $scope.toId = data.id
                    }
                });
                

                $scope.innaStartSearch = function () {
                    $scope.innaSearchUrl = "https://inna.ru/#/packages/search/" + $scope.fromId + "-" + $scope.toId + "-15.12.2014-21.12.2014-0-2-"
                    window.open($scope.innaSearchUrl, '_blank')
                }

            }
        }
    }



    angular
        .module('innaSearchForm.directives')
        .directive('searchForm', searchForm)


})()