(function () {
    "use strict"

    var app = angular.module("innaSearchForm");

    if (window.$ && angular.bootstrap) {
        $(function () {
            angular.bootstrap($("html"), ['innaSearchForm']);
        });
    }


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
            $scope.borderRadius = 2;
        }
    ]);
    /**
     * END Bootstrap form
     */


}());