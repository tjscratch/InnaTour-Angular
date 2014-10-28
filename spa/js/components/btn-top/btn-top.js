'use strict';

innaAppConponents.directive('btnTop', [function () {
    return {
        restrict: 'E',
        replace: true,
        template: "<span " +
            "ng-click='goToTop()' " +
            "class='button button-scroll-to-top'>" +
            "<span class='icon-sprite-arrow-top'></span>Наверх</span>",
        link: function ($scope) {

            /**
             * листаем страницу наверх
             */
            $scope.goToTop = function () {
                window.scrollTo(0, 0);
            };


            function showGoToTop() {
                $scope.safeApply(function () {
                    $scope.goToTopShow = true;
                })
            }


            function hideGoToTop() {
                $scope.safeApply(function () {
                    $scope.goToTopShow = false;
                })
            }


            function GoToTopBtn() {
                var windowHeight = window.innerHeight,
                    scrollTop = utils.getScrollTop();
                if (scrollTop >= windowHeight) {
                    showGoToTop();
                } else {
                    hideGoToTop();
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