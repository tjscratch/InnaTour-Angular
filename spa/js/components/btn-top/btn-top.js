'use strict';

innaAppConponents.directive('btnTop', [function () {
    return {
        restrict: 'E',
        replace: true,
        template: "<span ng-click='goToTop()' ng-show='goToTopShow' class='button button-scroll-to-top'><span class='icon-sprite-arrow-top'></span></span>",
        controller: function ($scope) {
            
            $scope.goToTopShow = false;
            /**
             * листаем страницу наверх
             */
            $scope.goToTop = function () {
                window.scrollTo(0, 0);
            };
            
            function GoToTopBtn() {
                var windowHeight = window.innerHeight,
                    scrollTop = utils.getScrollTop();
                if (scrollTop >= windowHeight) {
                    $scope.goToTopShow = true;
                    $scope.$apply();
                } else {
                    $scope.goToTopShow = false;
                    $scope.$apply();
                }
            }
            
            
            document.addEventListener('scroll', GoToTopBtn);
            window.addEventListener('resize', GoToTopBtn);
            
            
            setTimeout(GoToTopBtn, 0);
            
            
            $scope.$on('$destroy', function () {
                document.removeEventListener('scroll', GoToTopBtn, false);
                window.removeEventListener('resize', GoToTopBtn, false);
            });
        }
    };
}]);