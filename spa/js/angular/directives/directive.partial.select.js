innaAppDirectives.directive('partialSelect', ['$templateCache', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get('components/partial_select.html'),
        scope: {
            list: '=',
            result: '=',
            isOpen: '=',
            resultSet: '&'
        },
        controller: function ($scope) {

            /*Events*/
            $scope.itemClick = function (option) {
                var item = { id: option.Id, name: option.Name };
                
                if ($scope.result == null && $scope.resultSet) {
                    $scope.resultSet({ item: item });
                }
                else {
                    $scope.result = item;
                }
            }

            function setResultIfOneItem() {
                if ($scope.list != null && $scope.list.length == 1) {
                    var option = $scope.list[0];
                    $scope.result = { id: option.Id, name: option.Name };
                }
            }

            $scope.$watch('list', function (newVal, oldVal) {
                setResultIfOneItem();
            });
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