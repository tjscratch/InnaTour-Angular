innaAppDirectives.directive('partialSelect', [function () {
    return {
        replace: true,
        templateUrl: '/spa/templates/components/partial_select.html',
        scope: {
            list: '=',
            result: '=',
            callback: '='//сюда присваиваем функцию, которая сохранит колбэк для открытия списка
        },
        controller: function ($scope) {
            /*Properties*/
            $scope.isOpen = false;

            /*Events*/
            $scope.itemClick = function (option) {
                $scope.result = { id: option.Id, name: option.Name };
            }

            $scope.openListFn = function () {
                $scope.isOpen = true;
            }

            //мониторим, когда нам передадут функцию, для открытия списка
            $scope.$watch('callback', function (newValue, oldValue) {
                //передали, посылаем в нее функцию, что открывает список
                newValue($scope.openListFn);
            });
        },
        link: function (scope, element, attrs) {
            $(document).click(function (event) {
                var isInsideComponent = !!$(event.target).closest(element).length;

                if (!isInsideComponent) {
                    scope.$apply(function ($scope) {
                        $scope.isOpen = false;
                    });
                } else {
                    scope.$apply(function ($scope) {
                        $scope.isOpen = !$scope.isOpen;
                    });
                }
            });
        }
    }
}]);