(function () {
    "use strict"

    angular.module('innaSearchForm.directives', [])


    function searchForm() {
        return{
            restrict: 'E',
            templateUrl: 'tpl/form.html',
            controller: function () {

            }
        }
    }



    angular
        .module('innaSearchForm.directives')
        .directive('searchForm', searchForm)


})()