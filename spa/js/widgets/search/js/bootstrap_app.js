(function () {
    "use strict"

    var app = angular.module("innaSearchForm", [
        "ui.bootstrap",
        "searchForm",
        "innaDirectives",
        "innaTemplates",
        "innaValidation"
    ]);

    var innaTemplates = angular.module('innaTemplates', []);

    app.filter('range', function () {
        return function (input, total) {
            total = parseInt(total);
            for (var i = 0; i < total; i++)
                input.push(i);
            return input;
        };
    });
    app.filter('asQuantity', ['$filter', function ($filter) {
        return function (n, f1, f2, f5, f0) {
            return [n, $filter('choosePlural')(n, f1, f2, f5)].join(' ');
        }
    }]);
    app.filter('choosePlural', function () {
        return function (n, f1, f2, f5) {
            if (!f2 && !f5) {
                var bits = f1.split(',');
                f1 = bits[0];
                f2 = bits[1];
                f5 = bits[2];
            }
            n = n % 100;

            if (n % 10 + 10 == n) return f5;

            n = n % 10;

            if (n == 1) return f1;
            if (n == 2 || n == 3 || n == 4) return f2;

            return f5;
        }
    });


    /**
     * BEGIN Bootstrap form
     */
    app.controller('FormBootstrapCtrl', [
        '$scope',
        function ($scope) {

            $scope.radioModel = 'b-inna-search-widget-row-1';

            $scope.formBg = '#212121';
            $scope.formColorText = '#ffffff';
            $scope.btnBg = '#89c13a';
            $scope.btnColor = '#ffffff';
            $scope.borderRadius = 10;

        }
    ]);

    /**
     * END Bootstrap form
     */


}());

$(document).ready(function () {

    var appContainer = $("body");

    angular.bootstrap(appContainer, ['innaSearchForm']);

});

