innaAppDirectives.directive('partialSelect', [function () {
    return {
        replace: true,
        templateUrl: '/spa/templates/components/partial_select.html',
        scope: {
            list: '=',
            result: '=',
            isOpen: '='
        },
        controller: function ($scope) {

            /*Events*/
            $scope.itemClick = function (option) {
                $scope.result = { id: option.Id, name: option.Name };
            }
        },
        link: function ($scope, element, attrs) {
            $(document).click(function (event) {
                var isInsideComponent = !!$(event.target).closest(element).length;

                if (!isInsideComponent) {
                    $scope.$apply(function ($scope) {
                        if ($scope.isOpen != undefined)
                            $scope.isOpen = false;
                    });
                } else {
                    $scope.$apply(function ($scope) {
                        if ($scope.isOpen != undefined)
                            $scope.isOpen = !$scope.isOpen;
                    });
                }
            });
        }
    }
}]);