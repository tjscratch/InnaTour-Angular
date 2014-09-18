'use strict';

innaAppConponents.controller('AbTestCtrl', [
    '$scope',
    '$element',
    '$location',
    '$cookies',
    function ($scope, $element, $location, $cookies) {


        $scope.$on('$locationChangeSuccess', function () {
            $scope.safeApply(function () {
                var testParams = $location.search().ab;
                if (testParams) {
                    $cookies.ab_test = testParams;
                }
                switch ($cookies.ab_test) {
                    case '1':
                        $scope.abTestCssSrc = "/spa/js/components/ab_test/ab-1/ab.base.css";
                        break;
                    default:
                        $scope.abTestCssSrc = undefined;
                        break;
                }
            });
        });

    }])
