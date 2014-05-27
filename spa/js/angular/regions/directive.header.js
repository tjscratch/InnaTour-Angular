'use strict';

angular.module('innaApp.directives')
    .directive('regionHeader', [function(){
        return {
            replace: true,
            restrict : 'E',
            templateUrl: '/spa/templates/regions/header.html',
            scope: {},
            controller: function ($scope) {

            },
            link: function ($scope, $element, attrs) {

            }
        };
    }]);