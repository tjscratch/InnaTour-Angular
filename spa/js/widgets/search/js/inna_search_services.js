(function () {
    "use strict"

    angular.module('innaSearchForm.services', [])

//    http://lh.inna.ru/api/v1/Dictionary/Hotel?term=ber&_=1415204388970

    function SearchFormService($http) {
        return{
            locationFrom: function () {
                return $http.get("https://inna.ru/api/v1/Dictionary/Directory?term=ber")
            },
            locationTo: function () {
                return $http.get("https://inna.ru/api/v1/Dictionary/Hotel?term=ber")
            }
        }
    }


    SearchFormService.$inject = ['$http'];


    angular
        .module('innaSearchForm.services')
        .service('SearchFormService', SearchFormService);


})()