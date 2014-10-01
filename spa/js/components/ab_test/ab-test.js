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

    var onScroll = function () {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled > 25) {
            angular.element("body").removeClass("ab2");
        }else{
            angular.element("body").addClass("ab2");
        }
    }

    //BEGIN AB2
    var AB2AddClass = function () {
        angular.element("body").addClass("ab2");
        document.addEventListener('scroll', onScroll, false);
    }

    $rootScope.ABTest2 = false;
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
                window.onscroll = function () {
                    angular.element("body").removeClass("ab2");
                }
                break;
        }


    }

    //END AB2
    $scope.$on('$destroy', function(){
        console.log('$destroy AB');
        document.removeEventListener('scroll', onScroll, false);
    });

}


AbTestCtrl.$inject = ['$scope', '$rootScope', '$location', '$cookies'];
innaAppConponents.controller('AbTestCtrl', AbTestCtrl);