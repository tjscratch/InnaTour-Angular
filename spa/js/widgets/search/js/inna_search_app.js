(function () {
    "use strict"

    angular.module("innaSearchForm", [
        "ngResource",
        "ui.bootstrap",
        "searchForm",
        "innaDirectives",
        "innaTemplates",
        "innaValidation"
    ])

        .filter('range', function () {
            return function (input, total) {
                total = parseInt(total);
                for (var i = 0; i < total; i++)
                    input.push(i);
                return input;
            };
        })
        .filter('asQuantity', ['$filter', function ($filter) {
            return function (n, f1, f2, f5, f0) {
                return [n, $filter('choosePlural')(n, f1, f2, f5)].join(' ');
            }
        }])
        .filter('choosePlural', function () {
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
    
    var innaTemplates = angular.module('innaTemplates', []);
    
}());