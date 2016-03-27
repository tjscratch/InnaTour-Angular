innaAppDirectives.directive('nightCount', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/night-count/templ/night-count.html"),
        scope: {
            nightCount: '='
        },
        controller:  function ($scope) {
            $scope.isOpen = false;
            $scope.nightCountDisplay = "Количество ночей"
            $scope.onChoose = function (option) {
                $scope.nightCount = option;
            }
        },
        link: function (scope, element, attrs) {
            $(document).click(function (event) {
                var isInsideComponent = !!$(event.target).closest(element).length;

                if (isInsideComponent) {
                    scope.$apply(function ($scope) {
                        $scope.isOpen = !$scope.isOpen;
                    });
                } else {
                    scope.$apply(function ($scope) {
                        $scope.isOpen = false;
                    });
                }
            });
        }
    }
});
