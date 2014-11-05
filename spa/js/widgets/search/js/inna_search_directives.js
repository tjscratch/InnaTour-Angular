(function () {
    "use strict"

    angular.module('innaSearchForm.directives', [])


    function searchForm() {
        return{
            restrict: 'E',
            templateUrl: '/inna-frontend/spa/js/widgets/search/templ/form.html',
            controller: function ($scope, $http) {

                $scope.getLocation = function (val) {
                    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                        params: {
                            address: val,
                            sensor: false
                        }
                    }).then(function (response) {
                        return response.data.results.map(function (item) {
                            return item.formatted_address;
                        });
                    });
                };
                

            }
        }
    }



    angular
        .module('innaSearchForm.directives')
        .directive('searchForm', searchForm)


})()