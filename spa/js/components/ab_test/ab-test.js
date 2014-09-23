'use strict';


function AbTestCtrl($scope, $rootScope, $location, $cookies) {

    $scope.$on('$locationChangeSuccess', function () {
        $scope.safeApply(function () {
            var testParams = $location.search().ab;
            if (testParams) {
                $cookies.ab_test = testParams;
            }
            switch ($cookies.ab_test) {
                case '1':
                    $scope.abTestCssSrc = "/spa/js/components/ab_test/ab-1/ab.base.css";
                    $rootScope.ABTest2 = false;
                    break;
                case '2':
                    $scope.abTestCssSrc = "/spa/js/components/ab_test/ab-2/ab.base.css";
                    AB2();
                    break;
                default:
                    $scope.abTestCssSrc = undefined;
                    break;
            }
        });
    });


    //BEGIN AB2
    var AB2AddClass = function () {
        angular.element("body").addClass("ab2");
        window.onscroll = function () {
            var scrolled = window.pageYOffset || document.documentElement.scrollTop;
            console.log(scrolled)
            if (scrolled > 25) {
                angular.element("body").removeClass("ab2");
            }
        }
    }

    var AB2 = function () {
        switch ($location.$$path) {
            case '/':
                AB2AddClass();
                $rootScope.ABTest2 = true;
                break;
            case '/avia/':
                AB2AddClass();
                $rootScope.ABTest2 = true;
                break;
            case '/tours/':
                AB2AddClass();
                $rootScope.ABTest2 = false;
                break;
            case '/packages/':
                AB2AddClass();
                $rootScope.ABTest2 = false;
                break;
            default:
                angular.element("body").removeClass("ab2");
                $rootScope.ABTest2 = false;
                break;
        }


    }

    //END AB2


}


AbTestCtrl.$inject = ['$scope', '$rootScope', '$location', '$cookies'];
innaAppConponents.controller('AbTestCtrl', AbTestCtrl);