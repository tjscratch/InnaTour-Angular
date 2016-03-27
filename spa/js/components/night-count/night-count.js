innaAppDirectives.directive('nightCount', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/night-count/templ/night-count.html"),
        scope: {
            count: '='
        },
        controller: function ($scope) {
            $scope.isOpen = false;
            $scope.nightCountDisplay = "Количество ночей";

            $scope.increment = function (inc) {
                $scope.count = $scope.count + inc;
            };
        },
        link: function (scope, element, attrs) {
            $(document).click(function (event) {
                var isInsideComponent = !!$(event.target).closest(element).length;

                if (isInsideComponent) {
                    scope.$apply(function ($scope) {
                        $scope.isOpen = true;
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
