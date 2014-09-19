'use strict';


function AbTestCtrl($scope, $location, $cookies) {

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
    }

    var AB2 = function () {
        switch ($location.$$path) {
            case '/':
                AB2AddClass();
                break;
            case '/avia/':
                AB2AddClass();
                break;
            case '/tours/':
                AB2AddClass();
                break;
            case '/packages/':
                AB2AddClass();
                break;
            default:
                angular.element("body").removeClass("ab2");
                break;
        }

    }

    window.onscroll = function () {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled > 25) {
            angular.element("body").removeClass("ab2");
        }else{
            AB2AddClass();
        }
    }
    //END AB2


}


AbTestCtrl.$inject = ['$scope', '$location', '$cookies'];
innaAppConponents.controller('AbTestCtrl', AbTestCtrl);