(function () {
    "use strict"

    var app = angular.module("innaSearchForm");

    /**
     * BEGIN Bootstrap form
     */
    app.controller('FormBootstrapCtrl', [
        '$scope',
        '$templateCache',
        function ($scope, $templateCache) {

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